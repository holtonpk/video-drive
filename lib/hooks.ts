"use client";
import {useEffect, useLayoutEffect, useRef, useState} from "react";
import {db} from "@/config/firebase";
import {getDoc, doc} from "firebase/firestore";
import {UserData} from "@/context/user-auth";

interface IntersectionObserverOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
}

export const useIsVisible = (
  options?: IntersectionObserverOptions,
  once = false
) => {
  const optionsRef = useRef(options);
  const [isVisible, setIsVisible] = useState(false);
  const targetRef = useRef<Element | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible(() => true);
          if (once) {
            observer.unobserve(entry.target);
            observer.disconnect();
          }
        } else {
          setIsVisible(() => false);
        }
      });
    }, optionsRef.current);

    if (targetRef.current) {
      observer.observe(targetRef.current);
    }

    return () => {
      if (targetRef.current) {
        observer.unobserve(targetRef.current);
      }
      observer.disconnect(); // Clean up the IntersectionObserver
    };
  }, [once]);

  return {isVisible, targetRef};
};

export const getUserData = async (userIds: string[]) => {
  // get user data from firebase collection users
  const fetchUsers = async () => {
    try {
      const usersData = await Promise.all(
        userIds.map(async (user) => {
          const userSnap = await getDoc(doc(db, "users", user));
          return userSnap.data() as UserData; // Ensure type casting if needed
        })
      );
      return usersData;
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  return fetchUsers();
};

export const useLockBody = () => {
  useLayoutEffect((): (() => void) => {
    // Store original styles
    const originalBodyOverflow = window.getComputedStyle(
      document.body
    ).overflow;
    const originalHtmlOverflow = window.getComputedStyle(
      document.documentElement
    ).overflow;
    const originalBodyPosition = window.getComputedStyle(
      document.body
    ).position;
    const originalBodyTop = window.getComputedStyle(document.body).top;
    const originalBodyWidth = window.getComputedStyle(document.body).width;

    // Get current scroll position
    const scrollY = window.scrollY;

    // Apply styles to prevent scrolling
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    // document.body.style.position = "fixed";
    // document.body.style.top = `-${scrollY}px`;
    // document.body.style.width = "100%";

    // Also target common Next.js containers
    const nextContainer = document.getElementById("__next");
    if (nextContainer) {
      const originalNextOverflow =
        window.getComputedStyle(nextContainer).overflow;
      nextContainer.style.overflow = "hidden";

      return () => {
        // Restore original styles
        document.documentElement.style.overflow = originalHtmlOverflow;
        document.body.style.overflow = originalBodyOverflow;
        // document.body.style.position = originalBodyPosition;
        // document.body.style.top = originalBodyTop;
        // document.body.style.width = originalBodyWidth;
        // nextContainer.style.overflow = originalNextOverflow;

        // Restore scroll position
        // window.scrollTo(0, scrollY);
      };
    }

    return () => {
      // Restore original styles
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.overflow = originalBodyOverflow;
      document.body.style.position = originalBodyPosition;
      document.body.style.top = originalBodyTop;
      document.body.style.width = originalBodyWidth;

      // Restore scroll position
      // window.scrollTo(0, scrollY);
    };
  }, []);
};
