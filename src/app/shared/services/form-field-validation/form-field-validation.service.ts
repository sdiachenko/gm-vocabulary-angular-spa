import { ValidationErrors } from '@angular/forms';
import { Injectable } from '@angular/core';

import { FormFieldValidationMessagesConst } from '../../const/form-field-validation-messages.const';

@Injectable({
  providedIn: 'root',
})
export class FormFieldValidationService {
  getErrorsMessages(errors: ValidationErrors | null): string[] {
    return errors != null ? Object.keys(errors).map((key: string) => FormFieldValidationMessagesConst[key]): [];
  }
}
