// "use client";

// import { useState } from "react";
// import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Plus } from "lucide-react";

// export default function NewChatOverlay({ openDialog, setOpenDialog }) {
//   const [search, setSearch] = useState("");

//   return (
//     <Dialog open={openDialog} onOpenChange={setOpenDialog}>
//       <DialogTrigger asChild>
//         <Button variant="ghost" className="gap-2">
//           <Plus className="w-4 h-4" />
//           Create New Chat
//         </Button>
//       </DialogTrigger>

//       <DialogContent className="sm:max-w-md bg-muted text-muted-foreground border border-border">
//         <div className="space-y-4">
//           {/* <Input
//             placeholder="Search..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="bg-background text-foreground"
//           /> */}

//           <div className="text-sm text-muted-foreground">
//             Recent Conversations
//           </div>

//           <ul className="space-y-2">
//             {/* Example items — you can map over dynamic data here */}
//             <li className="hover:bg-accent p-2 rounded cursor-pointer text-sm">
//               Markdown to Word Document Converter
//             </li>
//             <li className="hover:bg-accent p-2 rounded cursor-pointer text-sm">
//               Markdown Editor Cursor Misalignment Issue
//             </li>
//           </ul>

//           <div className="text-xs text-muted-foreground text-right">
//             6 days ago
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }

import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Command,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
  CommandEmpty,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Copy, ExternalLink, PenSquare } from "lucide-react";

type ChatItem = {
  id: string;
  title: string;
  timestamp: string;
  timeAgo: string;
  isCurrent?: boolean;
};

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NewChatOverlay = ({ open, onOpenChange }: SearchDialogProps) => {
  // Sample data for the dialog content
  const [chatGroups] = useState({
    yesterday: [
      {
        id: "1",
        title: "Markdown to Word Document Conversion",
        timestamp: "2025-04-14",
        timeAgo: "19 hours ago",
        isCurrent: true,
      },
    ],
    lastWeek: [
      {
        id: "2",
        title: "Markdown Editor Cursor Misalignment Issue",
        timestamp: "2025-04-10",
        timeAgo: "5 days ago",
      },
    ],
  });

  const handleEditChat = (chatId: string) => {
    console.log("Edit chat:", chatId);
    onOpenChange(false);
  };

  const handleDeleteChat = (chatId: string) => {
    console.log("Delete chat:", chatId);
  };

  const handleCopyLink = (chatId: string) => {
    console.log("Copy link for chat:", chatId);
  };

  const handleOpenInNewTab = (chatId: string) => {
    console.log("Open in new tab:", chatId);
    onOpenChange(false);
  };

  const handleCreateNewChat = () => {
    console.log("Create new chat");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 overflow-hidden max-w-2xl bg-[#1A1F2C] text-white border border-gray-800 shadow-xl">
        <Command className="rounded-lg border-0 bg-transparent">
          <div className="border-b border-gray-800 px-3">
            <CommandInput
              placeholder="Search..."
              className="py-6 text-base focus:outline-none placeholder:text-gray-500"
            />
          </div>

          <CommandList className="max-h-[80vh] overflow-auto py-2">
            <div className="px-4 py-2 flex justify-between items-center">
              <div className="text-sm font-medium text-gray-400">Actions</div>
              <div className="text-xs text-gray-500">Show All</div>
            </div>

            <CommandGroup>
              <CommandItem
                className="px-4 py-3 cursor-pointer hover:bg-gray-800 rounded-md mx-2"
                onSelect={handleCreateNewChat}
              >
                <PenSquare className="mr-2 h-4 w-4" />
                <span>Create New Chat</span>
              </CommandItem>
            </CommandGroup>

            <div className="px-4 py-2 mt-4">
              <div className="text-sm font-medium text-gray-400">Yesterday</div>
            </div>

            <CommandGroup>
              {chatGroups.yesterday.map((chat) => (
                <CommandItem
                  key={chat.id}
                  className="flex items-center justify-between px-4 py-3 hover:bg-gray-800 rounded-md mx-2"
                >
                  <div className="flex flex-col">
                    <div className="flex items-center">
                      <span>{chat.title}</span>
                      {chat.isCurrent && (
                        <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-gray-700 text-gray-300">
                          Current
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      {chat.timeAgo}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>

            <div className="px-4 py-2 mt-4">
              <div className="text-sm font-medium text-gray-400">
                Last 7 Days
              </div>
            </div>

            <CommandGroup>
              {chatGroups.lastWeek.map((chat) => (
                <CommandItem
                  key={chat.id}
                  className="px-4 py-3 hover:bg-gray-800 rounded-md mx-2 group"
                  value={chat.id}
                >
                  <div className="flex items-center justify-between w-full">
                    <span>{chat.title}</span>
                    <div className="hidden group-hover:flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-700"
                        onClick={() => handleEditChat(chat.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-700"
                        onClick={() => handleCopyLink(chat.id)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-700"
                        onClick={() => handleOpenInNewTab(chat.id)}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-red-400 hover:bg-gray-700"
                        onClick={() => handleDeleteChat(chat.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandEmpty className="py-6 text-center text-sm text-gray-500">
              No chats found.
            </CommandEmpty>
          </CommandList>

          <div className="border-t border-gray-800 p-2 flex justify-between items-center">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-400 hover:text-white"
            >
              <span className="text-lg">↗</span>
            </Button>
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  className="px-3 py-1.5 h-auto text-gray-400 hover:text-white text-sm"
                >
                  Go
                  <kbd className="ml-2 px-1.5 py-0.5 text-xs bg-gray-700 rounded-md">
                    ⌘
                  </kbd>
                </Button>
              </div>
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  className="px-3 py-1.5 h-auto text-gray-400 hover:text-white text-sm"
                >
                  Edit
                  <div className="ml-2 flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 text-xs bg-gray-700 rounded-md">
                      Ctrl
                    </kbd>
                    <span>+</span>
                    <kbd className="px-1.5 py-0.5 text-xs bg-gray-700 rounded-md">
                      E
                    </kbd>
                  </div>
                </Button>
              </div>
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  className="px-3 py-1.5 h-auto text-gray-400 hover:text-white text-sm"
                >
                  Delete
                  <div className="ml-2 flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 text-xs bg-gray-700 rounded-md">
                      Ctrl
                    </kbd>
                    <span>+</span>
                    <kbd className="px-1.5 py-0.5 text-xs bg-gray-700 rounded-md">
                      D
                    </kbd>
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </Command>
      </DialogContent>
    </Dialog>
  );
};

export default NewChatOverlay;
