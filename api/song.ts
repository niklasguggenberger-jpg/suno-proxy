import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

const SUNO_URL = 'https://studio-api.suno.ai';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const cookie = process.env.SUNO_COOKIE;

  if (!cookie) {
    return res.status(500).json({ error: 'Missing SUNO_COOKIE in environment variables.' });
  }

  const { prompt, style, title } = req.body;

  if (!prompt || !style || !title) {
    return res.status(400).json({ error: 'Missing prompt, style, or title.' });
  }

  try {
    const response = await axios.post(
      `${SUNO_URL}/api/generate/song/`,
      {
        prompt,
        style,
        title
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Cookie': cookie
        }
      }
    );

    res.status(200).json(response.data);
  } catch (error: any) {
    console.error('Error from Suno API:', error?.response?.data || error.message);
    res.status(500).json({ error: 'Failed to generate song.', details: error?.response?.data || error.message });
  }
}
