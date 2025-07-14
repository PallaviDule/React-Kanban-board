import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../redux/store';
import { addColumn, deleteColumn, renameColumn } from '../redux/columnsSlice';
import { TrashIcon } from '@heroicons/react/24/outline';
import { PencilIcon } from '@heroicons/react/24/solid';
import { addTask, editTask, deleteTask, reorderTasks, moveTaskToColumn } from '../redux/tasksSlice';
import TaskCardModal from './TaskCardModal';
import {
  DndContext,
  closestCenter,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import SortableTaskCard from './SortableTaskCard';

const Board: React.FC = () => {
    const columns = useSelector((state: RootState) => state.columns.columns);
    const tasks = useSelector((state: RootState) => state.tasks.tasks);

    const dispatch = useDispatch<AppDispatch>();
    const [taskModalOpen, setTaskModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [taskToEdit, setTaskToEdit] = useState<{
        id: string;
        title: string;
        description?: string;
    } | null>(null);

    const [newTitle, setNewTitle] = useState('');
    const [showInput, setShowInput] = useState(false);

    const [editingId, setEditingId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState('');

    const [activeColumnId, setActiveColumnId] = useState<string | null>(null);

    const handleAddColumn = () => {
        if (newTitle.trim() !== '') {
            dispatch(addColumn(newTitle.trim()));
            setNewTitle('');
            setShowInput(false);
        }
    };

    const handleRename = (id: string) => {
    if (editTitle.trim()) {
      dispatch(renameColumn({ id, newTitle: editTitle.trim() }));
    }
    setEditingId(null);
    };

    const handleAddTask = (title: string, description: string) => {
        if (!activeColumnId) return;
        dispatch(
        addTask({
            columnId: activeColumnId,
            title,
            description,
        })
        );
    };

    const handleEditTask = (id: string, title: string, description?: string) => {
        dispatch(editTask({ id, title, description }));
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over) return;

        const activeTask = tasks.find(t => t.id === active.id);
        if (!activeTask) return;

        // Case 1: Dropped over a task (reorder or move)
        const overTask = tasks.find(t => t.id === over.id);
        if (overTask) {
            if (activeTask.columnId === overTask.columnId) {
                dispatch(reorderTasks({
                    columnId: activeTask.columnId,
                    activeId: active.id,
                    overId: over.id,
                }));
            } else {
                dispatch(moveTaskToColumn({
                    taskId: active.id,
                    toColumnId: overTask.columnId,
                }));
            }
            return;
        }

            // Case 2: Dropped over a column (empty or not)
            const overColumn = columns.find(c => c.id === over.id);
            if (overColumn && activeTask.columnId !== overColumn.id) {
                dispatch(moveTaskToColumn({
                    taskId: active.id,
                    toColumnId: overColumn.id,
                }));
            }
        };


    return (
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="flex gap-4 p-4 overflow-x-auto">
        {columns.map(({id, title}) => (
             <div
                key={id}
                id={id}
                className="bg-gray-100 rounded-md p-4 min-w-[250px] flex-shrink-0 flex flex-col"
            >
                <div className="flex justify-between items-start mb-2">
                    {editingId === id ? (
                    <input
                        autoFocus
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onBlur={() => handleRename(id)}
                        onKeyDown={(e) => {
                        if (e.key === 'Enter') handleRename(id);
                        if (e.key === 'Escape') setEditingId(null);
                        }}
                        className="font-semibold text-lg px-1 py-0.5 rounded border w-full mr-2"
                    />
                    ) : (
                    <h2
                        className="font-semibold text-lg"
                        onDoubleClick={() => {
                        setEditingId(id);
                        setEditTitle(title);
                        }}
                    >
                        {title}
                    </h2>
                    )}

                    <div className="flex gap-2 ml-2">
                    {/* EDIT ICON */}
                    {editingId !== id && (
                        <button
                        onClick={() => {
                            setEditingId(id);
                            setEditTitle(title);
                        }}
                        title="Rename Column"
                        >
                        <PencilIcon className="w-4 h-4 text-gray-500 hover:text-blue-600" />
                        </button>
                    )}

                    {/* DELETE ICON */}
                    <button
                        onClick={() => dispatch(deleteColumn(id))}
                        title="Delete Column"
                    >
                        <TrashIcon className="w-5 h-5 text-gray-500 hover:text-red-600" />
                    </button>
                    </div>
                </div>

                {/* Tasks */}
                <div className="mt-2 flex flex-col">
                    <SortableContext
                        items={tasks.filter((t) => t.columnId === id).map((t) => t.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        {tasks
                        .filter((task) => task.columnId === id)
                        .map((task) => (
                            <SortableTaskCard
                            key={task.id}
                            task={task}
                            onEdit={() => {
                                setModalMode('edit');
                                setTaskToEdit(task);
                                setTaskModalOpen(true);
                            }}
                            onDelete={() => dispatch(deleteTask(task.id))}
                            onClick={() => {
                                setModalMode('edit');
                                setTaskToEdit(task);
                                setTaskModalOpen(true);
                            }}
                            />
                        ))}
                    </SortableContext>
                </div>

                <button
                        onClick={() => {
                        setModalMode('add');
                        setActiveColumnId(id);
                        setTaskToEdit(null);
                        setTaskModalOpen(true);
                        }}
                        className="mt-2 text-xs text-blue-600 hover:underline text-left"
                    >
                        + Add Task
                </button>
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
            {/* AddTaskModal */}
            <TaskCardModal
                isOpen={taskModalOpen}
                onClose={() => setTaskModalOpen(false)}
                mode={modalMode}
                initialData={taskToEdit || undefined}
                onSubmit={({ id, title, description }) => {
                if (modalMode === 'add') {
                    handleAddTask(title, description);
                } else if (modalMode === 'edit' && id) {
                    handleEditTask(id, title, description);
                }
                }}
            />
        </div>
    </DndContext>
  );
};

export default Board;
