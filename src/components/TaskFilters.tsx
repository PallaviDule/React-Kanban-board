import type { Priority, Type } from "../redux/tasksSlice";

const TaskPriority : Priority[]= ['Low', 'High', 'Medium'];
const TaskType: Type[] = ['Bug', 'Feature', 'Critical']

type TaskFilterProps = {
    selectedType: Type | '';
    setSelectedType: (type: Type) => void;
    selectedPriority: Priority | '';
    setSelectedPriority: (priority: Priority) => void;
};

const TaskFilters : React.FC<TaskFilterProps> = ({selectedType, setSelectedType, selectedPriority, setSelectedPriority}) => {
  return (
    <div className="m-3">
        <select 
        className='m-1 border border-blue-400 rounded-lg p-1' 
        value={selectedType} 
        onChange={(e : React.ChangeEvent<HTMLSelectElement>) => setSelectedType(e.target.value as Type)}
        >
            <option key={'defaultType'} value={''}> Type</option>
            {TaskType.map((currentType) => 
                <option key={currentType} value={currentType}>{currentType}</option>
            )}
        </select>
        <select 
        className='m-1 border border-blue-400 rounded-lg p-1' 
        value={selectedPriority} 
        onChange={(e : React.ChangeEvent<HTMLSelectElement>) => setSelectedPriority(e.target.value as Priority)}
        >
            <option key={'defaultType'} value={''}> Priority </option>
            {TaskPriority.map((currentPriority) => 
                <option key={currentPriority} value={currentPriority}>{currentPriority}</option>
            )}
        </select>
    </div>
  )
}

export default TaskFilters;