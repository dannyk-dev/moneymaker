"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const BackButton = () => {
  const router = useRouter();

  const handleBackNavigation = () => {
    router.back();
  };

  return (
    <Button
      variant="secondary"
      className="w-fit"
      size="lg"
      onClick={handleBackNavigation}
    >
      <ChevronLeft />
      Back
    </Button>
  );
};

export default BackButton;
