import React, { useState } from 'react';
import { downloadMarkdown, downloadHTML } from '../../utils/exportUtils';

const ExportButton = ({ note, disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleExport = () => {
    if (note) {
      downloadMarkdown(note);
    }
  };


  if (!note) {
    return null;
  }

  return (
    <button
      className="export-btn"
      onClick={handleExport}
      disabled={disabled}
      title="Export note as Markdown"
    >
      📄 Export
    </button>
  );
};

export default ExportButton;
