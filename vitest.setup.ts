import '@testing-library/jest-dom'
import { vi, expect } from 'vitest'
import React from 'react'

// Mock MUI components to avoid heavy imports during collection
vi.mock('@mui/material', () => ({
  Container: ({ children, maxWidth, disableGutters, ...props }: any) => {
    const { sx, ...domProps } = props;
    return React.createElement('div', { 'data-testid': 'mui-container', ...domProps }, children);
  },
  Typography: ({ children, variant, component, gutterBottom, paragraph, ...props }: any) => {
    const { sx, ...domProps } = props;
    const Component = component || 'div';
    return React.createElement(Component, { 'data-testid': 'mui-typography', ...domProps }, children);
  },
  Link: ({ children, href, ...props }: any) => {
    const { sx, ...domProps } = props;
    return React.createElement('a', { href, 'data-testid': 'mui-link', ...domProps }, children);
  },
  FormControlLabel: ({ control, label, ...props }: any) => {
    const { sx, ...domProps } = props;
    return React.createElement('label', { 'data-testid': 'mui-form-control-label', ...domProps }, [control, React.createElement('span', { key: 'label' }, label)]);
  },
  Switch: ({ checked, onChange, inputProps, ...props }: any) => {
    const { sx, ...domProps } = props;
    return React.createElement('input', { type: 'checkbox', role: 'switch', checked, onChange, 'data-testid': 'mui-switch', ...inputProps, ...domProps });
  },
  Box: ({ children, component = 'div', ...props }: any) => {
    const { sx, ...domProps } = props;
    return React.createElement(component, { 'data-testid': 'mui-box', ...domProps }, children);
  },
  List: ({ children, ...props }: any) => {
    const { sx, ...domProps } = props;
    return React.createElement('ul', { 'data-testid': 'mui-list', ...domProps }, children);
  },
  ListItem: ({ children, component = 'li', href, ...props }: any) => {
    const { sx, ...domProps } = props;
    const Component = href ? 'a' : component;
    return React.createElement(Component, { href, 'data-testid': 'mui-list-item', ...domProps }, children);
  },
  ListItemText: ({ primary, ...props }: any) => {
    const { sx, ...domProps } = props;
    return React.createElement('div', { 'data-testid': 'mui-list-item-text', ...domProps }, primary);
  },
  ListItemIcon: ({ children, ...props }: any) => {
    const { sx, ...domProps } = props;
    return React.createElement('div', { 'data-testid': 'mui-list-item-icon', ...domProps }, children);
  },
  ListItemButton: ({ children, component, ...props }: any) => {
    const { sx, ...domProps } = props;
    const Component = component || 'button';
    return React.createElement(Component, { 'data-testid': 'mui-list-item-button', ...domProps }, children);
  },
  AppBar: ({ children, position, elevation, color, ...props }: any) => {
    const { sx, ...domProps } = props;
    return React.createElement('header', { 'data-testid': 'mui-app-bar', ...domProps }, children);
  },
  Toolbar: ({ children, ...props }: any) => {
    const { sx, ...domProps } = props;
    return React.createElement('div', { 'data-testid': 'mui-toolbar', ...domProps }, children);
  },
  Button: ({ children, href, variant = 'text', startIcon, fullWidth, color, ...props }: any) => {
    const { sx, ...domProps } = props;
    const Component = href ? 'a' : 'button';
    const className = variant === 'contained' ? 'MuiButton-contained' : 
                     variant === 'outlined' ? 'MuiButton-outlined' : 
                     'MuiButton-text';
    return React.createElement(Component, { 
      href, 
      'data-testid': 'mui-button', 
      className,
      ...domProps 
    }, children);
  },
  ButtonGroup: ({ children, ...props }: any) => {
    const { sx, ...domProps } = props;
    return React.createElement('div', { 'data-testid': 'mui-button-group', ...domProps }, children);
  },
  TextField: ({ placeholder, onChange, InputProps, ...props }: any) => {
    const { sx, ...domProps } = props;
    return React.createElement('input', { placeholder, onChange, 'data-testid': 'mui-text-field', ...domProps });
  },
  InputAdornment: ({ children, position, ...props }: any) => {
    const { sx, ...domProps } = props;
    return React.createElement('div', { 'data-testid': 'mui-input-adornment', ...domProps }, children);
  },
  Drawer: ({ children, anchor, open, ...props }: any) => {
    const { sx, ...domProps } = props;
    return React.createElement('aside', { 'data-testid': 'mui-drawer', ...domProps }, children);
  },
  Collapse: ({ children, in: inProp, timeout, unmountOnExit, ...props }: any) => {
    const { sx, ...domProps } = props;
    return React.createElement('div', { 'data-testid': 'mui-collapse', ...domProps }, children);
  },
  Divider: ({ ...props }: any) => {
    const { sx, ...domProps } = props;
    return React.createElement('hr', { 'data-testid': 'mui-divider', ...domProps });
  },
  IconButton: ({ children, ...props }: any) => {
    const { sx, ...domProps } = props;
    return React.createElement('button', { 'data-testid': 'mui-icon-button', ...domProps }, children);
  },
  Popover: ({ children, open, anchorEl, onClose, anchorOrigin, transformOrigin, ...props }: any) => {
    const { sx, PaperProps, ...domProps } = props;
    React.useEffect(() => {
      if (open && onClose) {
        const handleClickOutside = (event: MouseEvent) => {
          // Simulate clicking outside the popover
          if (event.target === document.body) {
            onClose(event, 'backdropClick');
          }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
      }
    }, [open, onClose]);
    
    return open ? React.createElement('div', { 'data-testid': 'mui-popover', role: 'tooltip', ...domProps }, children) : null;
  },
  Avatar: ({ src, alt, onClick, ...props }: any) => {
    const { sx, ...domProps } = props;
    return React.createElement('img', { 
      src, 
      alt, 
      onClick, 
      'data-testid': 'mui-avatar', 
      style: { cursor: onClick ? 'pointer' : 'default' },
      ...domProps 
    });
  },
  Grid: ({ children, container, item, xs, sm, md, lg, xl, ...props }: any) => {
    const { sx, ...domProps } = props;
    return React.createElement('div', { 'data-testid': 'mui-grid', ...domProps }, children);
  },
}))

vi.mock('@mui/icons-material', () => ({
  GitHub: () => React.createElement('svg', { 'data-testid': 'GitHubIcon' }),
  Menu: () => React.createElement('svg', { 'data-testid': 'MenuIcon' }),
  Search: () => React.createElement('svg', { 'data-testid': 'SearchIcon' }),
  Sort: () => React.createElement('svg', { 'data-testid': 'SortIcon' }),
  ExpandLess: () => React.createElement('svg', { 'data-testid': 'ExpandLessIcon' }),
  ExpandMore: () => React.createElement('svg', { 'data-testid': 'ExpandMoreIcon' }),
  StarBorder: () => React.createElement('svg', { 'data-testid': 'StarBorderIcon' }),
}))

vi.mock('next-themes', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: vi.fn(),
  }),
}))

// Extend Vitest matchers with jest-dom
import * as matchers from '@testing-library/jest-dom/matchers'
expect.extend(matchers)

// Lightweight mock Next.js router - no heavy dependencies
const mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
  prefetch: vi.fn(),
  back: vi.fn(),
  reload: vi.fn(),
  asPath: '/',
  pathname: '/',
  query: {},
  route: '/',
  events: {
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn()
  }
}

vi.mock('next/router', () => ({
  useRouter: () => mockRouter,
  withRouter: (Component: any) => Component
}))

// Lightweight Next.js image mock
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: any) => 
    React.createElement('img', { src, alt, ...props })
}))

// Simple html2canvas mock
vi.mock('html2canvas', () => ({
  default: vi.fn(() => Promise.resolve({
    toDataURL: () => 'data:image/png;base64,mock-image-data'
  }))
}))

// Simple cookies mock
vi.mock('cookies-next', () => ({
  getCookie: vi.fn(),
  setCookie: vi.fn(),
  deleteCookie: vi.fn()
}))

// Simple react-ga4 mock
vi.mock('react-ga4', () => ({
  gtag: vi.fn(),
  initialize: vi.fn(),
  event: vi.fn()
}))