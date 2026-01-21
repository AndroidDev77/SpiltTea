import React, { type ReactNode } from 'react';
import { makeStyles, shorthands, tokens } from '@fluentui/react-components';
import { Header } from './Header';

const useStyles = makeStyles({
  layout: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: tokens.colorNeutralBackground2,
  },
  main: {
    flex: 1,
    ...shorthands.padding('24px'),
    maxWidth: '1200px',
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  footer: {
    ...shorthands.padding('16px', '24px'),
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.borderTop('1px', 'solid', tokens.colorNeutralStroke1),
    textAlign: 'center',
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground2,
  },
});

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const styles = useStyles();

  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}>
        © 2024 Spilt Tea. All rights reserved.
      </footer>
    </div>
  );
};
