import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Cookies from "js-cookie";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { resetCurrentBlogTopic } from "@/redux/slices/currentBlogTopic";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { Timer } from "lucide-react";
import { Progress } from "../ui/progress";
import { resetCurrentUser } from "@/redux/slices/currentUserSlice";

export default function ProfileBanner() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [signOutLoading, setSignOutLoading] = useState<boolean>(false);
  const [userData, setUserData] = useState<any>();
  const userState = useAppSelector((state) => state.currentUser);

  const dailyLimit = {
    used: 20 - userState.limitLeft,
    total: 20,
  };

  const handleLogout = async () => {
    setSignOutLoading(true);
    const { error } = await supabase.auth.signOut();

    if (!error) {
      dispatch(resetCurrentBlogTopic());
      dispatch(resetCurrentUser());
      Cookies.remove("sb-access-token");
      router.push("/login");
      setSignOutLoading(false);
    }
  };
  useEffect(() => {
    const getUser = async () => {
      const token = userState.token;
      const {
        data: { user },
      } = await supabase.auth.getUser(token);
      setUserData(user);
    };
    getUser();
  }, []);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center justify-center p-1 rounded-full bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 transition-all duration-300 hover:shadow-md"
        >
          <Avatar className="h-8 w-8 border-2 border-purple-100 hover:border-purple-200 transition-colors">
            <AvatarImage src="/avatar.png" alt="User Avatar" />
            <AvatarFallback className="bg-purple-100 text-purple-700 font-medium">
              {userData?.identities[0]?.identity_data?.full_name?.charAt(0) ??
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
              {userData?.identities[0]?.identity_data?.full_name?.charAt(0) ??
                "A"}
            </AvatarFallback>
          </Avatar>
          <h3 className="text-lg font-semibold">
            {userData?.identities[0]?.identity_data?.full_name ?? "Admin"}
          </h3>
          <p className="text-sm text-gray-500">
            {userData?.identities[0]?.identity_data?.email}
          </p>
          <div className="flex items-center gap-3 px-4 py-2 bg-purple-50 rounded-full">
            <Timer className="h-4 w-4 text-purple-600" />
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="text-xs text-purple-600">Daily Credits</span>
                <span className="text-sm font-medium text-purple-700">
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
