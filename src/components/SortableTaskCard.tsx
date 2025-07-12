import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import TaskCard from './TaskCard';

type Task = {
  id: string;
  title: string;
  description?: string;
  columnId: string;
};
type Props = {
    task: Task;
    onClick: () => void;
    onDelete: () => void;
};

const SortableTaskCard = ({ task, onClick, onDelete }: Props) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div 
            ref={setNodeRef} 
            style={style} {...attributes} {...listeners}>
            <TaskCard
                key={task.id}
                title={task.title}
                description={task.description}
                onClick={onClick}
                onDelete={onDelete}
            />
        </div>
    );
};

export default SortableTaskCard;
