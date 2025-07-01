"use client";
import React from "react";
import {Button} from "@/components/ui/button";
import {Dialog, DialogTrigger, DialogContent} from "@/components/ui/dialog";

const CreatePost = () => {
  return (
    <Dialog>
      <DialogTrigger>
        <Button>Create Post</Button>
      </DialogTrigger>
      <DialogContent>
        <div>Popover Content</div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;
