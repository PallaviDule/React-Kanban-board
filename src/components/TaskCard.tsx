import React from 'react';

type Props = {
    title: string;
    description?: string;
    onClick: () => void;
}

const TaskCard: React.FC<Props> = ({title, description, onClick}) => {
  return (
    <div className="bg-white rounded p-2 mb-2 shadow-sm border" onClick={onClick}>
        <h1 className="text-sm">{title}</h1>
        <p className="text-xs text-gray-700">{description}</p>
    </div>
  )
}

export default TaskCard;