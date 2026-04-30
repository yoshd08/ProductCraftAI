
import type { FrameworkName } from './constants';

export type VisualType = "card" | "chart" | "list" | "timeline" | "matrix" | "flow" | "text";

export interface FrameworkMetaData {
  id: FrameworkName;
  title: string;
  description: string;
  visualType: VisualType;
  metricLabels?: string[]; // For charts like RICE: ["Reach", "Impact", "Confidence", "Effort"]
  // dataStructureHint?: Record<string, string>; // e.g. { coreAssumption: "string", validationMethod: "string" }
  // chartType?: 'bar' | 'pie' | 'radar' | 'line'; // if visualType is 'chart'
}

export const FRAMEWORKS_METADATA: FrameworkMetaData[] = [
  {
    id: 'MVP',
    title: 'Minimum Viable Product',
    description: 'A version of a new product which allows a team to collect the maximum amount of validated learning about customers with the least effort.',
    visualType: 'card',
  },
  {
    id: 'JTBD',
    title: 'Jobs to Be Done',
    description: 'A framework for understanding customer needs based on the "job" they are trying to get done.',
    visualType: 'list',
  },
  {
    id: 'RICE',
    title: 'RICE Scoring Model',
    description: 'A prioritization framework for quantifying the potential value of features, projects, or initiatives. (Reach, Impact, Confidence, Effort)',
    visualType: 'chart',
    metricLabels: ['Reach', 'Impact', 'Confidence', 'Effort'],
  },
  {
    id: 'SWOT',
    title: 'SWOT Analysis',
    description: 'A strategic planning technique used to help a person or organization identify Strengths, Weaknesses, Opportunities, and Threats related to business competition or project planning.',
    visualType: 'matrix',
    metricLabels: ['Strengths', 'Weaknesses', 'Opportunities', 'Threats'],
  },
  {
    id: 'PESTLE',
    title: 'PESTLE Analysis',
    description: 'A framework to analyze the Political, Economic, Social, Technological, Legal, and Environmental factors affecting an organization.',
    visualType: 'list',
    metricLabels: ['Political', 'Economic', 'Social', 'Technological', 'Legal', 'Environmental'],
  },
  {
    id: 'Five Forces',
    title: "Porter's Five Forces",
    description: 'A model that identifies and analyzes five competitive forces that shape every industry and helps determine an industry\'s weaknesses and strengths.',
    visualType: 'list',
    metricLabels: ['Competitive Rivalry', 'Supplier Power', 'Buyer Power', 'Threat of Substitution', 'Threat of New Entry'],
  },
  {
    id: 'Ansoff Matrix',
    title: 'Ansoff Matrix',
    description: 'A strategic planning tool that provides a framework to help executives, senior managers, and marketers devise strategies for future growth.',
    visualType: 'matrix', 
  },
  {
    id: 'BCG Matrix',
    title: 'BCG Matrix',
    description: 'A framework to evaluate the strategic position of a business brand portfolio and its potential. It classifies business portfolio into four categories based on industry attractiveness and competitive position.',
    visualType: 'matrix', 
    metricLabels: ['Stars', 'Cash Cows', 'Question Marks', 'Dogs'],
  },
  {
    id: 'Value Chain',
    title: 'Value Chain Analysis',
    description: 'A process where a firm identifies its primary and support activities that add value to its final product and then analyzes these activities to reduce costs or increase differentiation.',
    visualType: 'flow', 
  },
  {
    id: 'Porter Generic Strategies',
    title: "Porter's Generic Strategies",
    description: 'Describes how a company pursues competitive advantage across its chosen market scope. Three generic strategies are: cost leadership, differentiation, and focus.',
    visualType: 'card',
  },
  {
    id: 'Blue Ocean Strategy',
    title: 'Blue Ocean Strategy',
    description: 'A strategy about creating and capturing uncontested market space, thereby making the competition irrelevant.',
    visualType: 'card',
  },
  {
    id: 'Lean Startup',
    title: 'Lean Startup',
    description: 'A methodology for developing businesses and products, which aims to shorten product development cycles and rapidly discover if a proposed business model is viable.',
    visualType: 'flow', 
  },
  {
    id: 'Design Thinking',
    title: 'Design Thinking',
    description: 'A human-centered, iterative process for creative problem-solving. Phases: Empathize, Define, Ideate, Prototype, Test.',
    visualType: 'flow',
    metricLabels: ['Empathize', 'Define', 'Ideate', 'Prototype', 'Test'],
  },
  {
    id: 'Agile',
    title: 'Agile Methodology',
    description: 'A project management approach that involves breaking the project into phases and emphasizes continuous collaboration and improvement. Iterative approach.',
    visualType: 'card', 
  },
  {
    id: 'Scrum',
    title: 'Scrum Framework',
    description: 'An Agile framework for developing, delivering, and sustaining complex products, with specific roles, events, and artifacts.',
    visualType: 'list', 
  },
  {
    id: 'Kanban',
    title: 'Kanban',
    description: 'A visual system for managing work as it moves through a process. It visualizes both the process and the actual work passing through that process.',
    visualType: 'matrix', 
    metricLabels: ['To Do', 'In Progress', 'Done'], // Example labels
  },
  {
    id: 'Waterfall',
    title: 'Waterfall Model',
    description: 'A sequential design process in which progress is seen as flowing steadily downwards (like a waterfall) through the phases of conception, initiation, analysis, design, construction, testing, deployment and maintenance.',
    visualType: 'flow',
  },
  {
    id: 'Six Sigma',
    title: 'Six Sigma',
    description: 'A set of techniques and tools for process improvement. It seeks to improve the quality of the output of a process by identifying and removing the causes of defects and minimizing variability.',
    visualType: 'card', 
  },
  {
    id: 'Total Quality Management',
    title: 'Total Quality Management (TQM)',
    description: 'A management approach to long-term success through customer satisfaction. All members of an organization participate in improving processes, products, services, and the culture in which they work.',
    visualType: 'card',
  },
  {
    id: 'Theory of Constraints',
    title: 'Theory of Constraints (TOC)',
    description: 'A methodology for identifying the most important limiting factor (i.e., constraint) that stands in the way of achieving a goal and then systematically improving that constraint until it is no longer the limiting factor.',
    visualType: 'card',
  },
  {
    id: 'GIST Planning',
    title: 'GIST Planning',
    description: 'A lightweight planning framework that focuses on Goals, Ideas, Step-projects, and Tasks.',
    visualType: 'list',
    metricLabels: ['Goals', 'Ideas', 'Step-projects', 'Tasks'],
  },
];

export function getFrameworkMetaData(id: FrameworkName): FrameworkMetaData | undefined {
  return FRAMEWORKS_METADATA.find(fm => fm.id === id);
}
