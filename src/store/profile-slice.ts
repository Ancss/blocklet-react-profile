import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Profile } from '@/libs/types';

interface ProfileState {
  data: Profile | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ProfileState = {
  data: null,
  status: 'idle',
  error: null,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<Profile>) => {
      state.data = action.payload;
      state.status = 'succeeded';
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.status = 'failed';
    },
    clearProfile: (state) => {
      state.data = null;
      state.status = 'idle';
      state.error = null;
    },
  },
});

export const { setProfile, setError, clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
