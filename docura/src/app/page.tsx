"use client"

import { alpha, Box, Button, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const theme = useTheme();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        window.location.href = "/login";
      } else {
        setUser(user);
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return null;
  }

  const handleNewDocument = async () => {
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (!currentUser) {
      toast.error("You must be logged in to create a document.");
      return;
    }
    const { data, error } = await supabase
      .from("Document")
      .insert([{ title: "Untitled Document", content: {} }])
      .select()
      .single();
    if (error) {
      console.error("Error creating document:", error);
      toast.error("Failed to create document.");
      return;
    }
    if (data && data.id) {
      router.push(`/document/${data.id}`);
    }
  };

  if (user) {
    return (
  <div>
    <Navbar />
    
    {/* Main Content Area */}
    <Box
      sx={{
        pt: '80px', // Proper spacing from fixed navbar
        minHeight: 'calc(100vh - 80px)',
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.03)} 100%)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
      }}
    >
      {/* Hero Section */}
      <Box textAlign="center" mb={6}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2,
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
          }}
        >
          Welcome to Docura
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{
            fontWeight: 300,
            mb: 4,
            maxWidth: '600px',
            mx: 'auto',
            fontSize: { xs: '1rem', sm: '1.25rem' }
          }}
        >
          Create, edit, and manage your documents with ease
        </Typography>
      </Box>

      {/* New Document Button */}
      <Button
        variant="contained"
        size="large"
        onClick={handleNewDocument}
        startIcon={
          <Box
            sx={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
          </Box>
        }
        sx={{
          py: 2.5,
          px: 4,
          fontSize: '1.2rem',
          fontWeight: 600,
          textTransform: 'none',
          borderRadius: 3,
          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          boxShadow: `0 12px 40px ${alpha(theme.palette.primary.main, 0.3)}`,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'hidden',
          minWidth: '200px',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
            transition: 'left 0.5s ease',
          },
          '&:hover': {
            transform: 'translateY(-3px) scale(1.02)',
            boxShadow: `0 20px 60px ${alpha(theme.palette.primary.main, 0.4)}`,
            '&::before': {
              left: '100%',
            }
          },
          '&:active': {
            transform: 'translateY(-1px) scale(1.01)',
          }
        }}
      >
        Create New Document
      </Button>

      {/* Optional: Additional Content Area */}
      <Box
        sx={{
          mt: 8,
          width: '100%',
          maxWidth: '1200px',
          // This is where your additional content will go
          // It will automatically be positioned below the button
        }}
      >
        {/* Future content goes here */}
      </Box>
    </Box>
    
    <ToastContainer />
  </div>
)
  }

  return null;
}
