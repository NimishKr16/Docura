'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import CharacterCount from '@tiptap/extension-character-count';
import { 
  Box, 
  Paper, 
  IconButton, 
  Divider, 
  Tooltip,
  ButtonGroup,
  alpha,
  Typography,
  createTheme,
  ThemeProvider
} from '@mui/material';
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatStrikethrough,
  FormatListBulleted,
  FormatListNumbered,
  FormatQuote,
  Code,
  Undo,
  Redo,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
  Title,
  Subject,
  Notes,
  Link,
  Image,
  FormatSize,
  Palette
} from '@mui/icons-material';

// Clean, minimal theme
const editorTheme = createTheme({
  palette: {
    primary: {
      main: '#1a1a1a',
      light: '#404040',
      dark: '#000000',
    },
    secondary: {
      main: '#6366f1',
      light: '#818cf8',
      dark: '#4f46e5',
    },
    text: {
      primary: '#1a1a1a',
      secondary: '#6b7280',
    },
    grey: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    }
  },
});

export default function Editor({ content, onChange }: { content: any, onChange: (json: any) => void }) {
  const editor = useEditor({
    extensions: [StarterKit, CharacterCount.configure({ limit: null })],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[600px] p-8',
      },
    },
  });

  if (!editor) {
    return null;
  }

  const ToolbarButton = ({ 
    onClick, 
    isActive = false, 
    disabled = false, 
    tooltip, 
    children 
  }: {
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    tooltip: string;
    children: React.ReactNode;
  }) => (
    <Tooltip title={tooltip} placement="top">
      <IconButton
        onClick={onClick}
        disabled={disabled}
        size="small"
        sx={{
          borderRadius: 1,
          width: 36,
          height: 36,
          transition: 'all 0.15s ease',
          background: isActive ? '#1a1a1a' : 'transparent',
          color: isActive ? 'white' : '#6b7280',
          border: '1px solid transparent',
          '&:hover': {
            background: isActive ? '#2d2d2d' : '#f8fafc',
            color: isActive ? 'white' : '#1a1a1a',
            borderColor: isActive ? '#404040' : '#e2e8f0',
          },
          '&:disabled': {
            opacity: 0.4,
            color: '#d1d5db',
          }
        }}
      >
        {children}
      </IconButton>
    </Tooltip>
  );

  return (
    <ThemeProvider theme={editorTheme}>
      <Box sx={{ maxWidth: '900px', mx: 'auto', p: 2 }}>
        <Paper
          elevation={0}
          sx={{
            borderRadius: 2,
            overflow: 'hidden',
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)',
          }}
        >
          {/* Toolbar */}
          <Box
            sx={{
              p: 1.5,
              background: '#fafbfc',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              flexWrap: 'wrap',
              gap: 0.5,
              alignItems: 'center',
            }}
          >
            {/* Text Formatting Group */}
            <Box display="flex" gap={0.5} mr={1}>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleBold().run()}
                isActive={editor.isActive('bold')}
                tooltip="Bold (Ctrl+B)"
              >
                <FormatBold fontSize="small" />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleItalic().run()}
                isActive={editor.isActive('italic')}
                tooltip="Italic (Ctrl+I)"
              >
                <FormatItalic fontSize="small" />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleStrike().run()}
                isActive={editor.isActive('strike')}
                tooltip="Strikethrough"
              >
                <FormatStrikethrough fontSize="small" />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleCode().run()}
                isActive={editor.isActive('code')}
                tooltip="Inline Code"
              >
                <Code fontSize="small" />
              </ToolbarButton>
            </Box>

            <Divider orientation="vertical" sx={{ height: 24, mx: 0.5 }} />

            {/* Headings Group */}
            <Box display="flex" gap={0.5} mr={1}>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                isActive={editor.isActive('heading', { level: 1 })}
                tooltip="Heading 1"
              >
                <Typography sx={{ fontSize: '14px', fontWeight: 700 }}>H1</Typography>
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                isActive={editor.isActive('heading', { level: 2 })}
                tooltip="Heading 2"
              >
                <Typography sx={{ fontSize: '13px', fontWeight: 600 }}>H2</Typography>
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                isActive={editor.isActive('heading', { level: 3 })}
                tooltip="Heading 3"
              >
                <Typography sx={{ fontSize: '12px', fontWeight: 500 }}>H3</Typography>
              </ToolbarButton>
            </Box>

            <Divider orientation="vertical" sx={{ height: 24, mx: 0.5 }} />

            {/* Lists Group */}
            <Box display="flex" gap={0.5} mr={1}>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                isActive={editor.isActive('bulletList')}
                tooltip="Bullet List"
              >
                <FormatListBulleted fontSize="small" />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                isActive={editor.isActive('orderedList')}
                tooltip="Numbered List"
              >
                <FormatListNumbered fontSize="small" />
              </ToolbarButton>
            </Box>

            <Divider orientation="vertical" sx={{ height: 24, mx: 0.5 }} />

            {/* Block Elements */}
            <Box display="flex" gap={0.5} mr={1}>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                isActive={editor.isActive('blockquote')}
                tooltip="Quote"
              >
                <FormatQuote fontSize="small" />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                isActive={editor.isActive('codeBlock')}
                tooltip="Code Block"
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography sx={{ fontSize: '11px', fontFamily: 'monospace', fontWeight: 600 }}>
                    {'</>'}
                  </Typography>
                </Box>
              </ToolbarButton>
            </Box>

            <Box sx={{ flexGrow: 1 }} />

            {/* History Group */}
            <Box display="flex" gap={0.5}>
              <ToolbarButton
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().chain().focus().undo().run()}
                tooltip="Undo (Ctrl+Z)"
              >
                <Undo fontSize="small" />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().chain().focus().redo().run()}
                tooltip="Redo (Ctrl+Y)"
              >
                <Redo fontSize="small" />
              </ToolbarButton>
            </Box>
          </Box>

          {/* Editor Content */}
          <Box
            sx={{
              background: '#ffffff',
              minHeight: '600px',
              position: 'relative',
              '& .ProseMirror': {
                outline: 'none',
                padding: '32px',
                lineHeight: 1.8,
                fontSize: '16px',
                fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                color: '#1a1a1a',
                maxWidth: 'none',
                '& p': {
                  margin: '0 0 16px 0',
                  '&.is-editor-empty:first-of-type::before': {
                    content: '"Start writing..."',
                    float: 'left',
                    color: '#9ca3af',
                    pointerEvents: 'none',
                    height: 0,
                    fontStyle: 'italic',
                  }
                },
                '& h1': {
                  fontSize: '32px',
                  fontWeight: 700,
                  lineHeight: 1.2,
                  margin: '32px 0 16px 0',
                  color: '#1a1a1a',
                  '&::first-of-type': {
                    marginTop: 0,
                  }
                },
                '& h2': {
                  fontSize: '24px',
                  fontWeight: 600,
                  lineHeight: 1.3,
                  margin: '24px 0 12px 0',
                  color: '#1a1a1a',
                },
                '& h3': {
                  fontSize: '20px',
                  fontWeight: 600,
                  lineHeight: 1.4,
                  margin: '20px 0 8px 0',
                  color: '#1a1a1a',
                },
                '& blockquote': {
                  borderLeft: '3px solid #6366f1',
                  paddingLeft: '16px',
                  margin: '24px 0',
                  fontStyle: 'italic',
                  color: '#4b5563',
                  background: '#f8fafc',
                  padding: '16px 16px 16px 24px',
                  borderRadius: '0 6px 6px 0',
                },
                '& pre': {
                  background: '#1e293b',
                  color: '#e2e8f0',
                  padding: '16px',
                  borderRadius: '8px',
                  overflow: 'auto',
                  fontSize: '14px',
                  fontFamily: '"Fira Code", "SF Mono", Monaco, Inconsolata, "Roboto Mono", Consolas, "Droid Sans Mono", monospace',
                  margin: '16px 0',
                  border: '1px solid #334155',
                },
                '& code': {
                  background: '#f1f5f9',
                  color: '#1e293b',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontFamily: '"Fira Code", "SF Mono", Monaco, monospace',
                  border: '1px solid #e2e8f0',
                },
                '& ul, & ol': {
                  paddingLeft: '24px',
                  margin: '16px 0',
                },
                '& li': {
                  margin: '8px 0',
                  lineHeight: 1.6,
                },
                '& ul li': {
                  listStyleType: 'disc',
                },
                '& ol li': {
                  listStyleType: 'decimal',
                },
                '& strong': {
                  fontWeight: 600,
                  color: '#1a1a1a',
                },
                '& em': {
                  fontStyle: 'italic',
                  color: '#4b5563',
                },
                '& hr': {
                  border: 'none',
                  height: '1px',
                  background: '#e5e7eb',
                  margin: '32px 0',
                }
              },
            }}
          >
            <EditorContent editor={editor} />
          </Box>

          {/* Status Bar */}
          <Box
            sx={{
              px: 4,
              py: 2,
              background: '#fafbfc',
              borderTop: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Box display="flex" gap={4}>
              <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '13px' }}>
                {editor.storage.characterCount?.characters() ?? 0} characters
              </Typography>
              <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '13px' }}>
                {editor.storage.characterCount?.words() ?? 0} words
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#9ca3af', fontSize: '12px' }}>
              Saved automatically
            </Typography>
          </Box>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}