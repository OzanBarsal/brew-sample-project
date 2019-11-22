import React from 'react';
import './styles.scss';
import Cell from './Cell';

const Column = ({ columnData }) => {
  console.log('Column data : ', columnData);
  const getRandomColor = () => {
    return (
      '#' + Math.floor((0.2 + Math.random() * 0.6) * 16777215).toString(16)
    );
  };
  columnData.sort((a, b) => a.first_publish_year - b.first_publish_year);
  return (
    <div className="column-container">
      <div className="top-bar" style={{ backgroundColor: getRandomColor() }} />
      <div className="title">{columnData[0].last_publish_year}</div>
      <div className="cells-container">
        {columnData.map(value => {
          return <Cell key={value.title} cellData={value} />;
        })}
      </div>
    </div>
  );
};

export default Column;
