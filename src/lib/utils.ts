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
  BLOG ="/blog",
}

export enum TablesName {
  BLOGS = "Blogs",
  TOPICS = "Topics",
}
export const toneOptions = [
  { value: "professional", label: "Professional" },
  { value: "casual", label: "Casual" },
  { value: "friendly", label: "Friendly" },
  { value: "formal", label: "Formal" },
  { value: "conversational", label: "Conversational" },
  { value: "authoritative", label: "Authoritative" },
  { value: "humorous", label: "Humorous" },
  { value: "inspirational", label: "Inspirational" },
  { value: "educational", label: "Educational" },
  { value: "persuasive", label: "Persuasive" }
];