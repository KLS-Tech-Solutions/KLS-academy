
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Pricing",
  description:
    "KLS Academy is free. There is no charge at any stage and nothing to refund.",
  path: "/legal/refund",
});

/**
 * There is nothing to refund.
 *
 * The route is kept rather than deleted because the old refund policy has been
 * linked from the footer and elsewhere, and a 404 reads as though something
 * has been quietly withdrawn. It now says the only thing there is to say.
 */
export default function PricingPage() {
  return (
    <>
      <h1>Pricing</h1>

      <h2>KLS Academy is free</h2>
      <p>
        There is no charge at any point. Enrolling is free, the internship is free,
        and the certificate is free. We do not ask for card details, we do not
        process payments, and there is nothing to refund.
      </p>

      <h2>How you get your certificate</h2>
      <p>
        Complete every technical task assigned to your domain. Each one is reviewed
        by a KLS engineer, and your certificate is issued automatically the moment
        the last one is approved. No fee, no waiting on an invoice, no step in
        between.
      </p>

      <h2>The platform is open source</h2>
      <p>
        KLS Academy is released under the MIT licence. Anyone can read the code,
        run their own instance, or contribute to it. The KLS Tech Solutions name,
        logo and seal are not covered by that licence — a certificate issued by
        someone else&apos;s instance is theirs, not ours.
      </p>

      <h2>Questions</h2>
      <p>
        Email klstechsolutions2025@gmail.com from your registered address and we
        will get back to you. Please check your Spam, Junk or Bin folder if you do
        not see a reply.
      </p>
    </>
  );
}
