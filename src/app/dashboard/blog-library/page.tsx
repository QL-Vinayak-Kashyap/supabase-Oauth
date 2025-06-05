
'use client'

import { useEffect, useState } from "react";
import { Edit, Search, Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import Loading from "@/components/app/Loading";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export interface Topics {
  id: string;
  topic_name: string;
  tone: string;
  created_at: Date;
}

const page = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useAppDispatch();
  const userState = useAppSelector((state) => state.currentUser);
  const [topicLoading, setTopicLoading] = useState<boolean>(false);
  const [topics, setTopics] = useState<Topics[]>([]);
  const router = useRouter();

  const filteredItems = topics?.filter(item =>
    item.topic_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTopics = async () => {
    try {
      setTopicLoading(true);
      const { data: topics } = await supabase
        .from("Topics")
        .select("*")
        .eq("user_id", userState.id);
      if (topics) {
        setTopics(topics);
      }
    } catch (error) {
      toast(error)
    } finally {
      setTopicLoading(false);
    }
  };

  const handleDeleteTopic = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('Topics')
        .delete()
        .eq('id', id)
      if (error) {
        throw new Error(error.message);
      } else {
        getTopics();
        toast("Topic Deleted Succesfully");
      }
    } catch (error) {
      toast(error);
    }
  }

  const handleCreateNewTopic = () => {
    // dispatch
    router.push('/dashboard/blog-writer');
  }

  useEffect(() => {
    getTopics();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl md:text-3xl font-bold">History</h1>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
              />
            </div>
            <Button className="bg-grey-00 hover:bg-grey-700 text-black" onClick={() => handleCreateNewTopic()}>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Write New Blog
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            {/* Table Header */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border-b bg-gray-50 font-medium text-sm text-gray-600">
              <div className="md:col-span-7">Topic name</div>
              <div className="md:col-span-3">Created on</div>
              <div className="md:col-span-1"></div>
            </div>

            {/* Table Body */}
            {
              topicLoading ? <Loading /> : <> {filteredItems.map((item) => (
                <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border-b hover:bg-gray-50 transition-colors">
                  <div className="md:col-span-7">
                    <div className="space-y-2">
                      <h3 className="font-medium text-gray-900">{item.topic_name}</h3>
                      <div className="flex gap-2">
                        <span className="text-sm text-gray-600">{item.tone}</span>
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-3 text-sm text-gray-600">
                    {moment(item.created_at).fromNow()}
                  </div>
                  <div className="md:col-span-1">
                    <div className="flex gap-2">
                      <Link href={`/blog/${item.id}`}>
                        <Edit className="w-4 h-4" />
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger><Trash2 className="w-4 h-4" /></AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete your account
                              and remove your data from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteTopic(item.id)}>Continue</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              ))}</>
            }
            {filteredItems.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No history items found
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default page;
