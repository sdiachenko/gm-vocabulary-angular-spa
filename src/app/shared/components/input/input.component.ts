import { ControlValueAccessor, NgControl, ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { MatError, MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Component, Input, Self } from '@angular/core';
import { LowerCasePipe } from '@angular/common';

@UntilDestroy()
@Component({
  selector: 'gm-input',
  imports: [
    MatInput,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    LowerCasePipe,
    MatError
  ],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
})
export class InputComponent implements ControlValueAccessor {
  @Input() fieldLabel: string;
  @Input() fieldPlaceholder: string;
  @Input() fieldType: string = 'text';
  @Input() fieldErrors: string[];

  inputControl: UntypedFormControl;
  onTouch: () => void;

  constructor(@Self() public controlDir: NgControl) {
    controlDir.valueAccessor = this;
    this.inputControl = new UntypedFormControl();
  }

  writeValue(value: string) {
    this.inputControl.patchValue(value, {emitEvent: false});
  }

  registerOnChange(fn: any): void {
    this.inputControl.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.inputControl.disable({emitEvent: false, onlySelf: true}) :
      this.inputControl.enable({emitEvent: false, onlySelf: true});
  }
}
