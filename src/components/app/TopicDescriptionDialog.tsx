

import React from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

interface TopicDescriptionDialogProps {
  name: string;
  bannerDescription: string;
  metaDescription: string;
}

const TopicDescriptionDialog = ({
  name,
  bannerDescription,
  metaDescription,
}: TopicDescriptionDialogProps) => {
  return (
    <DialogContent className="border-none bg-gradient-to-b from-white to-gray-50 shadow-lg">
      <DialogHeader className="pb-4 border-b">
        <DialogTitle className="text-xl font-bold capitalize text-gray-800">{name?? "Title"}</DialogTitle>
      </DialogHeader>
      <div className="space-y-6 py-6">    
        <div className="bg-popover p-4 rounded-lg border border-grey-100">
          <h3 className="text-sm font-semibold text-grey-700 mb-2">Banner Description</h3>
          <p className="text-gray-700 leading-relaxed">{bannerDescription ?? "Not Available"}</p>
        </div>
        <div className="bg-popover p-4 rounded-lg border border-grey-100">
          <h3 className="text-sm font-semibold text-grey-700 mb-2">Meta Description</h3>
          <p className="text-gray-700 leading-relaxed">{metaDescription  ?? "Not Available"}</p>
        </div>
      </div>  
    </DialogContent>
  );
};

export default TopicDescriptionDialog;