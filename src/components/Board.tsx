import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { openAdd, openEdit } from '../redux/modalSlice';
import { moveTaskToColumn, reorderTasks } from '../redux/tasksSlice';
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

  const sensors = useSensors(useSensor(PointerSensor));

  // Helper: group tasks by columnId
  const tasksByColumn = columns.reduce<Record<string, typeof tasks>>(
    (acc, col) => {
      acc[col.id] = tasks.filter(t => t.columnId === col.id);
      return acc;
    },
    {}
  );

  const handleDragStart = (event) => {
    setActiveId(String(event.active.id));
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id) return;

    const activeTask = tasks.find(t => t.id === active.id);
    if (!activeTask) return;

    // over can be task id or column id (empty column drop)
    // Check if over is a task
    const overTask = tasks.find(t => t.id === over.id);
    // Check if over is a column
    const overColumn = columns.find(c => c.id === over.id);

    if (overTask) {
      if (activeTask.columnId === overTask.columnId) {
        // reorder in same column
        dispatch(
          reorderTasks({
            columnId: activeTask.columnId,
            activeId: active.id,
            overId: over.id,
          })
        );
      } else {
        // move to different column before the overTask
        dispatch(
          moveTaskToColumn({
            taskId: active.id,
            toColumnId: overTask.columnId,
            beforeTaskId: overTask.id,
          })
        );
      }
    } else if (overColumn) {
      // dropped on empty column or below all tasks — append
      dispatch(
        moveTaskToColumn({
          taskId: active.id,
          toColumnId: overColumn.id,
          beforeTaskId: null,
        })
      );
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveId(null)}
    >
      <div className="flex gap-4 p-4 overflow-x-auto">
        {columns.map(col => (
          <SortableContext
            key={col.id}
            id={col.id}
            items={tasksByColumn[col.id].map(t => t.id)}
            strategy={verticalListSortingStrategy}
          >
            <ColumnCard
              column={col}
              tasks={tasksByColumn[col.id]}
              onAddTaskClick={() => dispatch(openAdd(col.id))}
              onEditTaskClick={(task) => dispatch(openEdit(task))}
              draggingTaskId={activeId}
            />
          </SortableContext>
        ))}
        <AddColumn />
      </div>

      <DragOverlay>
        {activeTask && (
          <div className="bg-white rounded p-2 shadow-md border w-[250px]">
            <h1 className="text-sm font-medium">{activeTask.title}</h1>
            <p className="text-xs text-gray-600">{activeTask.description}</p>
          </div>
        )}
      </DragOverlay>

      <TaskController />
    </DndContext>
  );
};

export default Board;
