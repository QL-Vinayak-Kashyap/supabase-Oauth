import { Skeleton } from "../ui/skeleton";
import StickySupportButton from "./StickySUpportButton";
import { generatedBlogTypes } from "@/types";

export default function TopicCard({
  topicData,
  isLoading,
  feedbackUpdated,
  generatedBlogData
}: Readonly<{
  topicData: any;
  isLoading: boolean;
  feedbackUpdated: Number;
  generatedBlogData: generatedBlogTypes[]
}>) {
  return (
    <div className="flex justify-between bg-muted mx-auto p-4 rounded-b-lg sticky top-16 border-b-[8px] border-white z-10">
      <div className="">
        {isLoading ? (  
          <>
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/3" />
          </>
        ) : (
          <div className="items-center">
            <h2 className="text-2xl capitalize font-semibold">{topicData?.topic_name}</h2>
            <p className="text-sm text-gray-500">
              {topicData?.tone?.toUpperCase()}
            </p>
          </div>
        )}
      </div>
      <StickySupportButton  topicName={topicData?.topic_name} generatedBlogData ={generatedBlogData} id={topicData?.id} feedbackUpdated={feedbackUpdated}/>
    </div>
  );
}
