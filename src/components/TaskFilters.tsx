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
    </>
  )
}

export default TaskFilters;