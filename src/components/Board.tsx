import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DndContext, closestCenter } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
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
  const dispatch = useDispatch<AppDispatch>();
  const columns = useSelector((state: RootState) => state.columns.columns);
  const tasks = useSelector((state: RootState) => state.tasks.tasks);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeTask = tasks.find(t => t.id === active.id);
    if (!activeTask) return;

    const overTask = tasks.find(t => t.id === over.id);
    if (overTask) {
      if (activeTask.columnId === overTask.columnId) {
        dispatch(reorderTasks({ columnId: activeTask.columnId, activeId: active.id, overId: over.id }));
      } else {
        dispatch(moveTaskToColumn({ taskId: active.id, toColumnId: overTask.columnId }));
      }
      return;
    }

    const overColumn = columns.find(c => c.id === over.id);
    if (overColumn && activeTask.columnId !== overColumn.id) {
      dispatch(moveTaskToColumn({ taskId: active.id, toColumnId: overColumn.id }));
    }
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 p-4 overflow-x-auto">
        {columns.map(col => (
          <ColumnCard
            key={col.id}
            column={col}
            tasks={tasks.filter(t => t.columnId === col.id)}
            onAddTaskClick={() => dispatch(openAdd(col.id))}
            onEditTaskClick={(task) => dispatch(openEdit(task))}
          />
        ))}
        <AddColumn />
      </div>

      <TaskController />
    </DndContext>
  );
};

export default Board;
