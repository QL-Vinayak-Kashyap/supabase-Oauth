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
