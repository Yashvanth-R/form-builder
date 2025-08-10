import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import { Container, Typography, Card, CardContent, CardActions, Button, Box, Chip, Paper, Avatar, Divider, IconButton, Tooltip, Fade, Dialog, DialogTitle, DialogContent, DialogActions, Alert } from '@mui/material';
import { Visibility, Edit, DateRange, Assignment, AutoAwesome, Delete, Warning } from '@mui/icons-material';
import { RootState } from '../store/store';
import { loadForm, deleteForm } from '../store/formSlice';

export const MyForms: React.FC = () => {
  const { savedForms } = useSelector((state: RootState) => state.form);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [formToDelete, setFormToDelete] = React.useState<{ id: string; name: string } | null>(null);
  const [deleteSuccess, setDeleteSuccess] = React.useState(false);

  const handlePreviewForm = (formId: string) => {
    dispatch(loadForm(formId));
    navigate('/preview');
  };

  const handleEditForm = (formId: string) => {
    dispatch(loadForm(formId));
    navigate('/create');
  };

  const handleDeleteClick = (formId: string, formName: string) => {
    setFormToDelete({ id: formId, name: formName });
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (formToDelete) {
      dispatch(deleteForm(formToDelete.id));
      setDeleteDialogOpen(false);
      setFormToDelete(null);
      setDeleteSuccess(true);
      setTimeout(() => setDeleteSuccess(false), 3000);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setFormToDelete(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFormTypeColor = (fieldTypes: string[]) => {
    if (fieldTypes.includes('date')) return '#ff9800';
    if (fieldTypes.includes('select')) return '#4caf50';
    if (fieldTypes.includes('number')) return '#2196f3';
    return '#9c27b0';
  };

  if (!savedForms || savedForms.length === 0) {
    return (
      <Container maxWidth="md">
        <Box sx={{ py: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
              My Forms
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage and preview your saved forms
            </Typography>
          </Box>

          <Paper sx={{
            p: 6,
            textAlign: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: 3
          }}>
            <Assignment sx={{ fontSize: 64, mb: 2, opacity: 0.7 }} />
            <Typography variant="h5" gutterBottom>
              No Forms Yet
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
              Create your first form to see it here. All your saved forms will appear in this section.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/create')}
              sx={{
                bgcolor: 'rgba(255,255,255,0.2)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
              }}
            >
              Create Your First Form
            </Button>
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
              My Forms
            </Typography>
            <Typography variant="body1" color="text.secondary">
              You have {savedForms.length} saved form{savedForms.length !== 1 ? 's' : ''}
            </Typography>
          </Box>

          <Button
            variant="contained"
            onClick={() => navigate('/create')}
            sx={{
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)'
            }}
          >
            Create New Form
          </Button>
        </Box>

        <Fade in={deleteSuccess}>
          <Alert severity="success" sx={{ mb: 3 }}>
            Form deleted successfully!
          </Alert>
        </Fade>

        <Grid container spacing={3}>
          {savedForms.map((form, index) => (
            <Grid item xs={12} sm={6} md={4} key={form.id}>
              <Fade in={true} style={{ transitionDelay: `${index * 100}ms` }}>
                <Card
                  elevation={3}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 6
                    }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar
                        sx={{
                          bgcolor: getFormTypeColor(Array.from(new Set(form.fields.map(f => f.type)))),
                          mr: 2,
                          width: 48,
                          height: 48
                        }}
                      >
                        <Assignment />
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 0.5 }}>
                          {form.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <DateRange sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(form.createdAt)}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                      <Chip
                        label={`${form.fields.length} field${form.fields.length !== 1 ? 's' : ''}`}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                      <Chip
                        label={`${form.fields.filter(f => f.required).length} required`}
                        size="small"
                        color="error"
                        variant="outlined"
                      />
                      {form.fields.some(f => f.isDerived) && (
                        <Chip
                          label="Smart fields"
                          size="small"
                          color="secondary"
                          variant="outlined"
                          icon={<AutoAwesome sx={{ fontSize: 16 }} />}
                        />
                      )}
                    </Box>

                    <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                        Field Types:
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 0.5 }}>
                        {Array.from(new Set(form.fields.map(f => f.type))).map(type => (
                          <Chip
                            key={type}
                            label={type}
                            size="small"
                            sx={{ fontSize: '0.7rem', height: 20 }}
                          />
                        ))}
                      </Box>
                    </Box>
                  </CardContent>

                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
                      <Tooltip title="Preview form">
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => handlePreviewForm(form.id)}
                          startIcon={<Visibility />}
                          sx={{ flexGrow: 1 }}
                        >
                          Preview
                        </Button>
                      </Tooltip>
                      <Tooltip title="Edit form">
                        <IconButton
                          onClick={() => handleEditForm(form.id)}
                          color="primary"
                          sx={{ border: '1px solid', borderColor: 'primary.main' }}
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete form">
                        <IconButton
                          onClick={() => handleDeleteClick(form.id, form.name)}
                          color="error"
                          sx={{ border: '1px solid', borderColor: 'error.main' }}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </CardActions>
                </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={handleDeleteCancel}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{
            background: 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <Warning />
            Delete Form
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <Typography variant="body1" gutterBottom>
              Are you sure you want to delete the form "{formToDelete?.name}"?
            </Typography>
            <Alert severity="warning" sx={{ mt: 2 }}>
              This action cannot be undone. All form data and configurations will be permanently deleted.
            </Alert>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleDeleteCancel} size="large">
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              variant="contained"
              color="error"
              size="large"
              startIcon={<Delete />}
            >
              Delete Form
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};