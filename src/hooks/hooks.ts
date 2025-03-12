import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/redux/store";

// Custom hook for useSelector with type safety
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Custom hook for useDispatch with type safety
export const useAppDispatch = () => useDispatch<AppDispatch>();
