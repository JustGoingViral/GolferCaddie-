import Anthropic from '@anthropic-ai/sdk';
import { Request, Response } from 'express';

// the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// API handler for chat requests to Claude
export const handleGolfChatRequest = async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    const response = await anthropic.messages.create({
      model: 'claude-3-7-sonnet-20250219',
      max_tokens: 1024,
      system: `You are a highly knowledgeable golf assistant with expertise in golf techniques, rules, equipment, and course management. 
      Your name is "GolfPro AI" and you help golfers improve their game with personalized advice.
      Be concise but helpful, and always try to provide actionable tips that golfers can apply immediately.
      If asked about specific golf courses, players, or tournaments, provide factual information.
      If asked about equipment, provide balanced recommendations based on a player's skill level and needs.`,
      messages: [
        { 
          role: 'user', 
          content: message 
        }
      ],
    });
    
    res.json({ response: response.content[0].text });
  } catch (error) {
    console.error('Error in chat API:', error);
    res.status(500).json({ 
      error: 'Failed to get response from AI',
      message: (error as Error).message 
    });
  }
};