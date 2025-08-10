import React from 'react';
import { TextField, Checkbox, FormControlLabel, RadioGroup, FormControlLabel as MuiFormControlLabel, Radio, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { FormField } from '../../types/form.types';

interface Props {
  field: FormField;
  value: any;
  onChange: (value: any) => void;
  error?: string;
  disabled?: boolean;
}

export const FieldRenderer: React.FC<Props> = ({ field, value, onChange, error, disabled }) => {
  switch (field.type) {
    case 'text':
      return (
        <TextField
          label={field.label}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          error={!!error}
          helperText={error}
          fullWidth
          disabled={disabled}
        />
      );
    case 'number':
      return (
        <TextField
          label={field.label}
          type="number"
          value={value || ''}
          onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
          error={!!error}
          helperText={error}
          fullWidth
          disabled={disabled}
        />
      );
    case 'textarea':
      return (
        <TextField
          label={field.label}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          error={!!error}
          helperText={error}
          fullWidth
          multiline
          rows={4}
          disabled={disabled}
        />
      );
    case 'checkbox':
      return (
        <FormControlLabel
          control={
            <Checkbox
              checked={!!value}
              onChange={(e) => onChange(e.target.checked)}
              disabled={disabled}
            />
          }
          label={field.label}
        />
      );
    case 'select':
      return (
        <FormControl fullWidth error={!!error} disabled={disabled}>
          <InputLabel>{field.label}</InputLabel>
          <Select
            value={value || ''}
            label={field.label}
            onChange={(e) => onChange(e.target.value)}
          >
            {field.options?.map((option, i) => (
              <MenuItem key={i} value={option}>{option}</MenuItem>
            ))}
          </Select>
          {error && <p style={{ color: 'red', margin: '2px 14px 0 14px' }}>{error}</p>}
        </FormControl>
      );
    case 'radio':
      return (
        <FormControl component="fieldset" error={!!error} disabled={disabled}>
          <RadioGroup
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
          >
            {field.options?.map((option, i) => (
              <MuiFormControlLabel key={i} value={option} control={<Radio />} label={option} />
            ))}
          </RadioGroup>
          {error && <p style={{ color: 'red', margin: '2px 14px 0 14px' }}>{error}</p>}
        </FormControl>
      );
    case 'date':
      return (
        <TextField
          label={field.label}
          type="date"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          error={!!error}
          helperText={error}
          fullWidth
          InputLabelProps={{ shrink: true }}
          disabled={disabled}
        />
      );
    default:
      return null;
  }
};

export {};
