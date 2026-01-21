import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import { describe, it, expect } from 'vitest';
import HomePage from './HomePage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <FluentProvider theme={webLightTheme}>
          {component}
        </FluentProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

describe('HomePage', () => {
  it('renders welcome message', () => {
    renderWithProviders(<HomePage />);
    expect(screen.getByText(/Welcome to Spilt Tea/i)).toBeInTheDocument();
  });

  it('displays trending posts section', () => {
    renderWithProviders(<HomePage />);
    expect(screen.getByText(/Trending Posts/i)).toBeInTheDocument();
  });
});
