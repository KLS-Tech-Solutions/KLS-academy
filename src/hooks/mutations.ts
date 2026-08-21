"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import {
  enrollInDomain,
  markNotificationsRead,
  submitLinkedInPost,
  submitTask,
  updateProfile,
  type TaskSubmissionInput,
} from "@/services/journey.service";
import { sendContactMessage } from "@/services/contact.service";
import type { ContactValues, ProfileValues } from "@/lib/validation";

/** Anything that changes the student's position in the journey refreshes it. */
function useJourneyInvalidator() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: queryKeys.journey.all });
}

export function useEnroll() {
  const invalidate = useJourneyInvalidator();
  return useMutation({
    mutationFn: ({ domainId, batchId }: { domainId: string; batchId: string }) =>
      enrollInDomain(domainId, batchId),
    onSuccess: invalidate,
  });
}

export function useSubmitLinkedIn() {
  const invalidate = useJourneyInvalidator();
  return useMutation({
    mutationFn: (postUrl: string) => submitLinkedInPost(postUrl),
    onSuccess: invalidate,
  });
}

export function useSubmitTask() {
  const invalidate = useJourneyInvalidator();
  return useMutation({
    mutationFn: (input: TaskSubmissionInput) => submitTask(input),
    onSuccess: invalidate,
  });
}


export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: ProfileValues) => updateProfile(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.journey.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.profile.mine });
    },
  });
}

export function useMarkNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) => markNotificationsRead(ids),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.journey.all }),
  });
}

export function useSendContactMessage() {
  return useMutation({ mutationFn: (values: ContactValues) => sendContactMessage(values) });
}
