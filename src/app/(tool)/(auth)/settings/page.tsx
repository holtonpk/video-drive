import React from "react";
import {NotificationsForm} from "./notifications-form";
import {Separator} from "@/components/ui/separator";
const Page = () => {
  return (
    <div className="space-y-6 w-[600px] max-w-screen pb-10">
      <div>
        <h3 className="text-lg font-medium  text-foreground">Notifications</h3>
        <p className="text-sm text-muted-foreground">
          Configure how you receive notifications.
        </p>
      </div>
      <Separator />
      <NotificationsForm />
    </div>
  );
};

export default Page;
