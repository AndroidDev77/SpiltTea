import { axiosInstance } from '../client';
import type { FileUploadResponse } from '../../types';

export const storageApi = {
  uploadFile: async (file: File): Promise<FileUploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axiosInstance.post<FileUploadResponse>('/storage/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteFile: async (fileId: string): Promise<void> => {
    await axiosInstance.delete(`/storage/${fileId}`);
  },

  getFileUrl: (fileId: string): string => {
    return `${axiosInstance.defaults.baseURL}/storage/${fileId}`;
  },
};
