import { createTheme } from '@mui/material/styles';

export type ThemeMode = 'light' | 'dark';

export const getTheme = (mode: ThemeMode) =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: mode === 'light' ? '#1976d2' : '#90caf9',
      },
      secondary: {
        main: mode === 'light' ? '#dc004e' : '#f48fb1',
      },
    },
  });
