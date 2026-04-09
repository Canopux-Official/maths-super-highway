// import { useEditor, EditorContent } from '@tiptap/react';
// import StarterKit from '@tiptap/starter-kit';
// import { Box, ToggleButton, ToggleButtonGroup, Paper } from '@mui/material';
// import { FormatBold, FormatItalic, List as ListIcon } from '@mui/icons-material';

// interface EditorProps {
//   value: string;
//   onChange: (html: string) => void;
// }

// const Editor = ({ value, onChange }: EditorProps) => {
//   const editor = useEditor({
//     extensions: [StarterKit],
//     content: value,
//     onUpdate: ({ editor }) => {
//       onChange(editor.getHTML());
//     },
//   });

//   if (!editor) return null;

//   return (
//     <Paper variant="outlined" sx={{ overflow: 'hidden', borderRadius: 2 }}>
//       <Box sx={{ p: 1, borderBottom: '1px solid #ddd', bgcolor: '#f9f9f9' }}>
//         <ToggleButtonGroup size="small">
//           <ToggleButton value="bold" onClick={() => editor.chain().focus().toggleBold().run()}>
//             <FormatBold />
//           </ToggleButton>
//           <ToggleButton value="italic" onClick={() => editor.chain().focus().toggleItalic().run()}>
//             <FormatItalic />
//           </ToggleButton>
//           <ToggleButton value="bulletList" onClick={() => editor.chain().focus().toggleBulletList().run()}>
//             <ListIcon />
//           </ToggleButton>
//         </ToggleButtonGroup>
//       </Box>
//       <Box sx={{ p: 2, minHeight: '200px', '& .tiptap': { outline: 'none' } }}>
//         <EditorContent editor={editor} />
//       </Box>
//     </Paper>
//   );
// };

// export default Editor;


import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import { Box, Divider, Tooltip, IconButton } from '@mui/material';
import {
  FormatBold, FormatItalic, FormatUnderlined, StrikethroughS,
  FormatListBulleted, FormatListNumbered, FormatQuote, Code,
  FormatAlignLeft, FormatAlignCenter, FormatAlignRight,
  Highlight as HighlightIcon, Undo, Redo, HorizontalRule
} from '@mui/icons-material';

interface EditorProps {
  value: string;
  onChange: (html: string) => void;
}

const ToolbarButton = ({
  label, active, onClick, children
}: { label: string; active?: boolean; onClick: () => void; children: React.ReactNode }) => (
  <Tooltip title={label} placement="top" arrow>
    <IconButton
      size="small"
      onClick={onClick}
      sx={{
        borderRadius: '6px',
        width: 30, height: 30,
        color: active ? 'primary.dark' : 'text.secondary',
        bgcolor: active ? 'rgba(21,101,192,0.1)' : 'transparent',
        '&:hover': { bgcolor: active ? 'rgba(21,101,192,0.15)' : 'action.hover' },
      }}
    >
      {children}
    </IconButton>
  </Tooltip>
);

const ToolDivider = () => (
  <Divider orientation="vertical" flexItem sx={{ mx: 0.5, borderColor: 'divider' }} />
);

