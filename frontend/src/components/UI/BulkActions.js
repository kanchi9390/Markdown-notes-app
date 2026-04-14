import React from 'react';

const BulkActions = ({ 
  selectedCount, 
  totalCount, 
  onSelectAll, 
  onClearSelection, 
  onDeleteSelected, 
  onCancelBulkMode,
  loading 
}) => {
  const isAllSelected = selectedCount === totalCount && totalCount > 0;

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedCount} note${selectedCount > 1 ? 's' : ''}? This action cannot be undone.`)) {
      onDeleteSelected();
    }
  };

  return (
    <div className="bulk-actions">
      <div className="bulk-actions__info">
        <span>{selectedCount} of {totalCount} selected</span>
      </div>
      <div className="bulk-actions__buttons">
        <button
          className="bulk-btn"
          onClick={isAllSelected ? onClearSelection : onSelectAll}
          disabled={loading}
        >
          {isAllSelected ? 'Deselect All' : 'Select All'}
        </button>
        <button
          className="bulk-btn bulk-btn--danger"
          onClick={handleDelete}
          disabled={loading || selectedCount === 0}
        >
          Delete {selectedCount > 0 && `(${selectedCount})`}
        </button>
        <button
          className="bulk-btn"
          onClick={onCancelBulkMode}
          disabled={loading}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default BulkActions;
