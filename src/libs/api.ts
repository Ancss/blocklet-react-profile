import { createAxios } from '@blocklet/js-sdk';
import axios from 'axios';
import { Profile } from './types';

const api = createAxios({
  baseURL: window?.blocklet?.prefix || '/',
});
export async function getProfile(): Promise<Profile> {
  try {
    const response = await api.get<Profile>('/api/profile');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Failed to fetch profile: ${error.message}`);
    }
    throw error;
  }
}
export async function getProfileById(did:string): Promise<Profile> {
  try {
    const response = await api.get<Profile>('/api/profile/' + did);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Failed to fetch profile: ${error.message}`);
    }
    throw error;
  }
}
export async function createProfile(profile: Profile): Promise<Profile> {
  try {
    const response = await api.post<Profile>('/api/profile', profile);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Failed to create profile: ${error.message}`);
    }
    throw error;
  }
}

export async function updateProfile(profile: Profile): Promise<Profile> {
  try {
    const response = await api.put<Profile>('/api/profile', profile);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Failed to update profile: ${error.message}`);
    }
    throw error;
  }
}
export default api;
