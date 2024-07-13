import { useEffect } from 'react';
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import { useAppSelector } from '../hooks';
import { ThemeMode, getTheme } from '../libs/theme';
import { RootState } from '../store';

function ThemeWrapper({ children }: React.PropsWithChildren<{}>): JSX.Element {
  const mode = useAppSelector((state: RootState) => state.theme.mode);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', mode === 'dark');
    // 更新 CSS 变量
    document.documentElement.style.setProperty('--color-primary', mode === 'light' ? '#1976d2' : '#90caf9');
    document.documentElement.style.setProperty('--color-secondary', mode === 'light' ? '#dc004e' : '#f48fb1');
  }, [mode]);

  return <MUIThemeProvider theme={getTheme(mode as ThemeMode)}>{children}</MUIThemeProvider>;
}

export default ThemeWrapper;
