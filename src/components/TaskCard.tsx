import React from 'react';
import { TrashIcon, PencilIcon } from '@heroicons/react/24/outline';

type Props = {
  title: string;
  description?: string;
  onEdit: () => void;
  onDelete: () => void;
  dragListeners?: any;
};

const TaskCard: React.FC<Props> = ({ title, description, onEdit, onDelete, dragListeners }) => {
  return (
    <div className="bg-white rounded p-2 mb-2 shadow-sm border relative group">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-sm font-semibold">{title}</h1>
          {description && <p className="text-xs text-gray-600 mt-1">{description}</p>}
        </div>

        <div className="flex items-center gap-1">
          {/* Edit Button */}
          <button
            onClick={onEdit}
            title="Edit Task"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <PencilIcon className="w-4 h-4 text-gray-500 hover:text-blue-600" />
          </button>

          {/* Delete Button */}
          <button
            onClick={onDelete}
            title="Delete Task"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <TrashIcon className="w-4 h-4 text-gray-500 hover:text-red-600" />
          </button>

          {/* Drag Handle */}
          <div {...dragListeners} title="Drag" className="cursor-grab text-gray-400 hover:text-gray-600">
            ⠿
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
