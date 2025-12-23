import { catchError, defer, iif, map, Observable, switchMap, take, tap, throwError } from 'rxjs';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Router } from '@angular/router';

import { AuthApiService } from '../auth-api/auth-api.service';
import { LoginResponse } from '../auth-api/login-response';
import { Auth } from '../auth-api/auth';

@UntilDestroy()
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authApiService = inject(AuthApiService);
  private router = inject(Router);

  authState: WritableSignal<boolean> = signal(false);
  authLoadingState: WritableSignal<boolean> = signal(null);
  authError: WritableSignal<Error> = signal(null);
  token: WritableSignal<string> = signal(null);
  private tokenTimer: ReturnType<typeof setTimeout>;

  auth(user: Auth, isLoginModeActive: boolean): Observable<void> {
    this.toggleAuthLoadingState(true);
    return iif(
      () => isLoginModeActive,
      defer(() => this.login(user)),
      defer(() => {
        return this.authApiService.signup(user)
          .pipe(switchMap(() => this.login(user)))
      })
    ).pipe(
      take(1),
      untilDestroyed(this),
      catchError(err => {
        this.toggleAuthLoadingState(false);
        this.authError.set(err);
        return throwError(err);
      }),
      tap(() => {
        this.toggleAuthState(true);
        this.toggleAuthLoadingState(false);
        this.router.navigate(['/']);
      }),
      map(() => null),
    );
  }

  private login(user: Auth): Observable<void> {
    return this.authApiService.login(user)
      .pipe(
        tap((response: LoginResponse) => {
          this.token.set(response.token);
          this.setAuthTimer(response.expiresInSeconds);
          this.saveAuthData(response.token, new Date(new Date().getTime() + response.expiresInSeconds * 1000));
        }),
        map(() => void 0)
      );
  }

  logout(): void {
    this.token.set(null);
    this.toggleAuthState(false);
    this.clearAuthData();
    this.router.navigate(['/auth']);
    clearTimeout(this.tokenTimer);
  }

  autoAuthUser(): void {
    const authData = this.getAuthData();
    if (!authData) {
      return
    }
    const expiresIn = authData.expiresIn.getTime() - new Date().getTime();
    if (expiresIn > 0) {
      this.token.set(authData.token);
      this.toggleAuthState(true);
      this.setAuthTimer(expiresIn / 1000);
    }
  }

  private setAuthTimer(durationInSeconds: number): void {
    this.tokenTimer = setTimeout(() => {
      this.logout();
      this.authError.set(new Error('Session expired'));
    }, durationInSeconds * 1000);
  }

  private toggleAuthState(state: boolean) {
    this.authState.set(state);
  }

  private toggleAuthLoadingState(state: boolean) {
    this.authLoadingState.set(state);
  }

  private saveAuthData(token: string, expiresIn: Date): void {
    localStorage.setItem('token', token);
    localStorage.setItem('expiresIn', expiresIn.toISOString());
  }

  private clearAuthData(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('expiresIn');
  }

  getAuthData(): { token: string; expiresIn: Date } {
    const token = localStorage.getItem('token');
    const expiresIn = localStorage.getItem('expiresIn');
    if (!token || !expiresIn) {
      return null;
    }
    return {
      token,
      expiresIn: new Date(expiresIn)
    };
  }
}
