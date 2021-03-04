/* tslint:disable no-string-literal */
import { first } from 'rxjs/operators';
import { Subscription, Subject } from 'rxjs';
import {
    Component,
    OnInit,
    OnDestroy,
    Input,
    Output,
    SimpleChanges,
    OnChanges,
    ElementRef,
    Renderer2,
    EventEmitter,
} from '@angular/core';
import {
    ThreadListItem,
    ThreadMember,
    ChatMessage,
    IncomingChatMessage,
    WSResponse,
    DisputeChatThreadListItem,
    OrderChatThreadListItem,
} from '@models';
import { ThreadType, ThreadActivityType, ChatMessageType } from '@enums';
import { ChatHandlerService, GlobalsService, SocketService, ChatUtil } from '@services';
const badwordsRegExp = require('badwords/regexp') as RegExp;
@Component({
    selector: 'app-sewn-order-chat',
    templateUrl: './sewn-order-chat.component.html',
    styleUrls: ['./sewn-order-chat.component.scss'],
})
export class SewnOrderChatComponent implements OnInit, OnDestroy, OnChanges {
    @Input() orderThread: OrderChatThreadListItem;
    @Input() orderDisputes: DisputeChatThreadListItem;
    @Output() threadUsers: EventEmitter<ThreadMember[]> = new EventEmitter<ThreadMember[]>();

    messageList: ChatMessage[] = [];
    organizedMessages: any[] = [];
    threadDetails: ThreadListItem = null;
    SM: { [SubscriptionName: string]: Subscription } = {}; // Subscrition MAP object
    messageInput = '';
    TIMESTAMP_MAP: { [K in ChatMessageType]: string } = {} as { [K in ChatMessageType]: string };
    activeThreadId: number = null;
    activeThreadType: 'ORDER' | 'DISPUTE' | 'UNSET' = 'UNSET';
    showOffensiveMessageError = false;
    offensiveTimeout = 0;
    messageListConfig = {
        perPage: 300,
        activePage: 1,
    };
    messageInputElement: HTMLTextAreaElement;
    chatMessageBodyElement: HTMLElement;
    lastMessageRendered = new Subject();

    sentTokenDelayTimeOut = 0;

    constructor(
        public globals: GlobalsService,
        public chatService: ChatHandlerService,
        private socket: SocketService,
        private elRef: ElementRef,
        private chatUtil: ChatUtil,
        private render: Renderer2,
    ) {}

    ngOnInit(): void {
        this.SM['WSState'] = this.socket.socketState.subscribe((value) => {
            if (value === 'CONNECTED') {
                this.initializeWebSocket();
            }
        });
    }

