import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TaskCard from './TaskCard';
import styles from './Kanban.module.css';

const Column = ({ title, status, tasks }) => {
  const { setNodeRef } = useDroppable({
    id: status,
  });

  const getHeaderColor = () => {
    switch(status) {
      case 'todo': return 'var(--text-secondary)';
      case 'in-progress': return 'var(--accent-primary)';
      case 'done': return 'var(--accent-success)';
      default: return 'var(--text-secondary)';
    }
  };

  return (
    <div className={styles.column}>
      <div className={styles.columnHeader} style={{ borderBottomColor: getHeaderColor() }}>
        <span>{title}</span>
        <span className={styles.columnCount}>{tasks.length}</span>
      </div>
      
      <div ref={setNodeRef} className={styles.columnContent}>
        <SortableContext items={tasks.map(t => t._id)} strategy={verticalListSortingStrategy}>
          {tasks.map(task => (
            <TaskCard key={task._id} task={task} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};

export default Column;
