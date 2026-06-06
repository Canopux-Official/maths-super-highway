// import { useEditor, EditorContent } from '@tiptap/react';
// import StarterKit from '@tiptap/starter-kit';
// import Underline from '@tiptap/extension-underline';
// import TextAlign from '@tiptap/extension-text-align';
// import Highlight from '@tiptap/extension-highlight';
// import Color from '@tiptap/extension-color';
// import FontFamily from '@tiptap/extension-font-family';
// import Link from '@tiptap/extension-link';
// import Image from '@tiptap/extension-image';           // ← NEW
// import { Extension } from '@tiptap/core';
// import {
//   Box, Divider, Tooltip, IconButton,
//   Popover, TextField, Button, MenuItem, Select,
// } from '@mui/material';
// import {
//   FormatBold, FormatItalic, FormatUnderlined, StrikethroughS,
//   FormatListBulleted, FormatListNumbered, FormatQuote, Code,
//   FormatAlignLeft, FormatAlignCenter, FormatAlignRight,
//   Highlight as HighlightIcon, Undo, Redo, HorizontalRule,
//   Link as LinkIcon, LinkOff, FormatColorText, CodeOff,
//   Image as ImageIcon,                                  // ← NEW
// } from '@mui/icons-material';
// import React, { useState, useCallback, useRef } from 'react';
// import { TextStyle } from '@tiptap/extension-text-style';
// import { ChartExtension, InsertChartButton } from './ChartExtension'; // ← NEW

// /* ── FontSize extension (unchanged) ── */
// const FontSize = Extension.create({
//   name: 'fontSize',
//   addOptions() { return { types: ['textStyle'] }; },
//   addGlobalAttributes() {
//     return [{
//       types: this.options.types,
//       attributes: {
//         fontSize: {
//           default: null,
//           parseHTML: (el: HTMLElement) => el.style.fontSize?.replace('px', '') || null,
//           renderHTML: (attrs: Record<string, any>) =>
//             attrs.fontSize ? { style: `font-size: ${attrs.fontSize}px` } : {},
//         },
//       },
//     }];
//   },
//   addCommands() {
//     return {
//       setFontSize: (size: string) => ({ chain }: any) =>
//         chain().extendMarkRange('textStyle').setMark('textStyle', { fontSize: size }).run(),
//       unsetFontSize: () => ({ chain }: any) =>
//         chain().extendMarkRange('textStyle').setMark('textStyle', { fontSize: null }).removeEmptyTextStyle().run(),
//     } as any;
//   },
// });

// interface EditorProps {
//   value: string;
//   onChange: (html: string) => void;
// }

// /* ─── Toolbar button (unchanged) ─── */
// const ToolbarButton = ({
//   label, active, onClick, children, disabled,
// }: {
//   label: string; active?: boolean;
//   onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
//   children: React.ReactNode; disabled?: boolean;
// }) => (
//   <Tooltip title={label} placement="top" arrow>
//     <span>
//       <IconButton size="small" onClick={onClick} disabled={disabled} sx={{
//         borderRadius: '6px', width: 28, height: 28,
//         color: active ? '#1D4ED8' : '#64748B',
//         bgcolor: active ? 'rgba(29,78,216,0.08)' : 'transparent',
//         border: active ? '1px solid rgba(29,78,216,0.2)' : '1px solid transparent',
//         '&:hover': { bgcolor: active ? 'rgba(29,78,216,0.12)' : 'rgba(100,116,139,0.08)', color: active ? '#1D4ED8' : '#334155' },
//         transition: 'all 0.12s ease',
//       }}>
//         {children}
//       </IconButton>
//     </span>
//   </Tooltip>
// );

// const ToolDivider = () => (
//   <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: 0.5, borderColor: '#E2E8F0' }} />
// );

// /* ─── Colors (unchanged) ─── */
// const TEXT_COLORS = [
//   { label: 'Default', value: '' }, { label: 'Black', value: '#0F172A' },
//   { label: 'Dark Gray', value: '#475569' }, { label: 'Gray', value: '#94A3B8' },
//   { label: 'Red', value: '#DC2626' }, { label: 'Orange', value: '#EA580C' },
//   { label: 'Amber', value: '#D97706' }, { label: 'Green', value: '#16A34A' },
//   { label: 'Teal', value: '#0D9488' }, { label: 'Blue', value: '#1D4ED8' },
//   { label: 'Indigo', value: '#4F46E5' }, { label: 'Purple', value: '#7C3AED' },
//   { label: 'Pink', value: '#DB2777' }, { label: 'Rose', value: '#E11D48' },
//   { label: 'Cyan', value: '#0891B2' }, { label: 'Lime', value: '#65A30D' },
// ];

// const HIGHLIGHT_COLORS = [
//   { label: 'None', value: '' }, { label: 'Yellow', value: '#FEF08A' },
//   { label: 'Green', value: '#BBF7D0' }, { label: 'Blue', value: '#BFDBFE' },
//   { label: 'Pink', value: '#FBCFE8' }, { label: 'Orange', value: '#FED7AA' },
//   { label: 'Purple', value: '#E9D5FF' }, { label: 'Cyan', value: '#A5F3FC' },
//   { label: 'Red', value: '#FECACA' },
// ];

// const FONT_FAMILIES = [
//   { label: 'Default', value: '' }, { label: 'Serif', value: 'Georgia, serif' },
//   { label: 'Mono', value: "'Courier New', monospace" }, { label: 'DM Sans', value: "'DM Sans', sans-serif" },
//   { label: 'Playfair', value: "'Playfair Display', serif" }, { label: 'Sora', value: "'Sora', sans-serif" },
// ];

// const FONT_SIZES = ['12', '14', '16', '18', '20', '24', '28', '32', '36', '48'];

// /* ─── Color Swatch Popover (unchanged) ─── */
// const ColorPicker = ({
//   anchorEl, onClose, colors, onSelect, title,
// }: { anchorEl: HTMLElement | null; onClose: () => void; colors: { label: string; value: string }[]; onSelect: (val: string) => void; title: string }) => (
//   <Popover open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={onClose}
//     anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
//     transformOrigin={{ vertical: 'top', horizontal: 'left' }}
//     slotProps={{ paper: { sx: { mt: 0.5, p: 1.5, borderRadius: '10px', border: '1px solid #E2E8F0', boxShadow: '0 8px 24px rgba(15,23,42,0.12)', minWidth: 180 } } }}>
//     <Box sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#94A3B8', mb: 1, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{title}</Box>
//     <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
//       {colors.map(c => (
//         <Tooltip key={c.value || 'none'} title={c.label} placement="top" arrow>
//           <Box onClick={() => { onSelect(c.value); onClose(); }}
//             sx={{
//               width: 22, height: 22, borderRadius: '5px',
//               bgcolor: c.value || '#F1F5F9',
//               border: c.value ? '1.5px solid rgba(0,0,0,0.1)' : '1.5px dashed #CBD5E1',
//               cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
//               '&:hover': { transform: 'scale(1.2)', boxShadow: '0 2px 6px rgba(0,0,0,0.15)' },
//               transition: 'all 0.12s ease',
//             }}>
//             {!c.value && <Box sx={{ width: '70%', height: '1.5px', bgcolor: '#DC2626', transform: 'rotate(-45deg)', borderRadius: 1 }} />}
//           </Box>
//         </Tooltip>
//       ))}
//     </Box>
//   </Popover>
// );

// /* ─── Link Popover (unchanged) ─── */
// const LinkDialog = ({
//   anchorEl, onClose, onSet, onUnset, currentUrl,
// }: { anchorEl: HTMLElement | null; onClose: () => void; onSet: (url: string) => void; onUnset: () => void; currentUrl: string }) => {
//   const [url, setUrl] = useState(currentUrl);
//   return (
//     <Popover open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={onClose}
//       anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
//       transformOrigin={{ vertical: 'top', horizontal: 'left' }}
//       slotProps={{ paper: { sx: { mt: 0.5, p: 2, borderRadius: '10px', border: '1px solid #E2E8F0', boxShadow: '0 8px 24px rgba(15,23,42,0.12)', minWidth: 280 } } }}>
//       <Box sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#94A3B8', mb: 1.25, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Insert Link</Box>
//       <TextField fullWidth size="small" placeholder="https://example.com" value={url}
//         onChange={e => setUrl(e.target.value)}
//         onKeyDown={e => { if (e.key === 'Enter') { onSet(url); onClose(); } }}
//         autoFocus sx={{ mb: 1.25, '& .MuiOutlinedInput-root': { borderRadius: '8px', fontSize: '0.85rem' } }} />
//       <Box sx={{ display: 'flex', gap: 1 }}>
//         <Button size="small" variant="contained" disableElevation onClick={() => { onSet(url); onClose(); }}
//           sx={{ borderRadius: '7px', textTransform: 'none', fontSize: '0.8rem', bgcolor: '#1D4ED8', flex: 1 }}>Apply</Button>
//         {currentUrl && (
//           <Button size="small" variant="outlined" color="error" onClick={() => { onUnset(); onClose(); }}
//             sx={{ borderRadius: '7px', textTransform: 'none', fontSize: '0.8rem' }}>Remove</Button>
//         )}
//       </Box>
//     </Popover>
//   );
// };

// // ─── NEW: Image URL dialog ──────────────────────────────────────────────────
// const ImageDialog = ({
//   anchorEl, onClose, onInsert,
// }: { anchorEl: HTMLElement | null; onClose: () => void; onInsert: (src: string, alt: string) => void }) => {
//   const [src, setSrc] = useState('');
//   const [alt, setAlt] = useState('');
//   return (
//     <Popover open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={onClose}
//       anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
//       transformOrigin={{ vertical: 'top', horizontal: 'left' }}
//       slotProps={{ paper: { sx: { mt: 0.5, p: 2, borderRadius: '10px', border: '1px solid #E2E8F0', boxShadow: '0 8px 24px rgba(15,23,42,0.12)', minWidth: 320 } } }}>
//       <Box sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#94A3B8', mb: 1.25, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Insert Image</Box>
//       <TextField fullWidth size="small" placeholder="https://example.com/image.jpg" value={src}
//         onChange={e => setSrc(e.target.value)} label="Image URL" autoFocus
//         sx={{ mb: 1, '& .MuiOutlinedInput-root': { borderRadius: '8px', fontSize: '0.85rem' } }} />
//       <TextField fullWidth size="small" placeholder="Description" value={alt}
//         onChange={e => setAlt(e.target.value)} label="Alt text (optional)"
//         onKeyDown={e => { if (e.key === 'Enter' && src) { onInsert(src, alt); onClose(); } }}
//         sx={{ mb: 1.25, '& .MuiOutlinedInput-root': { borderRadius: '8px', fontSize: '0.85rem' } }} />
//       <Button fullWidth size="small" variant="contained" disableElevation
//         disabled={!src}
//         onClick={() => { onInsert(src, alt); onClose(); setSrc(''); setAlt(''); }}
//         sx={{ borderRadius: '7px', textTransform: 'none', fontSize: '0.8rem', bgcolor: '#1D4ED8' }}>
//         Insert Image
//       </Button>
//     </Popover>
//   );
// };

// /* ══════════════════════════════════════
//    Main Editor Component
// ══════════════════════════════════════ */
// const Editor = ({ value, onChange }: EditorProps) => {
//   const [textColorAnchor, setTextColorAnchor]   = useState<HTMLElement | null>(null);
//   const [highlightAnchor, setHighlightAnchor]   = useState<HTMLElement | null>(null);
//   const [linkAnchor, setLinkAnchor]             = useState<HTMLElement | null>(null);
//   const [imageAnchor, setImageAnchor]           = useState<HTMLElement | null>(null); // ← NEW
//   const imageFileRef = useRef<HTMLInputElement>(null);                                // ← NEW (upload)