const Editor = ({ value, onChange }: EditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Highlight.configure({ multicolor: false }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  if (!editor) return null;

  return (
    <Box
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: '10px',
        overflow: 'hidden',
        bgcolor: 'background.paper',
      }}
    >
      {/* Toolbar */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 0.25,
          px: 1.5,
          py: 1,
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: '#fafbfc',
        }}
      >
        {/* History */}
        <ToolbarButton label="Undo (Ctrl+Z)" onClick={() => editor.chain().focus().undo().run()}>
          <Undo sx={{ fontSize: 16 }} />
        </ToolbarButton>
        <ToolbarButton label="Redo (Ctrl+Y)" onClick={() => editor.chain().focus().redo().run()}>
          <Redo sx={{ fontSize: 16 }} />
        </ToolbarButton>

        <ToolDivider />

        {/* Headings */}
        {(['Normal', 'H1', 'H2', 'H3'] as const).map((level) => (
          <Tooltip key={level} title={level === 'Normal' ? 'Normal text' : `Heading ${level.slice(1)}`} placement="top" arrow>
            <Box
              component="button"
              onClick={() => {
                if (level === 'Normal') editor.chain().focus().setParagraph().run();
                else editor.chain().focus().toggleHeading({ level: Number(level.slice(1)) as 1|2|3 }).run();
              }}
              sx={{
                fontSize: '12px',
                fontWeight: 600,
                px: 1,
                height: 30,
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                bgcolor: editor.isActive('heading', { level: level !== 'Normal' ? Number(level.slice(1)) : undefined }) && level !== 'Normal'
                  ? 'rgba(21,101,192,0.1)' : 'transparent',
                color: 'text.secondary',
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              {level}
            </Box>
          </Tooltip>
        ))}

        <ToolDivider />

        {/* Text formatting */}
        <ToolbarButton label="Bold (Ctrl+B)" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>
          <FormatBold sx={{ fontSize: 16 }} />
        </ToolbarButton>
        <ToolbarButton label="Italic (Ctrl+I)" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <FormatItalic sx={{ fontSize: 16 }} />
        </ToolbarButton>
        <ToolbarButton label="Underline (Ctrl+U)" active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <FormatUnderlined sx={{ fontSize: 16 }} />
        </ToolbarButton>
        <ToolbarButton label="Strikethrough" active={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()}>
          <StrikethroughS sx={{ fontSize: 16 }} />
        </ToolbarButton>
        <ToolbarButton label="Highlight" active={editor.isActive('highlight')} onClick={() => editor.chain().focus().toggleHighlight().run()}>
          <HighlightIcon sx={{ fontSize: 16 }} />
        </ToolbarButton>
        <ToolbarButton label="Inline code" active={editor.isActive('code')} onClick={() => editor.chain().focus().toggleCode().run()}>
          <Code sx={{ fontSize: 16 }} />
        </ToolbarButton>

        <ToolDivider />

        {/* Alignment */}
        <ToolbarButton label="Align left" active={editor.isActive({ textAlign: 'left' })} onClick={() => editor.chain().focus().setTextAlign('left').run()}>
          <FormatAlignLeft sx={{ fontSize: 16 }} />
        </ToolbarButton>
        <ToolbarButton label="Align center" active={editor.isActive({ textAlign: 'center' })} onClick={() => editor.chain().focus().setTextAlign('center').run()}>
          <FormatAlignCenter sx={{ fontSize: 16 }} />
        </ToolbarButton>
        <ToolbarButton label="Align right" active={editor.isActive({ textAlign: 'right' })} onClick={() => editor.chain().focus().setTextAlign('right').run()}>
          <FormatAlignRight sx={{ fontSize: 16 }} />
        </ToolbarButton>

        <ToolDivider />

        {/* Lists */}
        <ToolbarButton label="Bullet list" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <FormatListBulleted sx={{ fontSize: 16 }} />
        </ToolbarButton>
        <ToolbarButton label="Numbered list" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <FormatListNumbered sx={{ fontSize: 16 }} />
        </ToolbarButton>
        <ToolbarButton label="Blockquote" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          <FormatQuote sx={{ fontSize: 16 }} />
        </ToolbarButton>
        <ToolbarButton label="Horizontal rule" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          <HorizontalRule sx={{ fontSize: 16 }} />
        </ToolbarButton>
      </Box>

      {/* Editor body */}
      <Box
        sx={{
          px: 3, py: 2.5,
          minHeight: 240,
          '& .tiptap': {
            outline: 'none',
            fontSize: '0.9375rem',
            lineHeight: 1.75,
            color: 'text.primary',
            '& h1': { fontSize: '1.5rem', fontWeight: 700, mt: 2, mb: 1 },
            '& h2': { fontSize: '1.25rem', fontWeight: 700, mt: 2, mb: 1 },
            '& h3': { fontSize: '1.1rem', fontWeight: 600, mt: 1.5, mb: 0.5 },
            '& p': { mt: 0, mb: 1 },
            '& ul, & ol': { pl: 3, mb: 1 },
            '& blockquote': { borderLeft: '3px solid', borderColor: 'primary.light', pl: 2, color: 'text.secondary', my: 1 },
            '& code': { bgcolor: 'grey.100', px: 0.75, py: 0.25, borderRadius: 1, fontSize: '0.85rem', fontFamily: 'monospace' },
            '& mark': { bgcolor: '#fff9c4', borderRadius: '2px', px: 0.5 },
            '& hr': { border: 'none', borderTop: '1px solid', borderColor: 'divider', my: 2 },
          },
        }}
      >
        <EditorContent editor={editor} />
      </Box>
    </Box>
  );
};

export default Editor;