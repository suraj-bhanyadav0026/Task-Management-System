import React, { useState, useEffect } from 'react';
import { 
  DndContext, 
  DragOverlay, 
  closestCorners, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors 
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useGetTasksQuery, useUpdateTaskMutation } from '../../features/tasks/tasksApi';
import Column from './Column';
import TaskCard from './TaskCard';
import styles from './Kanban.module.css';
import { Loader2 } from 'lucide-react';

const KanbanBoard = ({ searchQuery }) => {
  const { data, isLoading } = useGetTasksQuery({ search: searchQuery });
  const [updateTask] = useUpdateTaskMutation();
  
  const [columns, setColumns] = useState({
    'todo': [],
    'in-progress': [],
    'done': []
  });
  
  const [activeTask, setActiveTask] = useState(null);

  useEffect(() => {
    if (data?.tasks) {
      setColumns({
        'todo': data.tasks.filter(t => t.status === 'todo'),
        'in-progress': data.tasks.filter(t => t.status === 'in-progress'),
        'done': data.tasks.filter(t => t.status === 'done'),
      });
    }
  }, [data]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event) => {
    const { active } = event;
    const task = data?.tasks.find(t => t._id === active.id);
    setActiveTask(task);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id; // Could be a column id or another task id
    
    // Find column containing active task
    const activeColumn = active.data.current?.status;
    let overColumn;

    // Determine the over column container
    if (columns[overId]) {
      // dropped directly over a column container background
      overColumn = overId;
    } else {
      // dropped over another task, get its column
      overColumn = over.data.current?.status;
    }

    if (!overColumn || activeColumn === overColumn) {
      return; 
    }

    // Optimistic UI update
    setColumns(prev => {
      const activeItems = [...prev[activeColumn]];
      const overItems = [...prev[overColumn]];
      
      const activeIndex = activeItems.findIndex(t => t._id === activeId);
      const [movedTask] = activeItems.splice(activeIndex, 1);
      
      movedTask.status = overColumn;
      overItems.unshift(movedTask);

      return {
        ...prev,
        [activeColumn]: activeItems,
        [overColumn]: overItems
      };
    });

    // Make API call
    try {
      await updateTask({ id: activeId, status: overColumn }).unwrap();
    } catch (err) {
      console.error('Failed to update task status:', err);
      // In a real app, revert the optimistic update here if fail
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}>
        <Loader2 className="animate-spin" size={32} color="var(--accent-primary)" />
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className={styles.board}>
        <Column title="To Do" status="todo" tasks={columns['todo']} />
        <Column title="In Progress" status="in-progress" tasks={columns['in-progress']} />
        <Column title="Done" status="done" tasks={columns['done']} />
      </div>

      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} /> : null}
      </DragOverlay>
    </DndContext>
  );
};

export default KanbanBoard;
