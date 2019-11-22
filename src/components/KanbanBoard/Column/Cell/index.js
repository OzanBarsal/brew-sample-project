import React from 'react';
import './styles.scss';

const Cell = ({ cellData }) => {
  return (
    <div className="cell-container">
      <div className="vert">
        <div className="title">{cellData.title}</div>
      </div>
      <div className="vert">
        <div className="light-text">
          First Published: {cellData.first_publish_year}
        </div>
        <div className="light-text">Editions: {cellData.edition_count}</div>
      </div>
    </div>
  );
};

export default Cell;
