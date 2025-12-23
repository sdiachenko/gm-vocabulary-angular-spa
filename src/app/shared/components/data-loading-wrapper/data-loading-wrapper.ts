import { Component, inject, Input, OnChanges, SimpleChanges } from '@angular/core';

import { SpinnerComponent } from "../spinner/spinner.component";
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'gm-data-loading-wrapper',
  imports: [
    SpinnerComponent
  ],
  templateUrl: './data-loading-wrapper.html',
  styleUrl: './data-loading-wrapper.scss',
})
export class DataLoadingWrapper implements OnChanges {

  @Input() loadingState: boolean;
  @Input() error: Error;
  @Input() successMessage: string;

  private _snackBar = inject(MatSnackBar);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['error'] != null) {
      if (this.error == null) {
        this._snackBar.dismiss();
      } else {
        this._snackBar.open(this.error.message, 'Close');
      }
    }

    if (changes['successMessage'] != null) {
      if (this.error == null) {
        this._snackBar.dismiss();
      } else {
        this._snackBar.open(this.successMessage, 'Close');
      }
    }
  }
}
