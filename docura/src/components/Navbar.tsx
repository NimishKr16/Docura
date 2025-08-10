'use client'

import { SetStateAction, useState } from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Tooltip,
  IconButton,
  useTheme,
  alpha,
  Menu,
  MenuItem,
  Avatar,
  Divider
} from '@mui/material'
import {
  Logout,
  Person,
  Settings,
  KeyboardArrowDown
} from '@mui/icons-material'
import { supabase } from '@/lib/supabase'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function Navbar() {
  const [anchorEl, setAnchorEl] = useState(null)
  const theme = useTheme()
  const open = Boolean(anchorEl)

  const handleMenuClick = (event: { currentTarget: SetStateAction<null> }) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = async () => {
    handleMenuClose()
    await supabase.auth.signOut()
    toast.success('Logged out successfully!')
    setTimeout(() => {
      window.location.href = '/login'
    }, 1200)
  }

  return (
    <>
      <ToastContainer />
      <AppBar 
        position="fixed" 
        elevation={0}
        sx={{
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
          color: theme.palette.text.primary,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 4 } }}>
          {/* Left Side - Logo */}
          <Box display="flex" alignItems="center">
            <Typography
              variant="h5"
              component="div"
              sx={{
                fontWeight: 700,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.5px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                }
              }}
            >
              Docura
            </Typography>
          </Box>

          {/* Right Side - User Menu */}
          <Box display="flex" alignItems="center">
            {/* Simple Logout Button Version */}
            <Tooltip title="Logout" placement="bottom">
              <IconButton
                onClick={handleLogout}
                sx={{
                  background: alpha(theme.palette.error.main, 0.1),
                  border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
                  borderRadius: 2,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    background: alpha(theme.palette.error.main, 0.15),
                    borderColor: theme.palette.error.main,
                    transform: 'translateY(-1px)',
                    boxShadow: `0 4px 12px ${alpha(theme.palette.error.main, 0.3)}`,
                  }
                }}
              >
                <Logout sx={{ color: theme.palette.error.main, fontSize: 20 }} />
              </IconButton>
            </Tooltip>

            {/* Alternative: User Profile Dropdown */}
            {/* Uncomment this section if you prefer a dropdown menu instead */}
            {/*
            <Button
              onClick={handleMenuClick}
              endIcon={<KeyboardArrowDown />}
              sx={{
                textTransform: 'none',
                borderRadius: 2,
                px: 2,
                py: 1,
                background: alpha(theme.palette.grey[100], 0.5),
                border: `1px solid ${alpha(theme.palette.grey[300], 0.3)}`,
                transition: 'all 0.2s ease',
                '&:hover': {
                  background: alpha(theme.palette.grey[100], 0.8),
                  borderColor: theme.palette.primary.main,
                  transform: 'translateY(-1px)',
                  boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
                }
              }}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  mr: 1,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                }}
              >
                <Person sx={{ fontSize: 18 }} />
              </Avatar>
              <Typography variant="body2" color="text.primary" fontWeight={500}>
                John Doe
              </Typography>
            </Button>

            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  borderRadius: 2,
                  minWidth: 200,
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                }
              }}
            >
              <MenuItem onClick={handleMenuClose} sx={{ borderRadius: 1, mx: 1, my: 0.5 }}>
                <Person sx={{ mr: 2, fontSize: 20 }} />
                Profile
              </MenuItem>
              <MenuItem onClick={handleMenuClose} sx={{ borderRadius: 1, mx: 1, my: 0.5 }}>
                <Settings sx={{ mr: 2, fontSize: 20 }} />
                Settings
              </MenuItem>
              <Divider sx={{ my: 1 }} />
              <MenuItem 
                onClick={handleLogout} 
                sx={{ 
                  borderRadius: 1, 
                  mx: 1, 
                  my: 0.5,
                  color: theme.palette.error.main,
                  '&:hover': {
                    background: alpha(theme.palette.error.main, 0.1)
                  }
                }}
              >
                <Logout sx={{ mr: 2, fontSize: 20 }} />
                Logout
              </MenuItem>
            </Menu>
            */}
          </Box>
        </Toolbar>
      </AppBar>
    </>
  )
}