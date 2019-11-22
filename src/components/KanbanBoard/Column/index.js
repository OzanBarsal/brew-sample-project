import React from 'react';
import './styles.scss';
import Cell from './Cell';

const Column = ({ columnData }) => {
  console.log('Column data : ', columnData);
  const getRandomColor = () => {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
  };
  columnData.sort((a, b) => a.first_publish_year - b.first_publish_year);
  return (
    <div className="column-container">
      <div className="top-bar" style={{ backgroundColor: getRandomColor() }} />
      <div className="title">{columnData[0].last_publish_year}</div>
      {columnData.map(value => {
        return <Cell key={value.title} cellData={value} />;
      })}
    </div>
  );
};

export default Column;
