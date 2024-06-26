"use client";
import React from "react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Loader} from "lucide-react";

export const ContactForm = () => {
  const [isLoading, setIsLoading] = React.useState(false);

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [businessName, setBusinessName] = React.useState("");
  const [aboutBusiness, setAboutBusiness] = React.useState("");

  const [error, setError] = React.useState(false);

  const onSubmit = async () => {
    setIsLoading(true);
    if (!name || !email || !businessName || !aboutBusiness) {
      setError(true);
      setIsLoading(false);
      return;
    }
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          businessName,
          aboutBusiness,
        }),
      });
      if (response.ok) {
        alert("Submitted successfully");
      } else {
        alert("Failed to submit");
      }
    } catch (error) {
      alert("Failed to submit");
    }
  };

  return (
    <div className="bg-white/40 blurBack rounded-xl md:w-[60%] mt-2 h-fit mx-auto p-8 flex flex-col">
      <h1 className="font1 text-6xl">Let&apos;s get in touch</h1>
      <div className="grid gap-3">
        <div className="grid gap-1">
          <h1>Name</h1>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="grid gap-1">
          <h1>Email</h1>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="grid gap-1">
          <h1>Business Name</h1>
          <Input
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="grid gap-1">
          <h1>About your business</h1>
          <Textarea
            value={aboutBusiness}
            onChange={(e) => setAboutBusiness(e.target.value)}
            className="w-full"
          />
        </div>
      </div>
      <Button onClick={onSubmit} className="w-full mt-6">
        Submit
        {isLoading && <Loader className="ml-2 animate-spin h-4 w-4" />}
      </Button>
      {error && (
        <p className="text-red-500 text-sm mt-2 mx-auto">
          *Please fill out all the fields
        </p>
      )}
    </div>
  );
};
