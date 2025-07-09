export interface Question {
  id: string;
  title: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  tags: string[];
  description: string;
  answer: string;
  codeExample?: string;
  explanation?: string;
  followUpQuestions?: string[];
  resources?: {
    title: string;
    url: string;
  }[];
}

export interface ComponentDesign {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  design: {
    flowchart: string;
    componentStructure: string[];
    stateManagement: string;
    apiCalls?: string[];
  };
  implementation: string;
  testCases: string[];
}

export type Category = 'javascript' | 'typescript' | 'react' | 'redux' | 'components' | 'architecture' | 'web';

export interface CategoryInfo {
  id: Category;
  name: string;
  description: string;
  levels: {
    beginner?: boolean;
    intermediate?: boolean;
    advanced?: boolean;
  };
}
