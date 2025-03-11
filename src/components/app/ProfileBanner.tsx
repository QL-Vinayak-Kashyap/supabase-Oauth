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
import { useDispatch } from "react-redux";

export default function ProfileBanner() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [signOutLading, setSignOutLogin] = useState(false);
  const [userdata, setUserData] = useState<any>();

  const handleLogout = async () => {
    setSignOutLogin(true);
    const { error } = await supabase.auth.signOut();

    if (!error) {
      dispatch(resetCurrentBlogTopic());
      Cookies.remove("sb-access-token");
      router.push("/login");
      setSignOutLogin(false);
    }
  };
  useEffect(() => {
    const getUser = async () => {
      const token = JSON.parse(
        localStorage.getItem("sb-ggwdyutynlfgigfwmzug-auth-token") ?? ""
      );
      const {
        data: { user },
      } = await supabase.auth.getUser(token?.access_token);
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
            {userdata?.identities[0]?.full_name ?? "Admin"}
          </h3>
          <p className="text-sm text-gray-500">
            {userdata?.identities[0]?.email}
          </p>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full mt-2"
          >
            {signOutLading ? "Loading..." : "Logout"}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
