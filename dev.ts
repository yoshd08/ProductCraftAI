import { config } from 'dotenv';
config();

import '@/ai/flows/analyze-case-study.ts';
import '@/ai/flows/suggest-improvements.ts';
import '@/ai/flows/recommend-frameworks.ts';
import '@/ai/flows/analyze-brand.ts';
import '@/ai/tools/webScraper.ts';
