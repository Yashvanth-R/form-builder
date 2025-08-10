import React from 'react';
import { Box, Button, Typography, Alert } from '@mui/material';
import { FormField } from '../../types/form.types';
import { FieldRenderer } from '../FormBuilder/FieldRenderer';

interface Props {
  fields: FormField[];
  values: Record<string, any>;
  errors: Record<string, string>;
  onChange: (fieldId: string, value: any) => void;
  onSubmit: () => void;
  submitSuccess: boolean;
}

export const FormPreview: React.FC<Props> = ({ fields, values, errors, onChange, onSubmit, submitSuccess }) => {
  if (fields.length === 0) {
    return <Typography>No form fields to display.</Typography>;
  }

  return (
    <Box component="form" noValidate autoComplete="off" sx={{ width: '100%', maxWidth: 600 }}>
      {submitSuccess && <Alert severity="success" sx={{ mb: 2 }}>Form submitted successfully!</Alert>}
      {fields.map(field => (
        <Box key={field.id} sx={{ mb: 3 }}>
          <FieldRenderer
            field={field}
            value={values[field.id]}
            onChange={(val) => onChange(field.id, val)}
            error={errors[field.id]}
            disabled={field.isDerived}
          />
        </Box>
      ))}
      <Button variant="contained" onClick={onSubmit} size="large">Submit</Button>
    </Box>
  );
};

export {};