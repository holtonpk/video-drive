"use client";
import React from "react";
import Link from "next/link";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {useAuth} from "@/context/user-auth";
import {Button} from "@/components/ui/button";
import {Checkbox} from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Switch} from "@/components/ui/switch";
import {toast} from "@/components/ui/use-toast";
import {Input} from "@/components/ui/input";
import {Icons} from "@/components/icons";
import {doc, setDoc} from "firebase/firestore";
import {db} from "@/config/firebase";

export function NotificationsForm() {
  const notificationsFormSchema = z.object({
    email: z.string().email({
      message: "Invalid email address.",
    }),
    new_video: z.boolean(),
    revision: z.boolean(),
    done: z.boolean(),
    notes: z.boolean(),
  });

  type NotificationsFormValues = z.infer<typeof notificationsFormSchema>;

  const {currentUser} = useAuth()!;

  // This can come from your database or API.
  const defaultValues: Partial<NotificationsFormValues> = {
    email: currentUser?.notificationSettings.email,
    new_video: currentUser?.notificationSettings.new_video,
    revision: currentUser?.notificationSettings.revision,
    done: currentUser?.notificationSettings.done,
    notes: currentUser?.notificationSettings.notes,
  };

  const form = useForm<NotificationsFormValues>({
    resolver: zodResolver(notificationsFormSchema),
    defaultValues,
  });
  const [isLoading, setIsLoading] = React.useState(false);

  async function onSubmit(data: NotificationsFormValues) {
    if (!currentUser) return;
    setIsLoading(true);

    await setDoc(
      doc(db, "users", currentUser.uid),
      {
        notificationSettings: data,
      },
      {merge: true}
    );

    toast({
      title: "Successfully updated your notifications",
      description: "Your changes will take effect immediately.",
    });
    setIsLoading(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <FormField
            control={form.control}
            name="email"
            render={({field}) => (
              <FormItem className="flex flex-col items-start justify-between rounded-lg  ">
                <div className="space-y-0.5">
                  <FormLabel className="text-base text-foreground">
                    Send notifications to
                  </FormLabel>
                  <FormDescription>
                    The email that will receive notifications
                  </FormDescription>
                </div>
                <FormControl>
                  <Input
                    value={field.value}
                    onChange={field.onChange}
                    className="text-foreground"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <h3 className="mb-4 text-lg font-medium mt-6 text-foreground">
            Email Notifications
          </h3>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="new_video"
              render={({field}) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base text-foreground">
                      New video created
                    </FormLabel>
                    <FormDescription>
                      Receive an email when a new video is created.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="revision"
              render={({field}) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base text-foreground">
                      Video marked as needs revision
                    </FormLabel>
                    <FormDescription>
                      Receive an email when a video is marked as needs revision.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="done"
              render={({field}) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base text-foreground">
                      Video marked as done
                    </FormLabel>
                    <FormDescription>
                      Receive an email when a video is marked as done.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({field}) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base text-foreground">
                      Editor Notes
                    </FormLabel>
                    <FormDescription>
                      Receive an email when an editor leaves notes on a video.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      aria-readonly
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button type="submit" className="text-foreground">
          {isLoading && <Icons.spinner className="animate-spin mr-2" />}
          Update notifications
        </Button>
      </form>
    </Form>
  );
}
