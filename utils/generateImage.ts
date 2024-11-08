import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY as string,
});

export async function generateCharacterImage() {
  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `Create a heartwarming watercolor illustration of a young Korean woman (early 20s) 
      caring for her toddler in a pure, innocent way, focusing on love and hope.
      This is for a charitable donation platform to support young parents.
      Show her gentle, caring expression as she holds her child.
      She should look tired but determined, wearing simple but neat casual clothes.
      Style: soft watercolor illustration with warm colors, Korean art style.
      Gentle brushstrokes and warm lighting to create a hopeful atmosphere.
      The image should inspire empathy and support from viewers.
      Focus on the beautiful bond between parent and child,
      expressing the universal values of family love and care.
      Keep the tone respectful and supportive.`,
      n: 1,
      size: "1024x1024",
      quality: "standard",
      style: "natural"
    });

    console.log('DALL-E response:', response);
    return response.data[0].url;
  } catch (error) {
    console.error('Image generation error:', error);
    throw error;
  }
}