import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { FileText, Info } from "lucide-react";
import TopicDescriptionDialog from "./TopicDescriptionDialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

interface StickySupportButtonProps {
  name: string;
  bannerDescription: string;
  metaDescription: string;
}

const StickySupportButton = ({
  name,
  bannerDescription,
  metaDescription,
}: StickySupportButtonProps) => {
  return (
    <div className="fixed bottom-8 right-8 z-50">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-14 w-14 rounded-full shadow-lg border-2 border-grey-300 bg-gradient-to-r from-grey-50 to-grey-100 hover:from-grey-100 hover:to-grey-200 hover:text-grey-800 transition-all duration-300 animate-fade-in"
                  aria-label="View topic information"
                >
                  <div className="absolute inset-0 rounded-full bg-grey-500 opacity-10 animate-pulse"></div>
                  <FileText className="h-6 w-6 text-grey-700" />
                </Button>
              </DialogTrigger>
              <TopicDescriptionDialog 
                name={name}
                bannerDescription={bannerDescription}
                metaDescription={metaDescription}
              />
            </Dialog>
          </TooltipTrigger>
          <TooltipContent side="left" className="bg-grey-800 text-white border-grey-900">
            <p>Topic descriptions</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );   
};

export default StickySupportButton;
