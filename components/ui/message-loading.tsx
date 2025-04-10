"use client";

import * as React from "react";

export function MessageLoading() {
  return (
    <div className="flex items-center space-x-1">
      <div className="h-2 w-2 animate-bounce rounded-full bg-current delay-0"></div>
      <div className="h-2 w-2 animate-bounce rounded-full bg-current delay-75"></div>
      <div className="h-2 w-2 animate-bounce rounded-full bg-current delay-150"></div>
    </div>
  );
}
