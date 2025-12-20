import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Component, inject, WritableSignal } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { MatButton } from '@angular/material/button';
import { RouterOutlet } from '@angular/router';

import { DataLoadingWrapper } from '../data-loading-wrapper/data-loading-wrapper';
import { SubmitDialogComponent } from '../submit-dialog/submit-dialog.component';
import { SubmitDialogData } from '../submit-dialog/submit-dialog-data';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'gm-page-wrapper',
  imports: [
    MatToolbar,
    RouterOutlet,
    MatButton,
    DataLoadingWrapper
  ],
  templateUrl: './page-wrapper.component.html',
  styleUrl: './page-wrapper.component.scss',
})
export class PageWrapperComponent {
  private authService = inject(AuthService);
  private dialog = inject(MatDialog);
  private logoutDialogRef: MatDialogRef<SubmitDialogComponent, boolean>;

  authLoadingState: WritableSignal<boolean> = this.authService.authLoadingState;

  logout(): void {
    this.logoutDialogRef = this.dialog.open<SubmitDialogComponent, SubmitDialogData, boolean>(SubmitDialogComponent, {
      data: {
        title: 'Logout',
        text: 'Are you sure you want to logout?'
      }
    });

    this.logoutDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.authService.logout();
      }
    });
  }
}
