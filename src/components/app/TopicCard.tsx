import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function TopicCard({
  topicData,
  isLoading,
}: {
  topicData: any;
  isLoading: boolean;
}) {
  return (
    // <Card className="mx-auto">
    //   <CardHeader>
    //     {isLoading ? (
    //       <>
    //         <Skeleton className="h-6 w-3/4 mb-2" />
    //         <Skeleton className="h-4 w-1/3" />
    //       </>
    //     ) : (
    //       <>
    //         <CardTitle>{topicData?.topic_name}</CardTitle>
    //         <CardDescription>{topicData?.tone}</CardDescription>
    //       </>
    //     )}
    //   </CardHeader>
    //   <CardContent>
    //     {isLoading ? (
    //       <Skeleton className="h-4 w-1/2" />
    //     ) : (
    //       <p className="text-base font-medium">{topicData?.main_keyword}</p>
    //     )}
    //   </CardContent>
    //   <CardFooter>
    //     {isLoading ? (
    //       <Skeleton className="h-4 w-2/3" />
    //     ) : (
    //       <p className="text-sm text-muted-foreground">
    //         {topicData?.secondary_keywords}
    //       </p>
    //     )}
    //   </CardFooter>
    // </Card>
    <div className="bg-[#fcfbfe] mx-auto p-4 rounded-lg ">
      <div className="mb-4">
        {isLoading ? (
          <>
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/3" />
          </>
        ) : (
          <>
            <h2 className="text-2xl font-semibold">{topicData?.topic_name}</h2>
            <p className="text-sm text-gray-500">
              {topicData?.tone.toUpperCase()}
            </p>
          </>
        )}
      </div>
      {/* <div className="mb-4">
        {isLoading ? (
          <Skeleton className="h-4 w-1/2" />
        ) : (
          <p className="text-base font-medium">{topicData?.main_keyword}</p>
        )}
      </div>
      <div>
        {isLoading ? (
          <Skeleton className="h-4 w-2/3" />
        ) : (
          <p className="text-sm text-muted-foreground">
            {topicData?.secondary_keywords}
          </p>
        )}
      </div> */}
    </div>
  );
}
