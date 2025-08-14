'use client'

import { useState } from 'react'
import { 
  Container, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper,
  InputAdornment,
  IconButton,
  Divider,
  useTheme,
  alpha,
  Stack,
  CircularProgress,
  Alert
} from '@mui/material'
import { 
  Visibility, 
  VisibilityOff, 
  Email, 
  Lock,
  Person,
  Google,
  GitHub,
  Apple
} from '@mui/icons-material'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const theme = useTheme()
  const router = useRouter()

  const isValidEmail = (email: string) => {
    // Simple email regex validation
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleSignUp = async () => {
    setErrorMsg('')
    setSuccessMsg('')
    setEmailError('')
    setPasswordError('')

    let hasError = false
    if (!isValidEmail(email)) {
      setEmailError('Please enter a valid email address')
      hasError = true
    }
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters')
      hasError = true
    }
    if (hasError) return

    setLoading(true)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: 'https://localhost:3000/login',
      },
    })
    setLoading(false)

    if (error) {
      setErrorMsg(error.message)
    } else {
      setSuccessMsg('Check your email to confirm your account!')
      setEmail('')
      setPassword('')
    }
  }

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
        display: 'flex',
        alignItems: 'center',
        py: 4
      }}
    >
      <Container maxWidth="sm">
        <Paper 
          elevation={0}
          sx={{ 
            p: { xs: 3, sm: 5 }, 
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)'
          }}
        >
          {/* Header Section */}
          <Box textAlign="center" mb={4}>
            {/* <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.3)}`
              }}
            >
              <Person sx={{ fontSize: 20, color: 'white' }} />
            </Box> */}
            <Typography 
              variant="h3" 
              component="h1" 
              sx={{ 
                fontWeight: 700,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1
              }}
            >
              Create Account
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary"
              sx={{ fontSize: '1.1rem', fontWeight: 300 }}
            >
              Join us and start your journey today
            </Typography>
          </Box>

          {errorMsg && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorMsg}
            </Alert>
          )}
          {successMsg && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {successMsg}
            </Alert>
          )}

          {/* Social Login Buttons */}
          <Stack spacing={2} mb={3}>
            <Button
              fullWidth
              variant="outlined"
              size="large"
              startIcon={<Google />}
              sx={{
                borderColor: alpha(theme.palette.grey[400], 0.5),
                color: theme.palette.text.primary,
                py: 1.5,
                fontSize: '1rem',
                textTransform: 'none',
                borderRadius: 2,
                '&:hover': {
                  borderColor: theme.palette.primary.main,
                  backgroundColor: alpha(theme.palette.primary.main, 0.04)
                }
              }}
            >
              Continue with Google
            </Button>
            {/* <Stack direction="row" spacing={2}>
              <Button
                fullWidth
                variant="outlined"
                size="large"
                startIcon={<GitHub />}
                sx={{
                  borderColor: alpha(theme.palette.grey[400], 0.5),
                  color: theme.palette.text.primary,
                  py: 1.5,
                  textTransform: 'none',
                  borderRadius: 2,
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    backgroundColor: alpha(theme.palette.primary.main, 0.04)
                  }
                }}
              >
                GitHub
              </Button>
              <Button
                fullWidth
                variant="outlined"
                size="large"
                startIcon={<Apple />}
                sx={{
                  borderColor: alpha(theme.palette.grey[400], 0.5),
                  color: theme.palette.text.primary,
                  py: 1.5,
                  textTransform: 'none',
                  borderRadius: 2,
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    backgroundColor: alpha(theme.palette.primary.main, 0.04)
                  }
                }}
              >
                Apple
              </Button>
            </Stack> */}
          </Stack>

          {/* Divider */}
          <Box position="relative" my={3}>
            <Divider />
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: 'white',
                px: 2,
                fontSize: '0.9rem'
              }}
            >
              or continue with email
            </Typography>
          </Box>

          {/* Form Fields */}
          <Stack spacing={3} mb={4}>
            <TextField
              fullWidth
              label="Email Address"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!emailError}
              helperText={emailError}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: theme.palette.text.secondary }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: alpha(theme.palette.grey[50], 0.5),
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.grey[50], 0.8),
                  },
                  '&.Mui-focused': {
                    backgroundColor: 'white',
                    boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.1)}`,
                  }
                }
              }}
            />
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!passwordError}
              helperText={passwordError}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: theme.palette.text.secondary }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                      sx={{ color: theme.palette.text.secondary }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: alpha(theme.palette.grey[50], 0.5),
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.grey[50], 0.8),
                  },
                  '&.Mui-focused': {
                    backgroundColor: 'white',
                    boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.1)}`,
                  }
                }
              }}
            />
          </Stack>

          {/* Sign Up Button */}
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleSignUp}
            disabled={loading}
            sx={{
              py: 2,
              fontSize: '1.1rem',
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: 2,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.3)}`,
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: `0 12px 40px ${alpha(theme.palette.primary.main, 0.4)}`,
                background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
              },
              '&:disabled': {
                background: alpha(theme.palette.grey[400], 0.6),
                boxShadow: 'none',
                transform: 'none'
              }
            }}
          >
            {loading ? (
              <Box display="flex" alignItems="center" gap={2}>
                <CircularProgress size={20} color="inherit" />
                Creating your account...
              </Box>
            ) : (
              'Create Account'
            )}
          </Button>

          {/* Footer */}
          <Box textAlign="center" mt={4}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
              <Button
                variant="text"
                sx={{ 
                  textTransform: 'none',
                  fontWeight: 600,
                  p: 0,
                  minWidth: 'auto',
                  color: theme.palette.primary.main
                }}
                onClick={() => router.push('/login')}
              >
                Sign in here
              </Button>
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ mt: 2, fontSize: '0.85rem' }}
            >
              By creating an account, you agree to our{' '}
              <Button 
                variant="text" 
                size="small" 
                sx={{ 
                  textTransform: 'none', 
                  p: 0, 
                  minWidth: 'auto',
                  fontSize: '0.85rem',
                  textDecoration: 'underline'
                }}
              >
                Terms of Service
              </Button>
              {' '}and{' '}
              <Button 
                variant="text" 
                size="small" 
                sx={{ 
                  textTransform: 'none', 
                  p: 0, 
                  minWidth: 'auto',
                  fontSize: '0.85rem',
                  textDecoration: 'underline'
                }}
              >
                Privacy Policy
              </Button>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}