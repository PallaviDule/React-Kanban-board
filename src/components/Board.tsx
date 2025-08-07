import React, { useState } from 'react';
import { type Priority, type Type } from '../redux/tasksSlice';
import TaskFilters from './TaskFilters';
import DragAndDropContext from './DragAndDropContext';

const Board: React.FC = () => {
  const [selectedType, setSelectedType] = useState<Type | ''>('');
  const [selectedPriority, setSelectedPriority] = useState<Priority | ''>('');

  return (
    <>
    <TaskFilters 
      selectedPriority={selectedPriority}
      setSelectedPriority={setSelectedPriority}
      selectedType={selectedType}
      setSelectedType={setSelectedType}
    />
    <DragAndDropContext selectedPriority={selectedPriority} selectedType={selectedType}/>
    </>
  );
};

export default Board;
