import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Typography, Button, List, ListItem, ListItemText, IconButton, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Paper, Box, Alert, Chip, Card, CardContent, Grid, Tooltip, Fade } from '@mui/material';
import { Add, Delete, Edit, DragHandle, Save, Clear, Preview, Info, CheckCircle, Warning } from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { RootState } from '../store/store';
import { addField, updateField, deleteField, reorderFields, saveForm, clearCurrentForm } from '../store/formSlice';
import { FieldConfigurator } from '../components/FormBuilder/FieldConfigurator';
import { FormField } from '../types/form.types';
import { useNavigate } from 'react-router-dom';

export const Create: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentForm } = useSelector((state: RootState) => state.form);
  const [configuratorOpen, setConfiguratorOpen] = useState(false);
  const [editingField, setEditingField] = useState<FormField | null>(null);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [formName, setFormName] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [formError, setFormError] = useState('');

  const handleAddField = () => {
    setEditingField(null);
    setConfiguratorOpen(true);
  };

  const handleEditField = (field: FormField) => {
    setEditingField(field);
    setConfiguratorOpen(true);
  };

  const handleSaveField = (field: FormField) => {
    if (editingField) {
      dispatch(updateField({ id: field.id, field }));
    } else {
      dispatch(addField(field));
    }
  };

  const handleDeleteField = (fieldId: string) => {
    dispatch(deleteField(fieldId));
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    dispatch(reorderFields({
      fromIndex: result.source.index,
      toIndex: result.destination.index
    }));
  };

  const handleSaveForm = () => {
    if (!formName.trim()) {
      setFormError('Form name is required.');
      return;
    }
    if (!currentForm || currentForm.length === 0) {
      setFormError('Add at least one field to save the form.');
      return;
    }
    setFormError('');
    dispatch(saveForm({ name: formName.trim() }));
    setFormName('');
    setSaveDialogOpen(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleClearForm = () => {
    dispatch(clearCurrentForm());
  };

  const handlePreviewForm = () => {
    navigate('/preview');
  };

  const getFieldTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      text: 'primary',
      number: 'secondary',
      textarea: 'info',
      select: 'success',
      radio: 'warning',
      checkbox: 'error',
      date: 'default'
    };
    return colors[type] || 'default';
  };

  const formStats = {
    totalFields: currentForm.length,
    requiredFields: currentForm.filter(f => f.required).length,
    derivedFields: currentForm.filter(f => f.isDerived).length,
    fieldTypes: Array.from(new Set(currentForm.map(f => f.type))).length
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
              Form Builder
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Create dynamic forms with drag-and-drop functionality
            </Typography>
          </Box>
          {currentForm.length > 0 && (
            <Card sx={{ minWidth: 200 }}>
              <CardContent sx={{ py: 2 }}>
                <Typography variant="h6" gutterBottom>Form Stats</Typography>
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Total: {formStats.totalFields}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Required: {formStats.requiredFields}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Derived: {formStats.derivedFields}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Types: {formStats.fieldTypes}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}
        </Box>

        <Fade in={saveSuccess}>
          <Alert severity="success" sx={{ mb: 2 }} icon={<CheckCircle />}>
            Form saved successfully! You can find it in "My Forms" section.
          </Alert>
        </Fade>

        {formError && (
          <Alert severity="error" sx={{ mb: 2 }} icon={<Warning />}>
            {formError}
          </Alert>
        )}

        <Paper sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleAddField}
              size="large"
              sx={{
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)'
              }}
            >
              Add Field
            </Button>

            {currentForm.length > 0 && (
              <>
                <Tooltip title="Preview your form">
                  <Button
                    variant="outlined"
                    startIcon={<Preview />}
                    onClick={handlePreviewForm}
                    size="large"
                  >
                    Preview
                  </Button>
                </Tooltip>

                <Tooltip title="Save form for later use">
                  <Button
                    variant="outlined"
                    startIcon={<Save />}
                    onClick={() => setSaveDialogOpen(true)}
                    size="large"
                  >
                    Save Form
                  </Button>
                </Tooltip>

                <Tooltip title="Clear all fields">
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<Clear />}
                    onClick={handleClearForm}
                    size="large"
                  >
                    Clear Form
                  </Button>
                </Tooltip>
              </>
            )}
          </Box>
        </Paper>

        <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          {currentForm.length === 0 ? (
            <Box
              sx={{
                p: 6,
                textAlign: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                borderRadius: 3
              }}
            >
              <Add sx={{ fontSize: 64, mb: 2, opacity: 0.7 }} />
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 500 }}>
                Start Building Your Form
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
                Click "Add Field" to create your first form field and begin building
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={handleAddField}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
                }}
              >
                Get Started
              </Button>
            </Box>
          ) : (
            <>
              <Box sx={{
                p: 2,
                bgcolor: 'primary.main',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <Info />
                <Typography variant="h6">Form Fields ({currentForm.length})</Typography>
                <Typography variant="body2" sx={{ ml: 'auto', opacity: 0.9 }}>
                  Drag to reorder fields
                </Typography>
              </Box>

              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="form-fields">
                  {(provided) => (
                    <List {...provided.droppableProps} ref={provided.innerRef} sx={{ p: 0 }}>
                      {currentForm.map((field, index) => (
                        <Draggable key={field.id} draggableId={field.id} index={index}>
                          {(provided, snapshot) => (
                            <ListItem
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              sx={{
                                border: '1px solid #e0e0e0',
                                m: 1,
                                bgcolor: snapshot.isDragging ? '#f0f7ff' : 'white',
                                borderRadius: 2,
                                boxShadow: snapshot.isDragging ? 3 : 1,
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                  boxShadow: 2,
                                  bgcolor: '#fafafa'
                                }
                              }}
                            >
                              <IconButton
                                {...provided.dragHandleProps}
                                sx={{
                                  color: 'text.secondary',
                                  '&:hover': { color: 'primary.main' },
                                  cursor: 'grab',
                                  '&:active': { cursor: 'grabbing' }
                                }}
                              >
                                <DragHandle />
                              </IconButton>

                              <ListItemText
                                primary={
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 500 }}>
                                      {field.label}
                                    </Typography>
                                    <Chip
                                      label={field.type}
                                      size="small"
                                      color={getFieldTypeColor(field.type) as any}
                                      variant="outlined"
                                    />
                                    {field.required && (
                                      <Chip label="Required" size="small" color="error" variant="outlined" />
                                    )}
                                    {field.isDerived && (
                                      <Chip label="Derived" size="small" color="secondary" variant="outlined" />
                                    )}
                                  </Box>
                                }
                                secondary={
                                  <Box>
                                    {field.validations.length > 0 && (
                                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 1 }}>
                                        {field.validations.map((validation, idx) => (
                                          <Chip
                                            key={idx}
                                            label={validation.type}
                                            size="small"
                                            variant="outlined"
                                            sx={{ fontSize: '0.7rem', height: 20 }}
                                          />
                                        ))}
                                      </Box>
                                    )}
                                    {field.options && field.options.length > 0 && (
                                      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                        Options: {field.options.slice(0, 3).join(', ')}
                                        {field.options.length > 3 && ` (+${field.options.length - 3} more)`}
                                      </Typography>
                                    )}
                                  </Box>
                                }
                              />

                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <Tooltip title="Edit field">
                                  <IconButton
                                    onClick={() => handleEditField(field)}
                                    color="primary"
                                    size="small"
                                  >
                                    <Edit />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete field">
                                  <IconButton
                                    onClick={() => handleDeleteField(field.id)}
                                    color="error"
                                    size="small"
                                  >
                                    <Delete />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                            </ListItem>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </List>
                  )}
                </Droppable>
              </DragDropContext>
            </>
          )}
        </Paper>

        <FieldConfigurator
          open={configuratorOpen}
          field={editingField}
          onSave={handleSaveField}
          onClose={() => setConfiguratorOpen(false)}
          existingFields={currentForm}
        />

        <Dialog
          open={saveDialogOpen}
          onClose={() => setSaveDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <Save />
            Save Form
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <TextField
              label="Form Name"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              fullWidth
              margin="normal"
              autoFocus
              error={!formName.trim() && !!formError}
              helperText={!formName.trim() && !!formError ? 'Form name is required.' : 'Give your form a descriptive name'}
              variant="outlined"
            />
            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>Form Summary:</Typography>
              <Typography variant="body2" color="text.secondary">
                • {formStats.totalFields} total fields
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • {formStats.requiredFields} required fields
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • {formStats.derivedFields} derived fields
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setSaveDialogOpen(false)} size="large">
              Cancel
            </Button>
            <Button
              onClick={handleSaveForm}
              variant="contained"
              disabled={!formName.trim() || !currentForm || currentForm.length === 0}
              size="large"
              startIcon={<Save />}
            >
              Save Form
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};
