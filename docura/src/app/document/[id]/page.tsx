"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Box, CircularProgress, Container, IconButton, Paper, Tooltip, Typography, TextField } from "@mui/material";
import Editor from "@/components/Editor";
import { MoreVert, Share } from "@mui/icons-material";

export default function DocumentPage() {
  const { id } = useParams(); // URL param
  const [doc, setDoc] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [titleTimeout, setTitleTimeout] = useState<NodeJS.Timeout | null>(null);
  const [contentTimeout, setContentTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchDocument = async () => {
      const { data, error } = await supabase
        .from("Document")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching document:", error.message);
      } else {
        setDoc(data);
        setTitle(data.title || '');
        setContent(data.content || '');
      }
      setLoading(false);
    };

    if (id) fetchDocument();
  }, [id]);

  const saveTitleToSupabase = useCallback(async (newTitle: string) => {
    if (!doc?.id) return;
    const { error } = await supabase
      .from("Document")
      .update({ title: newTitle })
      .eq("id", doc.id);
    if (error) {
      console.error("Error updating title:", error.message);
    } else {
      setDoc((prev: any) => ({ ...prev, title: newTitle }));
    }
  }, [doc?.id]);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = event.target.value;
    setTitle(newTitle);
    if (titleTimeout) clearTimeout(titleTimeout);
    const timeout = setTimeout(() => {
      saveTitleToSupabase(newTitle);
    }, 500);
    setTitleTimeout(timeout);
  };

  const saveContentToSupabase = useCallback(async (updatedContent: string) => {
    if (!doc?.id) return;
    const { error } = await supabase
      .from("Document")
      .update({ content: updatedContent })
      .eq("id", doc.id);
    if (error) {
      console.error("Error updating content:", error.message);
    } else {
      setDoc((prev: any) => ({ ...prev, content: updatedContent }));
    }
  }, [doc?.id]);

  // Handles content change and updates local state and debounces Supabase update
  function handleContentChange(updatedContent: string) {
    setContent(updatedContent);
    if (contentTimeout) clearTimeout(contentTimeout);
    const timeout = setTimeout(() => {
      saveContentToSupabase(updatedContent);
    }, 500);
    setContentTimeout(timeout);
  }

  if (loading) return <div style={{ display: "flex", justifyContent: "center", marginTop: 50 }}><CircularProgress /></div>;
  if (!doc) return <Typography sx={{ mt: 4, textAlign: "center" }}>Document not found</Typography>;

  return (
    <Box
  sx={{
    minHeight: '100vh',
    background: '#fafbfc',
    pt: '80px', // Account for fixed navbar
  }}
>
  <Container maxWidth="lg" sx={{ py: 4 }}>
    {/* Document Header */}
    <Paper
      elevation={0}
      sx={{
        p: 4,
        mb: 3,
        background: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: 2,
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box>
          <TextField
            variant="standard"
            value={title}
            onChange={handleTitleChange}
            sx={{
              fontWeight: 700,
              color: '#1a1a1a',
              fontSize: { xs: '1.75rem', sm: '2.25rem' },
              lineHeight: 1.2,
              mb: 1,
              '& .MuiInputBase-input': {
                fontWeight: 700,
                color: '#1a1a1a',
                fontSize: 'inherit',
                lineHeight: 'inherit',
                padding: 0,
              },
              '& .MuiInput-underline:before, & .MuiInput-underline:after': {
                borderBottom: 'none',
              },
            }}
            fullWidth
            InputProps={{ disableUnderline: true }}
          />
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="body2" sx={{ color: '#6b7280' }}>
              Last edited {new Date().toLocaleDateString()}
            </Typography>
            <Box
              sx={{
                width: 4,
                height: 4,
                borderRadius: '50%',
                background: '#d1d5db',
              }}
            />
            <Typography variant="body2" sx={{ color: '#6b7280' }}>
              Auto-saved
            </Typography>
          </Box>
        </Box>
        
        {/* Action Buttons */}
        <Box display="flex" gap={1}>
          <Tooltip title="Share Document">
            <IconButton
              sx={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: 1.5,
                '&:hover': {
                  background: '#f1f5f9',
                  borderColor: '#cbd5e1',
                }
              }}
            >
              <Share fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="More Options">
            <IconButton
              sx={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: 1.5,
                '&:hover': {
                  background: '#f1f5f9',
                  borderColor: '#cbd5e1',
                }
              }}
            >
              <MoreVert fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Paper>

    {/* Editor Container */}
    <Editor content={content} onChange={handleContentChange} />
    
    {/* Optional: Document Stats */}
    <Paper
      elevation={0}
      sx={{
        p: 2,
        mt: 3,
        background: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: 2,
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="body2" sx={{ color: '#6b7280' }}>
          Document created on {new Date().toLocaleDateString()}
        </Typography>
        <Box display="flex" gap={3}>
          <Typography variant="body2" sx={{ color: '#6b7280' }}>
            Reading time: ~2 min
          </Typography>
          <Typography variant="body2" sx={{ color: '#6b7280' }}>
            Version 1.0
          </Typography>
        </Box>
      </Box>
    </Paper>
  </Container>
</Box>
  );
}