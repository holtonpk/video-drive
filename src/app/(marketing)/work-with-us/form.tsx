"use client";
import React from "react";
import {Icons} from "@/components/icons";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useForm} from "react-hook-form";
import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";

import axios from "axios";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

const ContactForm = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const nameRef = React.useRef<HTMLInputElement>(null);
  const businessNameRef = React.useRef<HTMLInputElement>(null);
  const emailRef = React.useRef<HTMLInputElement>(null);

  const ContactFormSchema = z.object({
    user_name: z.string({
      required_error: "Please enter your name.",
    }),
    user_email: z
      .string({
        required_error: "Please enter your email.",
      })
      .email(),
    user_business_name: z.string({
      required_error: "Please enter your business's name.",
    }),
  });
  type ContactFormValue = z.infer<typeof ContactFormSchema>;

  const form = useForm<ContactFormValue>({
    resolver: zodResolver(ContactFormSchema),
    mode: "onChange",
  });

  async function onSubmit(
    data: ContactFormValue,
    e?: React.BaseSyntheticEvent
  ) {
    e?.preventDefault();
    console.log("suibmitted", data);
    setIsLoading(true);
    try {
      await sendEmail(data);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        form.reset(
          {
            user_name: "",
            user_email: "",
            user_business_name: "",
          },
          {
            keepValues: false,
          }
        );
      }, 4000);
    } catch (err) {
      //
    }
    setIsLoading(false);
  }

  const sendEmail = async (emailTemp: any) => {
    const emailData = {
      service_id: "service_xh39zvd",
      template_id: "template_j4x1yy4",
      user_id: "_xxtFZFU5RPJivl-9",
      template_params: emailTemp,
      accessToken: "rIezh-MOZPAh3KEMZWpa_",
    };
    try {
      await axios.post(
        "https://api.emailjs.com/api/v1.0/email/send",
        emailData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Email sent successfully");
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  return (
    <div className="container z-30 relative  flex flex-col justify-center  items-center gap-10 md:w-[700px] h-fit py-40">
      <div className="w-full h-fit border rounded-md bg-muted/20 p-4 md:p-8 flex flex-col gap-4">
        <div className="grid gap-1">
          <h1 className="font1-bold text-2xl text-white text-center md:text-left">
            Work with us
          </h1>
          <p className="text-white text-center md:text-left">
            Fill out the form below and we will get back to you as soon as
            possible.
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4 relative z-20">
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="user_name"
                  render={({field}) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input
                          placeholder="Name"
                          {...field}
                          className={`bg-background/90 blurBack 
                            ${
                              form.formState.errors.user_name
                                ? "focus-visible:ring-red-600"
                                : "focus-visible:ring-[#34F4AF]"
                            }
                            
                            `}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="user_business_name"
                  render={({field}) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input
                          placeholder="Business name"
                          {...field}
                          className={`bg-background/90 blurBack 
                            ${
                              form.formState.errors.user_business_name
                                ? "focus-visible:ring-red-600"
                                : "focus-visible:ring-[#34F4AF]"
                            }
                            
                            `}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="user_email"
                render={({field}) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        placeholder="Email"
                        {...field}
                        className={`bg-background/90 blurBack 
                            ${
                              form.formState.errors.user_email
                                ? "focus-visible:ring-red-600"
                                : "focus-visible:ring-[#34F4AF]"
                            }
                            
                            `}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button
              disabled={isLoading || isSuccess}
              id="send-button"
              className="bg-[#1863F0] hover:bg-[#1863F0]/90   text-white font1-bold text-xl w-full mt-4 disabled:opacity-100 "
            >
              {isLoading ? (
                <>
                  Sending
                  <Icons.spinner className="animate-spin h-4 w-4 text-white ml-2" />
                </>
              ) : (
                <>
                  {isSuccess ? "Thanks we'll get back to you soon!" : "Submit"}
                </>
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ContactForm;
