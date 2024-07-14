import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { setProfile, setError } from '@/store/profile-slice';
import { getProfileById } from '@/libs/api';

import { useQuery, useQueryClient } from '@tanstack/react-query';

import { AppDispatch, RootState } from '../store';
import { useLocation } from 'react-router-dom';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;


export const useProfile = (did: string | null) => {
  console.log('did', did);
  const queryClient = useQueryClient();

  const dispatch = useDispatch();
  const profileState = useSelector((state: RootState) => state.profile);

  const { isLoading, error, data } = useQuery({
    queryKey: ['profile'],
    queryFn: () => did ? getProfileById(did) : Promise.resolve(null),
    enabled: !!did && !profileState.data,
  });
  useEffect(() => {
    if (error) {
      dispatch(setError(error?.message));
      return;
    }
    if (data) {
      dispatch(setProfile(data));
    }
  }, [data, dispatch, error]);

  // 提供一个方法来手动刷新数据
  const refreshProfile = () => {
    queryClient.invalidateQueries({ queryKey: ['profile'] });
  };

  return {
    profile: profileState.data,
    isLoading,
    error: profileState.error,
    refreshProfile,
  };
};


export function useDID() {
  const [did, setDID] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    let currentDID = params.get('did');

    if (currentDID) {
      setDID(currentDID);
    }
  }, [location]);

  return { did, setDID };
}