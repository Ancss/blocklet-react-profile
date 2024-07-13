import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, beforeEach, it } from 'node:test';
// @ts-ignore
import { expect } from '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { SnackbarProvider } from 'notistack';
import ProfileComponent from './profile-display';
import * as hooks from '@/hooks';
import * as api from '@/libs/api';

// Mock 依赖
jest.mock('@/hooks');
jest.mock('@/libs/api');
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

// 创建测试用的 store
const store = configureStore({
  reducer: {
    i18n: () => ({ language: 'en' }),
  },
});

// 创建一个包装器组件
const createWrapper = () => {
  const queryClient = new QueryClient();
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <SnackbarProvider>
          <MemoryRouter>{children}</MemoryRouter>
        </SnackbarProvider>
      </Provider>
    </QueryClientProvider>
  );
};

describe('ProfileComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('应该显示 NoProfileInfo 当没有 DID 时', () => {
    (hooks.useDID as jest.Mock).mockReturnValue({ did: null });

    render(<ProfileComponent />, { wrapper: createWrapper() });

    expect(screen.getByText('connectWallet')).toBeInTheDocument();
  });

  it('应该显示加载状态', () => {
    (hooks.useDID as jest.Mock).mockReturnValue({ did: 'test-did' });
    (hooks.useProfile as jest.Mock).mockReturnValue({ isLoading: true });

    render(<ProfileComponent />, { wrapper: createWrapper() });

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('应该显示错误状态', () => {
    (hooks.useDID as jest.Mock).mockReturnValue({ did: 'test-did' });
    (hooks.useProfile as jest.Mock).mockReturnValue({ error: 'Test error' });

    render(<ProfileComponent />, { wrapper: createWrapper() });

    expect(screen.getByText('Error: Test error')).toBeInTheDocument();
  });

  it('应该显示个人资料信息', () => {
    const mockProfile = {
      avatar: 'avatar-url',
      username: 'Test User',
      did: 'test-did',
      email: 'test@example.com',
      phone: '1234567890',
    };
    (hooks.useDID as jest.Mock).mockReturnValue({ did: 'test-did' });
    (hooks.useProfile as jest.Mock).mockReturnValue({ profile: mockProfile });

    render(<ProfileComponent />, { wrapper: createWrapper() });

    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('email: test@example.com')).toBeInTheDocument();
    expect(screen.getByText('phone: 1234567890')).toBeInTheDocument();
  });

  it('应该允许编辑个人资料', async () => {
    const mockProfile = {
      avatar: 'avatar-url',
      username: 'Test User',
      did: 'test-did',
      email: 'test@example.com',
      phone: '1234567890',
    };
    (hooks.useDID as jest.Mock).mockReturnValue({ did: 'test-did' });
    (hooks.useProfile as jest.Mock).mockReturnValue({ profile: mockProfile });
    (api.updateProfile as jest.Mock).mockResolvedValue(mockProfile);

    render(<ProfileComponent />, { wrapper: createWrapper() });

    // 点击编辑按钮
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));

    // 修改用户名
    const usernameInput = screen.getByLabelText('username');
    fireEvent.change(usernameInput, { target: { value: 'New Username' } });

    // 保存更改
    fireEvent.click(screen.getByRole('button', { name: 'save' }));

    await waitFor(() => {
      expect(api.updateProfile).toHaveBeenCalledWith(expect.objectContaining({
        username: 'New Username',
      }));
    });
  });
});


