'use client'

import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

interface ImageGenerationResult {
  success: boolean;
  url?: string;
  error?: string;
}

export async function generateImage(prompt: string): Promise<ImageGenerationResult> {
  try {
    const response = await openai.createImage({
      prompt,
      n: 1,
      size: '1024x1024',
      response_format: 'url',
    });

    const imageUrl = response.data.data[0].url;
    
    if (!imageUrl) {
      throw new Error('No image URL in response');
    }

    return {
      success: true,
      url: imageUrl,
    };
  } catch (error) {
    console.error('Error generating image:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
} 