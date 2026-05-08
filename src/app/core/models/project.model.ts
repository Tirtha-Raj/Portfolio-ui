export interface Project {
  id: number;
  title: string;
  description: string;
  techStack: string;
  githubUrl?: string;
  liveUrl?: string;
  viewsCount: number;
  likesCount: number;
  userHasLiked?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
