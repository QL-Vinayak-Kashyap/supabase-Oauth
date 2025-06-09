import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { resetCurrentBlogTopic } from "@/redux/slices/currentBlogTopic";
import { useAppDispatch, useAppSelector } from "@/utils/customHooks/hooks";
import { Timer } from "lucide-react";
import { Progress } from "../ui/progress";
import { resetCurrentUser } from "@/redux/slices/currentUserSlice";
import useUser from "@/utils/customHooks/useUser";
import {createClient} from "@/utils/supabase/client";

export default function ProfileBanner() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [signOutLoading, setSignOutLoading] = useState<boolean>(false);
  const userState = useAppSelector((state) => state.currentUser);
  const { user } = useUser();
  const supabase =createClient();

  const dailyLimit = {
    used: 5 - userState.limitLeft,
    total: 5,
  };

  const handleLogout = async () => {
    setSignOutLoading(true);
    const { error } = await supabase.auth.signOut();

    if (!error) {
      dispatch(resetCurrentBlogTopic());
      dispatch(resetCurrentUser());
      router.push("/auth/login");
      router.refresh();
      setSignOutLoading(false);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center justify-center p-1 rounded-full bg-gradient-to-r from-grey-500 to-grey-700 hover:from-grey-600 hover:to-grey-800 transition-all duration-300 hover:shadow-md"
        >
          <Avatar className="h-8 w-8 border-2 border-grey-100 hover:border-grey-200 transition-colors">
            <AvatarImage src="/avatar.png" alt="User Avatar" />
            <AvatarFallback className="bg-grey-100 text-grey-700 font-medium capitalize">
              {user?.identities[0]?.identity_data?.full_name?.charAt(0) ??
                "A"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-4">
        <div className="flex flex-col items-center gap-2">
          <Avatar className="w-16 h-16">
            <AvatarImage src="/avatar.png" alt="User Avatar" />
            <AvatarFallback>
              {user?.identities[0]?.identity_data?.full_name?.charAt(0) ??
                "A"}
            </AvatarFallback>
          </Avatar>
          <h3 className="text-lg font-semibold">
            {user?.identities[0]?.identity_data?.full_name ?? "Admin"}
          </h3>
          <p className="text-sm text-gray-500">
            {user?.identities[0]?.identity_data?.email}
          </p>
          <div className="flex items-center gap-3 px-4 py-2 bg-grey-50 rounded-full">
            <Timer className="h-4 w-4 text-grey-600" />
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="text-xs text-grey-600">Daily Credits</span>
                <span className="text-sm font-medium text-grey-700">
                  {dailyLimit.used}/{dailyLimit.total}
                </span>
              </div>
              <Progress
                value={(dailyLimit.used / dailyLimit.total) * 100}
                className="h-1 w-15"
              />
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full mt-2"
          >
            {signOutLoading ? "Loading..." : "Logout"}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
