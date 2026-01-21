import { axiosInstance } from '../client';

interface UploadUrlResponse {
  uploadUrl: string;
  key: string;
  publicUrl: string;
}

export const storageApi = {
  /**
   * Get a presigned URL for uploading a file to S3
   */
  getUploadUrl: async (filename: string, contentType: string): Promise<UploadUrlResponse> => {
    const response = await axiosInstance.post<UploadUrlResponse>('/storage/upload-url', {
      filename,
      contentType,
    });
    return response.data;
  },

  /**
   * Upload a file to S3 using a presigned URL
   * Returns the public URL of the uploaded file
   */
  uploadFile: async (file: File): Promise<string> => {
    // 1. Get presigned upload URL
    const { uploadUrl, publicUrl } = await storageApi.getUploadUrl(file.name, file.type);

    // 2. Upload directly to S3
    await fetch(uploadUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });

    // 3. Return the public URL
    return publicUrl;
  },

  /**
   * Get a presigned download URL for a file
   */
  getDownloadUrl: async (key: string, expiresIn?: number): Promise<string> => {
    const response = await axiosInstance.get<{ downloadUrl: string }>('/storage/download-url', {
      params: { key, expiresIn },
    });
    return response.data.downloadUrl;
  },
};
