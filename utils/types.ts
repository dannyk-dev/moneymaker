export interface IProductRequest {
  name: string;
  type: string;
  category: string;
}

export interface IProductResponse extends IProductRequest {
  id: string;
}

export type TIntervalUnit = "DAY" | "WEEK" | "MONTH" | "YEAR";
export type TTenureType = "REGULAR" | "TRIAL";
export type TSubscriptionStatus = "CREATED" | "ACTIVE" | "INACTIVE";

export const INTERVAL_UNITS: readonly {
  label: string;
  value: TIntervalUnit;
}[] = [
  {
    label: "Daily (A daily billing cycle).",
    value: "DAY",
  },
  {
    label: "Weekly (A weekly billing cycle).",
    value: "WEEK",
  },
  {
    label: "Monthly (A monthly billing cycle).",
    value: "MONTH",
  },
  {
    label: "Yearly (A yearly billing cycle).",
    value: "YEAR",
  },
];

export interface IBillingCycle {
  frequency: {
    interval_unit: TIntervalUnit;
    interval_count: number;
  };
  sequence: number;
  total_cycles: number;
  tenure_type?: TTenureType;
  pricing_scheme: {
    fixed_price: {
      currency_code: string;
      value: string;
    };
  };
}

export interface ISubscriptionRequest {
  product_id: string;
  name: string;
  status: TSubscriptionStatus;
  billing_cycles: IBillingCycle[];
  payment_preferences?: {
    setup_fee_failure_action: "CONTINUE" | "CANCEL";
    payment_failure_threshold: number;
    setup_fee: {
      currency_code: string;
      value: string;
    };
  };
}

export interface ISubscriptionFormRequest
  extends Pick<ISubscriptionRequest, "name" | "status"> {
  billing_cycle: {
    frequency: {
      interval_unit: TIntervalUnit;
      interval_count: number;
    };

    total_cycles: number;
    pricing_scheme: {
      fixed_price: {
        currency_code: string;
        value: string;
      };
    };
  };
}

export interface IPlan {
  id: string;
  name: string;
  description?: string;
  product_id: string;
  status: TSubscriptionStatus;
  billing_cycles: IBillingCycle[];
  create_time: string;
  payment_preferences?: {
    setup_fee_failure_action: "CONTINUE" | "CANCEL";
    payment_failure_threshold: number;
    setup_fee: {
      currency_code: string;
      value: string;
    };
  };
}

export interface ISubscriptionResponse {
  plans: IPlan[];
}
