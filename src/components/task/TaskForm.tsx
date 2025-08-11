import React from 'react';
import TaskFilters from '../TaskFilters';
import type { Priority, Type } from '../../redux/tasksSlice';

type TaskFormProps = {
  title: string;
  description: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  selectedType : Type | '';
  setSelectedType: (value: Type | '') => void;
  selectedPriority: Priority | '';
  setSelectedPriority: (value: Priority | '') => void;
};

const TaskForm: React.FC<TaskFormProps> = ({
  title,
  description,
  selectedType,
  selectedPriority,
  onTitleChange,
  onDescriptionChange,
  setSelectedPriority,
  setSelectedType
}) => {  
  return (
    <div className="flex flex-col gap-3">
      <input
        type="text"
        placeholder="Task Title"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        required
        className="border border-gray-300 rounded px-3 py-2"
        autoFocus
      />
      <textarea
        placeholder="Task Description (optional)"
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        rows={4}
        className="border rounded border-gray-300 px-3 py-2 resize-none"
      />
      <TaskFilters 
        selectedPriority={selectedPriority}
        setSelectedPriority={setSelectedPriority}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
      />    
    </div>
  );
};

export default TaskForm;
