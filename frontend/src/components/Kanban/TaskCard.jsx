import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Paperclip } from 'lucide-react';
import styles from './Kanban.module.css';

const TaskCard = ({ task }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task._id, data: { status: task.status } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners}
      className={`${styles.card} ${isDragging ? styles.cardDragging : ''}`}
    >
      <h4 className={styles.cardTitle}>{task.title}</h4>
      {task.description && <p className={styles.cardDesc}>{task.description}</p>}
      
      <div className={styles.cardFooter}>
        <span className={`${styles.priorityBadge} ${styles['priority-' + task.priority]}`}>
          {task.priority || 'medium'}
        </span>
        
        {task.attachments && task.attachments.length > 0 && (
          <div className={styles.attachmentIcon}>
            <Paperclip size={14} />
            {task.attachments.length}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
