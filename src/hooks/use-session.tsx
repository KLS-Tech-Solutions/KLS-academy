"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { queryKeys } from "@/lib/query-keys";
import { getSession, login, logout, register } from "@/services/auth.service";
import type { LoginValues, RegisterValues } from "@/lib/validation";

/** Current user, or null when signed out. Never throws on 401. */
export function useSession() {
  return useQuery({
    queryKey: queryKeys.session,
    queryFn: getSession,
    staleTime: 5 * 60_000,
    retry: false,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (values: LoginValues) => login(values),
    onSuccess: ({ user }) => {
      queryClient.setQueryData(queryKeys.session, user);
      queryClient.invalidateQueries({ queryKey: queryKeys.journey.all });
      router.push("/dashboard");
    },
  });
}

export function useRegister() {
  const router = useRouter();

  return useMutation({
    mutationFn: (values: RegisterValues) => register(values),
    onSuccess: () => router.push("/verify-email"),
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
