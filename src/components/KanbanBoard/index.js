import React from 'react';
import './styles.scss';
import Column from './Column';

const KanbanBoard = ({ data }) => {
  let publishYears = [];
  for (let i = 0; i < data.length; i++) {
    publishYears.push(data[i].last_publish_year);
  }
  let uniquePublishYears = [...new Set(publishYears)];
  uniquePublishYears.sort((a, b) => a - b);

  return (
    <div className="board-container">
      <div className="title">{data[0].author_name}</div>
      <div className="columns-container">
        {uniquePublishYears.map(value => {
          let columnData = [];
          for (let i = 0; i < data.length; i++) {
            if (data[i].last_publish_year === value) {
              columnData.push(data[i]);
            }
          }
          return <Column key={value} columnData={columnData} />;
        })}
      </div>
    </div>
  );
};

export default KanbanBoard;
