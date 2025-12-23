import { Routes } from '@angular/router';

import { CollectionsPageComponent } from './pages/colections/components/collections-page/collections-page.component';
import { PageWrapperComponent } from './shared/components/page-wrapper/page-wrapper.component';
import { WordsPageComponent } from './pages/words/components/words-page/words-page.component';
import { AuthPageComponent } from './pages/auth/components/auth-page/auth-page.component';
import { authGuard } from './guards/auth/auth-guard';

export const routes: Routes = [
  {
    path: 'auth',
    component: AuthPageComponent
  },
  {
    path: '',
    component: PageWrapperComponent,
    children: [
      {
        path: '',
        redirectTo: '/words',
        pathMatch: 'full'
      },
      {
        path: 'words',
        component: WordsPageComponent,
        canActivate: [authGuard]
      },
      {
        path: 'collections',
        component: CollectionsPageComponent,
        canActivate: [authGuard]
      }
    ]
  }
];
