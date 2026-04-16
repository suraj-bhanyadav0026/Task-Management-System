import React, { useState } from 'react';
import Sidebar from '../components/Sidebar/Sidebar';
import KanbanBoard from '../components/Kanban/KanbanBoard';
import TaskModal from '../components/Kanban/TaskModal';
import { Search, Plus } from 'lucide-react';
import styles from './Dashboard.module.css';

const Dashboard = ({ theme, toggleTheme }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className={styles.dashboardContainer}>
      <Sidebar theme={theme} toggleTheme={toggleTheme} />
      
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <h1 className={styles.pageTitle}>Tasks</h1>
          
          <div className={styles.headerActions}>
            <div className={styles.searchBar}>
              <Search size={18} className={styles.searchIcon} />
              <input 
                type="text" 
                placeholder="Search tasks..." 
                className={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className={styles.addTaskBtn} onClick={() => setIsModalOpen(true)}>
              <Plus size={18} />
              New Task
            </button>
          </div>
        </header>

        <div className={styles.boardContainer}>
          <KanbanBoard searchQuery={searchQuery} />
        </div>
      </main>

      <TaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Dashboard;
