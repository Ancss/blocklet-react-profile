import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './theme-slice';
import i18nReducer from './language-slice';
import profileReducer from './profile-slice';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    profile: profileReducer,
    i18n: i18nReducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