//   const textColorBtnRef  = useRef<HTMLButtonElement>(null);
//   const highlightBtnRef  = useRef<HTMLButtonElement>(null);
//   const linkBtnRef       = useRef<HTMLSpanElement>(null);
//   const imageBtnRef      = useRef<HTMLSpanElement>(null); // ← NEW

//   const editor = useEditor({
//     extensions: [
//       StarterKit.configure({}),
//       Underline,
//       TextStyle,
//       Color,
//       FontFamily,
//       FontSize,
//       Highlight.configure({ multicolor: true }),
//       TextAlign.configure({ types: ['heading', 'paragraph'] }),
//       Link.configure({ openOnClick: false, HTMLAttributes: { class: 'tiptap-link' } }),
//       // ── NEW ──
//       Image.configure({ inline: false, allowBase64: true }),
//       ChartExtension,
//     ],
//     content: value,
//     onUpdate: ({ editor }) => onChange(editor.getHTML()),
//   });

//   const setLink = useCallback((url: string) => {
//     if (!editor) return;
//     if (!url) { editor.chain().focus().unsetLink().run(); return; }
//     const href = url.startsWith('http') ? url : `https://${url}`;
//     editor.chain().focus().extendMarkRange('link').setLink({ href, target: '_blank' }).run();
//   }, [editor]);

//   const unsetLink = useCallback(() => editor?.chain().focus().unsetLink().run(), [editor]);

//   // ── NEW: insert image from URL ──
//   const insertImageUrl = useCallback((src: string, alt: string) => {
//     editor?.chain().focus().setImage({ src, alt }).run();
//   }, [editor]);

//   // ── NEW: insert image from local file (base64) ──
//   const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file || !editor) return;
//     const reader = new FileReader();
//     reader.onload = () => {
//       editor.chain().focus().setImage({ src: reader.result as string, alt: file.name }).run();
//     };
//     reader.readAsDataURL(file);
//     e.target.value = '';
//   }, [editor]);

//   if (!editor) return null;

//   const currentUrl           = editor.getAttributes('link').href || '';
//   const activeTextColor      = editor.getAttributes('textStyle').color || '#0F172A';
//   const activeHighlightColor = editor.getAttributes('highlight').color || '#FEF08A';

//   return (
//     <Box sx={{
//       border: '1px solid #E2E8F0', borderRadius: '12px', overflow: 'hidden',
//       bgcolor: '#fff', boxShadow: '0 1px 3px rgba(15,23,42,0.06)',
//       '&:focus-within': { borderColor: '#93C5FD', boxShadow: '0 0 0 3px rgba(29,78,216,0.08)' },
//       transition: 'border-color 0.15s, box-shadow 0.15s',
//     }}>

//       {/* ── Toolbar ── */}
//       <Box sx={{
//         display: 'flex', flexWrap: 'wrap', alignItems: 'center',
//         gap: 0.25, px: 1.25, py: 0.75,
//         borderBottom: '1px solid #F1F5F9', bgcolor: '#FAFBFD',
//       }}>

//         {/* History */}
//         <ToolbarButton label="Undo (Ctrl+Z)" onClick={() => editor.chain().focus().undo().run()}><Undo sx={{ fontSize: 15 }} /></ToolbarButton>
//         <ToolbarButton label="Redo (Ctrl+Y)" onClick={() => editor.chain().focus().redo().run()}><Redo sx={{ fontSize: 15 }} /></ToolbarButton>
//         <ToolDivider />

//         {/* Headings */}
//         {(['Normal', 'H1', 'H2', 'H3'] as const).map(level => {
//           const isActive = level !== 'Normal' && editor.isActive('heading', { level: Number(level.slice(1)) as 1|2|3 });
//           return (
//             <Tooltip key={level} title={level === 'Normal' ? 'Normal text' : `Heading ${level.slice(1)}`} placement="top" arrow>
//               <Box component="button"
//                 onClick={() => level === 'Normal' ? editor.chain().focus().setParagraph().run() : editor.chain().focus().toggleHeading({ level: Number(level.slice(1)) as 1|2|3 }).run()}
//                 sx={{
//                   fontSize: '11px', fontWeight: 700, px: 0.875, height: 28, borderRadius: '6px',
//                   border: isActive ? '1px solid rgba(29,78,216,0.2)' : '1px solid transparent',
//                   cursor: 'pointer', bgcolor: isActive ? 'rgba(29,78,216,0.08)' : 'transparent',
//                   color: isActive ? '#1D4ED8' : '#64748B', fontFamily: 'inherit',
//                   '&:hover': { bgcolor: 'rgba(100,116,139,0.08)', color: '#334155' },
//                   transition: 'all 0.12s ease',
//                 }}>
//                 {level}
//               </Box>
//             </Tooltip>
//           );
//         })}
//         <ToolDivider />

//         {/* Font Family */}
//         <Tooltip title="Font family" placement="top" arrow>
//           <Select size="small" value={editor.getAttributes('textStyle').fontFamily || ''}
//             onChange={e => { const v = e.target.value; if (!v) editor.chain().focus().unsetFontFamily().run(); else editor.chain().focus().setFontFamily(v).run(); }}
//             displayEmpty sx={{ height: 28, fontSize: '11px', fontWeight: 600, color: '#64748B', borderRadius: '6px', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#E2E8F0' }, '& .MuiSelect-select': { py: 0, px: 1, pr: '24px !important' }, minWidth: 80 }}>
//             {FONT_FAMILIES.map(f => <MenuItem key={f.value} value={f.value} sx={{ fontSize: '12px', fontFamily: f.value || 'inherit' }}>{f.label}</MenuItem>)}
//           </Select>
//         </Tooltip>

//         {/* Font Size */}
//         <Tooltip title="Font size" placement="top" arrow>
//           <Select size="small" value={editor.getAttributes('textStyle').fontSize || ''}
//             onChange={e => { const v = e.target.value; if (!v) (editor.chain().focus() as any).unsetFontSize().run(); else (editor.chain().focus() as any).setFontSize(v).run(); }}
//             displayEmpty sx={{ height: 28, fontSize: '11px', fontWeight: 600, color: '#64748B', borderRadius: '6px', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#E2E8F0' }, '& .MuiSelect-select': { py: 0, px: 1, pr: '24px !important' }, minWidth: 60 }}>
//             <MenuItem value="" sx={{ fontSize: '12px' }}>Size</MenuItem>
//             {FONT_SIZES.map(s => <MenuItem key={s} value={s} sx={{ fontSize: '12px' }}>{s}px</MenuItem>)}
//           </Select>
//         </Tooltip>
//         <ToolDivider />

//         {/* Text Formatting */}
//         <ToolbarButton label="Bold (Ctrl+B)"         active={editor.isActive('bold')}      onClick={() => editor.chain().focus().toggleBold().run()}><FormatBold sx={{ fontSize: 15 }} /></ToolbarButton>
//         <ToolbarButton label="Italic (Ctrl+I)"       active={editor.isActive('italic')}    onClick={() => editor.chain().focus().toggleItalic().run()}><FormatItalic sx={{ fontSize: 15 }} /></ToolbarButton>
//         <ToolbarButton label="Underline (Ctrl+U)"    active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()}><FormatUnderlined sx={{ fontSize: 15 }} /></ToolbarButton>
//         <ToolbarButton label="Strikethrough"         active={editor.isActive('strike')}    onClick={() => editor.chain().focus().toggleStrike().run()}><StrikethroughS sx={{ fontSize: 15 }} /></ToolbarButton>
//         <ToolDivider />

//         {/* Text Color */}
//         <Tooltip title="Text color" placement="top" arrow>
//           <Box component="button" ref={textColorBtnRef} onClick={() => setTextColorAnchor(textColorBtnRef.current)}
//             sx={{ width: 28, height: 28, borderRadius: '6px', border: '1px solid transparent', cursor: 'pointer', bgcolor: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '2px', p: 0, '&:hover': { bgcolor: 'rgba(100,116,139,0.08)' }, transition: 'all 0.12s' }}>
//             <FormatColorText sx={{ fontSize: 15, color: '#64748B' }} />
//             <Box sx={{ width: 16, height: 3, borderRadius: '1px', bgcolor: activeTextColor, border: '1px solid rgba(0,0,0,0.12)' }} />
//           </Box>
//         </Tooltip>
//         <ColorPicker anchorEl={textColorAnchor} onClose={() => setTextColorAnchor(null)} colors={TEXT_COLORS} title="Text Color"
//           onSelect={val => { if (!val) editor.chain().focus().extendMarkRange('textStyle').unsetColor().run(); else editor.chain().focus().extendMarkRange('textStyle').setColor(val).run(); }} />

//         {/* Highlight Color */}
//         <Tooltip title="Highlight color" placement="top" arrow>
//           <Box component="button" ref={highlightBtnRef} onClick={() => setHighlightAnchor(highlightBtnRef.current)}
//             sx={{ width: 28, height: 28, borderRadius: '6px', border: editor.isActive('highlight') ? '1px solid rgba(29,78,216,0.2)' : '1px solid transparent', cursor: 'pointer', bgcolor: editor.isActive('highlight') ? 'rgba(29,78,216,0.08)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '2px', p: 0, '&:hover': { bgcolor: 'rgba(100,116,139,0.08)' }, transition: 'all 0.12s' }}>
//             <HighlightIcon sx={{ fontSize: 15, color: editor.isActive('highlight') ? '#1D4ED8' : '#64748B' }} />
//             <Box sx={{ width: 16, height: 3, borderRadius: '1px', bgcolor: activeHighlightColor, border: '1px solid rgba(0,0,0,0.12)' }} />
//           </Box>
//         </Tooltip>
//         <ColorPicker anchorEl={highlightAnchor} onClose={() => setHighlightAnchor(null)} colors={HIGHLIGHT_COLORS} title="Highlight Color"
//           onSelect={val => { if (!val) editor.chain().focus().unsetHighlight().run(); else editor.chain().focus().toggleHighlight({ color: val }).run(); }} />
//         <ToolDivider />

//         {/* Link */}
//         <Tooltip title={editor.isActive('link') ? 'Edit link' : 'Add link'} placement="top" arrow>
//           <span ref={linkBtnRef}>
//             <IconButton size="small" onClick={() => setLinkAnchor(linkBtnRef.current)}
//               sx={{ borderRadius: '6px', width: 28, height: 28, color: editor.isActive('link') ? '#1D4ED8' : '#64748B', bgcolor: editor.isActive('link') ? 'rgba(29,78,216,0.08)' : 'transparent', border: editor.isActive('link') ? '1px solid rgba(29,78,216,0.2)' : '1px solid transparent', '&:hover': { bgcolor: 'rgba(100,116,139,0.08)' }, transition: 'all 0.12s' }}>
//               <LinkIcon sx={{ fontSize: 15 }} />
//             </IconButton>
//           </span>
//         </Tooltip>
//         {editor.isActive('link') && <ToolbarButton label="Remove link" onClick={unsetLink}><LinkOff sx={{ fontSize: 15 }} /></ToolbarButton>}
//         <LinkDialog anchorEl={linkAnchor} onClose={() => setLinkAnchor(null)} onSet={setLink} onUnset={unsetLink} currentUrl={currentUrl} />
//         <ToolDivider />

//         {/* Alignment */}
//         <ToolbarButton label="Align left"   active={editor.isActive({ textAlign: 'left' })}   onClick={() => editor.chain().focus().setTextAlign('left').run()}><FormatAlignLeft sx={{ fontSize: 15 }} /></ToolbarButton>
//         <ToolbarButton label="Align center" active={editor.isActive({ textAlign: 'center' })} onClick={() => editor.chain().focus().setTextAlign('center').run()}><FormatAlignCenter sx={{ fontSize: 15 }} /></ToolbarButton>
//         <ToolbarButton label="Align right"  active={editor.isActive({ textAlign: 'right' })}  onClick={() => editor.chain().focus().setTextAlign('right').run()}><FormatAlignRight sx={{ fontSize: 15 }} /></ToolbarButton>
//         <ToolDivider />

