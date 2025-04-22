import { useMemo } from "react";

const useCurrentYear = () => {
  const currentYear = useMemo(() => new Date().getFullYear(), []);
  return currentYear;
};

export default useCurrentYear;
