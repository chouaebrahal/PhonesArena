"use client";

import React from "react";
import { LogIn, ArrowLeft, Share2, Heart, Search, Menu, FolderSearch } from "lucide-react";

type IconName = "ArrowLeft" | "Share2" | "Heart" | "Search" | "Menu" | "FolderSearch" | "LogIn";

export default function IconsClient({
  name,
  size = 20,
  className = "",
  onclick,
}: {
  name: IconName;
  size?: number;
  className?: string;
  onclick?: () => void;
}) {
  switch (name) {
    case "ArrowLeft":
      return <ArrowLeft size={size} className={className} />;
    case "Share2":
      return <Share2 size={size} className={className} />;
    case "Heart":
      return <Heart onClick={onclick} size={size} className={className} />;
    case "Search":
      return <Search size={size} className={className} />;
    case "Menu":
      return <Menu size={size} className={className} />;
    case "FolderSearch":
      return <FolderSearch onClick={onclick} size={size} className={className} />;
    case "LogIn":
      return <LogIn onClick={onclick} size={size} className={className} />;
    default:
      return null;
  }
}
