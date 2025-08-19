"use client";

import { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  Link,
} from "@mui/material";
import { ContentCopy, Close, Block, Refresh, Visibility, Share, Edit } from "@mui/icons-material";
import { toast } from "react-toastify";
import { supabase } from "@/lib/supabase";

interface ShareDocumentModalProps {
  open: boolean;
  onClose: () => void;
  documentId: string;
  onStatusChange: (success: boolean) => void;
}

export default function ShareDocumentModal({
  open,
  onClose,
  documentId,
  onStatusChange,
}: ShareDocumentModalProps) {
  // const supabase = createClientComponentClient();
  const [link, setLink] = useState("");
  const [role, setRole] = useState("viewer");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    if (open) {
      fetchShareDetails();
    }
  }, [open]);

  const fetchShareDetails = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(`/api/share/link?documentId=${documentId}`, {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });
      const data = await res.json();
      if (data?.shareUrl) {
        setLink(data.shareUrl);
        setRole(data.role);
      }
    } catch {
      toast.error("Failed to load share settings.");
    }
    setLoading(false);
  };

  const handleGenerateLink = async () => {
    console.log("Generating link...");
    setLoading(true);
    setDisabled(false);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(`/api/share/link`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ documentId, role, enable: true }),
      });
      const data = await res.json();
      if (data?.shareUrl) {
        setLink(data.shareUrl);
        onStatusChange(true);
        toast.success("Share link generated!");
      }
    } catch {
      toast.error("Error generating link.");
      alert("Error toast executed."); // debugging
      onStatusChange(false);
    }
    setLoading(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 5000);
  };

  const handleDisableLink = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();

      const res = await fetch(`/api/share/link`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          documentId,
          enable: false, // disable sharing
        }),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        setLink("");
        toast.success("Link sharing disabled successfully.");
        onStatusChange(false);
        setDisabled(true);
        setCopied(false);
      } else {
        toast.error(result.error || "Failed to disable link.");
        onStatusChange(true);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to disable link.");
      onStatusChange(true);
    }
    setLoading(false);
  };
  return (
  <Modal open={open} onClose={onClose}>
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: { xs: '90vw', sm: '500px', md: '520px' },
        maxWidth: '95vw',
        maxHeight: '95vh',
        overflow: 'auto',
        bgcolor: 'background.paper',
        borderRadius: 4,
        boxShadow: '0 24px 48px rgba(0,0,0,0.12), 0 8px 16px rgba(0,0,0,0.08)',
        border: '1px solid rgba(255,255,255,0.1)',
        backdropFilter: 'blur(20px)',
        p: { xs: 3, sm: 4 },
      }}
    >
      {/* Header */}
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          mb: 3
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Share sx={{ color: 'white', fontSize: 20 }} />
          </Box>
          <Typography 
            variant="h5" 
            fontWeight={700}
            sx={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Share Document
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          sx={{ 
            bgcolor: 'grey.100',
            '&:hover': { bgcolor: 'grey.200' },
            width: 40,
            height: 40,
          }}
        >
          <Close sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>

      {loading ? (
        <Box 
          sx={{ 
            textAlign: 'center', 
            py: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2
          }}
        >
          <CircularProgress 
            size={40}
            sx={{ 
              color: 'primary.main',
            }}
          />
          <Typography variant="body2" color="text.secondary">
            Generating share link...
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Role Selection */}
          <Box>
            <Typography 
              variant="body2" 
              fontWeight={600} 
              color="text.secondary" 
              sx={{ mb: 1.5 }}
            >
              Access Level
            </Typography>
            <FormControl fullWidth>
              <InputLabel sx={{ fontSize: '14px' }}>Select role</InputLabel>
              <Select
                value={role}
                label="Select role"
                onChange={(e) => setRole(e.target.value)}
                sx={{
                  borderRadius: 2,
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                }}
              >
                <MenuItem value="viewer">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Visibility sx={{ fontSize: 18, color: 'text.secondary' }} />
                    <Box>
                      <Typography variant="body2" fontWeight={500}>Viewer</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Can view only
                      </Typography>
                    </Box>
                  </Box>
                </MenuItem>
                <MenuItem value="commenter">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    {/* <Comment sx={{ fontSize: 18, color: 'text.secondary' }} /> */}
                    <Box>
                      <Typography variant="body2" fontWeight={500}>Commenter</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Can view and comment
                      </Typography>
                    </Box>
                  </Box>
                </MenuItem>
                <MenuItem value="editor">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Edit sx={{ fontSize: 18, color: 'text.secondary' }} />
                    <Box>
                      <Typography variant="body2" fontWeight={500}>Editor</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Can view, comment and edit
                      </Typography>
                    </Box>
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Share Link */}
          <Box>
            <Typography 
              variant="body2" 
              fontWeight={600} 
              color="text.secondary" 
              sx={{ mb: 1.5 }}
            >
              Share Link
            </Typography>
            <TextField
              fullWidth
              value={link}
              placeholder="Generated link will appear here..."
              InputProps={{
                readOnly: true,
                sx: {
                  borderRadius: 2,
                  bgcolor: link ? 'grey.50' : 'transparent',
                  fontFamily: 'monospace',
                  fontSize: '13px',
                },
                endAdornment: (
                  link ? (
                    <IconButton 
                      onClick={handleCopyLink}
                      sx={{ 
                        bgcolor: 'primary.main',
                        color: 'white',
                        width: 36,
                        height: 36,
                        '&:hover': { 
                          bgcolor: 'primary.dark',
                          transform: 'scale(1.05)'
                        },
                        transition: 'all 0.2s ease-in-out'
                      }}
                    >
                      <ContentCopy sx={{ fontSize: 16 }} />
                    </IconButton>
                  ) : null
                ),
              }}
            />
          </Box>

          {/* Status Alerts */}
          <Box sx={{ minHeight: 40 }}>
            {copied && (
              <Alert 
                severity="success"
                sx={{
                  borderRadius: 2,
                  bgcolor: 'success.50',
                  color: 'success.800',
                  border: '1px solid',
                  borderColor: 'success.200',
                  '& .MuiAlert-icon': { color: 'success.600' }
                }}
              >
                <Typography variant="body2" fontWeight={500}>
                  Link copied to clipboard!
                </Typography>
              </Alert>
            )}
            {disabled && (
              <Alert 
                severity="info"
                sx={{
                  borderRadius: 2,
                  bgcolor: 'info.50',
                  color: 'info.800',
                  border: '1px solid',
                  borderColor: 'info.200',
                  '& .MuiAlert-icon': { color: 'info.600' }
                }}
              >
                <Typography variant="body2" fontWeight={500}>
                  Link sharing is currently disabled
                </Typography>
              </Alert>
            )}
          </Box>

          {/* Action Buttons */}
          <Box 
            sx={{ 
              display: 'flex', 
              gap: 2,
              flexDirection: { xs: 'column', sm: 'row' },
              pt: 1
            }}
          >
            <Button
              variant="contained"
              onClick={handleGenerateLink}
              sx={{ 
                flex: 1,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                textTransform: 'none',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 4px 16px rgba(102, 126, 234, 0.4)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                  boxShadow: '0 6px 20px rgba(102, 126, 234, 0.5)',
                  transform: 'translateY(-1px)',
                },
                transition: 'all 0.2s ease-in-out'
              }}
            >
              {link ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Refresh sx={{ fontSize: 18 }} />
                  Update Role
                </Box>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Link sx={{ fontSize: 18 }} />
                  Generate Share Link
                </Box>
              )}
            </Button>
            
            {link && (
              <Button
                variant="outlined"
                color="error"
                onClick={handleDisableLink}
                sx={{ 
                  flex: 1,
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                  textTransform: 'none',
                  borderWidth: 2,
                  '&:hover': {
                    borderWidth: 2,
                    bgcolor: 'error.50',
                    transform: 'translateY(-1px)',
                  },
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Block sx={{ fontSize: 18 }} />
                  Disable Link
                </Box>
              </Button>
            )}
          </Box>
        </Box>
      )}
    </Box>
  </Modal>
);
}