import React, { useRef } from 'react';
import { mount } from 'enzyme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import profileReducer from '@/store/profile-slice';
import { useProfile, useDID } from '.';
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
    const mockProfile = {
      avatar: 'avatar-url',
      username: 'Test User',
      did: 'test-did',
      email: 'test@example.com',
      phone: '1234567890',
    };
    (api.getProfileById as jest.Mock).mockResolvedValue(mockProfile);

    const TestComponent = () => {
      const { isLoading, profile, error } = useProfile('test-did');
      return (
        <div>
          {isLoading && <div data-testid="loading">Loading...</div>}
          {profile && <div data-testid="name">Name: {profile.username}</div>}
          {error && <div data-testid="error">Error: {error}</div>}
        </div>
      );
    };

    const wrapper = mount(
      <TestComponent />,
      { wrappingComponent: createWrapper() }
    );

    expect(wrapper.find('div[data-testid="loading"]').text()).toContain('Loading...');

    await new Promise(resolve => setTimeout(resolve, 1000));
    wrapper.update();

    expect(wrapper.find('div[data-testid="loading"]')).toHaveLength(0);
    expect(wrapper.find('div[data-testid="name"]').text()).toContain('Name: Test User');
    expect(wrapper.find('div[data-testid="error"]')).toHaveLength(0);
  });

 

  it('应该提供一个刷新方法', () => {
    const TestComponent = () => {
      const { refreshProfile } = useProfile('refresh-did');
      const divRef = useRef(null);
      return <div ref={divRef}>{typeof refreshProfile === 'function' ? 'function' : 'not a function'}</div>;
    };

    const wrapper = mount(
      <TestComponent />,
      { wrappingComponent: createWrapper() }
    );

    expect(wrapper.find('div').text()).toBe('function');
  });
});

describe('useDID hook', () => {
  it('应该从 URL 参数中提取 DID', () => {
    const TestComponent = () => {
      const { did } = useDID();
      return <div>{did}</div>;
    };

    const wrapper = mount(
      <TestComponent />,
      {
        wrappingComponent: ({ children }: { children: React.ReactNode }) => (
          <MemoryRouter initialEntries={['/?did=test-did']}>
            {children}
          </MemoryRouter>
        ),
      }
    );

    expect(wrapper.find('div').text()).toBe('test-did');
  });

  it('当 URL 中没有 DID 参数时应该返回 null', () => {
    const TestComponent = () => {
      const { did } = useDID();
      return <div>{did ?? 'null'}</div>;
    };

    const wrapper = mount(
      <TestComponent />,
      {
        wrappingComponent: ({ children }: { children: React.ReactNode }) => (
          <MemoryRouter initialEntries={['/']}>
            {children}
          </MemoryRouter>
        ),
      }
    );

    expect(wrapper.find('div').text()).toBe('null');
  });
});