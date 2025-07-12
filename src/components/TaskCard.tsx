import React from 'react';

type Props = {
    title: string;
}

const TaskCard: React.FC<Props> = ({title}) => {
  return (
    <div className="bg-white rounded p-2 mb-2 shadow-sm border">
        <h1 className="text-sm text-gray-800">{title}</h1>
    </div>
  )
}

export default TaskCard;