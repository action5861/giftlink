import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY as string,
});

export async function generateImage(prompt: string): Promise<string | null> {
  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
      style: "natural",
    });

    // response.data[0].url이 undefined일 수 있으므로 체크
    const imageUrl = response.data[0]?.url;
    return imageUrl || null;  // undefined인 경우 null 반환

  } catch (error) {
    console.error('Image generation error:', error);
    return null;
  }
}