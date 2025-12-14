import { MatButton } from '@angular/material/button';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'gm-button',
  imports: [
    MatButton
  ],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  @Input() isDisabled: boolean = false;
  @Input() isPrimary = false;
  @Input() isSubmit = false;
  @Output() btnClick = new EventEmitter();
}
