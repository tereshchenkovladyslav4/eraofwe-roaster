import { ThreadActivityType, OrganizationType } from '@enums';
import { ChatMessageMember } from './chat-message-member.model';
import { ThreadMember } from './thread-member.model';

export interface ChatMessage {
    activity_type: ThreadActivityType;
    content: string;
    created_at: string;
    id: number;
    member: ChatMessageMember;
    meta_data: string;
    meta: any;
    updated_at: string;
    computed_date: string;
    computed_author: ThreadMember;
    showUserBadge: boolean;
    isActiveUser: boolean;
    file?: {
        id: number;
        mime: string;
        org_id: number;
        org_type: OrganizationType;
        thread_id: number;
        thumb_url: string;
        url: string;
        user_id: number;
    };
    dateString?: string; // wil be null if same date as prev
    showDateBadge?: boolean;
    lang?: string;
    showTranslation?: 'ON' | 'OFF' | 'IP';
    translatedText?: string;
}
