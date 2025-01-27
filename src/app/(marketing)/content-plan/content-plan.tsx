"use client";
import React, {useState} from "react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {useForm} from "react-hook-form";
import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {LinkButton} from "@/components/ui/link";
import axios from "axios";
import Image from "next/image";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {Icons} from "@/components/icons";
import PhoneInput from "react-phone-number-input";
import validator from "validator";
import {setDoc, doc} from "firebase/firestore";
import {db} from "@/config/firebase";
import {E164Number} from "libphonenumber-js";

type FormData = {
  first_name: string;
  last_name: string;
  email: string;
  phone: E164Number | undefined;
  business_name: string;
  role: string;
};

export const ContentPlanForm = () => {
  const [step, setStep] = useState<number>(1);

  const [appId, setAppId] = useState<string>(
    Math.random().toString(36).substring(2, 15)
  );

  const [formData, setFormData] = useState<FormData>({
    first_name: "",
    last_name: "",
    email: "",
    phone: undefined,
    business_name: "",
    role: "",
  });

  return (
    <div className="container z-30 relative  flex flex-col justify-center  items-center  gap-6 md:w-[1200px] h-fit pb-[80px]">
      {step < 5 ? (
        <h1 className="text-3xl md:text-5xl font1-bold text-center">
          Get Your Free Personalized Social Media Content Plan ...in under 30
          seconds.
        </h1>
      ) : (
        <h1 className="text-3xl md:text-6xl font1-bold text-center">
          Check your email for your Personalized Social Media Content Plan!
        </h1>
      )}
      <Image
        width={800}
        height={268}
        alt="demo"
        src="/demo.png"
        className="w-full max-w-[800px]"
      />

      {step === 1 && (
        <Step1
          setStep={setStep}
          id={appId}
          formData={formData}
          setFormData={setFormData}
        />
      )}
      {step === 2 && (
        <Step2
          setStep={setStep}
          id={appId}
          formData={formData}
          setFormData={setFormData}
        />
      )}
      {step === 3 && (
        <Step3
          setStep={setStep}
          id={appId}
          formData={formData}
          setFormData={setFormData}
        />
      )}
      {step === 4 && (
        <Step4
          setStep={setStep}
          id={appId}
          formData={formData}
          setFormData={setFormData}
        />
      )}
      {step === 5 && <Success />}
    </div>
  );
};

