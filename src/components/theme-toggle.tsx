import { IconButton } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme } from '@/store/theme-slice';

export default function ThemeToggle() {
  const dispatch = useDispatch();
  const themeMode = useSelector((state: any) => state.theme.mode);
  // const { setTheme: setNextTheme } = useTheme();

  return (
    <IconButton
      className="!text-white hover:bg-white/10"
      onClick={() => {
        const newTheme = themeMode === 'light' ? 'dark' : 'light';
        dispatch(setTheme(newTheme));
        // setNextTheme(newTheme);
      }}>
      {themeMode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
    </IconButton>
  );
}
