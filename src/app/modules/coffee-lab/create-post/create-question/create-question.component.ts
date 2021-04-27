import { Component, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { ToastrService } from 'ngx-toastr';
import { CoffeeLabService } from '@services';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
    selector: 'app-create-question',
    templateUrl: './create-question.component.html',
    styleUrls: ['./create-question.component.scss'],
})
export class CreateQuestionComponent implements OnInit {
    isAllowTranslation = true;
    content?: string;
    isPosting = false;
    questionId: any;
    isLoading = false;
    languageCode?: string;

    constructor(
        public location: Location,
        public dialogService: DialogService,
        private coffeeLabService: CoffeeLabService,
        private toastrService: ToastrService,
        private router: Router,
        private route: ActivatedRoute,
        private toaster: ToastrService,
    ) {}

    ngOnInit(): void {
        this.questionId = this.route.snapshot.queryParamMap.get('id');
        if (this.questionId) {
            this.getQuestionById();
        }
    }

    getQuestionById(): void {
        this.isLoading = true;
        this.coffeeLabService.getForumDetails('question', this.questionId).subscribe((res: any) => {
            this.isLoading = false;
            if (res.success) {
                this.content = res.result.question;
                this.languageCode = res.result.lang_code;
                console.log('question >>>>>>>>>>>', res);
            } else {
                this.toaster.error('Error while get question');
                this.location.back();
            }
        });
    }

    onPostQuestion(status: string): void {
        if (!this.content) {
            this.toastrService.error('Please type your question.');
            return;
        }
        if (this.content.length < 10) {
            this.toastrService.error('Question is too short.');
            return;
        }
        if (this.content.length > 300) {
            this.toastrService.error('Question is too long.');
            return;
        }
        const data = {
            question: this.content,
            allow_translation: this.isAllowTranslation ? 1 : 0,
            status,
            language: this.languageCode || this.coffeeLabService.currentForumLanguage,
        };
        this.isPosting = true;
        if (this.questionId) {
            this.coffeeLabService.updateForum('question', this.questionId, data).subscribe((res: any) => {
                this.isPosting = false;
                console.log('update question res >>>>>>>>>>>>', res);
                if (res.success) {
                    this.toaster.success('You have updated a question successfully.');
                    this.location.back();
                } else {
                    this.toaster.error('Failed to update question.');
                }
            });
        } else {
            this.coffeeLabService.postForum('question', data).subscribe((res: any) => {
                this.isPosting = false;
                console.log('post question result >>>', res);
                if (res.success) {
                    this.toastrService.success('You have posted a question successfully.');
                    this.router.navigate(['/coffee-lab']);
                } else {
                    this.toastrService.error('Failed to post question.');
                }
            });
        }
    }
}
