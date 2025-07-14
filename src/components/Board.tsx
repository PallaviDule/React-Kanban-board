import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DndContext, DragOverlay, closestCenter, closestCorners } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { openAdd, openEdit } from '../redux/modalSlice';
import {
  moveTaskToColumn,
  reorderTasks,
} from '../redux/tasksSlice';
import type { RootState, AppDispatch } from '../redux/store';
import AddColumn from './AddColumn';
import ColumnCard from './ColumnCard';
import TaskController from './TaskController';

const Board: React.FC = () => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const columns = useSelector((state: RootState) => state.columns.columns);
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
    const activeTask = activeId ? tasks.find(t => t.id === activeId) : null;


  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveId(String(active.id));
  };
  // const handleDragEnd = (event: DragEndEvent) => {
  //   const { active, over } = event;
  //   if (!over) return;

  //   const activeTask = tasks.find(t => t.id === active.id);
  //   if (!activeTask) return;

  //   const overTask = tasks.find(t => t.id === over.id);
  //   if (overTask) {
  //     if (activeTask.columnId === overTask.columnId) {
  //       dispatch(reorderTasks({ columnId: activeTask.columnId, activeId: active.id, overId: over.id }));
  //     } else {
  //       dispatch(moveTaskToColumn({ taskId: active.id, toColumnId: overTask.columnId }));
  //     }
  //     return;
  //   }

  //   const overColumn = columns.find(c => c.id === over.id);
  //   if (overColumn && activeTask.columnId !== overColumn.id) {
  //     dispatch(moveTaskToColumn({ taskId: active.id, toColumnId: overColumn.id }));
  //   }
  // };
  const handleDragEnd = (event: DragEndEvent) => {
  const { active, over } = event;
  
  // Clear dragging state right away
  setActiveId(null);

  if (!over || active.id === over.id) return; // no move or dropped outside

  const activeTask = tasks.find(t => t.id === active.id);
  if (!activeTask) return;

  const overTask = tasks.find(t => t.id === over.id);
  const overColumn = columns.find(c => c.id === over.id);

  if (overTask) {
    if (activeTask.columnId === overTask.columnId) {
      // Reorder within same column
      dispatch(reorderTasks({
        columnId: activeTask.columnId,
        activeId: active.id,
        overId: over.id,
      }));
    } else {
      // Move task to another column, before the overTask
      dispatch(moveTaskToColumn({
        taskId: active.id,
        toColumnId: overTask.columnId,
        beforeTaskId: overTask.id,
      }));
    }
  } else if (overColumn) {
    // Dropped on an empty column or below last task, append task at the end
    dispatch(moveTaskToColumn({
      taskId: active.id,
      toColumnId: overColumn.id,
      beforeTaskId: null,
    }));
  }
};

  return (
    <DndContext 
      collisionDetection={closestCorners} 
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      onDragCancel={() => setActiveId(null)}
    >
      <div className="flex gap-4 p-4 overflow-x-auto">
        {columns.map(col => (
          <ColumnCard
            key={col.id}
            column={col}
            tasks={tasks.filter(t => t.columnId === col.id)}
            onAddTaskClick={() => dispatch(openAdd(col.id))}
            onEditTaskClick={(task) => dispatch(openEdit(task))}
            draggingTaskId={activeId}
          />
        ))}
        <AddColumn />
      </div>
      <DragOverlay>
        {activeTask ? (
          <div className="bg-white rounded p-2 shadow-md border w-[250px] pointer-events-none">
            <h1 className="text-sm font-medium">{activeTask.title}</h1>
            <p className="text-xs text-gray-600">{activeTask.description}</p>
          </div>
        ) : null}
      </DragOverlay>

      <TaskController />
    </DndContext>
  );
};

export default Board;
