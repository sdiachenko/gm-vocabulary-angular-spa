import { Component, inject, signal, Signal, WritableSignal } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { take } from 'rxjs';

import { DataLoadingWrapper } from '../../../../shared/components/data-loading-wrapper/data-loading-wrapper';
import { AuthFormComponent } from '../auth-form/auth-form.component';
import { AuthService } from '../../../../services/auth/auth.service';
import { Auth } from '../../../../services/auth-api/auth';

@UntilDestroy()
@Component({
  selector: 'gm-auth-page',
  imports: [
    AuthFormComponent,
    DataLoadingWrapper
  ],
  templateUrl: './auth-page.component.html',
  styleUrl: './auth-page.component.scss',
})
export class AuthPageComponent {
  private authService = inject(AuthService);

  authLoadingState: Signal<boolean> = this.authService.authLoadingState;
  authErrorMessage: Signal<Error> = this.authService.authError;
  isSignupFormActive: WritableSignal<boolean> = signal(false);

  submit(user: Auth) {
    this.authService.auth(user, !this.isSignupFormActive())
      .pipe(take(1), untilDestroyed(this))
      .subscribe();
  }
}
