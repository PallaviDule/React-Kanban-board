import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../redux/store';
import { addColumn } from '../redux/columnsSlice';

const Board: React.FC = () => {
    const columns = useSelector((state: RootState) => state.columns.columns);
    const dispatch = useDispatch<AppDispatch>();

    const [newTitle, setNewTitle] = useState('');
    const [showInput, setShowInput] = useState(false);

    const handleAddColumn = () => {
        if (newTitle.trim() !== '') {
            dispatch(addColumn(newTitle.trim()));
            setNewTitle('');
            setShowInput(false);
        }
    };



  return (
    <div className="flex gap-4 p-4 overflow-x-auto">
      {columns.map(({id, title}) => (
        <div
          key={id}
          className="bg-gray-100 rounded-md p-4 min-w-[250px] flex-shrink-0"
        >
          <h2 className="font-semibold text-lg mb-2">{title}</h2>
          {/* Tasks will go here */}
          <div className="text-gray-500">No tasks yet</div>
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