//         {/* Lists & Blocks */}
//         <ToolbarButton label="Bullet list"   active={editor.isActive('bulletList')}  onClick={() => editor.chain().focus().toggleBulletList().run()}><FormatListBulleted sx={{ fontSize: 15 }} /></ToolbarButton>
//         <ToolbarButton label="Numbered list" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}><FormatListNumbered sx={{ fontSize: 15 }} /></ToolbarButton>
//         <ToolbarButton label="Blockquote"    active={editor.isActive('blockquote')}  onClick={() => editor.chain().focus().toggleBlockquote().run()}><FormatQuote sx={{ fontSize: 15 }} /></ToolbarButton>
//         <ToolbarButton label="Code block"    active={editor.isActive('codeBlock')}   onClick={() => editor.chain().focus().toggleCodeBlock().run()}><Code sx={{ fontSize: 15 }} /></ToolbarButton>
//         <ToolbarButton label="Inline code"   active={editor.isActive('code')}        onClick={() => editor.chain().focus().toggleCode().run()}><CodeOff sx={{ fontSize: 15 }} /></ToolbarButton>
//         <ToolbarButton label="Horizontal rule" onClick={() => editor.chain().focus().setHorizontalRule().run()}><HorizontalRule sx={{ fontSize: 15 }} /></ToolbarButton>
//         <ToolDivider />

//         {/* ── NEW: Image buttons ── */}
//         <Tooltip title="Insert image from URL" placement="top" arrow>
//           <span ref={imageBtnRef}>
//             <IconButton size="small" onClick={() => setImageAnchor(imageBtnRef.current)}
//               sx={{ borderRadius: '6px', width: 28, height: 28, color: '#64748B', border: '1px solid transparent', '&:hover': { bgcolor: 'rgba(100,116,139,0.08)', color: '#334155' }, transition: 'all 0.12s ease' }}>
//               <ImageIcon sx={{ fontSize: 15 }} />
//             </IconButton>
//           </span>
//         </Tooltip>
//         <ImageDialog anchorEl={imageAnchor} onClose={() => setImageAnchor(null)} onInsert={insertImageUrl} />

//         <Tooltip title="Upload image from device" placement="top" arrow>
//           <span>
//             <IconButton size="small" onClick={() => imageFileRef.current?.click()}
//               sx={{ borderRadius: '6px', width: 28, height: 28, color: '#64748B', border: '1px solid transparent', '&:hover': { bgcolor: 'rgba(100,116,139,0.08)', color: '#334155' }, transition: 'all 0.12s ease' }}>
//               {/* upload icon: reuse ImageIcon with small badge feel */}
//               <ImageIcon sx={{ fontSize: 15 }} />
//             </IconButton>
//           </span>
//         </Tooltip>
//         <input ref={imageFileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileUpload} />

//         {/* ── NEW: Chart button (from ChartExtension) ── */}
//         <ToolDivider />
//         <InsertChartButton editor={editor} />
//       </Box>

//       {/* ── Editor Body ── */}
//       <Box sx={{
//         px: 3, py: 2.5, minHeight: 260,
//         '& .tiptap': {
//           outline: 'none', fontSize: '0.9375rem', lineHeight: 1.8, color: '#334155',
//           fontFamily: "'DM Sans', sans-serif",
//           '& h1': { fontSize: '1.6rem', fontWeight: 800, color: '#0F172A', marginTop: '1.4em', marginBottom: '0.5em', lineHeight: 1.25, letterSpacing: '-0.025em', borderBottom: '2px solid #F1F5F9', paddingBottom: '0.35em' },
//           '& h2': { fontSize: '1.3rem', fontWeight: 700, color: '#0F172A', marginTop: '1.3em', marginBottom: '0.4em', lineHeight: 1.3, letterSpacing: '-0.02em' },
//           '& h3': { fontSize: '1.1rem', fontWeight: 700, color: '#1E293B', marginTop: '1.2em', marginBottom: '0.35em', lineHeight: 1.35 },
//           '& h4': { fontSize: '0.975rem', fontWeight: 700, color: '#334155', marginTop: '1em', marginBottom: '0.3em' },
//           '& p': { marginTop: 0, marginBottom: '0.9em', lineHeight: 1.8 },
//           '& p.is-editor-empty:first-child::before': { content: 'attr(data-placeholder)', color: '#CBD5E1', float: 'left', height: 0, pointerEvents: 'none' },
//           '& ul': { paddingLeft: '1.4rem', marginBottom: '0.9em', listStyleType: 'none' },
//           '& ul li': { position: 'relative', paddingLeft: '0.5rem', marginBottom: '0.35em' },
//           '& ol': { paddingLeft: '1.5rem', marginBottom: '0.9em' },
//           '& ol li': { marginBottom: '0.35em' },
//           '& li p': { marginBottom: '0.2em' },
//           '& blockquote': { borderLeft: '3px solid #1D4ED8', backgroundColor: '#F0F7FF', paddingLeft: '1rem', paddingRight: '0.75rem', paddingTop: '0.6rem', paddingBottom: '0.6rem', marginLeft: 0, marginTop: '1em', marginBottom: '1em', borderRadius: '0 8px 8px 0', color: '#1E40AF', fontStyle: 'italic' },
//           '& blockquote p': { marginBottom: 0 },
//           '& code': { backgroundColor: '#F1F5F9', color: '#1D4ED8', padding: '0.15em 0.4em', borderRadius: '4px', fontSize: '0.85em', fontFamily: "'JetBrains Mono', 'Fira Code', monospace", border: '1px solid #E2E8F0' },
//           '& pre': { backgroundColor: '#0F172A', borderRadius: '10px', padding: '1rem 1.25rem', marginTop: '1em', marginBottom: '1em', overflowX: 'auto' },
//           '& pre code': { color: '#94A3B8', backgroundColor: 'transparent', border: 'none', padding: 0, fontSize: '0.875rem' },
//           '& mark': { borderRadius: '3px', padding: '0 0.2em' },
//           '& hr': { border: 'none', borderTop: '2px solid #F1F5F9', marginTop: '1.5em', marginBottom: '1.5em' },
//           '& a.tiptap-link': { color: '#1D4ED8', textDecoration: 'none', borderBottom: '1.5px solid rgba(29,78,216,0.3)', cursor: 'pointer' },
//           '& strong': { fontWeight: 700, color: 'inherit' },
//           '& em': { fontStyle: 'italic' },
//           // ── NEW: image styles ──
//           '& img': {
//             maxWidth: '100%', height: 'auto',
//             borderRadius: '8px', marginTop: '0.75em', marginBottom: '0.75em',
//             display: 'block',
//             '&.ProseMirror-selectednode': { outline: '2px solid #1D4ED8', outlineOffset: '2px' },
//           },
//         },
//       }}>
//         <EditorContent editor={editor} />
//       </Box>

//       {/* ── Footer ── */}
//       <Box sx={{ px: 3, py: 0.75, borderTop: '1px solid #F8FAFC', display: 'flex', justifyContent: 'flex-end', bgcolor: '#FAFBFD' }}>
//         <Box sx={{ fontSize: '0.7rem', color: '#CBD5E1', fontFamily: "'DM Sans', sans-serif" }}>
//           {editor.getText().length} chars
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// export default Editor;

// import { useEditor, EditorContent } from '@tiptap/react';
// import StarterKit from '@tiptap/starter-kit';
// import Underline from '@tiptap/extension-underline';
// import TextAlign from '@tiptap/extension-text-align';
// import Highlight from '@tiptap/extension-highlight';
// import Color from '@tiptap/extension-color';
// import FontFamily from '@tiptap/extension-font-family';
// import Link from '@tiptap/extension-link';
// import Image from '@tiptap/extension-image';
// import { Extension } from '@tiptap/core';
// import {
//   Box, Divider, Tooltip, IconButton,
//   Popover, TextField, Button, MenuItem, Select,
//   CircularProgress,
// } from '@mui/material';
// import {
//   FormatBold, FormatItalic, FormatUnderlined, StrikethroughS,
//   FormatListBulleted, FormatListNumbered, FormatQuote, Code,
//   FormatAlignLeft, FormatAlignCenter, FormatAlignRight,
//   Highlight as HighlightIcon, Undo, Redo, HorizontalRule,
//   Link as LinkIcon, LinkOff, FormatColorText, CodeOff,
//   Image as ImageIcon,
// } from '@mui/icons-material';
// import React, { useState, useCallback, useRef } from 'react';
// import { TextStyle } from '@tiptap/extension-text-style';
// import { ChartExtension, InsertChartButton } from './ChartExtension';

// // ─── FontSize extension ──────────────────────────────────────────────────────
// const FontSize = Extension.create({
//   name: 'fontSize',
//   addOptions() { return { types: ['textStyle'] }; },
//   addGlobalAttributes() {
//     return [{
//       types: this.options.types,
//       attributes: {
//         fontSize: {
//           default: null,
//           parseHTML: (el: HTMLElement) => el.style.fontSize?.replace('px', '') || null,
//           renderHTML: (attrs: Record<string, any>) =>
//             attrs.fontSize ? { style: `font-size: ${attrs.fontSize}px` } : {},
//         },
//       },
//     }];
//   },
//   addCommands() {
//     return {
//       setFontSize: (size: string) => ({ chain }: any) =>
//         chain().extendMarkRange('textStyle').setMark('textStyle', { fontSize: size }).run(),
//       unsetFontSize: () => ({ chain }: any) =>
//         chain().extendMarkRange('textStyle').setMark('textStyle', { fontSize: null }).removeEmptyTextStyle().run(),
//     } as any;
//   },
// });

// interface EditorProps {
//   value: string;
//   onChange: (html: string) => void;
//   // Pass your API base URL, e.g. "https://api.myapp.com"
//   apiBaseUrl?: string;
// }

// // ─── Toolbar button ──────────────────────────────────────────────────────────
// const ToolbarButton = ({
//   label, active, onClick, children, disabled,
// }: {
//   label: string; active?: boolean;
//   onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
//   children: React.ReactNode; disabled?: boolean;
// }) => (
//   <Tooltip title={label} placement="top" arrow>
//     <span>
//       <IconButton size="small" onClick={onClick} disabled={disabled} sx={{
//         borderRadius: '6px', width: 28, height: 28,
//         color: active ? '#1D4ED8' : '#64748B',
//         bgcolor: active ? 'rgba(29,78,216,0.08)' : 'transparent',
//         border: active ? '1px solid rgba(29,78,216,0.2)' : '1px solid transparent',
//         '&:hover': { bgcolor: active ? 'rgba(29,78,216,0.12)' : 'rgba(100,116,139,0.08)', color: active ? '#1D4ED8' : '#334155' },
//         transition: 'all 0.12s ease',
//       }}>
//         {children}
//       </IconButton>
//     </span>
//   </Tooltip>
// );

// const ToolDivider = () => (
//   <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: 0.5, borderColor: '#E2E8F0' }} />
// );

// // ─── Palettes ────────────────────────────────────────────────────────────────
// const TEXT_COLORS = [
//   { label: 'Default', value: '' },
//   { label: 'Black', value: '#0F172A' },
//   { label: 'Dark Gray', value: '#475569' },
//   { label: 'Gray', value: '#94A3B8' },
//   { label: 'Red', value: '#DC2626' },
//   { label: 'Orange', value: '#EA580C' },
//   { label: 'Amber', value: '#D97706' },
//   { label: 'Green', value: '#16A34A' },
//   { label: 'Teal', value: '#0D9488' },
//   { label: 'Blue', value: '#1D4ED8' },
//   { label: 'Indigo', value: '#4F46E5' },
//   { label: 'Purple', value: '#7C3AED' },
//   { label: 'Pink', value: '#DB2777' },
//   { label: 'Rose', value: '#E11D48' },
//   { label: 'Cyan', value: '#0891B2' },
//   { label: 'Lime', value: '#65A30D' },
// ];

