"use client";

import * as React from "react";
import { CheckCircle2, CreditCard, Lock, ShieldCheck } from "lucide-react";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Alert } from "@/components/ui/misc";
import { LockedState } from "@/components/shared/primitives";
import { PaymentStatusBadge } from "@/components/shared/status";
import { DashboardHeader } from "@/components/dashboard/page-header";
import { useToast } from "@/components/ui/toast";
import { useJourney } from "@/hooks/use-journey";
import { useConfirmPayment, useCreatePaymentOrder } from "@/hooks/mutations";
import { isApiError } from "@/lib/api/errors";
import { hasReached } from "@/types";

export default function PaymentPage() {
  const { journey, stage, refresh } = useJourney();
  const { toast } = useToast();
  const createOrder = useCreatePaymentOrder();
  const confirmPayment = useConfirmPayment();
  const [checkoutOpen, setCheckoutOpen] = React.useState(false);

  const processing = createOrder.isPending || confirmPayment.isPending;

  /**
   * Razorpay flow: create an order on the backend, open checkout, then send the
   * signature back for verification. The checkout itself is stubbed until the
   * Razorpay account is live — everything either side of it is real.
   */
  const startPayment = async () => {
    try {
      const order = await createOrder.mutateAsync();
      await confirmPayment.mutateAsync({
        razorpay_order_id: order.order_id,
        razorpay_payment_id: `pay_${order.order_id}`,
        razorpay_signature: "signature-pending-razorpay-integration",
      });
      setCheckoutOpen(false);
      refresh();
      toast({
        title: "Payment successful",
        description: "Your certificate is being issued.",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Payment failed",
        description: isApiError(error) ? error.userMessage : "Please try again.",
        variant: "error",
      });
    }
  };

  const paid = hasReached(stage, "paid");

  // The amount comes from the API so the fee is configured in one place. It
  // has to be shown here — nobody should be asked to pay an unstated amount.
  const fee = formatCurrency(journey.certificate_fee_paise / 100);

  if (!hasReached(stage, "all_tasks_approved")) {
    const approved = journey.submissions.filter((s) => s.status === "approved").length;
    const total = journey.tasks.filter((t) => t.order_number > 0).length;

    return (
      <div className="mx-auto max-w-4xl">
        <LockedState
          title="Payment is locked"
          description={`Every technical task must be approved before the certificate fee unlocks. ${approved} of ${total} approved so far.`}
          unlockHint="Unlocks when all tasks are approved"
          action={{ label: "View tasks", href: "/dashboard/tasks" }}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8">
      <DashboardHeader
        title="Certificate payment"
        description="All your tasks are approved. Pay the one-time issuance fee to generate your QR-verified certificate."
        action={journey.payment && <PaymentStatusBadge status={journey.payment.payment_status} />}
      />

      {paid ? (
        <Alert variant="success" icon={<CheckCircle2 />} title="Payment received">
          Transaction {journey.payment?.transaction_id} on{" "}
          {formatDateTime(journey.payment?.paid_at)}. Your certificate is being issued.
        </Alert>
      ) : (
        <Alert variant="info" icon={<ShieldCheck />}>
          Payments are processed by Razorpay. KLS Academy never sees or stores your card
          details.
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr] lg:items-start">
        <Card className="p-6 sm:p-8">
          <h2 className="text-lg font-semibold">Order summary</h2>

          <dl className="mt-6 flex flex-col gap-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <dt className="text-[15px] font-medium text-ink">
                  Certificate issuance
                </dt>
                <dd className="mt-0.5 text-sm text-body">
                  {journey.domain?.title ?? "Internship certificate"}
                </dd>
              </div>
              <span className="text-[15px] font-medium text-ink">{fee}</span>
            </div>

            <div className="flex items-center justify-between gap-4 border-t border-line pt-4">
              <dt className="text-[15px] text-body">Taxes</dt>
              <dd className="text-[15px] text-body">Included</dd>
            </div>

            <div className="flex items-center justify-between gap-4 border-t border-line pt-4">
              <dt className="text-lg font-semibold text-ink">Total</dt>
              <dd className="text-2xl font-bold text-ink">{fee}</dd>
            </div>
          </dl>

          {paid ? (
            <Button variant="secondary" full className="mt-8" disabled>
              <CheckCircle2 />
              Paid
            </Button>
          ) : (
            <Button size="lg" full className="mt-8" onClick={() => setCheckoutOpen(true)}>
              <CreditCard />
              Pay {fee} securely
            </Button>
          )}

          <p className="mt-4 flex items-center justify-center gap-2 text-[13px] text-muted">
            <Lock className="size-3.5" />
            Secured by Razorpay
          </p>
        </Card>

        <div className="flex flex-col gap-5">
          <Card className="p-6">
            <h2 className="text-[15px] font-semibold">What you get</h2>
            <ul className="mt-4 flex flex-col gap-3">
              {[
                "A downloadable PDF certificate",
                "A unique certificate number",
                "A public QR verification link",
                "Shareable directly to LinkedIn",
              ].map((item) => (
                <li key={item} className="flex gap-3 text-[15px] leading-relaxed text-body">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </Card>

          <Card className="bg-canvas p-6">
            <h2 className="text-[15px] font-semibold">Refunds</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-body">
              If payment is deducted but no certificate is issued, the full amount is
              refunded within 5–7 working days.
            </p>
          </Card>
        </div>
      </div>

      {/* Confirmation step. The Razorpay checkout script is wired in the
          payments sprint; the order and verify calls either side are real. */}
      <Dialog
        open={checkoutOpen}
        onClose={() => !processing && setCheckoutOpen(false)}
        title="Confirm payment"
        description={`You're paying ${fee} to issue your certificate.`}
        size="sm"
        footer={
          <>
            <Button
              variant="secondary"
              disabled={processing}
              onClick={() => setCheckoutOpen(false)}
            >
              Cancel
            </Button>
            <Button disabled={processing} onClick={startPayment}>
              {processing ? "Processing…" : `Pay ${fee}`}
            </Button>
          </>
        }
      >
        <div className="rounded-field bg-canvas p-4 text-[15px]">
          <p className="text-body">
            Razorpay checkout opens here once the payment account is live. The order is
            created and verified against the server either side of this step.
          </p>
        </div>
      </Dialog>
    </div>
  );
}
