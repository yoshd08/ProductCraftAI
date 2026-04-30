
'use server';
/**
 * @fileOverview A Genkit tool for scraping text content from a web page.
 *
 * - scrapeWebPage - A tool that fetches a URL and returns its text content.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { JSDOM } from 'jsdom';

export const scrapeWebPage = ai.defineTool(
  {
    name: 'scrapeWebPage',
    description: 'Fetches the content of a web page and returns the main text. Useful for analyzing articles, blog posts, or case studies from a URL.',
    inputSchema: z.object({
      url: z.string().url().describe('The URL of the web page to scrape.'),
    }),
    outputSchema: z.string(),
  },
  async ({ url }) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        // Throw an error that can be caught by the calling flow
        throw new Error(`Failed to fetch URL with status: ${response.status} ${response.statusText}`);
      }
      const html = await response.text();
      
      // Use JSDOM to parse the HTML and extract text content
      const dom = new JSDOM(html);
      const doc = dom.window.document;
      
      // Remove script and style elements, plus common noise
      doc.querySelectorAll('script, style, noscript, nav, header, footer, aside, form').forEach(el => el.remove());
      
      // Get text from the body, which is a reasonable approximation of main content
      let text = doc.body.textContent || '';
      
      // Clean up whitespace
      text = text.replace(/\s+/g, ' ').trim();

      if (!text) {
        return "Could not extract any meaningful text content from the page. The body might be empty or rendered with JavaScript.";
      }

      return text;

    } catch (error) {
      console.error('Error scraping web page:', error);
      // Re-throw the error to be handled by the flow's error handling logic.
      if (error instanceof Error) {
        throw new Error(`Scraping failed: ${error.message}`);
      }
      throw new Error('An unknown error occurred while scraping the web page.');
    }
  }
);
