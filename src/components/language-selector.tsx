import { MenuItem, Button, Menu } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { setLanguage } from '@/store/language-slice';

export default function LanguageSelector() {
  const { t } = useTranslation();

  const locale: string = useSelector((state: RootState) => state.i18n.language);
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleChange = (value: string) => {
    handleClose();
    dispatch(setLanguage(value));
    // navigate(`/${value}`);
  };
  return (
    <>
      <Button
        id="basic-language-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        className="!text-white hover:bg-white/10 w-28">
        {locale === 'en' ? t('english') : t('chinese')}
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-language-button',
        }}>
        <MenuItem onClick={() => handleChange('en')} value="en">
          {t('english')}
        </MenuItem>
        <MenuItem onClick={() => handleChange('zh')} value="zh">
          {t('chinese')}
        </MenuItem>
      </Menu>
    </>
  );
}
