import i18n from '@/libs/i18n';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const savedLanguage = localStorage.getItem('i18nextLng') || 'en';

interface I18nState {
  language: string;
}

const initialState: I18nState = {
  language: savedLanguage, // 默认语言
};

export const i18nSlice = createSlice({
  name: 'i18n',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
      i18n.changeLanguage(action.payload);
    },
  },
});

export const { setLanguage } = i18nSlice.actions;
export default i18nSlice.reducer;
