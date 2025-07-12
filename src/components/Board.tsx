import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../redux/store';
import { addColumn, deleteColumn, renameColumn } from '../redux/columnsSlice';
import { TrashIcon } from '@heroicons/react/24/outline';
import { PencilIcon } from '@heroicons/react/24/solid';
import TaskCard from './TaskCard';
import { addTask } from '../redux/tasksSlice';

const Board: React.FC = () => {
    const columns = useSelector((state: RootState) => state.columns.columns);
    const tasks = useSelector((state: RootState) => state.tasks.tasks);

    const dispatch = useDispatch<AppDispatch>();

    const [newTitle, setNewTitle] = useState('');
    const [showInput, setShowInput] = useState(false);

    const [editingId, setEditingId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState('');

    const [taskInputs, setTaskInputs] = useState<Record<string, string>>({});
    const [showTaskInput, setShowTaskInput] = useState<Record<string, boolean>>({});

    const handleAddColumn = () => {
        if (newTitle.trim() !== '') {
            dispatch(addColumn(newTitle.trim()));
            setNewTitle('');
            setShowInput(false);
        }
    };

    const handleRename = (id: string) => {
    if (editTitle.trim()) {
      dispatch(renameColumn({ id, newTitle: editTitle.trim() }));
    }
    setEditingId(null);
    };

    const handleAddTask = (columnId: string) => {
        const title = taskInputs[columnId]?.trim();
        if (title) {
            dispatch(addTask({ columnId, title }));
            setTaskInputs((prev) => ({ ...prev, [columnId]: '' }));
            setShowTaskInput((prev) => ({ ...prev, [columnId]: false }));
        }
    };
    const handleCancelTaskInput = (columnId: string) => {
        setTaskInputs((prev) => ({ ...prev, [columnId]: '' }));
        setShowTaskInput((prev) => ({ ...prev, [columnId]: false }));
    };

  return (
    <div className="flex gap-4 p-4 overflow-x-auto">
      {columns.map(({id, title}) => (
        <div
            key={id}
            className="bg-gray-100 rounded-md p-4 min-w-[250px] flex-shrink-0"
        >
            <div className="flex justify-between items-start mb-2">
                {editingId === id ? (
                <input
                    autoFocus
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onBlur={() => handleRename(id)}
                    onKeyDown={(e) => {
                    if (e.key === 'Enter') handleRename(id);
                    if (e.key === 'Escape') setEditingId(null);
                    }}
                    className="font-semibold text-lg px-1 py-0.5 rounded border w-full mr-2"
                />
                ) : (
                <h2
                    className="font-semibold text-lg"
                    onDoubleClick={() => {
                    setEditingId(id);
                    setEditTitle(title);
                    }}
                >
                    {title}
                </h2>
                )}

                <div className="flex gap-2 ml-2">
                {/* EDIT ICON */}
                {editingId !== id && (
                    <button
                    onClick={() => {
                        setEditingId(id);
                        setEditTitle(title);
                    }}
                    title="Rename Column"
                    >
                    <PencilIcon className="w-4 h-4 text-gray-500 hover:text-blue-600" />
                    </button>
                )}

                {/* DELETE ICON */}
                <button
                    onClick={() => dispatch(deleteColumn(id))}
                    title="Delete Column"
                >
                    <TrashIcon className="w-5 h-5 text-gray-500 hover:text-red-600" />
                </button>
                </div>
            </div>

            {/* Tasks */}
            <div className="mt-2">
            {tasks
                .filter((task) => task.columnId === id)
                .map((task) => (
                    <TaskCard key={task.id} title={task.title} />
                ))}
            </div>

            {/* Add Task Button */}
            {showTaskInput[id] ? (
                <div className="mt-2">
                    <input
                    type="text"
                    placeholder="Enter task title"
                    className="w-full text-sm border rounded px-2 py-1 mb-1"
                    value={taskInputs[id] || ''}
                    onChange={(e) =>
                        setTaskInputs((prev) => ({ ...prev, [id]: e.target.value }))
                    }
                    />
                    <div className="flex gap-2">
                    <button
                        onClick={() => handleAddTask(id)}
                        className="bg-blue-500 text-white px-2 py-1 text-xs rounded"
                    >
                        Add
                    </button>
                    <button
                        onClick={() => handleCancelTaskInput(id)}
                        className="text-xs px-2 py-1 rounded border"
                    >
                        Cancel
                    </button>
                    </div>
                </div>
                ) : (
                <button
                    onClick={() =>
                    setShowTaskInput((prev) => ({ ...prev, [id]: true }))
                    }
                    className="mt-2 text-xs text-blue-600 hover:underline"
                >
                    + Add Task
                </button>
            )}
        </div>
        ))}
        {/* Add Column Section */}
        <div className="min-w-[250px] flex-shrink-0">
          {showInput ? (
            <div className="bg-white p-4 rounded-md border border-gray-300">
              <input
                type="text"
                className="w-full border px-2 py-1 mb-2 text-sm rounded"
                placeholder="Enter column title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAddColumn}
                  className="bg-blue-500 text-white px-2 py-1 text-sm rounded"
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    setNewTitle('');
                    setShowInput(false);
                  }}
                  className="text-sm px-2 py-1 rounded border"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowInput(true)}
              className="text-sm text-blue-600 border border-dashed border-blue-400 w-full h-full p-4 rounded-md hover:bg-blue-50"
            >
              + Add Column
            </button>
          )}
        </div>
    </div>
  );
};

export default Board;
