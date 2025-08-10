export interface ValidationRule {
  type: 'required' | 'minLength' | 'maxLength' | 'email' | 'password';
  value?: number;
  message: string;
}

export interface FormField {
  id: string;
  type: 'text' | 'number' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date';
  label: string;
  required: boolean;
  defaultValue?: any;
  options?: string[]; // for select, radio
  validations: ValidationRule[];
  isDerived?: boolean;
  derivedFrom?: string[];
  derivedFormula?: string;
}

export interface FormSchema {
  id: string;
  name: string;
  createdAt: string;
  fields: FormField[];
}

export interface RootState {
  form: {
    currentForm: FormField[];
    savedForms: FormSchema[];
    formValues: Record<string, any>;
  };
}