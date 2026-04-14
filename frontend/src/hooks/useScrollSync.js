import { useEffect, useRef } from 'react';

export const useScrollSync = () => {
  const editorRef = useRef(null);
  const previewRef = useRef(null);

  useEffect(() => {
    const editor = editorRef.current;
    const preview = previewRef.current;
    
    if (!editor || !preview) return;

    const handleEditorScroll = () => {
      const editorScrollPercentage = 
        (editor.scrollTop / (editor.scrollHeight - editor.clientHeight)) * 100;
      
      const previewScrollTarget = 
        (preview.scrollHeight * editorScrollPercentage) / 100;
      
      preview.scrollTop = previewScrollTarget;
    };

    const handlePreviewScroll = () => {
      const previewScrollPercentage = 
        (preview.scrollTop / (preview.scrollHeight - preview.clientHeight)) * 100;
      
      const editorScrollTarget = 
        (editor.scrollHeight * previewScrollPercentage) / 100;
      
      editor.scrollTop = editorScrollTarget;
    };

    // Add scroll listeners
    editor.addEventListener('scroll', handleEditorScroll);
    preview.addEventListener('scroll', handlePreviewScroll);

    // Cleanup
    return () => {
      editor.removeEventListener('scroll', handleEditorScroll);
      preview.removeEventListener('scroll', handlePreviewScroll);
    };
  }, []);

  return {
    editorRef,
    previewRef
  };
};
