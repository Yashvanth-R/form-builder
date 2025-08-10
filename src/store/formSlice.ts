import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FormField, FormSchema } from '../types/form.types';

interface FormState {
  currentForm: FormField[];
  savedForms: FormSchema[];
  formValues: Record<string, any>;
}

const initialState: FormState = {
  currentForm: [],
  savedForms: JSON.parse(localStorage.getItem('savedForms') || '[]'),
  formValues: {}
};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    addField: (state, action: PayloadAction<FormField>) => {
      state.currentForm.push(action.payload);
    },
    updateField: (state, action: PayloadAction<{ id: string; field: Partial<FormField> }>) => {
      const index = state.currentForm.findIndex(f => f.id === action.payload.id);
      if (index !== -1) {
        state.currentForm[index] = { ...state.currentForm[index], ...action.payload.field };
      }
    },
    deleteField: (state, action: PayloadAction<string>) => {
      state.currentForm = state.currentForm.filter(f => f.id !== action.payload);
    },
    reorderFields: (state, action: PayloadAction<{ fromIndex: number; toIndex: number }>) => {
      const { fromIndex, toIndex } = action.payload;
      const [removed] = state.currentForm.splice(fromIndex, 1);
      state.currentForm.splice(toIndex, 0, removed);
    },
    saveForm: (state, action: PayloadAction<{ name: string }>) => {
      const newForm: FormSchema = {
        id: Date.now().toString(),
        name: action.payload.name,
        createdAt: new Date().toISOString(),
        fields: [...state.currentForm]
      };
      state.savedForms.push(newForm);
      localStorage.setItem('savedForms', JSON.stringify(state.savedForms));
    },
    loadForm: (state, action: PayloadAction<string>) => {
      const form = state.savedForms.find(f => f.id === action.payload);
      if (form) {
        state.currentForm = [...form.fields];
      }
    },
    updateFormValue: (state, action: PayloadAction<{ fieldId: string; value: any }>) => {
      state.formValues[action.payload.fieldId] = action.payload.value;
    },
    clearCurrentForm: (state) => {
      state.currentForm = [];
      state.formValues = {};
    },
    deleteForm: (state, action: PayloadAction<string>) => {
      state.savedForms = state.savedForms.filter(f => f.id !== action.payload);
      localStorage.setItem('savedForms', JSON.stringify(state.savedForms));
    }
  }
});

export const { 
  addField, 
  updateField, 
  deleteField, 
  reorderFields, 
  saveForm, 
  loadForm,
  updateFormValue,
  clearCurrentForm,
  deleteForm 
} = formSlice.actions;

export default formSlice.reducer;