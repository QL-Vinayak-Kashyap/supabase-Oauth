import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export enum AppRoutes {
  LANDING = "/",
  DASHBOARD = "/dashboard",
  LOGIN = "/login",
  SIGNUP = "/signup",
}

export enum TablesName {
  BLOGS = "Blogs",
  TOPICS = "Topics",
}

export interface BlogData {
  topic: string;
  primaryKeywords: string;
  secondaryKeywords: string[];
  tone: string;
  outline: string;
  generatedBlog: string;
}

export type BlogWizardStep = 'topic' | 'primary' | 'secondary'|'tone'| 'outline' | 'generate';