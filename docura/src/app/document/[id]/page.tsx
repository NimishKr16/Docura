"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Box, CircularProgress, Container, IconButton, Paper, Tooltip, Typography, TextField, Menu, MenuItem, Button } from "@mui/material";
import Editor from "@/components/Editor";
import { MoreVert, Share, ArrowDropDown, Download } from "@mui/icons-material";

export default function DocumentPage() {
  const { id } = useParams(); // URL param
  const [doc, setDoc] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [titleTimeout, setTitleTimeout] = useState<NodeJS.Timeout | null>(null);
  const [contentTimeout, setContentTimeout] = useState<NodeJS.Timeout | null>(null);
  const [exportAnchorEl, setExportAnchorEl] = useState<HTMLElement | null>(null);

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

  function extractTextFromTipTap(node: any): string {
    if (!node) return '';
    if (node.text) return node.text;
    if (node.content && Array.isArray(node.content)) {
      return node.content.map(extractTextFromTipTap).join(' ');
    }
    return '';
  }

  const plainText = extractTextFromTipTap(content);
  const wordCount = plainText.trim() === '' ? 0 : plainText.trim().split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);

  const handleExportClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setExportAnchorEl(event.currentTarget);
  };

  const handleExportClose = () => {
    setExportAnchorEl(null);
  };

  const handleExportPDF = async () => {
    handleExportClose();
    if (!doc?.id) return;
    try {
      const response = await fetch('/api/export', {
        method: 'POST',
        body: JSON.stringify({ documentId: doc.id }),
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        console.error('Failed to export PDF');
        return;
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${doc.title}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting PDF:', error);
    }
  };

  const handleExportDOCX = async () => {
    handleExportClose();
    if (!doc?.id) return;
    try {
      const response = await fetch('/api/export-docx', {
        method: 'POST',
        body: JSON.stringify({ documentId: doc.id }),
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        console.error('Failed to export DOCX');
        return;
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${doc.title}.docx`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting DOCX:', error);
    }
  };

  if (loading) return <div style={{ display: "flex", justifyContent: "center", marginTop: 50 }}><CircularProgress /></div>;
  if (!doc) return <Typography sx={{ mt: 4, textAlign: "center" }}>Document not found</Typography>;

  return (
    <Box
  // sx={{
  //   minHeight: '100vh',
  //   background: '#fafbfc',
  //   pt: '80px', // Account for fixed navbar
  // }}
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
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2 }}>
        <Box sx={{ width: { xs: '100%', sm: 'auto' } }}>
          <TextField
            variant="standard"
            value={title}
            onChange={handleTitleChange}
            sx={{
              fontWeight: 700,
              color: '#1a1a1a',
              fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.25rem' },
              lineHeight: 1.2,
              mb: 1,
              '& .MuiInputBase-input': {
                fontWeight: 700,
                color: '#1a1a1a',
                fontSize: 'inherit',
                lineHeight: 'inherit',
                padding: 0,
                overflowWrap: 'break-word',
                wordBreak: 'break-word',
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
              Last edited {new Date(doc.updatedAt).toLocaleString()}
            </Typography>
          </Box>
        </Box>
        
        {/* Action Buttons */}
        <Box display="flex" gap={1} alignItems="center" sx={{ flexWrap: { xs: 'wrap', sm: 'nowrap' }, justifyContent: { xs: 'flex-start', sm: 'flex-start' }, mt: { xs: 2, sm: 0 }, width: { xs: '100%', sm: 'auto' } }}>
          <Button
            variant="contained"
            startIcon={<Download />}
            endIcon={<ArrowDropDown />}
            onClick={handleExportClick}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              backgroundColor: '#f8fafc',
              color: '#1a1a1a',
              '&:hover': {
                backgroundColor: '#f1f5f9',
                boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
              },
            }}
          >
            Export
          </Button>
          <Menu
            anchorEl={exportAnchorEl}
            open={Boolean(exportAnchorEl)}
            onClose={handleExportClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={handleExportPDF}>Save as PDF</MenuItem>
            <MenuItem onClick={handleExportDOCX}>Save as Word</MenuItem>
          </Menu>
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
          Document created on {new Date(doc.createdAt).toLocaleString()}
        </Typography>
        <Box display="flex" gap={3}>
          <Typography variant="body2" sx={{ color: '#6b7280' }}>
            Reading time: ~{readingTime} min
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