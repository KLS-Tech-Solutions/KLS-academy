
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Privacy Policy",
  description:
    "What data KLS Academy collects, why, and how it is handled.",
  path: "/legal/privacy",
});

export default function PrivacyPage() {
  return (
    <>
      <h1>Privacy policy</h1>
      <p className="text-muted">Placeholder copy — to be reviewed before launch.</p>

      <h2>What we collect</h2>
      <ul>
        <li>Account details: name, email address and phone number.</li>
        <li>Profile details: college, degree, branch, year, LinkedIn and GitHub links.</li>
        <li>Submission content: repository links, screenshots and written explanations.</li>
      </ul>

      <h2>How we use it</h2>
      <p>
        To operate your internship — generating your offer letter, reviewing your
        submissions, issuing your certificate and sending workflow notifications.
      </p>

      <h2>What appears publicly</h2>
      <p>
        Only certificate verification data — student name, internship domain, duration
        and issue date — is shown on the public verification page, and only when someone
        enters a valid certificate number.
      </p>

      <h2>Storage</h2>
      <p>
        Uploaded files are stored in Cloudflare R2. Account and internship records are
        stored in a PostgreSQL database with encrypted secrets and access controls.
      </p>

      <h2>Your choices</h2>
      <p>
        You can request a copy of your data or ask for your account to be deleted by
        writing to klstechsolutions2025@gmail.com. Issued certificates remain verifiable
        unless revoked.
      </p>
    </>
  );
}
