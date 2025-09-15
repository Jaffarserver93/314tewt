'use server';

/**
 * @fileOverview Generates dynamic hero text for the JXFRCloud™ homepage.
 *
 * - generateDynamicHeroText - A function that generates the headline and subtext for the hero section.
 * - DynamicHeroTextInput - The input type for the generateDynamicHeroText function.
 * - DynamicHeroTextOutput - The return type for the generateDynamicHeroText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DynamicHeroTextInputSchema = z.object({
  currentTrends: z
    .string()
    .describe(
      'A comma separated list of trending keywords or topics related to hosting, domains, and VPS solutions in India.'
    ),
  userData: z.string().optional().describe('Optional data about the user.'),
});
export type DynamicHeroTextInput = z.infer<typeof DynamicHeroTextInputSchema>;

const DynamicHeroTextOutputSchema = z.object({
  headline: z.string().describe('The generated headline for the hero section.'),
  subtext: z.string().describe('The generated subtext for the hero section.'),
});
export type DynamicHeroTextOutput = z.infer<typeof DynamicHeroTextOutputSchema>;

export async function generateDynamicHeroText(
  input: DynamicHeroTextInput
): Promise<DynamicHeroTextOutput> {
  return generateDynamicHeroTextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'dynamicHeroTextPrompt',
  input: {schema: DynamicHeroTextInputSchema},
  output: {schema: DynamicHeroTextOutputSchema},
  prompt: `You are a marketing copywriter specializing in creating engaging hero section text for websites.

  Based on the current trends and optional user data, generate a compelling headline and subtext for JXFRCloud™, a hosting company specializing in domain registration, Minecraft hosting, and VPS solutions for Indian users.

  Current Trends: {{{currentTrends}}}
  User Data: {{{userData}}}

  Headline should be short, attention-grabbing, and incorporate a gradient and glow effect.
  Subtext should be informative and highlight the key services offered by JXFRCloud™.

  Ensure the generated text is relevant to the Indian market.

  Output in JSON format:
  {
    "headline": "Generated Headline",
    "subtext": "Generated Subtext"
  }`,
});

const generateDynamicHeroTextFlow = ai.defineFlow(
  {
    name: 'generateDynamicHeroTextFlow',
    inputSchema: DynamicHeroTextInputSchema,
    outputSchema: DynamicHeroTextOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
