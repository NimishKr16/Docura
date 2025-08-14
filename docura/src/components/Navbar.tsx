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
    toast.success('Logging you out...')
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
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(25px)',
        WebkitBackdropFilter: 'blur(25px)', // Safari support
        borderBottom: '1px solid rgba(255, 255, 255, 0.18)',
        boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
        color: theme.palette.text.primary,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
          borderRadius: 'inherit',
          zIndex: -1,
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
        }
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
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              '&:hover': {
                transform: 'scale(1.05)',
                filter: 'brightness(1.1)',
              }
            }}
          >
            Docura
          </Typography>
        </Box>

        {/* Right Side - User Menu */}
        <Box display="flex" alignItems="center">
          {/* Enhanced Glass Logout Button */}
          <Tooltip title="Logout" placement="bottom">
            <IconButton
              onClick={handleLogout}
              sx={{
                background: 'rgba(239, 68, 68, 0.1)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: 2,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
                  zIndex: 0,
                },
                '&:hover': {
                  background: 'rgba(239, 68, 68, 0.15)',
                  borderColor: 'rgba(239, 68, 68, 0.4)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(239, 68, 68, 0.25), 0 4px 12px rgba(0, 0, 0, 0.1)',
                  '&::before': {
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))',
                  }
                },
                '&:active': {
                  transform: 'translateY(-1px)',
                }
              }}
            >
              <Logout 
                sx={{ 
                  color: theme.palette.error.main, 
                  fontSize: 20,
                  position: 'relative',
                  zIndex: 1,
                  filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))'
                }} 
              />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
    </>
  )
}