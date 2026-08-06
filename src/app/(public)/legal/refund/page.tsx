export const metadata = { title: "Refund policy" };

export default function RefundPage() {
  return (
    <>
      <h1>Refund policy</h1>
      <p className="text-muted">Placeholder copy — to be reviewed before launch.</p>

      <h2>What is chargeable</h2>
      <p>
        The internship itself is free. The only charge on KLS Academy is a one-time ₹50
        certificate issuance fee, payable after all tasks have been approved.
      </p>

      <h2>Refund eligibility</h2>
      <ul>
        <li>
          If payment is deducted but no certificate is issued, the full amount is
          refunded.
        </li>
        <li>
          If you are charged more than once for the same certificate, the duplicate
          charge is refunded.
        </li>
        <li>
          Once a certificate has been generated and downloaded, the fee is
          non-refundable.
        </li>
      </ul>

      <h2>How to request a refund</h2>
      <p>
        Email klstechsolutions2025@gmail.com from your registered address with your
        transaction reference. Eligible refunds are processed within 5–7 working days to
        the original payment method.
      </p>
    </>
  );
}
