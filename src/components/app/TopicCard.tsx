import { Skeleton } from "@/components/ui/skeleton";
import StickySupportButton from "./StickySUpportButton";

export default function TopicCard({
  topicData,
  isLoading,
  feedbackUpdated
}: Readonly<{
  topicData: any;
  isLoading: boolean;
  feedbackUpdated: Number
}>) {
  // console.log("topicData",topicData);
  return (
    <div className="flex justify-between bg-muted mx-auto p-4 rounded-b-lg sticky top-16 border-b-[8px] border-white z-10">
      <div className="mb-4">
        {isLoading ? (    
          <>
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/3" />
          </>
        ) : (
          <div className="flex items-center">
            <h2 className="text-2xl font-semibold">{topicData?.topic_name}</h2>
            <p className="text-sm text-gray-500">
              {topicData?.tone?.toUpperCase()}
            </p>
          </div>
        )}
      </div>
      <StickySupportButton  id={topicData?.id} feedbackUpdated={feedbackUpdated}/>
    </div>
  );
}
