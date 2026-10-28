"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { queryKeys } from "@/lib/query-keys";
import {
  getSession,
  login,
  logout,
  register,
  type LoginCredentials,
} from "@/services/auth.service";
import type { RegisterValues } from "@/lib/validation";

/** Current user, or null when signed out. Never throws on 401. */
export function useSession() {
  return useQuery({
    queryKey: queryKeys.session,
    queryFn: getSession,
    staleTime: 5 * 60_000,
    retry: false,
  });
}

/**
 * `next` is where to land after signing in — used by the verification email
 * flow to drop a new student straight onto domain selection.
 *
 * Only same-origin paths are honoured. A `next` of `https://evil.example` or
 * `//evil.example` would otherwise turn the login screen into an open
 * redirect, and this value comes from the query string.
 */
function safeNext(next: string | null | undefined): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) return "/dashboard";
  return next;
}

export function useLogin(next?: string | null) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (values: LoginCredentials) => login(values),
    onSuccess: ({ user }) => {
      queryClient.setQueryData(queryKeys.session, user);
      queryClient.invalidateQueries({ queryKey: queryKeys.journey.all });
      router.push(safeNext(next));
    },
  });
}

export function useRegister() {
  const router = useRouter();

  return useMutation({
    mutationFn: (values: RegisterValues) => register(values),
    // Straight to sign-in. There is no verification step any more — the
    // account works the moment the form is submitted — so sending someone to
    // a "check your inbox" page would be telling them to wait for something
    // that is not coming.
    onSuccess: () => router.push("/login?registered=1"),
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear();
      router.push("/login");
    },
  });
}
