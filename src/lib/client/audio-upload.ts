/**
 * Client-side utility for uploading audio recordings
 * This avoids using the Cloudinary module directly on the client side
 */

/**
 * Upload a speaking practice audio recording to the server, which will then upload to Cloudinary
 * @param audioBlob The audio blob to upload
 * @param sessionId The speaking session ID to associate with the audio
 * @returns The Cloudinary URL and public ID
 */
export async function uploadSpeakingRecording(
  audioBlob: Blob,
  sessionId: string
): Promise<{ url: string; publicId: string }> {
  try {
    // Create form data with the audio blob
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');
    formData.append('sessionId', sessionId);

    // Send to server-side API endpoint
    const response = await fetch('/api/speaking/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to upload audio recording');
    }

    const result = await response.json();
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
