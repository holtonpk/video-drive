"use client";

import React, {useState} from "react";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import {Checkbox} from "@/components/ui/checkbox";
import axios from "axios";
import {Loader} from "lucide-react";
import {useToast} from "@/components/ui/use-toast";

export const ContactForm = () => {
  const {toast} = useToast();

  const [formData, setFormData] = useState({
    user_name: "",
    user_email: "",
    user_phone: "",
    user_hear_about_us: "",
    user_message: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [isLoading, setIsLoading] = useState(false);

  const resetForm = () => {
    setFormData({
      user_name: "",
      user_email: "",
      user_phone: "",
      user_hear_about_us: "",
      user_message: "",
    });
    setErrors({});
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const {name, value} = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.user_name.trim()) {
      newErrors.user_name = "Full name is required";
    }

    if (!formData.user_email.trim()) {
      newErrors.user_email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.user_email)) {
      newErrors.user_email = "Please enter a valid email address";
    }

    if (!formData.user_hear_about_us) {
      newErrors.user_hear_about_us = "Please select how you heard about us";
    }

    if (!formData.user_message.trim()) {
      newErrors.user_message = "Please tell us how we can help";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form submitted:", formData);
      setIsLoading(true);
      sendEmail(formData);
    }
  };

  const sendEmail = async (emailTemp: any) => {
    const emailData = {
      service_id: "service_w1ofllp",
      template_id: "template_g81l7ib",
      user_id: "_xxtFZFU5RPJivl-9",
      template_params: emailTemp,
      accessToken: "rIezh-MOZPAh3KEMZWpa_",
    };
    try {
      console.log("emailData", emailData);
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
      toast({
        title: "Message sent successfully!",
        description: "Thank you for contacting us. We'll get back to you soon.",
      });
      resetForm();
    } catch (error) {
      console.error("Error sending email:", error);
      toast({
        title: "Failed to send message",
        description: "Please try again later or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="big-text-bold text-5xl">Get in touch</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="user_name"
            className="block text-sm font-medium text-primar mb-2"
          >
            Full Name
          </label>
          <Input
            type="text"
            id="user_name"
            name="user_name"
            value={formData.user_name}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-[8px] focus:ring-2 focus-visible:ring-theme-color1 focus-visible:ring-offset-2 focus-visible:ring-offset-background bg-primary/10  ${
              errors.user_name ? "border-theme-color3" : "border-gray-300"
            }`}
            placeholder="Enter your full name"
          />
          {errors.user_name && (
            <p className="mt-1 text-sm text-theme-color3">{errors.user_name}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="user_email"
            className="block text-sm font-medium text-primary mb-2"
          >
            Email Address
          </label>
          <Input
            type="email"
            id="user_email"
            name="user_email"
            value={formData.user_email}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-[8px] focus:ring-2 focus-visible:ring-theme-color1 focus-visible:ring-offset-2 focus-visible:ring-offset-background bg-primary/10  ${
              errors.user_email ? "border-theme-color3" : "border-gray-300"
            }`}
            placeholder="Enter your email address"
          />
          {errors.user_email && (
            <p className="mt-1 text-sm text-theme-color3">
              {errors.user_email}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="user_phone"
            className="block text-sm font-medium text-primary mb-2"
          >
            Phone Number <span className="text-gray-500">(Optional)</span>
          </label>
          <Input
            type="tel"
            id="user_phone"
            name="user_phone"
            value={formData.user_phone}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-[8px] focus:ring-2 focus-visible:ring-theme-color1 focus-visible:ring-offset-2 focus-visible:ring-offset-background bg-primary/10"
            placeholder="Enter your phone number"
          />
        </div>

        <div>
          <label
            htmlFor="user_hear_about_us"
            className="block text-sm font-medium text-primary mb-2"
          >
            How did you hear about us?
          </label>
          <Select
            name="user_hear_about_us"
            value={formData.user_hear_about_us}
            onValueChange={(value) => {
              setFormData((prev) => ({
                ...prev,
                user_hear_about_us: value,
              }));
            }}
          >
            <SelectTrigger
              className={`w-full px-4 py-3 border rounded-[8px] focus:ring-2 focus:ring-theme-color1 focus-visible:ring-offset-2 focus-visible:ring-offset-background bg-primary/10  ${
                errors.user_hear_about_us
                  ? "border-theme-color3"
                  : "border-gray-300"
              }`}
            >
              <SelectValue placeholder="Please Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="social-media">Social Media</SelectItem>
              <SelectItem value="search-engine">Search Engine</SelectItem>
              <SelectItem value="friend-recommendation">
                Friend Recommendation
              </SelectItem>
              <SelectItem value="advertisement">Advertisement</SelectItem>
              <SelectItem value="blog-article">Blog/Article</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          {errors.user_hear_about_us && (
            <p className="mt-1 text-sm text-theme-color3">
              {errors.user_hear_about_us}
            </p>
          )}
        </div>

        <div className="col-span-2">
          <label
            htmlFor="howCanWeHelp"
            className="block text-sm font-medium text-primary mb-2"
          >
            How can we help?
          </label>
          <Textarea
            id="user_message"
            name="user_message"
            value={formData.user_message}
            onChange={handleInputChange}
            rows={4}
            className={`w-full px-4 py-3 border rounded-[12px] focus:ring-2 focus-visible:ring-theme-color1 focus-visible:ring-offset-2 focus-visible:ring-offset-background bg-primary/10  ${
              errors.user_message ? "border-theme-color3" : "border-gray-300"
            }`}
            placeholder="Tell us how we can help you..."
          />
          {errors.user_message && (
            <p className="mt-1 text-sm text-theme-color3">
              {errors.user_message}
            </p>
          )}
        </div>

        <div className="col-span-2 flex gap-4 flex-col items-center">
          {/* add email list opt in checkbox */}
          <div className="flex items-center gap-2 w-full text-primary/70">
            <Checkbox id="emailListOptIn" className="rounded-[4px]" />
            <label htmlFor="emailListOptIn">
              Subscribe for the latest news and insights delivered to your inbox
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-theme-color1 text-background big-text-bold text-2xl rounded-[8px] py-3 px-6  font-medium hover:bg-primary hover:ring-2 hover:ring-primary hover:ring-offset-2 hover:ring-offset-background transition-all duration-200 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Message"
            )}
          </button>
          <span className="text-sm text-primary/70 text-center mt-2 w-fit ">
            By submitting this form I accept the{" "}
            <Link href="/privacy" className="text-primary underline">
              Privacy Policy
            </Link>{" "}
            of this site.
          </span>
        </div>
      </form>
    </div>
  );
};
