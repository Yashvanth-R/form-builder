import React from 'react';
import { Card, CardContent, Typography, CardActions, Button, Box } from '@mui/material';
import { FormSchema } from '../../types/form.types';

interface Props {
  forms: FormSchema[];
  onPreview: (id: string) => void;
}

export const FormList: React.FC<Props> = ({ forms, onPreview }) => {
  if (forms.length === 0) {
    return <Typography>No saved forms available.</Typography>;
  }

  const formatDate = (dateString: string) => new Date(dateString).toLocaleString();

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
      {forms.map(form => (
        <Card key={form.id} sx={{ width: 300 }}>
          <CardContent>
            <Typography variant="h6">{form.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              Created: {formatDate(form.createdAt)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Fields: {form.fields.length}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small" onClick={() => onPreview(form.id)}>Preview</Button>
          </CardActions>
        </Card>
      ))}
    </Box>
  );
};

export {};