import { closestCenter, DndContext, DragOverlay, PointerSensor, useSensor, useSensors} from "@dnd-kit/core"
import TaskController from "./task/TaskController"
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { openAdd, openEdit } from "../redux/modalSlice";
import AddColumn from './column/AddColumn';
import ColumnCard from "./column/ColumnCard";
import { moveTaskToColumn, reorderTasks} from "../redux/tasksSlice";
import type { RootState, AppDispatch } from '../redux/store';
import type { Priority, Task, Type } from "../redux/tasksSlice";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core"

type Props = {
    selectedType: Type | '';
    selectedPriority: Priority | '';
}
const DragAndDropContext: React.FC<Props> = ({selectedPriority, selectedType}) => {
    const [activeId, setActiveId] = useState<string | null>(null);
    const dispatch = useDispatch<AppDispatch>();
    const columns = useSelector((state:RootState)  => state.columns.columns);
    const tasks = useSelector((state: RootState) => state.tasks.tasks);

    const activeTask = tasks.find((task: Task) => task.id === activeId);
    const tasksByColumn = columns.reduce<Record<string, Task[]>>((acc, current) => {
        acc[current.id] = tasks.filter((task) => { 
            const filterPriority = selectedPriority ? task.priority === selectedPriority : true;
            const filterType = selectedType ? task.type === selectedType : true;

            return task.columnId === current.id && filterPriority && filterType;
        });
        return acc;
    }, {})

    
    // Drag and Drop events
    const sensors = useSensors(useSensor(PointerSensor)); 
    const handleDragStart = (event : DragStartEvent) => {
        setActiveId(String(event.active.id))
    }
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
  )
}

export default DragAndDropContext