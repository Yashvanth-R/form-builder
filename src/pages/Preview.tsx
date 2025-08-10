import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Typography, TextField, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Checkbox, Radio, RadioGroup, Button, Box, Alert, Paper, Card, CardContent, Chip, Divider, LinearProgress, Fade, Zoom } from '@mui/material';
import { Send, CheckCircle, Warning, Info, AutoAwesome, Visibility } from '@mui/icons-material';
import { RootState } from '../store/store';
import { updateFormValue } from '../store/formSlice';
import { validateField } from '../utils/validation.utils';

export const Preview: React.FC = () => {
  const dispatch = useDispatch();
  const { currentForm, formValues } = useSelector((state: RootState) => state.form);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [submitted, setSubmitted] = React.useState(false);

  // Calculate derived fields
  useEffect(() => {
    currentForm.forEach(field => {
      if (field.isDerived && field.derivedFrom && field.derivedFormula) {
        try {
          const context: Record<string, any> = {};
          field.derivedFrom.forEach((parentId, index) => {
            context[`parent${index + 1}`] = formValues[parentId];
          });

          // Safe evaluation of simple formulas
          let derivedValue: any = '';
          if (field.derivedFormula.includes('getFullYear')) {
            // Handle age calculation from date of birth
            const dateValue = context.parent1;
            if (dateValue) {
              const birthYear = new Date(dateValue).getFullYear();
              const currentYear = new Date().getFullYear();
              derivedValue = currentYear - birthYear;
            }
          } else {
            // Handle other simple formulas
            try {
              derivedValue = new Function(...Object.keys(context), `return ${field.derivedFormula}`)(...Object.values(context));
            } catch {
              derivedValue = '';
            }
          }
          
          if (derivedValue !== formValues[field.id]) {
            dispatch(updateFormValue({ fieldId: field.id, value: derivedValue }));
          }
        } catch (error) {
          console.error('Error calculating derived field:', error);
        }
      }
    });
  }, [formValues, currentForm, dispatch]);

  const handleFieldChange = (fieldId: string, value: any) => {
    dispatch(updateFormValue({ fieldId, value }));
    
    // Clear error when user starts typing
    if (errors[fieldId]) {
      setErrors(prev => ({
        ...prev,
        [fieldId]: ''
      }));
    }
  };

  const handleSubmit = () => {
    // Validate all fields
    const newErrors: Record<string, string> = {};
    let hasErrors = false;
    currentForm.forEach(field => {
      if (!field.isDerived) {
        const error = validateField(field, formValues[field.id]);
        if (error) {
          newErrors[field.id] = error;
          hasErrors = true;
        }
      }
    });
    setErrors(newErrors);
    if (!hasErrors) {
      setSubmitted(true);
      // Optionally clear values after submit
      // dispatch(clearCurrentForm());
      console.log('Form values:', formValues);
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  const renderField = (field: any) => {
    const value = formValues[field.id] || '';
    const error = errors[field.id];

    switch (field.type) {
      case 'text':
        return (
          <TextField
            key={field.id}
            label={field.label}
            required={field.required}
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            error={!!error}
            helperText={error}
            fullWidth
            disabled={field.isDerived}
            sx={{ mb: 3 }}
          />
        );

      case 'number':
        return (
          <TextField
            key={field.id}
            type="number"
            label={field.label}
            required={field.required}
            value={value}
            onChange={(e) => handleFieldChange(field.id, parseFloat(e.target.value) || '')}
            error={!!error}
            helperText={error}
            fullWidth
            disabled={field.isDerived}
            sx={{ mb: 3 }}
          />
        );

      case 'textarea':
        return (
          <TextField
            key={field.id}
            label={field.label}
            required={field.required}
            multiline
            rows={4}
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            error={!!error}
            helperText={error}
            fullWidth
            disabled={field.isDerived}
            sx={{ mb: 3 }}
          />
        );

      case 'date':
        return (
          <TextField
            key={field.id}
            type="date"
            label={field.label}
            required={field.required}
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            error={!!error}
            helperText={error}
            fullWidth
            InputLabelProps={{ shrink: true }}
            disabled={field.isDerived}
            sx={{ mb: 3 }}
          />
        );

      case 'select':
        return (
          <FormControl key={field.id} fullWidth sx={{ mb: 3 }} error={!!error}>
            <InputLabel>{field.label}</InputLabel>
            <Select
              value={value}
              label={field.label}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              disabled={field.isDerived}
            >
              {field.options?.map((option: string, index: number) => (
                <MenuItem key={index} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
            {error && <Typography variant="caption" color="error">{error}</Typography>}
          </FormControl>
        );

      case 'radio':
        return (
          <FormControl key={field.id} component="fieldset" sx={{ mb: 3 }} error={!!error}>
            <Typography variant="subtitle1" gutterBottom>
              {field.label} {field.required && '*'}
            </Typography>
            <RadioGroup
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
            >
              {field.options?.map((option: string, index: number) => (
                <FormControlLabel
                  key={index}
                  value={option}
                  control={<Radio />}
                  label={option}
                  disabled={field.isDerived}
                />
              ))}
            </RadioGroup>
            {error && <Typography variant="caption" color="error">{error}</Typography>}
          </FormControl>
        );

      case 'checkbox':
        return (
          <FormControlLabel
            key={field.id}
            control={
              <Checkbox
                checked={!!value}
                onChange={(e) => handleFieldChange(field.id, e.target.checked)}
                disabled={field.isDerived}
              />
            }
            label={`${field.label} ${field.required ? '*' : ''}`}
            sx={{ mb: 3, display: 'block' }}
          />
        );

      default:
        return null;
    }
  };

  const completionPercentage = currentForm.length > 0 
    ? Math.round((Object.keys(formValues).filter(key => 
        formValues[key] !== '' && formValues[key] !== undefined && formValues[key] !== null
      ).length / currentForm.filter(f => !f.isDerived).length) * 100)
    : 0;

  if (currentForm.length === 0) {
    return (
      <Container maxWidth="md">
        <Box sx={{ py: 4 }}>
          <Paper sx={{ 
            p: 6, 
            textAlign: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: 3
          }}>
            <Visibility sx={{ fontSize: 64, mb: 2, opacity: 0.7 }} />
            <Typography variant="h5" gutterBottom>
              No Form to Preview
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Create a form first by going to the Create page, then come back here to preview it.
            </Typography>
          </Paper>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
              Form Preview
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Test your form before sharing it with users
            </Typography>
          </Box>
          
          <Card sx={{ minWidth: 200 }}>
            <CardContent sx={{ py: 2 }}>
              <Typography variant="h6" gutterBottom>Progress</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={completionPercentage} 
                  sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                />
                <Typography variant="body2" color="text.secondary">
                  {completionPercentage}%
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Fade in={submitted}>
          <Alert 
            severity="success" 
            sx={{ mb: 3 }} 
            icon={<CheckCircle />}
            action={
              <Button color="inherit" size="small">
                View Data
              </Button>
            }
          >
            Form submitted successfully! Check the console for form values.
          </Alert>
        </Fade>
        
        {Object.values(errors).some(Boolean) && (
          <Alert severity="error" sx={{ mb: 3 }} icon={<Warning />}>
            Please fix the errors below before submitting.
          </Alert>
        )}

        <Box sx={{ display: 'flex', gap: 3 }}>
          {/* Form Fields */}
          <Paper 
            elevation={3} 
            sx={{ 
              flexGrow: 1,
              borderRadius: 3,
              overflow: 'hidden'
            }}
          >
            <Box sx={{ 
              p: 3, 
              bgcolor: 'primary.main', 
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <Info />
              <Typography variant="h6">Form Fields</Typography>
            </Box>
            
            <Box sx={{ p: 4 }}>
              <Box component="form">
                {currentForm.map((field, index) => (
                  <Zoom in={true} key={field.id} style={{ transitionDelay: `${index * 100}ms` }}>
                    <Box sx={{ mb: 3 }}>
                      {renderField(field)}
                    </Box>
                  </Zoom>
                ))}
                
                <Divider sx={{ my: 3 }} />
                
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  size="large"
                  fullWidth
                  startIcon={<Send />}
                  disabled={Object.values(errors).some(Boolean)}
                  sx={{ 
                    py: 1.5,
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)'
                  }}
                >
                  Submit Form
                </Button>
              </Box>
            </Box>
          </Paper>

          {/* Form Info Sidebar */}
          <Box sx={{ width: 300 }}>
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Form Statistics</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Total Fields:</Typography>
                    <Chip label={currentForm.length} size="small" />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Required:</Typography>
                    <Chip label={currentForm.filter(f => f.required).length} size="small" color="error" />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Derived:</Typography>
                    <Chip label={currentForm.filter(f => f.isDerived).length} size="small" color="secondary" />
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {currentForm.filter(f => f.isDerived).length > 0 && (
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AutoAwesome />
                    Derived Fields
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {currentForm.filter(f => f.isDerived).map(field => (
                      <Chip 
                        key={field.id}
                        label={field.label} 
                        size="small" 
                        variant="outlined"
                        color="secondary"
                      />
                    ))}
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    These fields are automatically calculated based on other field values.
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Box>
        </Box>
      </Box>
    </Container>
  );
};