// const HIGHLIGHT_COLORS = [
//   { label: 'None', value: '' },
//   { label: 'Yellow', value: '#FEF08A' },
//   { label: 'Green', value: '#BBF7D0' },
//   { label: 'Blue', value: '#BFDBFE' },
//   { label: 'Pink', value: '#FBCFE8' },
//   { label: 'Orange', value: '#FED7AA' },
//   { label: 'Purple', value: '#E9D5FF' },
//   { label: 'Cyan', value: '#A5F3FC' },
//   { label: 'Red', value: '#FECACA' },
// ];

// const FONT_FAMILIES = [
//   { label: 'Default', value: '' },
//   { label: 'Serif', value: 'Georgia, serif' },
//   { label: 'Mono', value: "'Courier New', monospace" },
//   { label: 'DM Sans', value: "'DM Sans', sans-serif" },
//   { label: 'Playfair', value: "'Playfair Display', serif" },
//   { label: 'Sora', value: "'Sora', sans-serif" },
// ];

// const FONT_SIZES = ['12', '14', '16', '18', '20', '24', '28', '32', '36', '48'];

// // ─── Color Swatch Popover ────────────────────────────────────────────────────
// const ColorPicker = ({
//   anchorEl, onClose, colors, onSelect, title,
// }: {
//   anchorEl: HTMLElement | null;
//   onClose: () => void;
//   colors: { label: string; value: string }[];
//   onSelect: (val: string) => void;
//   title: string;
// }) => (
//   <Popover open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={onClose}
//     anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
//     transformOrigin={{ vertical: 'top', horizontal: 'left' }}
//     slotProps={{ paper: { sx: { mt: 0.5, p: 1.5, borderRadius: '10px', border: '1px solid #E2E8F0', boxShadow: '0 8px 24px rgba(15,23,42,0.12)', minWidth: 180 } } }}>
//     <Box sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#94A3B8', mb: 1, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{title}</Box>
//     <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
//       {colors.map(c => (
//         <Tooltip key={c.value || 'none'} title={c.label} placement="top" arrow>
//           <Box onClick={() => { onSelect(c.value); onClose(); }}
//             sx={{
//               width: 22, height: 22, borderRadius: '5px',
//               bgcolor: c.value || '#F1F5F9',
//               border: c.value ? '1.5px solid rgba(0,0,0,0.1)' : '1.5px dashed #CBD5E1',
//               cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
//               '&:hover': { transform: 'scale(1.2)', boxShadow: '0 2px 6px rgba(0,0,0,0.15)' },
//               transition: 'all 0.12s ease',
//             }}>
//             {!c.value && <Box sx={{ width: '70%', height: '1.5px', bgcolor: '#DC2626', transform: 'rotate(-45deg)', borderRadius: 1 }} />}
//           </Box>
//         </Tooltip>
//       ))}
//     </Box>
//   </Popover>
// );

// // ─── Link Popover ────────────────────────────────────────────────────────────
// const LinkDialog = ({
//   anchorEl, onClose, onSet, onUnset, currentUrl,
// }: {
//   anchorEl: HTMLElement | null;
//   onClose: () => void;
//   onSet: (url: string) => void;
//   onUnset: () => void;
//   currentUrl: string;
// }) => {
//   const [url, setUrl] = useState(currentUrl);
//   return (
//     <Popover open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={onClose}
//       anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
//       transformOrigin={{ vertical: 'top', horizontal: 'left' }}
//       slotProps={{ paper: { sx: { mt: 0.5, p: 2, borderRadius: '10px', border: '1px solid #E2E8F0', boxShadow: '0 8px 24px rgba(15,23,42,0.12)', minWidth: 280 } } }}>
//       <Box sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#94A3B8', mb: 1.25, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Insert Link</Box>
//       <TextField fullWidth size="small" placeholder="https://example.com" value={url}
//         onChange={e => setUrl(e.target.value)}
//         onKeyDown={e => { if (e.key === 'Enter') { onSet(url); onClose(); } }}
//         autoFocus sx={{ mb: 1.25, '& .MuiOutlinedInput-root': { borderRadius: '8px', fontSize: '0.85rem' } }} />
//       <Box sx={{ display: 'flex', gap: 1 }}>
//         <Button size="small" variant="contained" disableElevation onClick={() => { onSet(url); onClose(); }}
//           sx={{ borderRadius: '7px', textTransform: 'none', fontSize: '0.8rem', bgcolor: '#1D4ED8', flex: 1 }}>Apply</Button>
//         {currentUrl && (
//           <Button size="small" variant="outlined" color="error" onClick={() => { onUnset(); onClose(); }}
//             sx={{ borderRadius: '7px', textTransform: 'none', fontSize: '0.8rem' }}>Remove</Button>
//         )}
//       </Box>
//     </Popover>
//   );
// };

// // ─── Image URL dialog ────────────────────────────────────────────────────────
// const ImageUrlDialog = ({
//   anchorEl, onClose, onInsert,
// }: {
//   anchorEl: HTMLElement | null;
//   onClose: () => void;
//   onInsert: (src: string, alt: string) => void;
// }) => {
//   const [src, setSrc] = useState('');
//   const [alt, setAlt] = useState('');
//   return (
//     <Popover open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={onClose}
//       anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
//       transformOrigin={{ vertical: 'top', horizontal: 'left' }}
//       slotProps={{ paper: { sx: { mt: 0.5, p: 2, borderRadius: '10px', border: '1px solid #E2E8F0', boxShadow: '0 8px 24px rgba(15,23,42,0.12)', minWidth: 320 } } }}>
//       <Box sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#94A3B8', mb: 1.25, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Insert Image by URL</Box>
//       <TextField fullWidth size="small" placeholder="https://example.com/image.jpg" value={src}
//         onChange={e => setSrc(e.target.value)} label="Image URL" autoFocus
//         sx={{ mb: 1, '& .MuiOutlinedInput-root': { borderRadius: '8px', fontSize: '0.85rem' } }} />
//       <TextField fullWidth size="small" placeholder="Description" value={alt}
//         onChange={e => setAlt(e.target.value)} label="Alt text (optional)"
//         onKeyDown={e => { if (e.key === 'Enter' && src) { onInsert(src, alt); onClose(); } }}
//         sx={{ mb: 1.25, '& .MuiOutlinedInput-root': { borderRadius: '8px', fontSize: '0.85rem' } }} />
//       <Button fullWidth size="small" variant="contained" disableElevation
//         disabled={!src}
//         onClick={() => { onInsert(src, alt); onClose(); setSrc(''); setAlt(''); }}
//         sx={{ borderRadius: '7px', textTransform: 'none', fontSize: '0.8rem', bgcolor: '#1D4ED8' }}>
//         Insert Image
//       </Button>
//     </Popover>
//   );
// };

// // ═══════════════════════════════════════════════════════
// //  Main Editor Component
// // ═══════════════════════════════════════════════════════
// const Editor = ({ value, onChange, apiBaseUrl = '' }: EditorProps) => {
//   const [textColorAnchor, setTextColorAnchor] = useState<HTMLElement | null>(null);
//   const [highlightAnchor, setHighlightAnchor] = useState<HTMLElement | null>(null);
//   const [linkAnchor, setLinkAnchor] = useState<HTMLElement | null>(null);
//   const [imageUrlAnchor, setImageUrlAnchor] = useState<HTMLElement | null>(null);
//   // Tracks whether a device-file upload is in progress (uploading to Cloudinary)
//   const [uploadingImage, setUploadingImage] = useState(false);

//   const textColorBtnRef = useRef<HTMLButtonElement>(null);
//   const highlightBtnRef = useRef<HTMLButtonElement>(null);
//   const linkBtnRef = useRef<HTMLSpanElement>(null);
//   const imageBtnRef = useRef<HTMLSpanElement>(null);
//   const imageFileRef = useRef<HTMLInputElement>(null);

//   const editor = useEditor({
//     extensions: [
//       StarterKit.configure({}),
//       Underline,
//       TextStyle,
//       Color,
//       FontFamily,
//       FontSize,
//       Highlight.configure({ multicolor: true }),
//       TextAlign.configure({ types: ['heading', 'paragraph'] }),
//       Link.configure({ openOnClick: false, HTMLAttributes: { class: 'tiptap-link' } }),
//       // allowBase64: false — we never embed base64; everything goes through Cloudinary
//       Image.configure({ inline: false, allowBase64: false }),
//       ChartExtension,
//     ],
//     content: value,
//     onUpdate: ({ editor }) => onChange(editor.getHTML()),
//   });

//   const setLink = useCallback((url: string) => {
//     if (!editor) return;
//     if (!url) { editor.chain().focus().unsetLink().run(); return; }
//     const href = url.startsWith('http') ? url : `https://${url}`;
//     editor.chain().focus().extendMarkRange('link').setLink({ href, target: '_blank' }).run();
//   }, [editor]);

//   const unsetLink = useCallback(() => editor?.chain().focus().unsetLink().run(), [editor]);

//   // Insert an image by URL (e.g. external URL or already-hosted URL)
//   const insertImageUrl = useCallback((src: string, alt: string) => {
//     editor?.chain().focus().setImage({ src, alt }).run();
//   }, [editor]);

//   // ── KEY CHANGE: upload to Cloudinary, insert the returned secure_url ────
//   // The base64 approach stuffed potentially large blobs into the HTML content
//   // string, which grows the DB document and slows transfers. Now we POST the
//   // file to the backend, get a Cloudinary URL back, and insert only that URL.
//   const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file || !editor) return;
//     e.target.value = ''; // reset so same file can be picked again

//     setUploadingImage(true);
//     try {
//       const formData = new FormData();
//       formData.append('image', file);

//       const res = await fetch(`${apiBaseUrl}/api/courses/upload-image`, {
//         method: 'POST',
//         body: formData,
//         // Do NOT set Content-Type — browser sets it with the correct boundary
//       });

//       if (!res.ok) {
//         const err = await res.json().catch(() => ({ message: 'Upload failed' }));
//         throw new Error(err.message ?? 'Upload failed');
//       }

//       const { url, publicId } = await res.json() as { url: string; publicId: string };

//       // Insert image into editor.
//       // The publicId is stored as a data attribute on the <img> tag so we can
//       // retrieve it later when the user deletes the image from the editor.
//       editor.chain().focus().setImage({
//         src: url,
//         alt: file.name,
//         // @ts-ignore — custom attribute; configure Image extension to allow it
//         'data-public-id': publicId,
//       }).run();
//     } catch (err: any) {
//       console.error('Image upload error:', err);
//       // Replace with your toast/snackbar system
//       alert(`Image upload failed: ${err.message}`);
//     } finally {
//       setUploadingImage(false);
//     }
//   }, [editor, apiBaseUrl]);

//   if (!editor) return null;

//   const currentUrl = editor.getAttributes('link').href || '';
//   const activeTextColor = editor.getAttributes('textStyle').color || '#0F172A';
//   const activeHighlightColor = editor.getAttributes('highlight').color || '#FEF08A';

//   return (
//     <Box sx={{
//       border: '1px solid #E2E8F0', borderRadius: '12px', overflow: 'hidden',
//       bgcolor: '#fff', boxShadow: '0 1px 3px rgba(15,23,42,0.06)',
//       '&:focus-within': { borderColor: '#93C5FD', boxShadow: '0 0 0 3px rgba(29,78,216,0.08)' },
//       transition: 'border-color 0.15s, box-shadow 0.15s',
//     }}>