    initializeWebSocket() {
        if (this.SM['WSSubscription'] && this.SM['WSSubscription'].unsubscribe) {
            this.SM['WSSubscription'].unsubscribe();
        }
        this.SM['WSSubscription'] = this.socket.orderChatReceive.subscribe((WSmsg: WSResponse<unknown>) => {
            if (this.TIMESTAMP_MAP[WSmsg.type] === WSmsg.timestamp) {
                if (WSmsg.type === ChatMessageType.threads) {
                    // this.handleThreadsResponse(WSmsg as WSResponse<ThreadListItem[]>);
                } else if (WSmsg.type === ChatMessageType.unread) {
                    // this.handleUnReadResponse(WSmsg as WSResponse<null>);
                } else if (WSmsg.type === ChatMessageType.users) {
                    // this.handleUserDetailResponse(WSmsg as WSResponse<ResponseUserStatus[]>);
                } else if (WSmsg.type === ChatMessageType.history) {
                    this.handleThreadHistory(WSmsg as WSResponse<ChatMessage[]>);
                } else if (WSmsg.type === ChatMessageType.message) {
                    this.handleIncomingMessages(WSmsg as WSResponse<IncomingChatMessage>);
                } else if (WSmsg.type === ChatMessageType.getCreate) {
                    // this.handleFindThreadRequest(WSmsg as WSResponse<ThreadListItem[]>);
                } else if (WSmsg.type === ChatMessageType.thread) {
                    this.handleRequestedThreadDetails(WSmsg as WSResponse<ThreadListItem>);
                }
            }
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        setTimeout(() => {
            if (this.socket.authenticationState.value === 'SUCCESS') {
                this.checkInputs();
            }
        });
    }

    checkInputs() {
        if (this.orderDisputes && this.orderDisputes.chat_thread_id) {
            // Checking if order dispute is available
            this.activeThreadId = this.orderDisputes.chat_thread_id;
            this.activeThreadType = 'DISPUTE';
            this.openThread();
        } else if (this.orderThread && this.orderThread.thread_id) {
            // Checking for order thread
            this.activeThreadId = this.orderThread.thread_id;
            this.activeThreadType = 'ORDER';
            this.openThread();
        } else {
            this.activeThreadId = null;
            this.activeThreadType = 'UNSET';
            this.messageList = [];
            this.organizedMessages = [];
            this.threadDetails = null;
            this.threadUsers.emit([]);
        }
    }

    openThread() {
        if (this.socket.authenticationState.value === 'SUCCESS') {
            this.getThreadDetails(this.activeThreadId);
        }
    }

    getThreadHistory(threadId: number) {
        const timestamp = this.chatUtil.getTimeStamp();
        this.TIMESTAMP_MAP[ChatMessageType.history] = timestamp;
        this.socket.orderChatSent.next({
            timestamp,
            type: ChatMessageType.history,
            data: {
                thread_id: threadId,
                page: this.messageListConfig.activePage,
                per_page: this.messageListConfig.perPage,
            },
        });
    }

    getThreadDetails(threadId: number) {
        const timestamp = this.chatUtil.getTimeStamp();
        this.TIMESTAMP_MAP[ChatMessageType.thread] = timestamp;
        this.socket.orderChatSent.next({
            timestamp,
            type: ChatMessageType.thread,
            data: {
                thread_id: threadId,
            },
        });
    }

    processThreads(thread: ThreadListItem): ThreadListItem {
        const activeUser: ThreadMember[] = [];
        const targtedUserList: ThreadMember[] = [];
        thread.members = thread.members.map((mem: any) => {
            mem = { ...mem, ...mem.user } as ThreadListItem;
            mem = this.processThreadUser(mem);
            if (!mem.is_removed) {
                if (
                    mem.org_type === this.chatUtil.ORGANIZATION_TYPE &&
                    mem.org_id === this.chatUtil.ORGANIZATION_ID &&
                    mem.user_id === this.chatUtil.USER_ID
                ) {
                    activeUser.push(mem);
                } else {
                    targtedUserList.push(mem);
                }
            }
            return mem;
        });
        thread.content = thread.content || '';
        thread.computed_mute = false;
        thread.computed_activeUser = activeUser[0];
        thread.computed_targetedUser = targtedUserList[0];
        thread.computed_targetedUserList = targtedUserList;
        thread.computed_createdAt = this.chatUtil.getReadableTime(thread.activity_created_at || '');
        thread.computed_thread_createdAt = this.chatUtil.getReadableTime(thread.created_at || '');
        thread.computed_lastActivityText =
            thread.content.length > 100 ? thread.content.slice(0, 100) + '...' : thread.content;
        return thread;
    }

    handleRequestedThreadDetails(WSmsg: WSResponse<ThreadListItem>) {
        if (WSmsg.code === 200) {
            const thread = WSmsg.data;
            if (thread.type !== ThreadType.normal && thread.type !== ThreadType.service_request) {
                this.threadDetails = this.processThreads(thread);
                const memberList = this.threadDetails.members || [];
                const users: { [key: string]: ThreadMember } = {};
                for (const member of memberList) {
                    let isRemoved = false;
                    if (member.hasOwnProperty('is_removed')) {
                        isRemoved = member.is_removed;
                    } else {
                        isRemoved = (member as any).removed_at !== '0001-01-01T00:00:00Z';
                    }
                    if (!isRemoved) {
                        const key = member.user_id + '_' + member.org_id + '_' + member.org_type;
                        users[key] = member;
                    }
                }
                this.threadUsers.emit(Object.values(users));
                if (this.threadDetails.computed_activeUser) {
                    if (this.activeThreadId && this.activeThreadType !== 'UNSET') {
                        this.getThreadHistory(this.activeThreadId);
                    }
                } else {
                    console.log('User is not authorized to view this chat');
                }
            } else {
                console.error('Websocket:Requested-thread: Received non direct message thread ');
            }
        } else {
            console.log('Websocket:Requested-thread Thread: Failure');
        }
    }

    handleThreadHistory(WSmsg: WSResponse<ChatMessage[]>) {
        if (WSmsg.code === 200) {
            if (this.SM['lastRender'] && this.SM['lastRender'].unsubscribe) {
                this.SM['lastRender'].unsubscribe();
            }
            this.SM['lastRender'] = this.lastMessageRendered.pipe(first()).subscribe((x) => {
                this.scrollbottom();
            });

            this.messageList = WSmsg.data
                .filter((x) => x.activity_type === ThreadActivityType.message && x.content.trim() !== '')
                .reverse();
            this.messageList.forEach((message) => {
                this.processChatMessages(message, this.threadDetails);
            });
            const lastMessage = this.messageList[this.messageList.length - 1];
            if (lastMessage) {
                this.sentReadTokenTimeout(lastMessage.id);
            }
        } else {
            console.log('Websocket:Thread History: Failure');
        }
    }

    handleIncomingMessages(WSmsg: WSResponse<IncomingChatMessage>) {
        const message = WSmsg.data;
        if (WSmsg.code === 201 && (message?.content || '').trim() !== '') {
            if (
                message.activity_type === ThreadActivityType.message &&
                this.threadDetails &&
                this.threadDetails.id === message.thread_id
            ) {
                this.processChatMessages(message, this.threadDetails);
                const user = message?.member?.user;
                if (user) {
                    this.processThreadUser(user);
                }
                if (this.SM['lastRender'] && this.SM['lastRender'].unsubscribe) {
                    this.SM['lastRender'].unsubscribe();
                }
                this.SM['lastRender'] = this.lastMessageRendered.pipe(first()).subscribe((x) => {
                    this.scrollbottom();
                });
                this.messageList.push(message);
                this.sentReadTokenTimeout(message.id);
            } else {
                console.log('Websocket:Incoming Message : Failure');
            }
        }
    }

    processChatMessages(message: ChatMessage | IncomingChatMessage, thread: ThreadListItem) {
        message.computed_date = this.chatUtil.getReadableTime(message.updated_at || message.created_at);
        if (thread.computed_targetedUserList.find((tuser) => tuser.id === message.member.id)) {
            message.computed_author = thread.computed_targetedUser;
            message.isActiveUser = false;
        } else if (thread.computed_activeUser.id === message.member.id) {
            message.computed_author = thread.computed_activeUser;
            message.isActiveUser = true;
        } else {
            console.log('Error: nable to find message owner');
        }
    }
    processThreadUser(threadUser: ThreadMember) {
        threadUser.last_seen = threadUser.last_seen || '';
        threadUser.computed_lastseen = this.chatUtil.getReadableTime(threadUser.last_seen);
        threadUser.computed_organization_name = this.chatUtil.getOrganization(threadUser.org_type);
        threadUser.computed_fullname = threadUser.first_name + ' ' + threadUser.last_name;
        threadUser.computed_profile_dp = this.chatUtil.getProfileImageBgStyle(threadUser.profile_pic);
        return threadUser;
    }

    sendReadToken(lastMessageId: number) {
        const timestamp = this.chatUtil.getTimeStamp();
        this.TIMESTAMP_MAP[ChatMessageType.read] = timestamp;
        this.socket.orderChatSent.next({
            type: ChatMessageType.read,
            timestamp,
            data: {
                thread_id: this.threadDetails.id,
                last_read_id: lastMessageId,
            },
        });
    }

    sentReadTokenTimeout(lastMessageId: number) {
        if (this.sentTokenDelayTimeOut) {
            clearTimeout(this.sentTokenDelayTimeOut);
        }
        this.sentTokenDelayTimeOut = window.setTimeout(() => {
            this.sendReadToken(lastMessageId);
        }, 800);
    }

    chatInputHeightAdjust(resetFlag = false) {
        this.updateMessageInputElRef();
        this.updateChatMessageBodyElRef();
        if (resetFlag) {
            this.messageInputElement.value = '';
        }
        if (this.messageInputElement) {
            this.render.removeStyle(this.messageInputElement, 'height');
            const inputHeight = this.messageInputElement.offsetHeight;
            const scrollHeight = this.messageInputElement.scrollHeight;
            const calculatedHeight = Math.min(scrollHeight, 80);
            if (inputHeight < scrollHeight) {
                this.render.setStyle(this.messageInputElement, 'height', `${calculatedHeight}px`);
                if (this.chatMessageBodyElement) {
                    this.render.setStyle(
                        this.chatMessageBodyElement,
                        'height',
                        `calc(100% - ${calculatedHeight + 80}px)`,
                    );
                }
            } else {
                this.render.removeStyle(this.chatMessageBodyElement, 'height');
            }
        }
    }

    updateMessageInputElRef() {
        if (!this.messageInputElement) {
            const query = `[data-element="messag-text-area"]`;
            this.messageInputElement = (this.elRef?.nativeElement?.querySelector(query) as HTMLTextAreaElement) || null;
        }
    }
    updateChatMessageBodyElRef() {
        if (!this.chatMessageBodyElement) {
            const query = `[data-element="live-chat-message-body"]`;
            this.chatMessageBodyElement = (this.elRef?.nativeElement?.querySelector(query) as HTMLElement) || null;
        }
    }
    scrollbottom() {
        this.updateChatMessageBodyElRef();
        this.chatMessageBodyElement.scrollTop = this.chatMessageBodyElement.scrollHeight;
    }

    inputkeyPress(event: KeyboardEvent) {
        if (event.key === 'Enter' && !event.shiftKey && !event.ctrlKey) {
            event.preventDefault();
            this.sendMessage();
        }
    }

    inputChanges(event: InputEvent) {
        this.chatInputHeightAdjust();
    }

    sendMessage() {
        clearTimeout(this.offensiveTimeout);
        this.showOffensiveMessageError = false;
        let msg = this.messageInput.trim();
        if (msg !== '') {
            badwordsRegExp.lastIndex = 0;
            if (badwordsRegExp.test(msg)) {
                this.showOffensiveMessageError = true;
                this.offensiveTimeout = window.setTimeout(this.offensiveTimeoutHandler, 3500);
                msg = msg.replace(badwordsRegExp, '****');
            }
            this.socket.chatSent.next(this.getMessagePayload(msg));
            this.chatUtil.playNotificationSound('OUTGOING');
            this.messageInput = '';
            this.chatInputHeightAdjust();
            if (this.SM['lastRender2'] && this.SM['lastRender2'].unsubscribe) {
                this.SM['lastRender2'].unsubscribe();
            }
            this.SM['lastRender2'] = this.lastMessageRendered.pipe(first()).subscribe((x) => {
                console.log('Last render chatInputHeightAdjust');
                this.chatInputHeightAdjust(true);
            });
        }
    }

    offensiveTimeoutHandler = () => {
        this.showOffensiveMessageError = false;
    };

    getMessagePayload(message: string) {
        const timestamp = this.chatUtil.getTimeStamp();
        this.TIMESTAMP_MAP[ChatMessageType.message] = timestamp;
        return {
            type: ChatMessageType.message,
            timestamp,
            data: {
                thread_id: this.threadDetails.id,
                content: message,
                meta_data: '',
            },
        };
    }

    ngOnDestroy() {
        for (const name in this.SM) {
            if (this.SM[name] && this.SM[name].unsubscribe) {
                this.SM[name].unsubscribe();
            }
        }
        if (this.sentTokenDelayTimeOut) {
            clearTimeout(this.sentTokenDelayTimeOut);
        }
        if (this.offensiveTimeout) {
            clearTimeout(this.offensiveTimeout);
        }
    }
}
