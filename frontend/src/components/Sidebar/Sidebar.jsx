import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import { LayoutDashboard, CheckSquare, Settings, LogOut, Moon, Sun } from 'lucide-react';
import styles from './Sidebar.module.css';

const Sidebar = ({ theme, toggleTheme }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoSection}>
        <CheckSquare className={styles.logoIcon} />
        <h2 className={styles.logoText}>TaskFlow</h2>
      </div>

      <nav className={styles.navLinks}>
        <button className={`${styles.navItem} ${styles.active}`}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </button>
        <button className={styles.navItem}>
          <Settings size={20} />
          <span>Settings</span>
        </button>

        <div className={styles.spacer}></div>

        <button className={styles.navItem} onClick={toggleTheme}>
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
        </button>
      </nav>

      <div className={styles.userProfile}>
        <div className={styles.avatar}>
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div className={styles.userInfo}>
          <div className={styles.userName}>{user?.name}</div>
          <div className={styles.userRole}>{user?.role}</div>
        </div>
        <button className={styles.logoutBtn} onClick={handleLogout} title="Logout">
          <LogOut size={18} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
