"use client";
// create a simple auth. only ask for a password set the password as a env variable

import {useState, useEffect} from "react";
import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";
import Background from "@/src/app/(marketing)/components/background";
import {Input} from "@/components/ui/input";
import {Logo} from "@/components/icons";
const Auth = ({children}: {children: React.ReactNode}) => {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Check localStorage on component mount
    const authStatus = localStorage.getItem("reportsAuth");
    if (authStatus === "true") {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const storedPassword =
      localStorage.getItem("reportsPassword") ||
      process.env.NEXT_PUBLIC_REPORTS_PASSWORD;

    if (password === storedPassword) {
      setIsAuthenticated(true);
      localStorage.setItem("reportsAuth", "true");
    } else {
      alert("Incorrect password");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("reportsAuth");
    setShowChangePassword(false);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    // Store the new password in localStorage
    localStorage.setItem("reportsPassword", newPassword);
    alert("Password changed successfully");
    setShowChangePassword(false);
    setNewPassword("");
    setConfirmPassword("");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center ">
        <Background />
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[rgba(52,244,175)]"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="h-fit overflow-hidden">
        {showChangePassword && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4">Change Password</h2>
              <form onSubmit={handleChangePassword}>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="newPassword"
                  >
                    New Password
                  </label>
                  <input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="confirmPassword"
                  >
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Button type="submit">Save</Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowChangePassword(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center  dark">
      <Background />
      <div className="max-w-md w-full space-y-2 p-8 border border-white/10 rounded-lg bg-white/5 shadow-lg">
        <div className="flex items-center justify-center p-2 rounded-lg bg-[#1A191E] w-fit mx-auto">
          <Logo className="w-10 h-10" />
        </div>
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-[rgba(52,244,175)]">
            Reports Access
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please enter the password to access reports
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-black bg-[rgba(52,244,175)] hover:bg-[rgba(52,244,175)]/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Access Reports
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Layout = ({children}: {children: React.ReactNode}) => {
  return <Auth>{children}</Auth>;
};

export default Layout;
