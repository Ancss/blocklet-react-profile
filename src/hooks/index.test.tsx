// @ts-ignore
import { renderHook, act } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import profileReducer from '@/store/profile-slice';
import { useProfile, useDID } from './';
import * as api from '@/libs/api';

jest.mock('@/libs/api');

// 创建一个包装器组件来提供必要的上下文
const createWrapper = () => {
  const queryClient = new QueryClient();
  const store = configureStore({
    reducer: {
      profile: profileReducer,
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <MemoryRouter>
          <Routes>
            <Route path="*" element={children} />
          </Routes>
        </MemoryRouter>
      </Provider>
    </QueryClientProvider>
  );
};

describe('useProfile hook', () => {
  it('应该在有 DID 时获取配置文件', async () => {
    const mockProfile = { name: 'Test User', age: 30 };
    (api.getProfileById as jest.Mock).mockResolvedValue(mockProfile);

    const { result, waitForNextUpdate } = renderHook(() => useProfile('test-did'), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    await waitForNextUpdate();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.profile).toEqual(mockProfile);
    expect(result.current.error).toBe(null);
  });

  it('应该处理错误情况', async () => {
    const errorMessage = 'Failed to fetch profile';
    (api.getProfileById as jest.Mock).mockRejectedValue(new Error(errorMessage));

    const { result, waitForNextUpdate } = renderHook(() => useProfile('error-did'), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    await waitForNextUpdate();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.profile).toBe(null);
    expect(result.current.error).toBe(errorMessage);
  });

  it('应该提供一个刷新方法', async () => {
    const { result } = renderHook(() => useProfile('refresh-did'), {
      wrapper: createWrapper(),
    });

    expect(typeof result.current.refreshProfile).toBe('function');
  });
});

describe('useDID hook', () => {
  it('应该从 URL 参数中提取 DID', () => {
    const { result } = renderHook(() => useDID(), {
      wrapper: ({ children }: { children: React.ReactNode }) => (
        <MemoryRouter initialEntries={['/?did=test-did']}>
          {children}
        </MemoryRouter>
      ),
    });

    expect(result.current.did).toBe('test-did');
  });

  it('当 URL 中没有 DID 参数时应该返回 null', () => {
    const { result } = renderHook(() => useDID(), {
      wrapper: ({ children }: { children: React.ReactNode }) => (
        <MemoryRouter initialEntries={['/']}>
          {children}
        </MemoryRouter>
      ),
    });

    expect(result.current.did).toBe(null);
  });


});