"use client";
import {useState, useEffect} from "react";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import {Loader} from "lucide-react";
import {Input} from "@/components/ui/input";
import {Source_Serif_4, Inter} from "next/font/google";

import "../(marketing)/marketing-style.css";

const displayFont = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "600"],
});

const bodyFont = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const PASSWORD = "elphadel123";
const STORAGE_KEY = "elphadelAuth";

const INK = "#28231e";
const PAPER = "#f4f1ea";
const ACCENT = "#922f21";

const Auth = ({children}: {children: React.ReactNode}) => {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const authStatus = localStorage.getItem(STORAGE_KEY);
    if (authStatus === "true") {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === PASSWORD) {
      setIsAuthenticated(true);
      setError("");
      localStorage.setItem(STORAGE_KEY, "true");
    } else {
      setError("Incorrect password");
    }
  };

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{backgroundColor: PAPER}}
      >
        <Loader className="animate-spin h-8 w-8" style={{color: ACCENT}} />
      </div>
    );
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 ${bodyFont.className}`}
      style={{backgroundColor: PAPER}}
    >
      <div
        className="max-w-md w-full space-y-5 p-8 rounded-[16px] shadow-lg"
        style={{backgroundColor: "#fff", border: `1px solid ${INK}1a`}}
      >
        <div className="flex flex-col items-center gap-3">
          <Image
            src="/elphadel/logo.png"
            alt="Elphadel"
            width={52}
            height={52}
            priority
          />
          <h1
            className={`text-center text-2xl ${displayFont.className}`}
            style={{color: INK}}
          >
            Protected Page
          </h1>
          <p className="text-center text-sm" style={{color: `${INK}99`}}>
            Enter the password to view this page
          </p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              autoFocus
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError("");
              }}
              className="rounded-full"
              style={{
                color: INK,
                borderColor: `${INK}1a`,
              }}
            />
            {error ? (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            ) : null}
          </div>
          <Button
            type="submit"
            className="w-full rounded-full text-white text-base py-5 transition-all duration-300 hover:opacity-90"
            style={{backgroundColor: ACCENT}}
          >
            View Page
          </Button>
        </form>
      </div>
    </div>
  );
};

const Layout = ({children}: {children: React.ReactNode}) => {
  return <Auth>{children}</Auth>;
};

export default Layout;
