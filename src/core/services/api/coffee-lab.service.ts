import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
    providedIn: 'root',
})
export class CoffeeLabService extends ApiService {
    forumLanguage = new BehaviorSubject('en');
    organization = 'ro';
    organizationId = this.cookieSrv.get('roaster_id');

    get currentForumLanguage(): string {
        return this.forumLanguage.value;
    }

    constructor(protected cookieSrv: CookieService, protected http: HttpClient, private toastService: ToastrService) {
        super(cookieSrv, http);
    }

    copyContext(context: string): void {
        const textArea = document.createElement('textarea');
        textArea.value = context;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('Copy');
        textArea.remove();
        this.toastService.success('Successfully copied');
    }

    getForumList(type: string, options?: any): Observable<any> {
        return this.post(this.orgPostUrl, `general/${type}s?${this.serializeParams(options)}`, 'GET');
    }

    getForumDetails(type: string, idOrSlug: any): Observable<any> {
        return this.post(this.orgPostUrl, `general/${type}s/${idOrSlug}`, 'GET');
    }

    getCommentList(type: string, slug: any): any {
        return this.post(this.orgPostUrl, `general/${type}s/${slug}/comments`, 'GET');
    }

    postComment(type: string, id: any, data: any): any {
        return this.post(
            this.orgPostUrl,
            `${this.organization}/${this.organizationId}/${type}s/${id}/comments`,
            'POST',
            data,
        );
    }

    postQuestion(data: any): Observable<any> {
        return this.post(this.orgPostUrl, `${this.organization}/${this.organizationId}/questions`, 'POST', data);
    }

    getAuthors(type: string): Observable<any> {
        return this.post(this.orgPostUrl, `general/coffee-lab/authors?post_type=${type}s`, 'GET');
    }

    getDrafts(): Observable<any> {
        return this.post(this.orgPostUrl, `${this.organization}/${this.organizationId}/drafts`, 'GET');
    }

    getMyComments(organizationId): Observable<any> {
        return this.post(this.orgPostUrl, `${this.organization}/${organizationId}/my-comments`, 'GET');
    }

    getMyAnswers(organizationId): Observable<any> {
        return this.post(this.orgPostUrl, `${this.organization}/${organizationId}/answers`, 'GET');
    }

    getMyForumList(type: string, organizationId: any): Observable<any> {
        return this.post(this.orgPostUrl, `${this.organization}/${organizationId}/${type}s`, 'GET');
    }

    getSavedForumList(type: string, organizationId: any): Observable<any> {
        return this.post(this.orgPostUrl, `${this.organization}/${organizationId}/${type}s/saved`, 'GET');
    }

    saveForum(type: string, id: any): Observable<any> {
        return this.post(this.orgPostUrl, `${this.organization}/${this.organizationId}/${type}s/${id}/save`, 'PUT');
    }
}
