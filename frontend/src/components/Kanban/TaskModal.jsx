import React, { useState } from 'react';
import Modal from '../UI/Modal';
import { useCreateTaskMutation } from '../../features/tasks/tasksApi';
import { Loader2 } from 'lucide-react';
import styles from './TaskModal.module.css';

const TaskModal = ({ isOpen, onClose }) => {
  const [createTask, { isLoading }] = useCreateTaskMutation();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    dueDate: '',
  });

  const [files, setFiles] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 3) {
      alert('Maximum 3 files allowed');
      return;
    }
    setFiles(selectedFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // We must use FormData because we might send files
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('status', formData.status);
    data.append('priority', formData.priority);
    if (formData.dueDate) data.append('dueDate', formData.dueDate);
    
    files.forEach(file => {
      data.append('attachments', file);
    });

    try {
      await createTask(data).unwrap();
      
      // reset and close
      setFormData({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        dueDate: '',
      });
      setFiles([]);
      onClose();
    } catch (error) {
      console.error('Error creating task', error);
      alert('Failed to create task');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Task">
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label>Title <span className={styles.required}>*</span></label>
          <input 
            type="text" 
            name="title" 
            value={formData.title} 
            onChange={handleChange} 
            required 
            placeholder="e.g., Fix Navigation Bug"
          />
        </div>

        <div className={styles.formGroup}>
          <label>Description</label>
          <textarea 
            name="description" 
            value={formData.description} 
            onChange={handleChange} 
            placeholder="Detailed description..."
            rows={3}
          />
        </div>

        <div className={styles.flexRow}>
          <div className={styles.formGroup}>
            <label>Priority</label>
            <select name="priority" value={formData.priority} onChange={handleChange}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Status</label>
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Due Date</label>
          <input 
            type="date" 
            name="dueDate" 
            value={formData.dueDate} 
            onChange={handleChange} 
          />
        </div>

        <div className={styles.formGroup}>
          <label>Attachments (Max 3 PDFs)</label>
          <input 
            type="file" 
            accept="application/pdf"
            multiple
            onChange={handleFileChange}
            className={styles.fileInput}
          />
          {files.length > 0 && (
            <div className={styles.fileInfo}>{files.length} file(s) selected</div>
          )}
        </div>

        <div className={styles.actions}>
          <button type="button" onClick={onClose} className={styles.cancelBtn}>Cancel</button>
          <button type="submit" className={styles.submitBtn} disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin" /> : 'Create Task'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default TaskModal;
