import React from 'react';

const Board: React.FC = () => {
  const columns = ['To Do', 'In Progress', 'Done'];

  return (
    <div className="flex gap-4 p-4 overflow-x-auto">
      {columns.map((title) => (
        <div
          key={title}
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
