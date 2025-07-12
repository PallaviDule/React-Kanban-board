import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../redux/store';

const Board: React.FC = () => {
  const columns = useSelector((state: RootState) => state.columns.columns);

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
    </div>
  );
};

export default Board;
