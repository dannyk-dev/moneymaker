"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const BackButton = ({className, ...props}: React.ComponentProps<'button'>) => {
  const router = useRouter();

  const handleBackNavigation = () => {
    router.back();
  };

  return (
    <Button
      variant="secondary"
      size="lg"
      onClick={handleBackNavigation}
      {...props}
      className={cn("w-fit mb-4", className)}
    >
      <ChevronLeft />
      Back
    </Button>
  );
};

export default BackButton;
