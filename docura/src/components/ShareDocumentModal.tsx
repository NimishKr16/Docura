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
} from "@mui/material";
import { ContentCopy, Close } from "@mui/icons-material";
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

  // useEffect(() => {
  //   if (open) {
  //     fetchShareDetails();
  //   }
  // }, [open]);

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
      if (data?.token) {
        setLink(`${window.location.origin}/document?token=${data.token}`);
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
    try {
      // const { data: { user } } = await supabase.auth.getUser()
      // console.log("USER:", user);
      const { data: { session } } = await supabase.auth.getSession();
      // console.log("ACCESS TOKEN:",session?.access_token);
      
      const res = await fetch(`/api/share/link`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ documentId, role, enable: true }),
      });
      const data = await res.json();
      console.log("SHARE LINK RESULT:", data);

      if (data?.token) {
        setLink(`${window.location.origin}/document?token=${data.token}`);
        toast.success("Share link generated!");
        onStatusChange(true);
      }
    } catch {
      toast.error("Error generating link.");
      onStatusChange(false);
    }
    setLoading(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(link);
    toast.success("Link copied!");
  };

  const handleDisableLink = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      await fetch(`/api/share/link`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ documentId }),
      });
      setLink("");
      toast.info("Link sharing disabled.");
      onStatusChange(true);
    } catch {
      toast.error("Failed to disable link.");
      onStatusChange(false);
    }
    setLoading(false);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          background: "white",
          borderRadius: 3,
          width: "500px",
          p: 4,
          mx: "auto",
          mt: "10%",
          boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
          position: "relative",
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", top: 12, right: 12 }}
        >
          <Close />
        </IconButton>

        <Typography variant="h5" fontWeight={700} mb={2}>
          Share Document
        </Typography>

        {loading ? (
          <Box textAlign="center" py={4}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Role</InputLabel>
              <Select
                value={role}
                label="Role"
                onChange={(e) => setRole(e.target.value)}
              >
                <MenuItem value="viewer">Viewer</MenuItem>
                <MenuItem value="commenter">Commenter</MenuItem>
                <MenuItem value="editor">Editor</MenuItem>
              </Select>
            </FormControl>

            {link ? (
              <>
                <TextField
                  fullWidth
                  value={link}
                  InputProps={{
                    readOnly: true,
                    endAdornment: (
                      <IconButton onClick={handleCopyLink}>
                        <ContentCopy />
                      </IconButton>
                    ),
                  }}
                  sx={{ mb: 3 }}
                />
                <Box display="flex" gap={2}>
                  <Button
                    variant="contained"
                    onClick={handleGenerateLink}
                    sx={{ flex: 1 }}
                  >
                    Update Role
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={handleDisableLink}
                    sx={{ flex: 1 }}
                  >
                    Disable Link
                  </Button>
                </Box>
              </>
            ) : (
              <Button
                variant="contained"
                fullWidth
                onClick={handleGenerateLink}
              >
                Generate Share Link
              </Button>
            )}
          </>
        )}
      </Box>
    </Modal>
  );
}