//       {/* ── Toolbar ── */}
//       <Box sx={{
//         display: 'flex', flexWrap: 'wrap', alignItems: 'center',
//         gap: 0.25, px: 1.25, py: 0.75,
//         borderBottom: '1px solid #F1F5F9', bgcolor: '#FAFBFD',
//       }}>

//         {/* History */}
//         <ToolbarButton label="Undo (Ctrl+Z)" onClick={() => editor.chain().focus().undo().run()}><Undo sx={{ fontSize: 15 }} /></ToolbarButton>
//         <ToolbarButton label="Redo (Ctrl+Y)" onClick={() => editor.chain().focus().redo().run()}><Redo sx={{ fontSize: 15 }} /></ToolbarButton>
//         <ToolDivider />

//         {/* Headings */}
//         {(['Normal', 'H1', 'H2', 'H3'] as const).map(level => {
//           const isActive = level !== 'Normal' && editor.isActive('heading', { level: Number(level.slice(1)) as 1 | 2 | 3 });
//           return (
//             <Tooltip key={level} title={level === 'Normal' ? 'Normal text' : `Heading ${level.slice(1)}`} placement="top" arrow>
//               <Box component="button"
//                 onClick={() => level === 'Normal'
//                   ? editor.chain().focus().setParagraph().run()
//                   : editor.chain().focus().toggleHeading({ level: Number(level.slice(1)) as 1 | 2 | 3 }).run()}
//                 sx={{
//                   fontSize: '11px', fontWeight: 700, px: 0.875, height: 28, borderRadius: '6px',
//                   border: isActive ? '1px solid rgba(29,78,216,0.2)' : '1px solid transparent',
//                   cursor: 'pointer',
//                   bgcolor: isActive ? 'rgba(29,78,216,0.08)' : 'transparent',
//                   color: isActive ? '#1D4ED8' : '#64748B',
//                   fontFamily: 'inherit',
//                   '&:hover': { bgcolor: 'rgba(100,116,139,0.08)', color: '#334155' },
//                   transition: 'all 0.12s ease',
//                 }}>
//                 {level}
//               </Box>
//             </Tooltip>
//           );
//         })}
//         <ToolDivider />

//         {/* Font Family */}
//         <Tooltip title="Font family" placement="top" arrow>
//           <Select size="small" value={editor.getAttributes('textStyle').fontFamily || ''}
//             onChange={e => {
//               const v = e.target.value;
//               if (!v) editor.chain().focus().unsetFontFamily().run();
//               else editor.chain().focus().setFontFamily(v).run();
//             }}
//             displayEmpty
//             sx={{ height: 28, fontSize: '11px', fontWeight: 600, color: '#64748B', borderRadius: '6px', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#E2E8F0' }, '& .MuiSelect-select': { py: 0, px: 1, pr: '24px !important' }, minWidth: 80 }}>
//             {FONT_FAMILIES.map(f => <MenuItem key={f.value} value={f.value} sx={{ fontSize: '12px', fontFamily: f.value || 'inherit' }}>{f.label}</MenuItem>)}
//           </Select>
//         </Tooltip>

//         {/* Font Size */}
//         <Tooltip title="Font size" placement="top" arrow>
//           <Select size="small" value={editor.getAttributes('textStyle').fontSize || ''}
//             onChange={e => {
//               const v = e.target.value;
//               if (!v) (editor.chain().focus() as any).unsetFontSize().run();
//               else (editor.chain().focus() as any).setFontSize(v).run();
//             }}
//             displayEmpty
//             sx={{ height: 28, fontSize: '11px', fontWeight: 600, color: '#64748B', borderRadius: '6px', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#E2E8F0' }, '& .MuiSelect-select': { py: 0, px: 1, pr: '24px !important' }, minWidth: 60 }}>
//             <MenuItem value="" sx={{ fontSize: '12px' }}>Size</MenuItem>
//             {FONT_SIZES.map(s => <MenuItem key={s} value={s} sx={{ fontSize: '12px' }}>{s}px</MenuItem>)}
//           </Select>
//         </Tooltip>
//         <ToolDivider />

//         {/* Text Formatting */}
//         <ToolbarButton label="Bold (Ctrl+B)" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}><FormatBold sx={{ fontSize: 15 }} /></ToolbarButton>
//         <ToolbarButton label="Italic (Ctrl+I)" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}><FormatItalic sx={{ fontSize: 15 }} /></ToolbarButton>
//         <ToolbarButton label="Underline (Ctrl+U)" active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()}><FormatUnderlined sx={{ fontSize: 15 }} /></ToolbarButton>
//         <ToolbarButton label="Strikethrough" active={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()}><StrikethroughS sx={{ fontSize: 15 }} /></ToolbarButton>
//         <ToolDivider />

//         {/* Text Color */}
//         <Tooltip title="Text color" placement="top" arrow>
//           <Box component="button" ref={textColorBtnRef} onClick={() => setTextColorAnchor(textColorBtnRef.current)}
//             sx={{ width: 28, height: 28, borderRadius: '6px', border: '1px solid transparent', cursor: 'pointer', bgcolor: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '2px', p: 0, '&:hover': { bgcolor: 'rgba(100,116,139,0.08)' }, transition: 'all 0.12s' }}>
//             <FormatColorText sx={{ fontSize: 15, color: '#64748B' }} />
//             <Box sx={{ width: 16, height: 3, borderRadius: '1px', bgcolor: activeTextColor, border: '1px solid rgba(0,0,0,0.12)' }} />
//           </Box>
//         </Tooltip>
//         <ColorPicker anchorEl={textColorAnchor} onClose={() => setTextColorAnchor(null)} colors={TEXT_COLORS} title="Text Color"
//           onSelect={val => {
//             if (!val) editor.chain().focus().extendMarkRange('textStyle').unsetColor().run();
//             else editor.chain().focus().extendMarkRange('textStyle').setColor(val).run();
//           }} />

//         {/* Highlight Color */}
//         <Tooltip title="Highlight color" placement="top" arrow>
//           <Box component="button" ref={highlightBtnRef} onClick={() => setHighlightAnchor(highlightBtnRef.current)}
//             sx={{ width: 28, height: 28, borderRadius: '6px', border: editor.isActive('highlight') ? '1px solid rgba(29,78,216,0.2)' : '1px solid transparent', cursor: 'pointer', bgcolor: editor.isActive('highlight') ? 'rgba(29,78,216,0.08)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '2px', p: 0, '&:hover': { bgcolor: 'rgba(100,116,139,0.08)' }, transition: 'all 0.12s' }}>
//             <HighlightIcon sx={{ fontSize: 15, color: editor.isActive('highlight') ? '#1D4ED8' : '#64748B' }} />
//             <Box sx={{ width: 16, height: 3, borderRadius: '1px', bgcolor: activeHighlightColor, border: '1px solid rgba(0,0,0,0.12)' }} />
//           </Box>
//         </Tooltip>
//         <ColorPicker anchorEl={highlightAnchor} onClose={() => setHighlightAnchor(null)} colors={HIGHLIGHT_COLORS} title="Highlight Color"
//           onSelect={val => {
//             if (!val) editor.chain().focus().unsetHighlight().run();
//             else editor.chain().focus().toggleHighlight({ color: val }).run();
//           }} />
//         <ToolDivider />

//         {/* Link */}
//         <Tooltip title={editor.isActive('link') ? 'Edit link' : 'Add link'} placement="top" arrow>
//           <span ref={linkBtnRef}>
//             <IconButton size="small" onClick={() => setLinkAnchor(linkBtnRef.current)}
//               sx={{ borderRadius: '6px', width: 28, height: 28, color: editor.isActive('link') ? '#1D4ED8' : '#64748B', bgcolor: editor.isActive('link') ? 'rgba(29,78,216,0.08)' : 'transparent', border: editor.isActive('link') ? '1px solid rgba(29,78,216,0.2)' : '1px solid transparent', '&:hover': { bgcolor: 'rgba(100,116,139,0.08)' }, transition: 'all 0.12s' }}>
//               <LinkIcon sx={{ fontSize: 15 }} />
//             </IconButton>
//           </span>
//         </Tooltip>
//         {editor.isActive('link') && <ToolbarButton label="Remove link" onClick={unsetLink}><LinkOff sx={{ fontSize: 15 }} /></ToolbarButton>}
//         <LinkDialog anchorEl={linkAnchor} onClose={() => setLinkAnchor(null)} onSet={setLink} onUnset={unsetLink} currentUrl={currentUrl} />
//         <ToolDivider />

//         {/* Alignment */}
//         <ToolbarButton label="Align left" active={editor.isActive({ textAlign: 'left' })} onClick={() => editor.chain().focus().setTextAlign('left').run()}><FormatAlignLeft sx={{ fontSize: 15 }} /></ToolbarButton>
//         <ToolbarButton label="Align center" active={editor.isActive({ textAlign: 'center' })} onClick={() => editor.chain().focus().setTextAlign('center').run()}><FormatAlignCenter sx={{ fontSize: 15 }} /></ToolbarButton>
//         <ToolbarButton label="Align right" active={editor.isActive({ textAlign: 'right' })} onClick={() => editor.chain().focus().setTextAlign('right').run()}><FormatAlignRight sx={{ fontSize: 15 }} /></ToolbarButton>
//         <ToolDivider />

//         {/* Lists & Blocks */}
//         <ToolbarButton label="Bullet list" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}><FormatListBulleted sx={{ fontSize: 15 }} /></ToolbarButton>
//         <ToolbarButton label="Numbered list" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}><FormatListNumbered sx={{ fontSize: 15 }} /></ToolbarButton>
//         <ToolbarButton label="Blockquote" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}><FormatQuote sx={{ fontSize: 15 }} /></ToolbarButton>
//         <ToolbarButton label="Code block" active={editor.isActive('codeBlock')} onClick={() => editor.chain().focus().toggleCodeBlock().run()}><Code sx={{ fontSize: 15 }} /></ToolbarButton>
//         <ToolbarButton label="Inline code" active={editor.isActive('code')} onClick={() => editor.chain().focus().toggleCode().run()}><CodeOff sx={{ fontSize: 15 }} /></ToolbarButton>
//         <ToolbarButton label="Horizontal rule" onClick={() => editor.chain().focus().setHorizontalRule().run()}><HorizontalRule sx={{ fontSize: 15 }} /></ToolbarButton>
//         <ToolDivider />

//         {/* Image: URL insert */}
//         <Tooltip title="Insert image from URL" placement="top" arrow>
//           <span ref={imageBtnRef}>
//             <IconButton size="small" onClick={() => setImageUrlAnchor(imageBtnRef.current)}
//               sx={{ borderRadius: '6px', width: 28, height: 28, color: '#64748B', border: '1px solid transparent', '&:hover': { bgcolor: 'rgba(100,116,139,0.08)', color: '#334155' }, transition: 'all 0.12s ease' }}>
//               <ImageIcon sx={{ fontSize: 15 }} />
//             </IconButton>
//           </span>
//         </Tooltip>
//         <ImageUrlDialog anchorEl={imageUrlAnchor} onClose={() => setImageUrlAnchor(null)} onInsert={insertImageUrl} />

//         {/* Image: upload from device → Cloudinary */}
//         <Tooltip title={uploadingImage ? 'Uploading…' : 'Upload image from device'} placement="top" arrow>
//           <span>
//             <IconButton
//               size="small"
//               disabled={uploadingImage}
//               onClick={() => imageFileRef.current?.click()}
//               sx={{ borderRadius: '6px', width: 28, height: 28, color: '#64748B', border: '1px solid transparent', '&:hover': { bgcolor: 'rgba(100,116,139,0.08)', color: '#334155' }, transition: 'all 0.12s ease' }}>
//               {uploadingImage
//                 ? <CircularProgress size={12} sx={{ color: '#64748B' }} />
//                 : <ImageIcon sx={{ fontSize: 15 }} />}
//             </IconButton>
//           </span>
//         </Tooltip>
//         {/* Hidden file input — triggers handleFileUpload which POSTs to /api/courses/upload-image */}
//         <input ref={imageFileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileUpload} />

