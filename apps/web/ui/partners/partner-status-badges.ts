import {
  BoxArchive,
  CircleCheck,
  CircleHalfDottedClock,
  CircleXmark,
  EnvelopeAlert,
  EnvelopeArrowRight,
  UserDelete,
} from "@dub/ui/icons";

export const PartnerStatusBadges = {
  pending: {
    label: "Pending",
    variant: "pending" as const,
    className: "text-orange-600 bg-orange-100",
    icon: CircleHalfDottedClock,
  },
  approved: {
    label: "Approved",
    variant: "success" as const,
    className: "text-green-600 bg-green-100",
    icon: CircleCheck,
  },
  rejected: {
    label: "Rejected",
    variant: "error" as const,
    className: "text-red-600 bg-red-100",
    icon: CircleXmark,
  },
  invited: {
    label: "Invited",
    variant: "new" as const,
    className: "text-blue-600 bg-blue-100",
    icon: EnvelopeArrowRight,
  },
  declined: {
    label: "Declined",
    variant: "warning" as const,
    className: "text-amber-600 bg-amber-100",
    icon: EnvelopeAlert,
  },
  deactivated: {
    label: "Deactivated",
    variant: "neutral" as const,
    className: "text-neutral-500 bg-neutral-100",
    icon: CircleXmark,
  },
  banned: {
    label: "Banned",
    variant: "error" as const,
    className: "text-red-600 bg-red-100",
    icon: UserDelete,
  },
  archived: {
    label: "Archived",
    variant: "neutral" as const,
    className: "text-neutral-500 bg-neutral-100",
    icon: BoxArchive,
  },
};
