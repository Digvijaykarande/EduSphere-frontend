"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/formatCurrency";

// Generic person/entity avatar with image + initials fallback. Same markup
// as the previous StudentAvatar (fees/shared.jsx), renamed since it's used
// for students, teachers, and staff alike across modules.
export function EntityAvatar({ name, src, className = "h-8 w-8" }) {
  return (
    <Avatar className={`${className} border border-border shadow-sm`}>
      <AvatarImage src={src} alt={name} className="object-cover" />
      <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
}

export default EntityAvatar;
