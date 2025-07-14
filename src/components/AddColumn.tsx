import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addColumn } from '../redux/columnsSlice';

const AddColumn: React.FC = () => {
  const dispatch = useDispatch();
  const [showInput, setShowInput] = useState(false);
  const [title, setTitle] = useState('');

  const handleAdd = () => {
    if (!title.trim()) return;
    dispatch(addColumn(title.trim()));
    setTitle('');
    setShowInput(false);
  };

  return (
    <div className="min-w-[250px] flex-shrink-0">
      {showInput ? (
        <div className="bg-white p-4 rounded-md border border-gray-300">
          <input
            className="w-full border px-2 py-1 mb-2 text-sm rounded"
            placeholder="Enter column title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div className="flex gap-2">
            <button onClick={handleAdd} className="bg-blue-500 text-white px-2 py-1 text-sm rounded">
              Add
            </button>
            <button onClick={() => setShowInput(false)} className="text-sm px-2 py-1 rounded border">
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
  );
};

export default AddColumn;
