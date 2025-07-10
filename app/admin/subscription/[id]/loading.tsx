import { Spinner } from "@/components/ui/spinner";
import React from "react";

const SubscriptionLoading = () => {
  return (
    <div className="mx-auto mt-4 w-full">
      <Spinner className="mx-auto w-6 h-6" />
    </div>
  );
};

export default SubscriptionLoading;
