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
  console.log(
    `Cloudinary upload: Buffer size ${buffer.length} bytes, Folder: ${options.folder || 'listening-sessions'}`
  );

  // Verify Cloudinary config is set
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    console.error('Cloudinary configuration missing:', {
      hasCloudName: !!process.env.CLOUDINARY_CLOUD_NAME,
      hasApiKey: !!process.env.CLOUDINARY_API_KEY,
      hasApiSecret: !!process.env.CLOUDINARY_API_SECRET,
    });
    throw new Error('Cloudinary configuration missing');
  }

  return new Promise((resolve, reject) => {
    // Set appropriate codec based on format
    // WAV format should not use AAC codec
    const audioCodec =
      options.format === 'wav' ? undefined : options.audio_codec || 'aac';

    const uploadOptions = {
      folder: options.folder || 'listening-sessions',
      resource_type: options.resource_type || 'auto',
      bit_rate: options.bit_rate || '128k',
      format: options.format,
      use_filename: true,
      unique_filename: true,
      overwrite: true,
    };

    // Only add audio_codec if it's defined
    if (audioCodec) {
      // @ts-expect-error - Adding property dynamically
      uploadOptions.audio_codec = audioCodec;
    }

    console.log('Cloudinary upload options:', uploadOptions);

    // Create upload stream
    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          reject(error);
          return;
        }

        if (!result) {
          console.error('No result returned from Cloudinary');
          reject(
            new Error('Upload failed: No result returned from Cloudinary')
          );
          return;
        }

        console.log(`Cloudinary upload successful: ${result.secure_url}`);
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
    try {
      uploadStream.write(buffer);
      uploadStream.end();
    } catch (streamError) {
      console.error('Error writing to upload stream:', streamError);
      reject(streamError);
    }
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
    console.log(
      `Deleting Cloudinary file: ${publicId} (type: ${resourceType})`
    );
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    console.log(`Deletion result for ${publicId}: ${result.result}`);
    return { result: result.result };
  } catch (error) {
    console.error(`Error deleting file ${publicId} from Cloudinary:`, error);
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

/**
 * Extract public ID from a Cloudinary URL
 * @param url The Cloudinary URL
 * @returns The public ID of the resource
 */
export function extractPublicIdFromUrl(url: string): string | null {
  try {
    if (!url || typeof url !== 'string') return null;

    // Example URL: https://res.cloudinary.com/dey0ndsrf/video/upload/v1744031034/speaking-assessments/file_xqucvn.wav

    // Parse URL to extract path components
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');

    // Find the index of 'upload' in the path
    const uploadIndex = pathParts.findIndex(part => part === 'upload');
    if (uploadIndex === -1) return null;

    // Skip the upload part and the version part (if it exists)
    let startIndex = uploadIndex + 1;
    if (
      startIndex < pathParts.length &&
      pathParts[startIndex].startsWith('v')
    ) {
      startIndex++;
    }

    // Join the remaining parts to form the public ID, but remove the file extension
    const pathWithExtension = pathParts.slice(startIndex).join('/');
    const lastDotIndex = pathWithExtension.lastIndexOf('.');

    // Remove file extension if it exists
    const publicId =
      lastDotIndex !== -1
        ? pathWithExtension.substring(0, lastDotIndex)
        : pathWithExtension;

    return publicId;
  } catch (error) {
    console.error('Error extracting public ID from URL:', error);
    return null;
  }
}

/**
 * Delete multiple files from Cloudinary based on their URLs
 * @param urls Array of Cloudinary URLs to delete
 * @param resourceType The resource type (default: 'video')
 * @returns Array of deletion results
 */
export async function deleteCloudinaryFiles(
  urls: string[],
  resourceType: string = 'video'
): Promise<
  Array<{ url: string; success: boolean; result?: string; error?: string }>
> {
  console.log(`Attempting to delete ${urls.length} files from Cloudinary`);

  const results = await Promise.allSettled(
    urls.map(async url => {
      const publicId = extractPublicIdFromUrl(url);
      if (!publicId) {
        console.warn(`Could not extract public ID from URL: ${url}`);
        return { url, success: false, error: 'Invalid URL format' };
      }

      try {
        const result = await deleteCloudinaryFile(publicId, resourceType);
        return { url, success: true, result: result.result };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        return { url, success: false, error: errorMessage };
      }
    })
  );

  return results.map(result => {
    if (result.status === 'fulfilled') {
      return result.value;
    } else {
      const url = urls[results.indexOf(result)] || 'unknown';
      return {
        url,
        success: false,
        error: result.reason?.message || 'Unknown error',
      };
    }
  });
}

export default cloudinary;
