
export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  image: string;
  link?: string;
}

export interface LeadershipActivity {
  id: string;
  title: string;
  role: string;
  description: string;
  keyResult: string;
}

export interface SkillCard {
  title: string;
  subtitle?: string;
}

export enum SectionId {
  Home = 'home',
  Leadership = 'leadership',
  Skills = 'skills',
  Projects = 'projects',
  Contact = 'contact'
}