const Step1 = ({
  setStep,
  id,
  formData,
  setFormData,
}: {
  setStep: React.Dispatch<React.SetStateAction<number>>;
  id: string;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const ContactFormSchema = z.object({
    first_name: z
      .string({
        required_error: "Please enter your first name.",
      })
      .min(2, {
        message: "Please enter a valid first name.",
      }),
    last_name: z
      .string({
        required_error: "Please enter your last name.",
      })
      .min(2, {
        message: "Please enter a valid last name.",
      }),
  });
  type ContactFormValue = z.infer<typeof ContactFormSchema>;

  const form = useForm<ContactFormValue>({
    resolver: zodResolver(ContactFormSchema),
    mode: "onChange",
    defaultValues: {
      first_name: formData.first_name,
      last_name: formData.last_name,
    },
  });

  async function onSubmit(
    data: ContactFormValue,
    e?: React.BaseSyntheticEvent
  ) {
    e?.preventDefault();
    console.log("suibmitted", data);
    setIsLoading(true);
    try {
      await saveName(data.first_name, data.last_name);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        form.reset(
          {
            first_name: "",
            last_name: "",
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

  async function saveName(firstName: string, lastName: string) {
    // save name firebase
    await setDoc(
      doc(db, "lead-magnet", id),
      {
        firstName,
        lastName,
        date: new Date(),
      },
      {
        merge: true,
      }
    );

    setStep(2);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6 w-full md:w-[80%]"
      >
        <span className="text-2xl md:text-4xl font1 text-center md:text-left">
          What&apos;s Your
          <span className="font1-bold "> Name?</span>
        </span>
        <div className="w-full grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="first_name"
            render={({field}) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    placeholder="First Name"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e); // Update react-hook-form state
                      setFormData((prev) => ({
                        ...prev,
                        first_name: e.target.value, // Update formData state
                      }));
                    }}
                    className={`bg-white/5 blurBack text-lg md:text-2xl py-4 h-fit placeholder:uppercase 
            ${
              form.formState.errors.first_name
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
            name="last_name"
            render={({field}) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    {...field}
                    onChange={(e) => {
                      field.onChange(e); // Update react-hook-form state
                      setFormData((prev) => ({
                        ...prev,
                        last_name: e.target.value, // Update formData state
                      }));
                    }}
                    placeholder="Last Name"
                    className={`bg-white/5 blurBack text-lg md:text-2xl py-4 h-fit placeholder:uppercase 
            ${
              form.formState.errors.last_name
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
          className="text-xl md:text-3xl py-4 h-fit w-full md:w-[80%] mx-auto font1-bold rounded-full bg-[#34F4AF] hover:bg-[#34F4AF]/90 hover:-translate-y-[2px] transition-all duration-300"
          //   onClick={() => setStep(2)}
        >
          {isLoading ? (
            <Icons.spinner className="h-8 w-8 text-background animate-spin" />
          ) : (
            "Let's start"
          )}
        </Button>
      </form>
    </Form>
  );
};

const Step2 = ({
  setStep,
  id,
  formData,
  setFormData,
}: {
  setStep: React.Dispatch<React.SetStateAction<number>>;
  id: string;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const ContactFormSchema = z.object({
    email: z
      .string({
        required_error: "Please enter a valid email address.",
      })
      .email(),
  });
  type ContactFormValue = z.infer<typeof ContactFormSchema>;

  const form = useForm<ContactFormValue>({
    resolver: zodResolver(ContactFormSchema),
    mode: "onChange",
    defaultValues: {
      email: formData.email,
    },
  });

  async function onSubmit(
    data: ContactFormValue,
    e?: React.BaseSyntheticEvent
  ) {
    e?.preventDefault();
    console.log("suibmitted", data);
    setIsLoading(true);
    try {
      await saveEmail(data.email);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        form.reset(
          {
            email: "",
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

  async function saveEmail(email: string) {
    // save name to db
    await setDoc(
      doc(db, "lead-magnet", id),
      {
        email,
      },
      {
        merge: true,
      }
    );
    setStep(3);
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6  w-full md:w-[80%]"
      >
        <span className="text-2xl md:text-4xl font1 text-center md:text-left">
          Where should we
          <span className="font1-bold "> email </span>
          it to?
        </span>
        <div className="w-full  gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({field}) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    placeholder="Business Email Address"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e); // Update react-hook-form state
                      setFormData((prev) => ({
                        ...prev,
                        email: e.target.value, // Update formData state
                      }));
                    }}
                    className={`bg-white/5 blurBack text-lg md:text-2xl py-4 h-fit placeholder:uppercase
          ${
            form.formState.errors.email
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
        <div className="flex flex-col gap-2">
          <Button
            className="text-xl md:text-3xl py-4 h-fit w-full md:w-[80%] mx-auto font1-bold rounded-full bg-[#34F4AF] hover:bg-[#34F4AF]/90 hover:-translate-y-[2px] transition-all duration-300"
            //   onClick={() => setStep(2)}
          >
            {isLoading ? (
              <Icons.spinner className="h-8 w-8 text-background animate-spin" />
            ) : (
              "Continue"
            )}
          </Button>
          <Button
            onClick={() => setStep(1)}
            variant={"ghost"}
            className="gap-2 text-lg w-fit mx-auto hover:-translate-y-[2px] transition-all duration-300 hover:bg-transparent"
          >
            <Icons.arrowRight className="h-4 w-4 text-white rotate-180" />
            previous
          </Button>
        </div>
      </form>
    </Form>
  );
};

const Step3 = ({
  setStep,
  id,
  formData,
  setFormData,
}: {
  setStep: React.Dispatch<React.SetStateAction<number>>;
  id: string;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const ContactFormSchema = z.object({
    phone: z
      .string({
        required_error: "Please provide a phone number.",
      })
      .refine(validator.isMobilePhone, {
        message:
          "This phone number is either invalid or is in the wrong format.", // Custom error message
      }),
  });
  type ContactFormValue = z.infer<typeof ContactFormSchema>;

  const form = useForm<ContactFormValue>({
    resolver: zodResolver(ContactFormSchema),
    mode: "onBlur",
    defaultValues: {
      phone: formData.phone,
    },
  });

  async function onSubmit(
    data: ContactFormValue,
    e?: React.BaseSyntheticEvent
  ) {
    e?.preventDefault();
    console.log("suibmitted", data);
    setIsLoading(true);
    try {
      await saveEmail(data.phone);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        form.reset(
          {
            phone: "",
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

  async function saveEmail(phone: string) {
    await setDoc(
      doc(db, "lead-magnet", id),
      {
        phone,
      },
      {
        merge: true,
      }
    );
    setStep(4);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6  w-full md:w-[80%]"
      >
        <span className="text-2xl md:text-4xl font1 text-center md:text-left">
          What is your
          <span className="font1-bold "> phone number?</span>
        </span>
        <div className="w-full  gap-4">
          <FormField
            control={form.control}
            name="phone"
            render={({field}) => (
              <FormItem className="w-full ">
                <FormControl>
                  <PhoneInput
                    initialValueFormat="national"
                    international={true}
                    defaultCountry="US"
                    className={` ring-offset-background text-lg md:text-2xl
                        ${
                          form.formState.errors.phone
                            ? "ring-red-600"
                            : "ring-[#34F4AF]"
                        }`}
                    {...field}
                    onChange={(value) => {
                      field.onChange(value); // Call the original onChange
                      form.clearErrors("phone"); // Clear errors for the phone field
                      setFormData((prev) => ({
                        ...prev,
                        phone: value,
                      }));
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Button
            type="submit"
            className="text-xl md:text-3xl py-4 h-fit w-full md:w-[80%] mx-auto font1-bold rounded-full bg-[#34F4AF] hover:bg-[#34F4AF]/90 hover:-translate-y-[2px] transition-all duration-300"
          >
            {isLoading ? (
              <Icons.spinner className="h-8 w-8 text-background animate-spin" />
            ) : (
              "Continue"
            )}
          </Button>
          <Button
            onClick={() => setStep(2)}
            variant={"ghost"}
            className="gap-2 text-lg w-fit mx-auto hover:-translate-y-[2px] transition-all duration-300 hover:bg-transparent"
          >
            <Icons.arrowRight className="h-4 w-4 text-white rotate-180" />
            previous
          </Button>
        </div>
      </form>
    </Form>
  );
};

const Step4 = ({
  setStep,
  id,
  formData,
  setFormData,
}: {
  setStep: React.Dispatch<React.SetStateAction<number>>;
  id: string;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const ContactFormSchema = z.object({
    business_name: z.string({
      required_error: "Please enter your business name.",
    }),
    role: z.string({
      required_error: "Please enter your role in the business.",
    }),
  });
  type ContactFormValue = z.infer<typeof ContactFormSchema>;

  const form = useForm<ContactFormValue>({
    resolver: zodResolver(ContactFormSchema),
    mode: "onChange",
    defaultValues: {
      business_name: formData.business_name,
      role: formData.role,
    },
  });

  async function onSubmit(
    data: ContactFormValue,
    e?: React.BaseSyntheticEvent
  ) {
    e?.preventDefault();
    console.log("suibmitted", data);
    setIsLoading(true);
    try {
      await saveBusinessInfo(data.business_name, data.role);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        form.reset(
          {
            business_name: "",
            role: "",
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

  async function saveBusinessInfo(businessName: string, role: string) {
    await setDoc(
      doc(db, "lead-magnet", id),
      {
        businessName,
        role,
      },
      {
        merge: true,
      }
    );
    await sendEmail({
      user_first_name: formData.first_name,
      user_last_name: formData.last_name,
      user_business_name: formData.business_name,
      user_role: formData.role,
      user_email: formData.email,
      user_phone: formData.phone,
    });

    setStep(5);
    return undefined;
  }

  const sendEmail = async (emailTemp: any) => {
    const emailData = {
      service_id: "service_w1ofllp",
      template_id: "template_fbi1bdw",
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
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6  w-full md:w-[80%]"
      >
        <span className="text-2xl md:text-4xl font1 text-center md:text-left">
          Tell us about your
          <span className="font1-bold "> Business</span>
        </span>
        <div className="w-full  gap-4">
          <FormField
            control={form.control}
            name="business_name"
            render={({field}) => (
              <FormItem className="w-full ">
                <FormControl>
                  <Input
                    placeholder="Business Name"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e); // Update react-hook-form state
                      setFormData((prev) => ({
                        ...prev,
                        business_name: e.target.value, // Update formData state
                      }));
                    }}
                    className={`bg-white/5 blurBack text-lg md:text-2xl py-4 h-fit placeholder:uppercase 
            ${
              form.formState.errors.business_name
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
        <div className="w-full  gap-4">
          <FormField
            control={form.control}
            name="role"
            render={({field}) => (
              <FormItem className="w-full ">
                <FormControl>
                  <Input
                    placeholder="Your Position/Role (ie. Founder, CMO, etc.)"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e); // Update react-hook-form state
                      setFormData((prev) => ({
                        ...prev,
                        role: e.target.value, // Update formData state
                      }));
                    }}
                    className={`bg-white/5 blurBack text-lg md:text-2xl py-4 h-fit placeholder:uppercase 
            ${
              form.formState.errors.role
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
        <div className="flex flex-col gap-2">
          <Button
            type="submit"
            className="text-xl md:text-3xl py-4 h-fit w-full md:w-[80%] mx-auto font1-bold rounded-full bg-[#34F4AF] hover:bg-[#34F4AF]/90 hover:-translate-y-[2px] transition-all duration-300"
          >
            {isLoading ? (
              <Icons.spinner className="h-8 w-8 text-background animate-spin" />
            ) : (
              "Get my custom plan"
            )}
          </Button>
          <Button
            onClick={() => setStep(3)}
            variant={"ghost"}
            className="gap-2 text-lg w-fit mx-auto hover:-translate-y-[2px] transition-all duration-300 hover:bg-transparent"
          >
            <Icons.arrowRight className="h-4 w-4 text-white rotate-180" />
            previous
          </Button>
        </div>
      </form>
    </Form>
  );
};

const Success = () => {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-xl md:text-2xl w-full md:w-[80%] mx-auto text-center">
        We&apos;ll get started creating your plan. We should have is built in
        the next few days. In the meantime, you can contact us directly to learn
        more about our process.
      </p>
      <LinkButton
        href="/work-with-us"
        className="text-xl md:text-3xl py-4 h-fit w-full md:w-[80%] mx-auto font1-bold rounded-full bg-[#34F4AF] hover:bg-[#34F4AF]/90 hover:-translate-y-[2px] transition-all duration-300"
      >
        Contact Us
      </LinkButton>
    </div>
  );
};
