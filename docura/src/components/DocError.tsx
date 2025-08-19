import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  useTheme,
  alpha,
  Container
} from '@mui/material';
import {
  Lock,
  FindInPage,
  Warning,
  Home,
  ArrowBack,
  Refresh
} from '@mui/icons-material';

interface DocumentErrorProps {
  type?: 'not-found' | 'access-denied' | 'server-error' | 'network-error';
  onGoHome?: () => void;
  onGoBack?: () => void;
  onRetry?: () => void;
  customTitle?: string;
  customMessage?: string;
}

const DocumentError: React.FC<DocumentErrorProps> = ({ 
  type = 'not-found', 
  onGoHome, 
  onGoBack, 
  onRetry,
  customTitle,
  customMessage 
}) => {
  const theme = useTheme();

  const errorConfig = {
    'not-found': {
      icon: FindInPage,
      title: 'Document Not Found',
      message: 'The document you\'re looking for doesn\'t exist or may have been deleted.',
      color: '#6b7280',
      bgColor: '#f3f4f6'
    },
    'access-denied': {
      icon: Lock,
      title: 'Access Denied',
      message: 'You don\'t have permission to view this document. Please contact the owner for access.',
      color: '#dc2626',
      bgColor: '#fef2f2'
    },
    'server-error': {
      icon: Warning,
      title: 'Something Went Wrong',
      message: 'We encountered an error while loading your document. Please try again.',
      color: '#d97706',
      bgColor: '#fffbeb'
    },
    'network-error': {
      icon: Warning,
      title: 'Connection Problem',
      message: 'Unable to connect to our servers. Please check your internet connection.',
      color: '#7c3aed',
      bgColor: '#faf5ff'
    }
  };

  const config = errorConfig[type] || errorConfig['not-found'];
  const IconComponent = config.icon;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: '#fafbfc',
        pt: '80px', // Account for navbar
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: 6,
            textAlign: 'center',
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: 3,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
          }}
        >
          {/* Error Icon */}
          <Box
            sx={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              background: config.bgColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 32px',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                inset: -8,
                borderRadius: '50%',
                background: `linear-gradient(45deg, ${alpha(config.color, 0.1)}, ${alpha(config.color, 0.05)})`,
                zIndex: -1,
              }
            }}
          >
            <IconComponent
              sx={{
                fontSize: 60,
                color: config.color,
              }}
            />
          </Box>

          {/* Error Content */}
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: '#1a1a1a',
              mb: 2,
              fontSize: { xs: '1.75rem', sm: '2.25rem' },
              lineHeight: 1.2,
            }}
          >
            {customTitle || config.title}
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: '#6b7280',
              mb: 4,
              fontSize: '1.1rem',
              lineHeight: 1.6,
              maxWidth: '400px',
              mx: 'auto',
            }}
          >
            {customMessage || config.message}
          </Typography>

          {/* Action Buttons */}
          <Box
            display="flex"
            flexDirection={{ xs: 'column', sm: 'row' }}
            gap={2}
            justifyContent="center"
            mt={4}
          >
            {onGoHome && (
              <Button
                variant="contained"
                startIcon={<Home />}
                onClick={onGoHome}
                sx={{
                  background: '#1a1a1a',
                  color: 'white',
                  px: 3,
                  py: 1.5,
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: 2,
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    background: '#2d2d2d',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
                  },
                }}
              >
                Go to Dashboard
              </Button>
            )}

            {onGoBack && (
              <Button
                variant="outlined"
                startIcon={<ArrowBack />}
                onClick={onGoBack}
                sx={{
                  borderColor: '#e5e7eb',
                  color: '#6b7280',
                  px: 3,
                  py: 1.5,
                  textTransform: 'none',
                  fontWeight: 500,
                  borderRadius: 2,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: '#d1d5db',
                    background: '#f9fafb',
                    color: '#374151',
                  },
                }}
              >
                Go Back
              </Button>
            )}

            {onRetry && type === 'server-error' && (
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={onRetry}
                sx={{
                  borderColor: config.color,
                  color: config.color,
                  px: 3,
                  py: 1.5,
                  textTransform: 'none',
                  fontWeight: 500,
                  borderRadius: 2,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    background: alpha(config.color, 0.1),
                    borderColor: config.color,
                  },
                }}
              >
                Try Again
              </Button>
            )}
          </Box>

          {/* Help Text */}
          {type === 'access-denied' && (
            <Box
              sx={{
                mt: 4,
                p: 3,
                background: alpha(config.color, 0.05),
                borderRadius: 2,
                border: `1px solid ${alpha(config.color, 0.1)}`,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: '#6b7280',
                  fontWeight: 500,
                  mb: 1,
                }}
              >
                Need access to this document?
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: '#9ca3af',
                  fontSize: '0.9rem',
                }}
              >
                Contact the document owner or your administrator to request viewing permissions.
              </Typography>
            </Box>
          )}

          {type === 'network-error' && (
            <Box
              sx={{
                mt: 4,
                p: 3,
                background: alpha(config.color, 0.05),
                borderRadius: 2,
                border: `1px solid ${alpha(config.color, 0.1)}`,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: '#6b7280',
                  fontWeight: 500,
                  mb: 1,
                }}
              >
                Troubleshooting Tips:
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: '#9ca3af',
                  fontSize: '0.9rem',
                  textAlign: 'left',
                }}
              >
                • Check your internet connection<br/>
                • Refresh the page<br/>
                • Try again in a few minutes
              </Typography>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default DocumentError;