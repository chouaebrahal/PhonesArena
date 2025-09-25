import { Flame, Zap } from "lucide-react"
import Image from "next/image"
import React from "react"


type HeaderProps = {
  type?: "video" | "image"
  title?: string
  views?: number
  url?: string
  author?: { name: string | undefined; avatar: string | undefined}
  publishedAt?: string
}

const PagesHeading = ({
  type = "image",
  title,
  views,
  author,
  publishedAt,
  url = "/globe.svg",
}: HeaderProps) => {
  return (
    <div className="relative w-full py-20  !bg-[var(--bg-alt)]">
      {/* Background
      {type === "image" && (
        <Image
          src={url}
          alt="Page background"
          fill
          className="object-cover w-screen"
          priority
        />
      )}
      {type === "video" && (
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src={url}
          autoPlay
          muted
          loop
        />
      )} */}

      {/* Overlay */}
      {/* <div className="absolute inset-0 bg-black/50" /> */}

      {/* Content */}
      <section className="relative  flex flex-col items-center justify-center gap-4 h-full container  mx-auto text-center ">
        {/* Icons */}
        <div className="flex items-center gap-4 mb-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--primary)] text-[var(--foreground)]">
            <Flame className="w-5 h-5" />
          </div>
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--secondary)] text-[var(--foreground)]">
            <Zap className="w-5 h-5" />
          </div>
        </div>

        {/* Button + Views */}
        <div className="flex items-center gap-3">
          <button className="px-6 py-1 text-[14px] rounded-full border bg-[var(--primary)] text-[var(--foreground)] font-medium hover:bg-[var(--secondary)] transition cursor-pointer">
            Design
          </button>
          <div className="flex items-center text-[14px] gap-2 px-4 py-1 rounded-full text-[var(--foreground)]">
            👀 <span>{views || "1.2k views"}</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="max-w-3xl text-3xl md:text-4xl font-bold text-[var(--foreground)] leading-snug">
          {title || "How to Add Video Background in Next.js Application"}
        </h1>

        {/* Author + Date */}
        <div className="flex items-center gap-3  mt-2">
          <Image
            src={author?.avatar || "/images/49.png"}
            alt={`avatar of ${author?.name || "Chouaeb Rahal"}`}
            width={40}
            height={40}
            className="rounded-full border border-[var(--primary)]"
          />
          <div className="flex flex-col">
            <span className="font-medium text-[var(--foreground)]">
              {author?.name || "Chouaeb Rahal"}
            </span>
            <span className="text-sm text-[var(--foreground)]">
              {publishedAt || "Published on Sep 11, 2025"}
            </span>
          </div>
        </div>
      </section>
    </div>
  )
}

export default PagesHeading
