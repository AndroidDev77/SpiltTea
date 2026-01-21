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
} from '@fluentui/react-components';
import {
  Person24Regular,
  SignOut24Regular,
  Search24Regular,
  Home24Regular,
  Document24Regular,
  CheckmarkCircle24Regular,
} from '@fluentui/react-icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const useStyles = makeStyles({
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shorthands.padding('16px', '24px'),
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.borderBottom('1px', 'solid', tokens.colorNeutralStroke1),
    height: '64px',
  },
  logo: {
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorBrandForeground1,
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('8px'),
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('8px'),
  },
  navLink: {
    textDecoration: 'none',
    color: tokens.colorNeutralForeground1,
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('12px'),
  },
  userName: {
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground2,
  },
});

export const Header: React.FC = () => {
  const styles = useStyles();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logo}>
        🍵 Spilt Tea
      </Link>

      {isAuthenticated && (
        <nav className={styles.nav}>
          <Link to="/" className={styles.navLink}>
            <Button appearance="subtle" icon={<Home24Regular />}>
              Home
            </Button>
          </Link>
          <Link to="/posts" className={styles.navLink}>
            <Button appearance="subtle" icon={<Document24Regular />}>
              Posts
            </Button>
          </Link>
          <Link to="/vetting" className={styles.navLink}>
            <Button appearance="subtle" icon={<CheckmarkCircle24Regular />}>
              Vetting
            </Button>
          </Link>
          <Link to="/search" className={styles.navLink}>
            <Button appearance="subtle" icon={<Search24Regular />}>
              Search
            </Button>
          </Link>
        </nav>
      )}

      <div className={styles.userSection}>
        {isAuthenticated && user ? (
          <>
            <span className={styles.userName}>{user.username}</span>
            <Menu>
              <MenuTrigger disableButtonEnhancement>
                <Button appearance="subtle" icon={<Person24Regular />} />
              </MenuTrigger>
              <MenuPopover>
                <MenuList>
                  <MenuItem onClick={() => navigate(`/profile/${user.id}`)}>
                    Profile
                  </MenuItem>
                  <MenuItem onClick={handleLogout} icon={<SignOut24Regular />}>
                    Logout
                  </MenuItem>
                </MenuList>
              </MenuPopover>
            </Menu>
          </>
        ) : (
          <>
            <Link to="/login">
              <Button appearance="subtle">Login</Button>
            </Link>
            <Link to="/register">
              <Button appearance="primary">Register</Button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
};
