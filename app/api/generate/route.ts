import { NextResponse } from 'next/server';
import { generateCharacterImage } from '@/utils/generateImage';

export async function POST() {
  try {
    const imageUrl = await generateCharacterImage();
    console.log('Generated image URL:', imageUrl);

    if (!imageUrl) {
      throw new Error('No image URL generated');
    }

    return NextResponse.json({ url: imageUrl });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to generate image' 
    }, { 
      status: 500 
    });
  }
}