//         {/* Chart */}
//         <ToolDivider />
//         <InsertChartButton editor={editor} />
//       </Box>

//       {/* ── Editor Body ── */}
//       <Box sx={{
//         px: 3, py: 2.5, minHeight: 260,
//         '& .tiptap': {
//           outline: 'none', fontSize: '0.9375rem', lineHeight: 1.8, color: '#334155',
//           fontFamily: "'DM Sans', sans-serif",
//           '& h1': { fontSize: '1.6rem', fontWeight: 800, color: '#0F172A', marginTop: '1.4em', marginBottom: '0.5em', lineHeight: 1.25, letterSpacing: '-0.025em', borderBottom: '2px solid #F1F5F9', paddingBottom: '0.35em' },
//           '& h2': { fontSize: '1.3rem', fontWeight: 700, color: '#0F172A', marginTop: '1.3em', marginBottom: '0.4em', lineHeight: 1.3, letterSpacing: '-0.02em' },
//           '& h3': { fontSize: '1.1rem', fontWeight: 700, color: '#1E293B', marginTop: '1.2em', marginBottom: '0.35em', lineHeight: 1.35 },
//           '& h4': { fontSize: '0.975rem', fontWeight: 700, color: '#334155', marginTop: '1em', marginBottom: '0.3em' },
//           '& p': { marginTop: 0, marginBottom: '0.9em', lineHeight: 1.8 },
//           '& p.is-editor-empty:first-child::before': { content: 'attr(data-placeholder)', color: '#CBD5E1', float: 'left', height: 0, pointerEvents: 'none' },
//           '& ul': { paddingLeft: '1.4rem', marginBottom: '0.9em', listStyleType: 'none' },
//           '& ul li': { position: 'relative', paddingLeft: '0.5rem', marginBottom: '0.35em' },
//           '& ol': { paddingLeft: '1.5rem', marginBottom: '0.9em' },
//           '& ol li': { marginBottom: '0.35em' },
//           '& li p': { marginBottom: '0.2em' },
//           '& blockquote': { borderLeft: '3px solid #1D4ED8', backgroundColor: '#F0F7FF', paddingLeft: '1rem', paddingRight: '0.75rem', paddingTop: '0.6rem', paddingBottom: '0.6rem', marginLeft: 0, marginTop: '1em', marginBottom: '1em', borderRadius: '0 8px 8px 0', color: '#1E40AF', fontStyle: 'italic' },
//           '& blockquote p': { marginBottom: 0 },
//           '& code': { backgroundColor: '#F1F5F9', color: '#1D4ED8', padding: '0.15em 0.4em', borderRadius: '4px', fontSize: '0.85em', fontFamily: "'JetBrains Mono', 'Fira Code', monospace", border: '1px solid #E2E8F0' },
//           '& pre': { backgroundColor: '#0F172A', borderRadius: '10px', padding: '1rem 1.25rem', marginTop: '1em', marginBottom: '1em', overflowX: 'auto' },
//           '& pre code': { color: '#94A3B8', backgroundColor: 'transparent', border: 'none', padding: 0, fontSize: '0.875rem' },
//           '& mark': { borderRadius: '3px', padding: '0 0.2em' },
//           '& hr': { border: 'none', borderTop: '2px solid #F1F5F9', marginTop: '1.5em', marginBottom: '1.5em' },
//           '& a.tiptap-link': { color: '#1D4ED8', textDecoration: 'none', borderBottom: '1.5px solid rgba(29,78,216,0.3)', cursor: 'pointer' },
//           '& strong': { fontWeight: 700, color: 'inherit' },
//           '& em': { fontStyle: 'italic' },
//           '& img': {
//             maxWidth: '100%', height: 'auto',
//             borderRadius: '8px', marginTop: '0.75em', marginBottom: '0.75em',
//             display: 'block',
//             '&.ProseMirror-selectednode': { outline: '2px solid #1D4ED8', outlineOffset: '2px' },
//           },
//         },
//       }}>
//         <EditorContent editor={editor} />
//       </Box>

//       {/* ── Footer ── */}
//       <Box sx={{ px: 3, py: 0.75, borderTop: '1px solid #F8FAFC', display: 'flex', justifyContent: 'flex-end', bgcolor: '#FAFBFD' }}>
//         <Box sx={{ fontSize: '0.7rem', color: '#CBD5E1', fontFamily: "'DM Sans', sans-serif" }}>
//           {editor.getText().length} chars
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// export default Editor;




import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import Color from '@tiptap/extension-color';
import FontFamily from '@tiptap/extension-font-family';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { Extension } from '@tiptap/core';
import {
    Box, Divider, Tooltip, IconButton,
    Popover, TextField, Button, MenuItem, Select,
    CircularProgress,
} from '@mui/material';
import {
    FormatBold, FormatItalic, FormatUnderlined, StrikethroughS,
    FormatListBulleted, FormatListNumbered, FormatQuote, Code,
    FormatAlignLeft, FormatAlignCenter, FormatAlignRight,
    Highlight as HighlightIcon, Undo, Redo, HorizontalRule,
    Link as LinkIcon, LinkOff, FormatColorText, CodeOff,
    Image as ImageIcon,
} from '@mui/icons-material';
import React, { useState, useCallback, useRef } from 'react';
import { TextStyle } from '@tiptap/extension-text-style';
import { ChartExtension, InsertChartButton } from './other/ChartExtension';
import { courseService } from '../services/api';

// ─── FontSize extension ──────────────────────────────────────────────────────
const FontSize = Extension.create({
    name: 'fontSize',
    addOptions() { return { types: ['textStyle'] }; },
    addGlobalAttributes() {
        return [{
            types: this.options.types,
            attributes: {
                fontSize: {
                    default: null,
                    parseHTML: (el: HTMLElement) => el.style.fontSize?.replace('px', '') || null,
                    renderHTML: (attrs: Record<string, any>) =>
                        attrs.fontSize ? { style: `font-size: ${attrs.fontSize}px` } : {},
                },
            },
        }];
    },
    addCommands() {
        return {
            setFontSize: (size: string) => ({ chain }: any) =>
                chain().extendMarkRange('textStyle').setMark('textStyle', { fontSize: size }).run(),
            unsetFontSize: () => ({ chain }: any) =>
                chain().extendMarkRange('textStyle').setMark('textStyle', { fontSize: null }).removeEmptyTextStyle().run(),
        } as any;
    },
});

interface EditorProps {
    value: string;
    onChange: (html: string) => void;
    // Pass your API base URL, e.g. "https://api.myapp.com"
    apiBaseUrl?: string;
}

// ─── Toolbar button ──────────────────────────────────────────────────────────
const ToolbarButton = ({
    label, active, onClick, children, disabled,
}: {
    label: string; active?: boolean;
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
    children: React.ReactNode; disabled?: boolean;
}) => (
    <Tooltip title={label} placement="top" arrow>
        <span>
            <IconButton size="small" onClick={onClick} disabled={disabled} sx={{
                borderRadius: '6px', width: 28, height: 28,
                color: active ? '#1D4ED8' : '#64748B',
                bgcolor: active ? 'rgba(29,78,216,0.08)' : 'transparent',
                border: active ? '1px solid rgba(29,78,216,0.2)' : '1px solid transparent',
                '&:hover': { bgcolor: active ? 'rgba(29,78,216,0.12)' : 'rgba(100,116,139,0.08)', color: active ? '#1D4ED8' : '#334155' },
                transition: 'all 0.12s ease',
            }}>
                {children}
            </IconButton>
        </span>
    </Tooltip>
);

const ToolDivider = () => (
    <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: 0.5, borderColor: '#E2E8F0' }} />
);

// ─── Palettes ────────────────────────────────────────────────────────────────
const TEXT_COLORS = [
    { label: 'Default', value: '' },
    { label: 'Black', value: '#0F172A' },
    { label: 'Dark Gray', value: '#475569' },
    { label: 'Gray', value: '#94A3B8' },
    { label: 'Red', value: '#DC2626' },
    { label: 'Orange', value: '#EA580C' },
    { label: 'Amber', value: '#D97706' },
    { label: 'Green', value: '#16A34A' },
    { label: 'Teal', value: '#0D9488' },
    { label: 'Blue', value: '#1D4ED8' },
    { label: 'Indigo', value: '#4F46E5' },
    { label: 'Purple', value: '#7C3AED' },
    { label: 'Pink', value: '#DB2777' },
    { label: 'Rose', value: '#E11D48' },
    { label: 'Cyan', value: '#0891B2' },
    { label: 'Lime', value: '#65A30D' },
];

const HIGHLIGHT_COLORS = [
    { label: 'None', value: '' },
    { label: 'Yellow', value: '#FEF08A' },
    { label: 'Green', value: '#BBF7D0' },
    { label: 'Blue', value: '#BFDBFE' },
    { label: 'Pink', value: '#FBCFE8' },
    { label: 'Orange', value: '#FED7AA' },
    { label: 'Purple', value: '#E9D5FF' },
    { label: 'Cyan', value: '#A5F3FC' },
    { label: 'Red', value: '#FECACA' },
];

const FONT_FAMILIES = [
    { label: 'Default', value: '' },
    { label: 'Serif', value: 'Georgia, serif' },
    { label: 'Mono', value: "'Courier New', monospace" },
    { label: 'DM Sans', value: "'DM Sans', sans-serif" },
    { label: 'Playfair', value: "'Playfair Display', serif" },
    { label: 'Sora', value: "'Sora', sans-serif" },
];

const FONT_SIZES = ['12', '14', '16', '18', '20', '24', '28', '32', '36', '48'];

// ─── Color Swatch Popover ────────────────────────────────────────────────────
const ColorPicker = ({
    anchorEl, onClose, colors, onSelect, title,
}: {
    anchorEl: HTMLElement | null;
    onClose: () => void;
    colors: { label: string; value: string }[];
    onSelect: (val: string) => void;
    title: string;
}) => (
    <Popover open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={onClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{ paper: { sx: { mt: 0.5, p: 1.5, borderRadius: '10px', border: '1px solid #E2E8F0', boxShadow: '0 8px 24px rgba(15,23,42,0.12)', minWidth: 180 } } }}>
        <Box sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#94A3B8', mb: 1, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{title}</Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {colors.map(c => (
                <Tooltip key={c.value || 'none'} title={c.label} placement="top" arrow>
                    <Box onClick={() => { onSelect(c.value); onClose(); }}
                        sx={{
                            width: 22, height: 22, borderRadius: '5px',
                            bgcolor: c.value || '#F1F5F9',
                            border: c.value ? '1.5px solid rgba(0,0,0,0.1)' : '1.5px dashed #CBD5E1',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            '&:hover': { transform: 'scale(1.2)', boxShadow: '0 2px 6px rgba(0,0,0,0.15)' },
                            transition: 'all 0.12s ease',
                        }}>
                        {!c.value && <Box sx={{ width: '70%', height: '1.5px', bgcolor: '#DC2626', transform: 'rotate(-45deg)', borderRadius: 1 }} />}
                    </Box>
                </Tooltip>
            ))}
        </Box>
    </Popover>
);

