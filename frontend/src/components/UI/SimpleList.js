import React from 'react';

const SimpleList = ({ items, renderItem, className = '' }) => {
  return (
    <div className={`simple-list ${className}`}>
      {items.map((item, index) => renderItem(item, index))}
    </div>
  );
};

export default SimpleList;
