/**
 * Every cache key in one registry, so invalidating after a mutation is a
 * lookup rather than a guess. Keys are hierarchical — invalidating
 * `queryKeys.tasks.all` clears the list and every task detail beneath it.
 */
export const queryKeys = {
  session: ["session"] as const,

  domains: {
    all: ["domains"] as const,
    detail: (slug: string) => ["domains", slug] as const,
  },

  journey: {
    all: ["journey"] as const,
  },

  enrollment: {
    current: ["enrollment", "current"] as const,
  },

  offerLetter: {
    current: ["offer-letter"] as const,
  },

  linkedin: {
    submission: ["linkedin", "submission"] as const,
  },

  tasks: {
    all: ["tasks"] as const,
    detail: (taskId: string) => ["tasks", taskId] as const,
    submission: (taskId: string) => ["tasks", taskId, "submission"] as const,
  },

  payment: {
    current: ["payment"] as const,
  },

  certificate: {
    mine: ["certificate", "mine"] as const,
    verify: (number: string) => ["certificate", "verify", number] as const,
  },

  notifications: {
    all: ["notifications"] as const,
  },

  profile: {
    mine: ["profile"] as const,
  },
} as const;
