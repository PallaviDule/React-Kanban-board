import React from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';

type Props = {
  title: string;
  description?: string;
  onClick: () => void;
  onDelete: () => void;
};

const TaskCard: React.FC<Props> = ({
  title,
  description,
  onClick,
  onDelete,
}) => {
  return (
    <div className="bg-white rounded p-2 mb-2 shadow-sm border relative group">
      <div onClick={onClick} className="cursor-pointer pr-6">
        <h1 className="text-sm font-medium text-gray-800">{title}</h1>
        {description && (
          <p className="text-xs text-gray-600 mt-1">{description}</p>
        )}
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation(); // prevent parent onClick
          onDelete();
        }}
        title="Delete Task"
        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <TrashIcon className="w-4 h-4 text-gray-400 hover:text-red-600" />
      </button>
    </div>
  );
};

export default TaskCard;
