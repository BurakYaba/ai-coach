import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate an engaging title for a listening session
 *
 * @param transcript The transcript text (optional)
 * @param topic The topic of the session
 * @param level The CEFR level of the content
 * @returns A generated title
 */
export async function generateTitle(
  transcript: string = '',
  topic: string,
  level: string
): Promise<string> {
  try {
    // Use different prompt strategies based on available information
    let prompt: string;

    if (transcript && transcript.length > 0) {
      // If we have a transcript, use it to generate a more relevant title
      prompt = `
Generate a short, engaging title (maximum 8 words) for a language learning listening exercise at ${level} level.
The topic is "${topic}" and here's the beginning of the content:
"${transcript.substring(0, 200)}..."

The title should be catchy, relevant to the content, and appropriate for the language level.
Return only the title without quotes or additional commentary.
`;
    } else {
      // If we only have the topic and level, generate a more generic title
      prompt = `
Generate a short, engaging title (maximum 8 words) for a language learning listening exercise at ${level} level on the topic of "${topic}".
The title should be catchy, suitable for a ${getLevelDescription(level)} learner, and clearly related to the topic.
Return only the title without quotes or additional commentary.
`;
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful assistant that creates engaging titles for language learning content.',
        },
        { role: 'user', content: prompt },
      ],
      max_tokens: 30,
      temperature: 0.7,
    });

    // Extract and clean the title from the response
    const generatedTitle = response.choices[0]?.message?.content?.trim() || '';

    // Remove any quotes that might be present
    const cleanTitle = generatedTitle.replace(/^["']|["']$/g, '');

    // If we get a valid title, return it
    if (cleanTitle && cleanTitle.length > 0) {
      return cleanTitle;
    }

    // Fallback to a basic title
    return generateFallbackTitle(topic, level);
  } catch (error) {
    console.error('Error generating title:', error);
    return generateFallbackTitle(topic, level);
  }
}

/**
 * Generate a fallback title without using AI
 */
function generateFallbackTitle(topic: string, level: string): string {
  // Capitalize the first letter of the topic
  const capitalizedTopic = topic.charAt(0).toUpperCase() + topic.slice(1);

  // Array of templates for different levels
  const templates: Record<string, string[]> = {
    A1: [
      'Basic ${topic} Conversations',
      "Let's Talk About ${topic}",
      'First Steps: ${topic}',
      'Simple ${topic} Talk',
    ],
    A2: [
      'Everyday ${topic}',
      'Exploring ${topic}',
      'Practical ${topic} Talk',
      '${topic} Basics',
    ],
    B1: [
      '${topic} Experiences',
      'Discussing ${topic}',
      '${topic} in Our Lives',
      'Perspectives on ${topic}',
    ],
    B2: [
      'Understanding ${topic}',
      '${topic} in Detail',
      'The World of ${topic}',
      'Exploring ${topic} Together',
    ],
    C1: [
      'Advanced ${topic} Concepts',
      'Complex Views on ${topic}',
      '${topic} Analysis',
      'In-depth ${topic}',
    ],
    C2: [
      'Mastering ${topic} Discourse',
      'Sophisticated ${topic} Debate',
      'Expert ${topic} Discussion',
      'Nuanced ${topic} Perspectives',
    ],
  };

  // Get templates for the specified level or fallback to B1
  const levelTemplates = templates[level] || templates['B1'];

  // Pick a random template
  const randomTemplate =
    levelTemplates[Math.floor(Math.random() * levelTemplates.length)];

  // Replace ${topic} placeholder with actual topic
  return randomTemplate.replace('${topic}', capitalizedTopic);
}

/**
 * Get a description of the language level for prompting
 */
function getLevelDescription(level: string): string {
  const descriptions: Record<string, string> = {
    A1: 'beginner/elementary',
    A2: 'pre-intermediate',
    B1: 'intermediate',
    B2: 'upper-intermediate',
    C1: 'advanced',
    C2: 'proficient/mastery',
  };

  return descriptions[level] || 'intermediate';
}
