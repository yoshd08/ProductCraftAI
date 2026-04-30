export type FrameworkName =
  | 'MVP'
  | 'JTBD'
  | 'RICE'
  | 'SWOT'
  | 'PESTLE'
  | 'Five Forces'
  | 'Ansoff Matrix'
  | 'BCG Matrix'
  | 'Value Chain'
  | 'Porter Generic Strategies'
  | 'Blue Ocean Strategy'
  | 'Lean Startup'
  | 'Design Thinking'
  | 'Agile'
  | 'Scrum'
  | 'Kanban'
  | 'Waterfall'
  | 'Six Sigma'
  | 'Total Quality Management'
  | 'Theory of Constraints'
  | 'GIST Planning';

export const ALL_FRAMEWORKS: FrameworkName[] = [
  'MVP', // Minimum Viable Product
  'JTBD', // Jobs to Be Done
  'RICE', // Reach, Impact, Confidence, Effort
  'SWOT', // Strengths, Weaknesses, Opportunities, Threats
  'PESTLE', // Political, Economic, Social, Technological, Legal, Environmental
  'Five Forces', // Porter's Five Forces
  'Ansoff Matrix',
  'BCG Matrix', // Boston Consulting Group Matrix
  'Value Chain', // Value Chain Analysis
  'Porter Generic Strategies',
  'Blue Ocean Strategy',
  'Lean Startup',
  'Design Thinking',
  'Agile',
  'Scrum',
  'Kanban',
  'Waterfall',
  'Six Sigma',
  'Total Quality Management', // Total Quality Management (TQM)
  'Theory of Constraints', // Theory of Constraints (TOC)
  'GIST Planning', // GIST Planning (Goals, Ideas, Step-projects, Tasks)
];

export const MAX_FRAMEWORKS_SELECTABLE = 5;
