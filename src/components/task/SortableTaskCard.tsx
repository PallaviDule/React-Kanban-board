import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import type { Task } from '../redux/tasksSlice';

type Props = {
  task: Task;
  draggingTaskId: string;
  onDelete: () => void;
  onEdit: () => void;
};

const SortableTaskCard: React.FC<Props> = ({ task, onDelete, onEdit, draggingTaskId }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
  } = useSortable({ id: task.id});  

  return (
    <div
      ref={setNodeRef}
      style={{
        opacity: task.id === draggingTaskId ? 0 : 1, 
        pointerEvents: task.id === draggingTaskId ? 'none' : 'auto',
      }}
      className="bg-white rounded p-2 mb-2 shadow-sm border border-gray-200 relative group"
    >
      {/* Drag handle only on this wrapper */}
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing"
      >
        <h1 className="text-sm font-medium">{task.title}</h1>
        <p className="text-xs text-gray-600">{task.description}</p>
        <div className='flex'>
          <h3 className='text-xs'>
            <label className=''> Priority:</label> 
            <label className='text-gray-500'>{task.priority}</label>
          </h3>
          <h3 className='text-xs px-1 '>
            <label> Type:</label> 
            <label className='text-gray-500'>{task.type}</label>
          </h3>
        </div>

      </div>

      {/* Icons should be outside the draggable zone */}
      <div className="absolute top-1 right-1 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={onEdit} title="Edit Task">
          <PencilIcon className="w-4 h-4 text-gray-400 hover:text-blue-600" />
        </button>
        <button onClick={onDelete} title="Delete Task">
          <TrashIcon className="w-4 h-4 text-gray-400 hover:text-red-600" />
        </button>
      </div>
    </div>
  );
};

export default SortableTaskCard;
