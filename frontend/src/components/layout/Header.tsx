import React from 'react';
import {
  makeStyles,
  shorthands,
  tokens,
  Button,
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
  Avatar,
  Divider,
} from '@fluentui/react-components';
import {
  Person24Regular,
  SignOut24Regular,
  Search24Regular,
  Home24Regular,
  Document24Regular,
  CheckmarkCircle24Regular,
  Settings24Regular,
} from '@fluentui/react-icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const useStyles = makeStyles({
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shorthands.padding('0', '32px'),
    backgroundColor: tokens.colorNeutralBackground1,
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
    height: '64px',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    '@media (max-width: 768px)': {
      ...shorthands.padding('0', '16px'),
    },
  },
  headerContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: '1280px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  logo: {
    fontSize: tokens.fontSizeBase600,
    fontWeight: tokens.fontWeightBold,
    color: tokens.colorNeutralForeground1,
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('10px'),
    ...shorthands.padding('4px', '0', '4px', '4px'),
    transition: 'opacity 0.2s',
    ':hover': {
      opacity: 0.8,
    },
  },
  logoIcon: {
    fontSize: '28px',
  },
  logoText: {
    background: `linear-gradient(135deg, ${tokens.colorBrandForeground1}, ${tokens.colorPaletteBerryForeground1})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    lineHeight: 1.3,
    paddingBottom: '2px',
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('4px'),
    '@media (max-width: 768px)': {
      display: 'none',
    },
  },
  navButton: {
    ...shorthands.borderRadius('8px'),
    fontWeight: tokens.fontWeightMedium,
    transition: 'all 0.2s',
  },
  navButtonActive: {
    backgroundColor: tokens.colorNeutralBackground1Hover,
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('16px'),
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('12px'),
    cursor: 'pointer',
    ...shorthands.padding('6px', '12px'),
    ...shorthands.borderRadius('24px'),
    transition: 'background-color 0.2s',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  userName: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightMedium,
    color: tokens.colorNeutralForeground1,
    '@media (max-width: 640px)': {
      display: 'none',
    },
  },
  menuPopover: {
    ...shorthands.borderRadius('12px'),
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
    ...shorthands.padding('8px'),
  },
  menuItem: {
    ...shorthands.borderRadius('8px'),
  },
  authButtons: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('8px'),
  },
});

export const Header: React.FC = () => {
  const styles = useStyles();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoIcon}>🍵</span>
          <span className={styles.logoText}>Spilt Tea</span>
        </Link>

        {isAuthenticated && (
          <nav className={styles.nav}>
            <Link to="/">
              <Button
                appearance="subtle"
                icon={<Home24Regular />}
                className={`${styles.navButton} ${isActive('/') && location.pathname === '/' ? styles.navButtonActive : ''}`}
              >
                Home
              </Button>
            </Link>
            <Link to="/posts">
              <Button
                appearance="subtle"
                icon={<Document24Regular />}
                className={`${styles.navButton} ${isActive('/posts') ? styles.navButtonActive : ''}`}
              >
                Posts
              </Button>
            </Link>
            {user?.role === 'ADMIN' && (
              <Link to="/vetting">
                <Button
                  appearance="subtle"
                  icon={<CheckmarkCircle24Regular />}
                  className={`${styles.navButton} ${isActive('/vetting') ? styles.navButtonActive : ''}`}
                >
                  Vetting
                </Button>
              </Link>
            )}
            <Link to="/search">
              <Button
                appearance="subtle"
                icon={<Search24Regular />}
                className={`${styles.navButton} ${isActive('/search') ? styles.navButtonActive : ''}`}
              >
                Search
              </Button>
            </Link>
          </nav>
        )}

        <div className={styles.userSection}>
          {isAuthenticated && user ? (
            <Menu positioning="below-end">
              <MenuTrigger disableButtonEnhancement>
                <div className={styles.userInfo}>
                  <span className={styles.userName}>{user.username}</span>
                  <Avatar
                    name={user.username}
                    size={32}
                    color="colorful"
                  />
                </div>
              </MenuTrigger>
              <MenuPopover className={styles.menuPopover}>
                <MenuList>
                  <MenuItem
                    icon={<Person24Regular />}
                    onClick={() => navigate(`/profile/${user.id}`)}
                    className={styles.menuItem}
                  >
                    My Profile
                  </MenuItem>
                  <MenuItem
                    icon={<Settings24Regular />}
                    onClick={() => navigate('/settings')}
                    className={styles.menuItem}
                  >
                    Settings
                  </MenuItem>
                  <Divider style={{ margin: '8px 0' }} />
                  <MenuItem
                    icon={<SignOut24Regular />}
                    onClick={handleLogout}
                    className={styles.menuItem}
                  >
                    Sign Out
                  </MenuItem>
                </MenuList>
              </MenuPopover>
            </Menu>
          ) : (
            <div className={styles.authButtons}>
              <Link to="/login">
                <Button appearance="subtle" size="medium">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button appearance="primary" size="medium">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
