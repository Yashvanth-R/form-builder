import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { store } from './store/store';
import { Create } from './pages/Create';
import { Preview } from './pages/Preview';
import { MyForms } from './pages/MyForms';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const Navigation: React.FC = () => {
  const location = useLocation();

  return (
    <AppBar 
      position="static" 
      sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}
    >
      <Toolbar sx={{ py: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Box 
            sx={{ 
              width: 40, 
              height: 40, 
              borderRadius: 2, 
              bgcolor: 'rgba(255,255,255,0.2)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              mr: 2
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>
              FB
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
              Form Builder
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button 
            color="inherit" 
            component={Link} 
            to="/create"
            variant={location.pathname === '/create' ? 'contained' : 'text'}
            sx={{ 
              borderRadius: 2,
              ...(location.pathname === '/create' && {
                bgcolor: 'rgba(255,255,255,0.2)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
              })
            }}
          >
            Create
          </Button>
          <Button 
            color="inherit" 
            component={Link} 
            to="/preview"
            variant={location.pathname === '/preview' ? 'contained' : 'text'}
            sx={{ 
              borderRadius: 2,
              ...(location.pathname === '/preview' && {
                bgcolor: 'rgba(255,255,255,0.2)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
              })
            }}
          >
            Preview
          </Button>
          <Button 
            color="inherit" 
            component={Link} 
            to="/myforms"
            variant={location.pathname === '/myforms' ? 'contained' : 'text'}
            sx={{ 
              borderRadius: 2,
              ...(location.pathname === '/myforms' && {
                bgcolor: 'rgba(255,255,255,0.2)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
              })
            }}
          >
            My Forms
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Navigation />
          <Routes>
            <Route path="/" element={<Navigate to="/create" replace />} />
            <Route path="/create" element={<Create />} />
            <Route path="/preview" element={<Preview />} />
            <Route path="/myforms" element={<MyForms />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
