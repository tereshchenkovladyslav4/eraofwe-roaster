import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoffeeLabComponent } from './coffee-lab.component';
import { OverviewComponent } from '@modules/coffee-lab/overview/overview.component';
import { QaForumViewComponent } from '@modules/coffee-lab/qa-forum/qa-forum-view/qa-forum-view.component';
import { ArticlesViewComponent } from '@modules/coffee-lab/articles/articles-view/articles-view.component';
import { ArticleDetailComponent } from './articles/article-detail/article-detail.component';
import { CoffeeRecipesViewComponent } from '@modules/coffee-lab/coffee-recipes/coffee-recipes-view/coffee-recipes-view.component';
import { MyPostsViewComponent } from '@modules/coffee-lab/my-posts/my-posts-view/my-posts-view.component';
import { SavedPostsViewComponent } from '@modules/coffee-lab/saved-posts/saved-posts-view/saved-posts-view.component';
import { CoffeeDetailsComponent } from './coffee-recipes/coffee-details/coffee-details.component';
import { CreatePostComponent } from './create-post/create-post.component';
import { QuestionDetailComponent } from '@modules/coffee-lab/qa-forum/question-detail/question-detail.component';
import { CreateQuestionComponent } from '@modules/coffee-lab/create-post/create-question/create-question.component';
import { CreateArticleComponent } from '@modules/coffee-lab/create-post/create-article/create-article.component';
import { CreateRecipeComponent } from '@modules/coffee-lab/create-post/create-recipe/create-recipe.component';
import { TabContainerComponent } from '@modules/coffee-lab/create-post/tab-container/tab-container.component';
import { CreateAnswerComponent } from '@modules/coffee-lab/create-post/create-answer/create-answer.component';
import { AssignedToMeViewComponent } from '@modules/coffee-lab/assigned-to-me/assigned-to-me-view/assigned-to-me-view.component';
import { TranslateRecipeComponent } from '@modules/coffee-lab/create-post/translate/translate-recipe/translate-recipe.component';
import { TranslateArticleComponent } from '@modules/coffee-lab/create-post/translate/translate-article/translate-article.component';
import { TranslateAnswerComponent } from '@modules/coffee-lab/create-post/translate/translate-answer/translate-answer.component';

const routes: Routes = [
    {
        path: '',
        component: CoffeeLabComponent,
        children: [
            {
                path: '',
                redirectTo: 'overview',
                pathMatch: 'full',
            },
            {
                path: 'overview',
                component: OverviewComponent,
                children: [
                    {
                        path: '',
                        redirectTo: 'qa-forum',
                        pathMatch: 'full',
                    },
                    {
                        path: 'qa-forum',
                        component: QaForumViewComponent,
                    },
                    {
                        path: 'articles',
                        component: ArticlesViewComponent,
                    },
                    {
                        path: 'coffee-recipes',
                        component: CoffeeRecipesViewComponent,
                    },
                    {
                        path: 'my-posts',
                        component: MyPostsViewComponent,
                    },
                    {
                        path: 'saved-posts',
                        component: SavedPostsViewComponent,
                    },
                    {
                        path: 'assigned-to-me',
                        component: AssignedToMeViewComponent,
                    },
                ],
            },
            {
                path: 'articles/:idOrSlug',
                component: ArticleDetailComponent,
            },
            {
                path: 'recipes/:id',
                component: CoffeeDetailsComponent,
            },
            {
                path: 'questions/:slug',
                component: QuestionDetailComponent,
            },
            {
                path: 'create-post',
                component: CreatePostComponent,
                children: [
                    {
                        path: '',
                        redirectTo: 'tab',
                        pathMatch: 'full',
                    },
                    {
                        path: 'tab',
                        component: TabContainerComponent,
                        children: [
                            {
                                path: '',
                                redirectTo: 'question',
                                pathMatch: 'full',
                            },
                            {
                                path: 'question',
                                component: CreateQuestionComponent,
                                data: { type: 'question' },
                            },
                            {
                                path: 'article',
                                component: CreateArticleComponent,
                                data: { type: 'question' },
                            },
                            {
                                path: 'recipe',
                                component: CreateRecipeComponent,
                                data: { type: 'question' },
                            },
                        ],
                    },
                    {
                        path: 'answer',
                        component: CreateAnswerComponent,
                    },
                    {
                        path: 'translate-answer',
                        component: TranslateAnswerComponent,
                    },
                    {
                        path: 'translate-article',
                        component: TranslateArticleComponent,
                    },
                    {
                        path: 'translate-recipe',
                        component: TranslateRecipeComponent,
                    },
                ],
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CoffeeLabRoutingModule {}
