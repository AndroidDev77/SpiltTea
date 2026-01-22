import React, { type ReactNode } from 'react';
import { makeStyles, shorthands, tokens } from '@fluentui/react-components';
import { Header } from './Header';

const useStyles = makeStyles({
  layout: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: tokens.colorNeutralBackground3,
  },
  main: {
    flex: 1,
    ...shorthands.padding('32px', '24px'),
    maxWidth: '1280px',
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
    '@media (max-width: 768px)': {
      ...shorthands.padding('16px'),
    },
  },
  footer: {
    ...shorthands.padding('12px', '24px'),
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.borderTop('1px', 'solid', tokens.colorNeutralStroke2),
    textAlign: 'center',
    fontSize: tokens.fontSizeBase100,
    color: tokens.colorNeutralForeground3,
  },
  footerContent: {
    maxWidth: '1280px',
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    ...shorthands.gap('8px'),
  },
  footerLink: {
    color: tokens.colorBrandForeground1,
    textDecoration: 'none',
    ':hover': {
      textDecoration: 'underline',
    },
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
        <div className={styles.footerContent}>
          <span>© 2026 Spilt Tea</span>
          <span>·</span>
          <span>Share your dating experiences. Look up who you're dating. Know before you go.</span>
        </div>
      </footer>
    </div>
  );
};