// ─── Link Popover ────────────────────────────────────────────────────────────
const LinkDialog = ({
    anchorEl, onClose, onSet, onUnset, currentUrl,
}: {
    anchorEl: HTMLElement | null;
    onClose: () => void;
    onSet: (url: string) => void;
    onUnset: () => void;
    currentUrl: string;
}) => {
    const [url, setUrl] = useState(currentUrl);
    return (
        <Popover open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={onClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            slotProps={{ paper: { sx: { mt: 0.5, p: 2, borderRadius: '10px', border: '1px solid #E2E8F0', boxShadow: '0 8px 24px rgba(15,23,42,0.12)', minWidth: 280 } } }}>
            <Box sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#94A3B8', mb: 1.25, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Insert Link</Box>
            <TextField fullWidth size="small" placeholder="https://example.com" value={url}
                onChange={e => setUrl(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { onSet(url); onClose(); } }}
                autoFocus sx={{ mb: 1.25, '& .MuiOutlinedInput-root': { borderRadius: '8px', fontSize: '0.85rem' } }} />
            <Box sx={{ display: 'flex', gap: 1 }}>
                <Button size="small" variant="contained" disableElevation onClick={() => { onSet(url); onClose(); }}
                    sx={{ borderRadius: '7px', textTransform: 'none', fontSize: '0.8rem', bgcolor: '#1D4ED8', flex: 1 }}>Apply</Button>
                {currentUrl && (
                    <Button size="small" variant="outlined" color="error" onClick={() => { onUnset(); onClose(); }}
                        sx={{ borderRadius: '7px', textTransform: 'none', fontSize: '0.8rem' }}>Remove</Button>
                )}
            </Box>
        </Popover>
    );
};

// ─── Image URL dialog ────────────────────────────────────────────────────────
const ImageUrlDialog = ({
    anchorEl, onClose, onInsert,
}: {
    anchorEl: HTMLElement | null;
    onClose: () => void;
    onInsert: (src: string, alt: string) => void;
}) => {
    const [src, setSrc] = useState('');
    const [alt, setAlt] = useState('');
    return (
        <Popover open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={onClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            slotProps={{ paper: { sx: { mt: 0.5, p: 2, borderRadius: '10px', border: '1px solid #E2E8F0', boxShadow: '0 8px 24px rgba(15,23,42,0.12)', minWidth: 320 } } }}>
            <Box sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#94A3B8', mb: 1.25, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Insert Image by URL</Box>
            <TextField fullWidth size="small" placeholder="https://example.com/image.jpg" value={src}
                onChange={e => setSrc(e.target.value)} label="Image URL" autoFocus
                sx={{ mb: 1, '& .MuiOutlinedInput-root': { borderRadius: '8px', fontSize: '0.85rem' } }} />
            <TextField fullWidth size="small" placeholder="Description" value={alt}
                onChange={e => setAlt(e.target.value)} label="Alt text (optional)"
                onKeyDown={e => { if (e.key === 'Enter' && src) { onInsert(src, alt); onClose(); } }}
                sx={{ mb: 1.25, '& .MuiOutlinedInput-root': { borderRadius: '8px', fontSize: '0.85rem' } }} />
            <Button fullWidth size="small" variant="contained" disableElevation
                disabled={!src}
                onClick={() => { onInsert(src, alt); onClose(); setSrc(''); setAlt(''); }}
                sx={{ borderRadius: '7px', textTransform: 'none', fontSize: '0.8rem', bgcolor: '#1D4ED8' }}>
                Insert Image
            </Button>
        </Popover>
    );
};

// ═══════════════════════════════════════════════════════
//  Main Editor Component
// ═══════════════════════════════════════════════════════
const Editor = ({ value, onChange, apiBaseUrl = '' }: EditorProps) => {
    const [textColorAnchor, setTextColorAnchor] = useState<HTMLElement | null>(null);
    const [highlightAnchor, setHighlightAnchor] = useState<HTMLElement | null>(null);
    const [linkAnchor, setLinkAnchor] = useState<HTMLElement | null>(null);
    const [imageUrlAnchor, setImageUrlAnchor] = useState<HTMLElement | null>(null);
    // Tracks whether a device-file upload is in progress (uploading to Cloudinary)
    const [uploadingImage, setUploadingImage] = useState(false);

    const textColorBtnRef = useRef<HTMLButtonElement>(null);
    const highlightBtnRef = useRef<HTMLButtonElement>(null);
    const linkBtnRef = useRef<HTMLSpanElement>(null);
    const imageBtnRef = useRef<HTMLSpanElement>(null);
    const imageFileRef = useRef<HTMLInputElement>(null);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({}),
            Underline,
            TextStyle,
            Color,
            FontFamily,
            FontSize,
            Highlight.configure({ multicolor: true }),
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Link.configure({ openOnClick: false, HTMLAttributes: { class: 'tiptap-link' } }),
            // allowBase64: false — we never embed base64; everything goes through Cloudinary
            Image.configure({ inline: false, allowBase64: false }),
            ChartExtension,
        ],
        content: value,
        onUpdate: ({ editor }) => onChange(editor.getHTML()),
    });

    const setLink = useCallback((url: string) => {
        if (!editor) return;
        if (!url) { editor.chain().focus().unsetLink().run(); return; }
        const href = url.startsWith('http') ? url : `https://${url}`;
        editor.chain().focus().extendMarkRange('link').setLink({ href, target: '_blank' }).run();
    }, [editor]);

    const unsetLink = useCallback(() => editor?.chain().focus().unsetLink().run(), [editor]);

    // Insert an image by URL (e.g. external URL or already-hosted URL)
    const insertImageUrl = useCallback((src: string, alt: string) => {
        editor?.chain().focus().setImage({ src, alt }).run();
    }, [editor]);

    // ── KEY CHANGE: upload to Cloudinary, insert the returned secure_url ────
    // The base64 approach stuffed potentially large blobs into the HTML content
    // string, which grows the DB document and slows transfers. Now we POST the
    // file to the backend, get a Cloudinary URL back, and insert only that URL.
    const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !editor) return;

        // Reset immediately so the same file can be selected again
        e.target.value = '';

        setUploadingImage(true);
        try {
            // Use the courseService instead of the raw fetch API
            const data = await courseService.uploadImage(file);

            // Access the url returned from your service
            const url = data.url;

            // Insert the Cloudinary URL into the editor
            editor.chain().focus().setImage({ src: url, alt: file.name }).run();
        } catch (err: any) {
            console.error('Image upload error:', err);

            // Handle axios/apiClient errors vs normal errors elegantly
            const errorMessage = err.response?.data?.message ?? err.message ?? 'Upload failed';
            alert(`Image upload failed: ${errorMessage}`);
        } finally {
            setUploadingImage(false);
        }
    }, [editor]); // Notice you no longer need apiBaseUrl in the dependency array!

    if (!editor) return null;

    const currentUrl = editor.getAttributes('link').href || '';
    const activeTextColor = editor.getAttributes('textStyle').color || '#0F172A';
    const activeHighlightColor = editor.getAttributes('highlight').color || '#FEF08A';

    return (
        <Box sx={{
            border: '1px solid #E2E8F0', borderRadius: '12px', overflow: 'hidden',
            bgcolor: '#fff', boxShadow: '0 1px 3px rgba(15,23,42,0.06)',
            '&:focus-within': { borderColor: '#93C5FD', boxShadow: '0 0 0 3px rgba(29,78,216,0.08)' },
            transition: 'border-color 0.15s, box-shadow 0.15s',
        }}>

            {/* ── Toolbar ── */}
            <Box sx={{
                display: 'flex', flexWrap: 'wrap', alignItems: 'center',
                gap: 0.25, px: 1.25, py: 0.75,
                borderBottom: '1px solid #F1F5F9', bgcolor: '#FAFBFD',
            }}>

                {/* History */}
                <ToolbarButton label="Undo (Ctrl+Z)" onClick={() => editor.chain().focus().undo().run()}><Undo sx={{ fontSize: 15 }} /></ToolbarButton>
                <ToolbarButton label="Redo (Ctrl+Y)" onClick={() => editor.chain().focus().redo().run()}><Redo sx={{ fontSize: 15 }} /></ToolbarButton>
                <ToolDivider />

                {/* Headings */}
                {(['Normal', 'H1', 'H2', 'H3'] as const).map(level => {
                    const isActive = level !== 'Normal' && editor.isActive('heading', { level: Number(level.slice(1)) as 1 | 2 | 3 });
                    return (
                        <Tooltip key={level} title={level === 'Normal' ? 'Normal text' : `Heading ${level.slice(1)}`} placement="top" arrow>
                            <Box component="button"
                                onClick={() => level === 'Normal'
                                    ? editor.chain().focus().setParagraph().run()
                                    : editor.chain().focus().toggleHeading({ level: Number(level.slice(1)) as 1 | 2 | 3 }).run()}
                                sx={{
                                    fontSize: '11px', fontWeight: 700, px: 0.875, height: 28, borderRadius: '6px',
                                    border: isActive ? '1px solid rgba(29,78,216,0.2)' : '1px solid transparent',
                                    cursor: 'pointer',
                                    bgcolor: isActive ? 'rgba(29,78,216,0.08)' : 'transparent',
                                    color: isActive ? '#1D4ED8' : '#64748B',
                                    fontFamily: 'inherit',
                                    '&:hover': { bgcolor: 'rgba(100,116,139,0.08)', color: '#334155' },
                                    transition: 'all 0.12s ease',
                                }}>
                                {level}
                            </Box>
                        </Tooltip>
                    );
                })}
                <ToolDivider />

                {/* Font Family */}
                <Tooltip title="Font family" placement="top" arrow>
                    <Select size="small" value={editor.getAttributes('textStyle').fontFamily || ''}
                        onChange={e => {
                            const v = e.target.value;
                            if (!v) editor.chain().focus().unsetFontFamily().run();
                            else editor.chain().focus().setFontFamily(v).run();
                        }}
                        displayEmpty
                        sx={{ height: 28, fontSize: '11px', fontWeight: 600, color: '#64748B', borderRadius: '6px', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#E2E8F0' }, '& .MuiSelect-select': { py: 0, px: 1, pr: '24px !important' }, minWidth: 80 }}>
                        {FONT_FAMILIES.map(f => <MenuItem key={f.value} value={f.value} sx={{ fontSize: '12px', fontFamily: f.value || 'inherit' }}>{f.label}</MenuItem>)}
                    </Select>
                </Tooltip>

                {/* Font Size */}
                <Tooltip title="Font size" placement="top" arrow>
                    <Select size="small" value={editor.getAttributes('textStyle').fontSize || ''}
                        onChange={e => {
                            const v = e.target.value;
                            if (!v) (editor.chain().focus() as any).unsetFontSize().run();
                            else (editor.chain().focus() as any).setFontSize(v).run();
                        }}
                        displayEmpty
                        sx={{ height: 28, fontSize: '11px', fontWeight: 600, color: '#64748B', borderRadius: '6px', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#E2E8F0' }, '& .MuiSelect-select': { py: 0, px: 1, pr: '24px !important' }, minWidth: 60 }}>
                        <MenuItem value="" sx={{ fontSize: '12px' }}>Size</MenuItem>
                        {FONT_SIZES.map(s => <MenuItem key={s} value={s} sx={{ fontSize: '12px' }}>{s}px</MenuItem>)}
                    </Select>
                </Tooltip>
                <ToolDivider />

                {/* Text Formatting */}
                <ToolbarButton label="Bold (Ctrl+B)" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}><FormatBold sx={{ fontSize: 15 }} /></ToolbarButton>
                <ToolbarButton label="Italic (Ctrl+I)" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}><FormatItalic sx={{ fontSize: 15 }} /></ToolbarButton>
                <ToolbarButton label="Underline (Ctrl+U)" active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()}><FormatUnderlined sx={{ fontSize: 15 }} /></ToolbarButton>
                <ToolbarButton label="Strikethrough" active={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()}><StrikethroughS sx={{ fontSize: 15 }} /></ToolbarButton>
                <ToolDivider />

                {/* Text Color */}
                <Tooltip title="Text color" placement="top" arrow>
                    <Box component="button" ref={textColorBtnRef} onClick={() => setTextColorAnchor(textColorBtnRef.current)}
                        sx={{ width: 28, height: 28, borderRadius: '6px', border: '1px solid transparent', cursor: 'pointer', bgcolor: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '2px', p: 0, '&:hover': { bgcolor: 'rgba(100,116,139,0.08)' }, transition: 'all 0.12s' }}>
                        <FormatColorText sx={{ fontSize: 15, color: '#64748B' }} />
                        <Box sx={{ width: 16, height: 3, borderRadius: '1px', bgcolor: activeTextColor, border: '1px solid rgba(0,0,0,0.12)' }} />
                    </Box>
                </Tooltip>
                <ColorPicker anchorEl={textColorAnchor} onClose={() => setTextColorAnchor(null)} colors={TEXT_COLORS} title="Text Color"
                    onSelect={val => {
                        if (!val) editor.chain().focus().extendMarkRange('textStyle').unsetColor().run();
                        else editor.chain().focus().extendMarkRange('textStyle').setColor(val).run();
                    }} />

                {/* Highlight Color */}
                <Tooltip title="Highlight color" placement="top" arrow>
                    <Box component="button" ref={highlightBtnRef} onClick={() => setHighlightAnchor(highlightBtnRef.current)}
                        sx={{ width: 28, height: 28, borderRadius: '6px', border: editor.isActive('highlight') ? '1px solid rgba(29,78,216,0.2)' : '1px solid transparent', cursor: 'pointer', bgcolor: editor.isActive('highlight') ? 'rgba(29,78,216,0.08)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '2px', p: 0, '&:hover': { bgcolor: 'rgba(100,116,139,0.08)' }, transition: 'all 0.12s' }}>
                        <HighlightIcon sx={{ fontSize: 15, color: editor.isActive('highlight') ? '#1D4ED8' : '#64748B' }} />
                        <Box sx={{ width: 16, height: 3, borderRadius: '1px', bgcolor: activeHighlightColor, border: '1px solid rgba(0,0,0,0.12)' }} />
                    </Box>
                </Tooltip>
                <ColorPicker anchorEl={highlightAnchor} onClose={() => setHighlightAnchor(null)} colors={HIGHLIGHT_COLORS} title="Highlight Color"
                    onSelect={val => {
                        if (!val) editor.chain().focus().unsetHighlight().run();
                        else editor.chain().focus().toggleHighlight({ color: val }).run();
                    }} />
                <ToolDivider />

                {/* Link */}
                <Tooltip title={editor.isActive('link') ? 'Edit link' : 'Add link'} placement="top" arrow>
                    <span ref={linkBtnRef}>
                        <IconButton size="small" onClick={() => setLinkAnchor(linkBtnRef.current)}
                            sx={{ borderRadius: '6px', width: 28, height: 28, color: editor.isActive('link') ? '#1D4ED8' : '#64748B', bgcolor: editor.isActive('link') ? 'rgba(29,78,216,0.08)' : 'transparent', border: editor.isActive('link') ? '1px solid rgba(29,78,216,0.2)' : '1px solid transparent', '&:hover': { bgcolor: 'rgba(100,116,139,0.08)' }, transition: 'all 0.12s' }}>
                            <LinkIcon sx={{ fontSize: 15 }} />
                        </IconButton>
                    </span>
                </Tooltip>
                {editor.isActive('link') && <ToolbarButton label="Remove link" onClick={unsetLink}><LinkOff sx={{ fontSize: 15 }} /></ToolbarButton>}
                <LinkDialog anchorEl={linkAnchor} onClose={() => setLinkAnchor(null)} onSet={setLink} onUnset={unsetLink} currentUrl={currentUrl} />
                <ToolDivider />

                {/* Alignment */}
                <ToolbarButton label="Align left" active={editor.isActive({ textAlign: 'left' })} onClick={() => editor.chain().focus().setTextAlign('left').run()}><FormatAlignLeft sx={{ fontSize: 15 }} /></ToolbarButton>
                <ToolbarButton label="Align center" active={editor.isActive({ textAlign: 'center' })} onClick={() => editor.chain().focus().setTextAlign('center').run()}><FormatAlignCenter sx={{ fontSize: 15 }} /></ToolbarButton>
                <ToolbarButton label="Align right" active={editor.isActive({ textAlign: 'right' })} onClick={() => editor.chain().focus().setTextAlign('right').run()}><FormatAlignRight sx={{ fontSize: 15 }} /></ToolbarButton>
                <ToolDivider />

                {/* Lists & Blocks */}
                <ToolbarButton label="Bullet list" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}><FormatListBulleted sx={{ fontSize: 15 }} /></ToolbarButton>
                <ToolbarButton label="Numbered list" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}><FormatListNumbered sx={{ fontSize: 15 }} /></ToolbarButton>
                <ToolbarButton label="Blockquote" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}><FormatQuote sx={{ fontSize: 15 }} /></ToolbarButton>
                <ToolbarButton label="Code block" active={editor.isActive('codeBlock')} onClick={() => editor.chain().focus().toggleCodeBlock().run()}><Code sx={{ fontSize: 15 }} /></ToolbarButton>
                <ToolbarButton label="Inline code" active={editor.isActive('code')} onClick={() => editor.chain().focus().toggleCode().run()}><CodeOff sx={{ fontSize: 15 }} /></ToolbarButton>
                <ToolbarButton label="Horizontal rule" onClick={() => editor.chain().focus().setHorizontalRule().run()}><HorizontalRule sx={{ fontSize: 15 }} /></ToolbarButton>
                <ToolDivider />

                {/* Image: URL insert */}
                <Tooltip title="Insert image from URL" placement="top" arrow>
                    <span ref={imageBtnRef}>
                        <IconButton size="small" onClick={() => setImageUrlAnchor(imageBtnRef.current)}
                            sx={{ borderRadius: '6px', width: 28, height: 28, color: '#64748B', border: '1px solid transparent', '&:hover': { bgcolor: 'rgba(100,116,139,0.08)', color: '#334155' }, transition: 'all 0.12s ease' }}>
                            <ImageIcon sx={{ fontSize: 15 }} />
                        </IconButton>
                    </span>
                </Tooltip>
                <ImageUrlDialog anchorEl={imageUrlAnchor} onClose={() => setImageUrlAnchor(null)} onInsert={insertImageUrl} />

                {/* Image: upload from device → Cloudinary */}
                <Tooltip title={uploadingImage ? 'Uploading…' : 'Upload image from device'} placement="top" arrow>
                    <span>
                        <IconButton
                            size="small"
                            disabled={uploadingImage}
                            onClick={() => imageFileRef.current?.click()}
                            sx={{ borderRadius: '6px', width: 28, height: 28, color: '#64748B', border: '1px solid transparent', '&:hover': { bgcolor: 'rgba(100,116,139,0.08)', color: '#334155' }, transition: 'all 0.12s ease' }}>
                            {uploadingImage
                                ? <CircularProgress size={12} sx={{ color: '#64748B' }} />
                                : <ImageIcon sx={{ fontSize: 15 }} />}
                        </IconButton>
                    </span>
                </Tooltip>
                {/* Hidden file input — triggers handleFileUpload which POSTs to /api/courses/upload-image */}
                <input ref={imageFileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileUpload} />

                {/* Chart */}
                <ToolDivider />
                <InsertChartButton editor={editor} />
            </Box>

            {/* ── Editor Body ── */}
            <Box sx={{
                px: 3, py: 2.5, minHeight: 260,
                '& .tiptap': {
                    outline: 'none', fontSize: '0.9375rem', lineHeight: 1.8, color: '#334155',
                    fontFamily: "'DM Sans', sans-serif",
                    '& h1': { fontSize: '1.6rem', fontWeight: 800, color: '#0F172A', marginTop: '1.4em', marginBottom: '0.5em', lineHeight: 1.25, letterSpacing: '-0.025em', borderBottom: '2px solid #F1F5F9', paddingBottom: '0.35em' },
                    '& h2': { fontSize: '1.3rem', fontWeight: 700, color: '#0F172A', marginTop: '1.3em', marginBottom: '0.4em', lineHeight: 1.3, letterSpacing: '-0.02em' },
                    '& h3': { fontSize: '1.1rem', fontWeight: 700, color: '#1E293B', marginTop: '1.2em', marginBottom: '0.35em', lineHeight: 1.35 },
                    '& h4': { fontSize: '0.975rem', fontWeight: 700, color: '#334155', marginTop: '1em', marginBottom: '0.3em' },
                    '& p': { marginTop: 0, marginBottom: '0.9em', lineHeight: 1.8 },
                    '& p.is-editor-empty:first-child::before': { content: 'attr(data-placeholder)', color: '#CBD5E1', float: 'left', height: 0, pointerEvents: 'none' },
                    '& ul': { paddingLeft: '1.4rem', marginBottom: '0.9em', listStyleType: 'none' },
                    '& ul li': { position: 'relative', paddingLeft: '0.5rem', marginBottom: '0.35em' },
                    '& ol': { paddingLeft: '1.5rem', marginBottom: '0.9em' },
                    '& ol li': { marginBottom: '0.35em' },
                    '& li p': { marginBottom: '0.2em' },
                    '& blockquote': { borderLeft: '3px solid #1D4ED8', backgroundColor: '#F0F7FF', paddingLeft: '1rem', paddingRight: '0.75rem', paddingTop: '0.6rem', paddingBottom: '0.6rem', marginLeft: 0, marginTop: '1em', marginBottom: '1em', borderRadius: '0 8px 8px 0', color: '#1E40AF', fontStyle: 'italic' },
                    '& blockquote p': { marginBottom: 0 },
                    '& code': { backgroundColor: '#F1F5F9', color: '#1D4ED8', padding: '0.15em 0.4em', borderRadius: '4px', fontSize: '0.85em', fontFamily: "'JetBrains Mono', 'Fira Code', monospace", border: '1px solid #E2E8F0' },
                    '& pre': { backgroundColor: '#0F172A', borderRadius: '10px', padding: '1rem 1.25rem', marginTop: '1em', marginBottom: '1em', overflowX: 'auto' },
                    '& pre code': { color: '#94A3B8', backgroundColor: 'transparent', border: 'none', padding: 0, fontSize: '0.875rem' },
                    '& mark': { borderRadius: '3px', padding: '0 0.2em' },
                    '& hr': { border: 'none', borderTop: '2px solid #F1F5F9', marginTop: '1.5em', marginBottom: '1.5em' },
                    '& a.tiptap-link': { color: '#1D4ED8', textDecoration: 'none', borderBottom: '1.5px solid rgba(29,78,216,0.3)', cursor: 'pointer' },
                    '& strong': { fontWeight: 700, color: 'inherit' },
                    '& em': { fontStyle: 'italic' },
                    '& img': {
                        maxWidth: '100%', height: 'auto',
                        borderRadius: '8px', marginTop: '0.75em', marginBottom: '0.75em',
                        display: 'block',
                        '&.ProseMirror-selectednode': { outline: '2px solid #1D4ED8', outlineOffset: '2px' },
                    },
                },
            }}>
                <EditorContent editor={editor} />
            </Box>

            {/* ── Footer ── */}
            <Box sx={{ px: 3, py: 0.75, borderTop: '1px solid #F8FAFC', display: 'flex', justifyContent: 'flex-end', bgcolor: '#FAFBFD' }}>
                <Box sx={{ fontSize: '0.7rem', color: '#CBD5E1', fontFamily: "'DM Sans', sans-serif" }}>
                    {editor.getText().length} chars
                </Box>
            </Box>
        </Box>
    );
};

export default Editor;