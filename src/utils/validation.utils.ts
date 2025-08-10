import { FormField } from '../types/form.types';

export const validateField = (field: FormField, value: any): string | null => {
  for (const rule of field.validations) {
    switch (rule.type) {
      case 'required':
        if (!value || (typeof value === 'string' && !value.trim())) {
          return rule.message;
        }
        break;
      case 'minLength':
        if (typeof value === 'string' && value.length < (rule.value || 0)) {
          return rule.message;
        }
        break;
      case 'maxLength':
        if (typeof value === 'string' && value.length > (rule.value || 0)) {
          return rule.message;
        }
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value && !emailRegex.test(value)) {
          return rule.message;
        }
        break;
      case 'password':
        const passwordRegex = /^(?=.*\d).{8,}$/;
        if (value && !passwordRegex.test(value)) {
          return rule.message;
        }
        break;
    }
  }
  return null;
};