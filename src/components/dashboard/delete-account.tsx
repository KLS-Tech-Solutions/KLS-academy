"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/misc";
import { useToast } from "@/components/ui/toast";
import { isApiError } from "@/lib/api/errors";
import { deleteAccount } from "@/services/auth.service";

const CONFIRM_WORD = "DELETE";

/**
 * Closing an account, from the profile screen.
 *
 * Two locks before it fires: type DELETE, and enter the current password.
 * This is irreversible and it removes personal data, so a mis-click or an
 * unattended laptop should not be enough.
 */
export function DeleteAccount() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [open, setOpen] = React.useState(false);
  const [confirmation, setConfirmation] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const armed = confirmation.trim() === CONFIRM_WORD && password.length > 0;

  const close = () => {
    if (pending) return;
    setOpen(false);
    setConfirmation("");
    setPassword("");
    setError(null);
  };

  const submit = async () => {
    setPending(true);
    setError(null);
    try {
      await deleteAccount(password);
      queryClient.clear();
      toast({
        title: "Account closed",
        description: "Your personal details have been removed.",
        variant: "success",
      });
      router.push("/");
    } catch (err) {
      setError(
        isApiError(err)
          ? err.userMessage
          : "We couldn't close the account. Try again in a moment.",
      );
      setPending(false);
    }
  };

  return (
    <>
      <Card className="border-danger/25 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-ink">Close your account</h2>
            <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-body">
              This removes your name, phone number and profile details — college,
              degree, branch, year, LinkedIn and GitHub — and you will not be able
              to sign in again.
            </p>
            <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-body">
              <strong className="text-ink">
                Certificates you have earned stay valid.
              </strong>{" "}
              You paid for them, so their public verification links keep working
              for any employer who checks. You will not be able to download them
              from here afterwards, so save any documents you want first.
            </p>
          </div>

          <Button
            variant="secondary"
            onClick={() => setOpen(true)}
            className="shrink-0 border-danger/30 text-danger hover:bg-danger-bg"
          >
            <Trash2 />
            Close account
          </Button>
        </div>
      </Card>

      <Dialog
        open={open}
        onClose={close}
        title="Close your account?"
        description="This cannot be undone."
        footer={
          <>
            <Button variant="secondary" onClick={close} disabled={pending}>
              Keep my account
            </Button>
            <Button
              onClick={submit}
              disabled={!armed || pending}
              className="bg-danger hover:bg-danger"
            >
              <Trash2 />
              {pending ? "Closing…" : "Close account permanently"}
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-5">
          {error && <Alert variant="danger">{error}</Alert>}

          <Alert variant="warning">
            <span className="inline-flex items-start gap-2">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" />
              Download anything you want to keep before continuing — offer
              letters and certificates included.
            </span>
          </Alert>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-ink">
              Type <span className="font-mono">{CONFIRM_WORD}</span> to confirm
            </span>
            <Input
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              placeholder={CONFIRM_WORD}
              autoComplete="off"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-ink">Your password</span>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </label>
        </div>
      </Dialog>
    </>
  );
}
