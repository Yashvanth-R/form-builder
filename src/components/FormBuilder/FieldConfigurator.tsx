import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControlLabel, Switch, Button, Select, MenuItem, FormControl, InputLabel, Chip, Box, Typography, IconButton } from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { FormField, ValidationRule } from '../../types/form.types';

interface FieldConfiguratorProps {
  open: boolean;
  field: FormField | null;
  onSave: (field: FormField) => void;
  onClose: () => void;
  existingFields: FormField[];
}

export const FieldConfigurator: React.FC<FieldConfiguratorProps> = ({
  open,
  field,
  onSave,
  onClose,
  existingFields
}) => {
  const [config, setConfig] = React.useState<FormField>({
    id: '',
    type: 'text',
    label: '',
    required: false,
    validations: [],
    isDerived: false,
    derivedFrom: [],
    derivedFormula: '',
    options: []
  });

  React.useEffect(() => {
    if (field) {
      setConfig(field);
    } else {
      setConfig({
        id: Date.now().toString(),
        type: 'text',
        label: '',
        required: false,
        validations: [],
        isDerived: false,
        derivedFrom: [],
        derivedFormula: '',
        options: []
      });
    }
  }, [field, open]);

  const addValidation = (type: ValidationRule['type']) => {
    const messages = {
      required: 'This field is required',
      minLength: 'Minimum length not met',
      maxLength: 'Maximum length exceeded',
      email: 'Invalid email format',
      password: 'Password must be at least 8 characters with a number'
    };

    const newRule: ValidationRule = {
      type,
      message: messages[type],
      value: type.includes('Length') ? 1 : undefined
    };
    setConfig(prev => ({
      ...prev,
      validations: [...prev.validations, newRule]
    }));
  };

  const removeValidation = (index: number) => {
    setConfig(prev => ({
      ...prev,
      validations: prev.validations.filter((_, i) => i !== index)
    }));
  };

  const updateValidation = (index: number, updates: Partial<ValidationRule>) => {
    setConfig(prev => ({
      ...prev,
      validations: prev.validations.map((rule, i) =>
        i === index ? { ...rule, ...updates } : rule
      )
    }));
  };

  const addOption = () => {
    setConfig(prev => ({
      ...prev,
      options: [...(prev.options || []), '']
    }));
  };

  const updateOption = (index: number, value: string) => {
    setConfig(prev => ({
      ...prev,
      options: prev.options?.map((opt, i) => i === index ? value : opt)
    }));
  };

  const removeOption = (index: number) => {
    setConfig(prev => ({
      ...prev,
      options: prev.options?.filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    // Basic validation
    if (!config.label.trim()) {
      alert('Please enter a field label');
      return;
    }

    if (needsOptions && (!config.options || config.options.filter(opt => opt.trim()).length === 0)) {
      alert('Please add at least one option for this field type');
      return;
    }

    if (config.isDerived && (!config.derivedFrom || config.derivedFrom.length === 0)) {
      alert('Please select at least one parent field for derived field');
      return;
    }

    if (config.isDerived && (!config.derivedFormula || !config.derivedFormula.trim())) {
      alert('Please enter a formula for the derived field');
      return;
    }

    onSave(config);
    onClose();
  };

  const needsOptions = ['select', 'radio'].includes(config.type);
  const canSave = config.label.trim() &&
    (!needsOptions || (config.options && config.options.filter(opt => opt.trim()).length > 0)) &&
    (!config.isDerived || (config.derivedFrom && config.derivedFrom.length > 0 && config.derivedFormula && config.derivedFormula.trim()));

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        {field ? 'Edit Field Configuration' : 'Create New Field'}
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            label="Field Label"
            value={config.label}
            onChange={(e) => setConfig(prev => ({ ...prev, label: e.target.value }))}
            fullWidth
          />

          <FormControl fullWidth>
            <InputLabel>Field Type</InputLabel>
            <Select
              value={config.type}
              label="Field Type"
              onChange={(e) => {
                const newType = e.target.value as any;
                setConfig(prev => ({
                  ...prev,
                  type: newType,
                  options: ['select', 'radio'].includes(newType) ? (prev.options && prev.options.length > 0 ? prev.options : ['Option 1']) : undefined
                }));
              }}
            >
              <MenuItem value="text">Text Input</MenuItem>
              <MenuItem value="number">Number Input</MenuItem>
              <MenuItem value="textarea">Text Area</MenuItem>
              <MenuItem value="select">Dropdown Select</MenuItem>
              <MenuItem value="radio">Radio Buttons</MenuItem>
              <MenuItem value="checkbox">Checkbox</MenuItem>
              <MenuItem value="date">Date Picker</MenuItem>
            </Select>
          </FormControl>

          {needsOptions && (
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Options for {config.type === 'select' ? 'Dropdown' : 'Radio Buttons'}
              </Typography>
              {config.options && config.options.length > 0 ? (
                config.options.map((option, index) => (
                  <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                    <TextField
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      size="small"
                      fullWidth
                      label={`Option ${index + 1}`}
                    />
                    <IconButton
                      onClick={() => removeOption(index)}
                      color="error"
                      disabled={config.options && config.options.length <= 1}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                ))
              ) : (
                <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1, mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    No options added yet. Click "Add Option" to create choices for users.
                  </Typography>
                </Box>
              )}
              <Button onClick={addOption} startIcon={<Add />} size="small" variant="outlined">
                Add Option
              </Button>
              {config.options && config.options.length >= 1 && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  At least one option is required for {config.type} fields.
                </Typography>
              )}
            </Box>
          )}

          <FormControlLabel
            control={
              <Switch
                checked={config.required}
                onChange={(e) => setConfig(prev => ({ ...prev, required: e.target.checked }))}
              />
            }
            label="Required Field"
          />

          <FormControlLabel
            control={
              <Switch
                checked={config.isDerived}
                onChange={(e) => setConfig(prev => ({ ...prev, isDerived: e.target.checked }))}
              />
            }
            label="Derived Field"
          />

          {config.isDerived && (
            <Box>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Parent Fields</InputLabel>
                <Select
                  multiple
                  value={config.derivedFrom || []}
                  label="Parent Fields"
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    derivedFrom: typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value
                  }))}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {(selected as string[]).map((value) => {
                        const parentField = existingFields.find(f => f.id === value);
                        return (
                          <Chip
                            key={value}
                            label={parentField ? `${parentField.label} (${parentField.type})` : value}
                            size="small"
                          />
                        );
                      })}
                    </Box>
                  )}
                >
                  {existingFields.filter(f => f.id !== config.id && !f.isDerived).length === 0 ? (
                    <MenuItem disabled>
                      <Typography variant="body2" color="text.secondary">
                        No parent fields available. Add some fields first.
                      </Typography>
                    </MenuItem>
                  ) : (
                    existingFields.filter(f => f.id !== config.id && !f.isDerived).map((field) => (
                      <MenuItem key={field.id} value={field.id}>
                        <Box>
                          <Typography variant="body2">{field.label}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            Type: {field.type} {field.required && '• Required'}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))
                  )}
                </Select>
                {existingFields.filter(f => f.id !== config.id && !f.isDerived).length === 0 && (
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                    You need to create at least one regular field before creating derived fields.
                  </Typography>
                )}
              </FormControl>

              <TextField
                label="Derived Formula"
                value={config.derivedFormula || ''}
                onChange={(e) => setConfig(prev => ({ ...prev, derivedFormula: e.target.value }))}
                fullWidth
                multiline
                rows={3}
                helperText="Example: new Date().getFullYear() - new Date(parent1).getFullYear() (for age calculation)"
                placeholder="Enter JavaScript formula using parent1, parent2, etc. to reference parent fields"
              />

              <Box sx={{ mt: 2, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
                <Typography variant="subtitle2" gutterBottom>Formula Examples:</Typography>
                <Typography variant="caption" display="block">
                  • Age from birth date: <code>new Date().getFullYear() - new Date(parent1).getFullYear()</code>
                </Typography>
                <Typography variant="caption" display="block">
                  • Sum two numbers: <code>parent1 + parent2</code>
                </Typography>
                <Typography variant="caption" display="block">
                  • Concatenate text: <code>parent1 + ' ' + parent2</code>
                </Typography>
              </Box>
            </Box>
          )}

          <Box>
            <Typography variant="subtitle2" gutterBottom>Validation Rules</Typography>
            {config.validations.length === 0 ? (
              <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1, mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  No validation rules added yet. Click the buttons below to add validation.
                </Typography>
              </Box>
            ) : (
              config.validations.map((rule, index) => (
                <Box key={index} sx={{
                  display: 'flex',
                  gap: 2,
                  mb: 2,
                  alignItems: 'center',
                  p: 2,
                  border: '1px solid #e0e0e0',
                  borderRadius: 1,
                  bgcolor: 'background.paper'
                }}>
                  <Chip
                    label={rule.type}
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{ minWidth: 100 }}
                  />
                  {['minLength', 'maxLength'].includes(rule.type) && (
                    <TextField
                      label="Value"
                      type="number"
                      size="small"
                      value={rule.value || ''}
                      onChange={(e) => updateValidation(index, { value: parseInt(e.target.value) || 1 })}
                      sx={{ width: 100 }}
                    />
                  )}
                  <TextField
                    label="Error Message"
                    size="small"
                    value={rule.message}
                    onChange={(e) => updateValidation(index, { message: e.target.value })}
                    fullWidth
                  />
                  <IconButton
                    onClick={() => removeValidation(index)}
                    color="error"
                    size="small"
                  >
                    <Delete />
                  </IconButton>
                </Box>
              ))
            )}
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {[
                { type: 'required', label: 'Required' },
                { type: 'minLength', label: 'Min Length' },
                { type: 'maxLength', label: 'Max Length' },
                { type: 'email', label: 'Email Format' },
                { type: 'password', label: 'Password Strength' }
              ].map(({ type, label }) => (
                <Button
                  key={type}
                  size="small"
                  variant="outlined"
                  onClick={() => addValidation(type as ValidationRule['type'])}
                  disabled={config.validations.some(v => v.type === type)}
                >
                  Add {label}
                </Button>
              ))}
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} size="large">
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          size="large"
          disabled={!canSave}
          sx={{
            background: canSave ? 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)' : undefined,
            boxShadow: canSave ? '0 3px 5px 2px rgba(33, 203, 243, .3)' : undefined
          }}
        >
          {field ? 'Update Field' : 'Create Field'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default FieldConfigurator;