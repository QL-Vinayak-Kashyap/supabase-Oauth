"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Loader } from "lucide-react";

const LoaderComp = () => {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 500); // Simulating a short delay for effect

    return () => clearTimeout(timeout);
  }, [pathname]); // Trigger loader on route change

  return (
    loading && (
      <div className="fixed top-0 left-0 w-full h-screen bg-black/50 flex items-center justify-center">
        <div className="loader">
          <Loader className="animate-rotate h-6 w-6 self-center" size="sm" />
        </div>
      </div>
    )
  );
};

export default LoaderComp;
