import { v2 as cloudinary } from 'cloudinary';

// Initialize Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
  duration: number;
  format: string;
  resourceType: string;
}

/**
 * Upload an audio buffer to Cloudinary
 * @param buffer Buffer containing audio data
 * @param options Upload options
 * @returns Promise with the upload result
 */
export async function uploadAudioBuffer(
  buffer: Buffer,
  options: {
    folder?: string;
    filename?: string;
    resource_type?: 'video' | 'image' | 'raw' | 'auto';
    audio_codec?: string;
    bit_rate?: number | string;
    format?: string;
  } = {}
): Promise<CloudinaryUploadResult> {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder: options.folder || 'listening-sessions',
      resource_type: options.resource_type || 'auto',
      audio_codec: options.audio_codec || 'aac',
      bit_rate: options.bit_rate || '128k',
      format: options.format,
      use_filename: true,
      unique_filename: true,
      overwrite: true,
    };

    // Create upload stream
    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        if (!result) {
          reject(
            new Error('Upload failed: No result returned from Cloudinary')
          );
          return;
        }

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          duration: result.duration || 0,
          format: result.format,
          resourceType: result.resource_type,
        });
      }
    );

    // Write buffer to upload stream
    uploadStream.write(buffer);
    uploadStream.end();
  });
}

/**
 * Delete a file from Cloudinary
 * @param publicId The public ID of the file to delete
 * @returns Promise with deletion result
 */
export async function deleteCloudinaryFile(
  publicId: string,
  resourceType: string = 'video'
): Promise<{ result: string }> {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    return { result: result.result };
  } catch (error) {
    console.error('Error deleting file from Cloudinary:', error);
    throw error;
  }
}

/**
 * Generate a Cloudinary URL with transformation options
 * @param publicId The public ID of the file
 * @param options Transformation options
 * @returns Transformed URL
 */
export function getAudioUrl(
  publicId: string,
  options: {
    format?: string;
    quality?: string | number;
    bit_rate?: string | number;
  } = {}
): string {
  return cloudinary.url(publicId, {
    resource_type: 'video',
    format: options.format || 'mp3',
    quality: options.quality || 'auto',
    bit_rate: options.bit_rate || 'auto',
  });
}

export default cloudinary;
