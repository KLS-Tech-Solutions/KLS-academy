import type { Metadata } from "next";

import { VerifyEmail } from "@/components/auth/verify-email";

export const metadata: Metadata = { title: "Verify your email" };

/**
 * `?token=` arrives from the link in the verification email. Reading it here
 * rather than in the client avoids a Suspense boundary and means the page
 * knows which of its two states to render before it paints.
 */
export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string | string[] }>;
}) {
  const { token } = await searchParams;
  const value = Array.isArray(token) ? token[0] : token;
  return <VerifyEmail token={value?.trim() || null} />;
}
