import { createTheme, ThemeOptions } from '@mui/material/styles';

// Base theme configuration that works with CSS variables
const baseThemeOptions: ThemeOptions = {
  typography: {
    fontFamily: 'Lato, "Helvetica Neue", Arial, Helvetica, sans-serif',
    h1: {
      fontSize: '2rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '1.714rem',
      fontWeight: 700,
    },
    h3: {
      fontSize: '1.28rem',
      fontWeight: 700,
    },
    h4: {
      fontSize: '1.071rem',
      fontWeight: 700,
    },
    h5: {
      fontSize: '1rem',
      fontWeight: 700,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          transition: 'background-color 0.2s ease, color 0.2s ease',
        },
      },
    },
  },
};

export const lightTheme = createTheme({
  ...baseThemeOptions,
  palette: {
    mode: 'light',
    primary: {
      main: '#c62828', // Deep red
      light: '#ff5f52',
      dark: '#8e0000',
    },
    secondary: {
      main: '#d32f2f', // Slightly lighter red
      light: '#ff6659',
      dark: '#9a0007',
    },
    background: {
      default: '#ffffff',
      paper: '#f5f5f5',
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.6)',
    },
  },
  typography: {
    fontFamily: 'Lato, "Helvetica Neue", Arial, Helvetica, sans-serif',
    h1: {
      fontSize: '2rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '1.714rem',
      fontWeight: 700,
    },
    h3: {
      fontSize: '1.28rem',
      fontWeight: 700,
    },
    h4: {
      fontSize: '1.071rem',
      fontWeight: 700,
    },
    h5: {
      fontSize: '1rem',
      fontWeight: 700,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#ffffff',
          color: 'rgba(0, 0, 0, 0.87)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          borderRadius: '4px',
          border: '1px solid rgba(0, 0, 0, 0.12)',
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          border: '1px solid rgba(0, 0, 0, 0.12)',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
        },
        head: {
          backgroundColor: '#f5f5f5',
          fontWeight: 700,
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  ...baseThemeOptions,
  palette: {
    mode: 'dark',
    primary: {
      main: '#ef5350', // Lighter red for dark theme
      light: '#ff867c',
      dark: '#b61827',
    },
    secondary: {
      main: '#f44336', // Material red
      light: '#ff7961',
      dark: '#ba000d',
    },
    background: {
      default: 'hsl(0, 2%, 20.0%)',
      paper: 'hsl(0, 2%, 18.0%)',
    },
    text: {
      primary: 'rgba(255, 255, 255, 0.87)',
      secondary: 'rgba(255, 255, 255, 0.6)',
    },
    divider: 'rgba(255, 255, 255, 0.12)',
  },
  typography: {
    fontFamily: 'Lato, "Helvetica Neue", Arial, Helvetica, sans-serif',
    h1: {
      fontSize: '2rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '1.714rem',
      fontWeight: 700,
    },
    h3: {
      fontSize: '1.28rem',
      fontWeight: 700,
    },
    h4: {
      fontSize: '1.071rem',
      fontWeight: 700,
    },
    h5: {
      fontSize: '1rem',
      fontWeight: 700,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: 'hsl(0, 2%, 20.0%)',
          color: 'rgba(255, 255, 255, 0.87)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: 'hsl(0, 2%, 18.0%)',
          borderRadius: '4px',
          border: '1px solid rgba(255, 255, 255, 0.12)',
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          backgroundColor: 'hsl(0, 2%, 18.0%)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
        },
        head: {
          backgroundColor: 'hsl(0, 2%, 16.0%)',
          fontWeight: 700,
        },
      },
    },
  },
});