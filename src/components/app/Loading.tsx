// components/Loading.tsx
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Loading() {
  const loadingTexts = ["Generating content", "Thinking...", "Almost there!"];

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 p-4 text-center">
      <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      <motion.div
        key={loadingTexts[0]}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ repeat: Infinity, repeatType: "loop", duration: 2 }}
        className="text-lg font-medium text-gray-700"
      >
        {loadingTexts[Math.floor(Math.random() * loadingTexts.length)]}
      </motion.div>
    </div>
  );
}
