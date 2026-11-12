import React from "react";
import Image from "next/image";

export default function BenAvatar() {
  return <Image src="/ben/avatar.jpg" alt="" width={40} height={40} className="h-10 w-10 shrink-0 rounded-full border border-white/50 object-cover" />;
}
