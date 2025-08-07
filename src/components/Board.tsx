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
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';

import { openAdd, openEdit } from '../redux/modalSlice';
import { moveTaskToColumn, reorderTasks, type Priority, type Task, type Type } from '../redux/tasksSlice';
import type { RootState, AppDispatch } from '../redux/store';
import AddColumn from './AddColumn';
import ColumnCard from './ColumnCard';
import TaskController from './TaskController';

const TaskPriority : Priority[]= ['Low', 'High', 'Medium'];
const TaskType: Type[] = ['Bug', 'Feature', 'Critical']

const Board: React.FC = () => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<Type | ''>('');
  const [selectedPriority, setSelectedPriority] = useState<Priority | ''>('');


  const dispatch = useDispatch<AppDispatch>();
  const columns = useSelector((state: RootState) => state.columns.columns);
  const tasks = useSelector((state: RootState) => state.tasks.tasks);

  const activeTask = activeId ? tasks.find(t => t.id === activeId) : null;

  const sensors = useSensors(useSensor(PointerSensor));

  // Group tasks by their columnId for easy passing to ColumnCard
  const tasksByColumn = columns.reduce<Record<string, Task[]>>(
    (acc, col) => {
      console.log('task:', tasks);
      acc[col.id] = tasks.filter(t => {
        const selectPriority = selectedPriority ? t.priority === selectedPriority : true;
        const selectType = selectedType ? t.type === selectedType : true;

        return t.columnId === col.id && (selectPriority || selectType )
    });
      return acc;
    },
    {}
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id) return;
    if (!activeTask) return;

    // Determine if over is a task or a column (empty or drop at end)
    const overTask = tasks.find(t => t.id === over.id);
    const overColumn = columns.find(c => c.id === over?.id);

    if (overTask) {
      if (activeTask.columnId === overTask.columnId) {
        // Reorder task within same column
        dispatch(
          reorderTasks({
            columnId: activeTask.columnId,
            activeId: active.id,
            overId: over.id,
          })
        );
      } else {
        // Move task to different column, before overTask
        dispatch(
          moveTaskToColumn({
            taskId: active.id,
            toColumnId: overTask.columnId,
            beforeTaskId: overTask.id,
          })
        );
      }
    } else if (overColumn) {
      dispatch(
        moveTaskToColumn({
          taskId: active.id,
          toColumnId: overColumn.id,
          beforeTaskId: null, // append to end
        })
      );
}
  };

  return (
    <>
    <select 
      className='m-5' 
      value={selectedType} 
      onChange={(e : React.ChangeEvent<HTMLSelectElement>) => setSelectedType(e.target.value as Type)}
    >
      <option key={'defaultType'} value={''}> Type</option>
      {TaskType.map((currentType) => 
          <option key={currentType} value={currentType}>{currentType}</option>
      )}
    </select>
    <select 
      className='m-5' 
      value={selectedPriority} 
      onChange={(e : React.ChangeEvent<HTMLSelectElement>) => setSelectedPriority(e.target.value as Priority)}
    >
      <option key={'defaultType'} value={''}> Priority </option>
      {TaskPriority.map((currentPriority) => 
          <option key={currentPriority} value={currentPriority}>{currentPriority}</option>
      )}
    </select>
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveId(null)}
    >
      <div className="flex gap-4 p-4 overflow-x-auto min-h-full">
        {columns.map(col => (
          <div key={col.id} id={col.id}>
              <ColumnCard
                column={col}
                tasks={tasksByColumn[col.id] || []}
                onAddTaskClick={() => dispatch(openAdd(col.id))}
                onEditTaskClick={task => dispatch(openEdit(task))}
                draggingTaskId={activeId || ''}
              />
          </div>
        ))}
          <div className="flex items-start">

        <AddColumn />
        </div>
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
    </>
  );
};

export default Board;
