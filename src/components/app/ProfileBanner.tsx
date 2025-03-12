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

export default function ProfileBanner() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [signOutLoading, setSignOutLoading] = useState<boolean>(false);
  const [userData, setUserData] = useState<any>();
  const userState = useAppSelector((state) => state.currentUser);

  const handleLogout = async () => {
    setSignOutLoading(true);
    const { error } = await supabase.auth.signOut();

    if (!error) {
      dispatch(resetCurrentBlogTopic());
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
        <Button variant="ghost" className="rounded-full">
          <Avatar>
            <AvatarImage src="/avatar.png" alt="User Avatar" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-4">
        <div className="flex flex-col items-center gap-2">
          <Avatar className="w-16 h-16">
            <AvatarImage src="/avatar.png" alt="User Avatar" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <h3 className="text-lg font-semibold">
            {userData?.identities[0]?.full_name ?? "Admin"}
          </h3>
          <p className="text-sm text-gray-500">
            {userData?.identities[0]?.email}
          </p>
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
