import React from 'react';
import './styles.scss';

const KanbanBoard = ({ data }) => {
  console.log('Shrunk data : ', data);
  return <div className="Board">I'll be a kanban board when I grow up!</div>;
};

export default KanbanBoard;
