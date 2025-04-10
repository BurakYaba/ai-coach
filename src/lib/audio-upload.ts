import { uploadAudioBuffer } from './cloudinary';

/**
 * Convert a Blob to a Buffer
 * @param blob The blob to convert
 */
export async function blobToBuffer(blob: Blob): Promise<Buffer> {
  const arrayBuffer = await blob.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * Upload a speaking practice audio recording to Cloudinary
 * @param audioBlob The audio blob to upload
 * @param sessionId The speaking session ID to associate with the audio
 * @returns The Cloudinary URL and public ID
 */
export async function uploadSpeakingRecording(
  audioBlob: Blob,
  sessionId: string
): Promise<{ url: string; publicId: string }> {
  try {
    // Convert blob to buffer
    const buffer = await blobToBuffer(audioBlob);

    // Upload to Cloudinary
    const result = await uploadAudioBuffer(buffer, {
      folder: 'speaking-assessments',
      filename: `speech-recording-${sessionId}-${Date.now()}`,
      resource_type: 'video', // Cloudinary uses 'video' for audio files
      format: 'wav', // Ensure format is compatible with Azure Speech Service
    });

    return {
      url: result.url,
      publicId: result.publicId,
    };
  } catch (error) {
    console.error('Error uploading speaking recording:', error);
    throw new Error('Failed to upload audio recording');
  }
}

/**
 * Upload multiple speaking practice recordings for a session
 * @param audioBlobs Array of audio blobs to upload
 * @param sessionId The speaking session ID
 * @returns Array of uploaded audio URLs and public IDs
 */
export async function uploadSessionRecordings(
  audioBlobs: Blob[],
  sessionId: string
): Promise<Array<{ url: string; publicId: string }>> {
  try {
    const uploadPromises = audioBlobs.map(blob =>
      uploadSpeakingRecording(blob, sessionId)
    );

    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('Error uploading session recordings:', error);
    throw new Error('Failed to upload session recordings');
  }
}
