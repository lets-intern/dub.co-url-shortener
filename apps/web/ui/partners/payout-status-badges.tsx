import {
  CircleCheck,
  CircleHalfDottedCheck,
  CircleHalfDottedClock,
  CircleWarning,
  CircleXmark,
  PaperPlane,
} from "@dub/ui/icons";

export const PayoutStatusBadges = {
  pending: {
    label: "Pending",
    variant: "pending" as const,
    icon: CircleHalfDottedClock,
    className: "text-orange-600 bg-orange-100",
  },
  processing: {
    label: "Processing",
    variant: "new" as const,
    icon: CircleHalfDottedClock,
    className: "text-blue-600 bg-blue-100",
  },
  processed: {
    label: "Processed",
    variant: "new" as const,
    icon: CircleHalfDottedCheck,
    className: "text-indigo-600 bg-indigo-100",
  },
  sent: {
    label: "Sent",
    variant: "new" as const,
    icon: PaperPlane,
    className: "text-blue-600 bg-blue-100",
  },
  completed: {
    label: "Completed",
    variant: "success" as const,
    icon: CircleCheck,
    className: "text-green-600 bg-green-100",
  },
  failed: {
    label: "Failed",
    variant: "error" as const,
    icon: CircleWarning,
    className: "text-red-600 bg-red-100",
  },
  canceled: {
    label: "Canceled",
    variant: "neutral" as const,
    icon: CircleXmark,
    className: "text-gray-600 bg-gray-100",
  },
  // extra status for hold (not in OpenAPI spec)
  hold: {
    label: "On Hold",
    variant: "error" as const,
    icon: CircleXmark,
    className: "text-red-600 bg-red-100",
  },
};
