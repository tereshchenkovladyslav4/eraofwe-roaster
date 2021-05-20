import { AfterViewInit, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
    selector: 'app-my-posts-view',
    templateUrl: './my-posts-view.component.html',
    styleUrls: ['./my-posts-view.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class MyPostsViewComponent implements OnInit, AfterViewInit {
    menuItems = [
        {
            label: 'qa_post',
            routerLink: ['qa-post'],
            command: (event) => {
                this.removeClass(event);
            },
        },
        {
            label: 'article',
            routerLink: ['article'],
            command: (event) => {
                this.removeClass(event);
            },
        },
        {
            label: 'recipe',
            routerLink: ['recipe'],
            command: (event) => {
                this.removeClass(event);
            },
        },
        {
            label: 'my_answers',
            routerLink: ['answer'],
            command: (event) => {
                this.removeClass(event);
            },
        },
        {
            label: 'my_comments',
            routerLink: ['comment'],
            command: (event) => {
                this.removeClass(event);
            },
        },
    ];

    constructor(private router: Router) {}

    ngOnInit(): void {}

    ngAfterViewInit(): void {
        const ele = document.getElementsByClassName('remove-menu-post');
        if (this.router.url.split('/')[this.router.url.split('/').length - 1] === 'qa-post') {
            ele[0].children[0].children[0].className = ele[0].children[0].children[0].className.concat(' p-highlight');
        } else if (this.router.url.split('/')[this.router.url.split('/').length - 1] === 'article') {
            ele[0].children[0].children[1].className = ele[0].children[0].children[1].className.concat(' p-highlight');
        } else if (this.router.url.split('/')[this.router.url.split('/').length - 1] === 'recipe') {
            ele[0].children[0].children[2].className = ele[0].children[0].children[2].className.concat(' p-highlight');
        } else if (this.router.url.split('/')[this.router.url.split('/').length - 1] === 'answer') {
            ele[0].children[0].children[3].className = ele[0].children[0].children[3].className.concat(' p-highlight');
        } else if (this.router.url.split('/')[this.router.url.split('/').length - 1] === 'comment') {
            ele[0].children[0].children[4].className = ele[0].children[0].children[4].className.concat(' p-highlight');
        }
    }

    removeClass(event) {
        const ele = document.getElementsByClassName('remove-menu-post');
        if (event.item.label === 'qa-post') {
            ele[0].children[0].children[1].className = 'p-tabmenuitem';
            ele[0].children[0].children[2].className = 'p-tabmenuitem';
            ele[0].children[0].children[3].className = 'p-tabmenuitem';
            ele[0].children[0].children[4].className = 'p-tabmenuitem';
        } else if (event.item.label === 'article') {
            ele[0].children[0].children[0].className = 'p-tabmenuitem';
            ele[0].children[0].children[2].className = 'p-tabmenuitem';
            ele[0].children[0].children[3].className = 'p-tabmenuitem';
            ele[0].children[0].children[4].className = 'p-tabmenuitem';
        } else if (event.item.label === 'recipe') {
            ele[0].children[0].children[0].className = 'p-tabmenuitem';
            ele[0].children[0].children[1].className = 'p-tabmenuitem';
            ele[0].children[0].children[3].className = 'p-tabmenuitem';
            ele[0].children[0].children[4].className = 'p-tabmenuitem';
        } else if (event.item.label === 'my_answers') {
            ele[0].children[0].children[0].className = 'p-tabmenuitem';
            ele[0].children[0].children[1].className = 'p-tabmenuitem';
            ele[0].children[0].children[2].className = 'p-tabmenuitem';
            ele[0].children[0].children[4].className = 'p-tabmenuitem';
        } else if (event.item.label === 'my_comments') {
            ele[0].children[0].children[0].className = 'p-tabmenuitem';
            ele[0].children[0].children[1].className = 'p-tabmenuitem';
            ele[0].children[0].children[2].className = 'p-tabmenuitem';
            ele[0].children[0].children[3].className = 'p-tabmenuitem';
        }
    }
}
