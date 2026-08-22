import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Terms of Service",
  description:
    "The terms governing use of KLS Academy — a free virtual internship platform operated by KLS Tech Solutions.",
  path: "/legal/terms",
});

/**
 * The terms a student agrees to at registration.
 *
 * Written to be read rather than to be skipped: short sentences, no defined
 * terms in capitals, and each section says the thing it is actually about. The
 * clauses that would surprise someone — that this is not employment, that a
 * certificate can be revoked, that the platform carries no availability
 * guarantee — are stated plainly instead of buried.
 */
export default function TermsPage() {
  return (
    <>
      <h1>Terms of service</h1>
      <p className="text-muted">Last updated: 22 August 2026</p>

      <p>
        These terms govern your use of KLS Academy at academy.klstechsolutions.in.
        The platform is operated by KLS Tech Solutions, an MSME registered
        organisation based in Bangalore, Karnataka. By creating an account you
        agree to them. If you do not, please do not register.
      </p>

      <h2>1. Who can register</h2>
      <p>
        You must be 18 or over. We ask for your date of birth at registration and
        refuse accounts below that age. This is not a preference — India&apos;s
        Digital Personal Data Protection Act, 2023 treats anyone under 18 as a
        child and requires verifiable parental consent before their personal data
        may be processed, and we are not set up to collect that consent.
      </p>
      <p>
        You must register in your own name and use a real email address you
        control. One person, one account.
      </p>

      <h2>2. What this is, and what it is not</h2>
      <p>
        KLS Academy is a virtual internship: you work through domain tasks on your
        own schedule, a KLS engineer reviews each submission, and a verifiable
        certificate is issued once every task is approved.
      </p>
      <p>To be unambiguous about the things people most often assume:</p>
      <ul>
        <li>
          This is <strong>not employment</strong>. Enrolling does not create an
          employment, contractor, agency or partnership relationship between you
          and KLS Tech Solutions.
        </li>
        <li>
          There is <strong>no stipend, salary or payment</strong> of any kind to
          you.
        </li>
        <li>
          There is <strong>no offer of a job</strong>, and completing the
          internship does not entitle you to be considered for one.
        </li>
        <li>
          The offer letter issued at the start of your internship is a letter of
          participation in this programme. It is not an employment offer and
          should not be presented as one.
        </li>
      </ul>

      <h2>3. It is free</h2>
      <p>
        There is no charge at any stage — not to enrol, not to be reviewed, and
        not to receive your certificate. We never ask for card or bank details.
        If anyone asks you to pay for anything connected to KLS Academy, it is
        not us; please write to us at the address at the bottom of this page.
      </p>

      <h2>4. Your account</h2>
      <p>
        You are responsible for keeping your password to yourself and for
        everything done through your account. Tell us promptly if you think
        someone else has access to it. Resetting your password signs out every
        device your account is signed in on, which is the fastest way to end a
        session you did not start.
      </p>

      <h2>5. Your work</h2>
      <p>
        <strong>Your work remains yours.</strong> You keep ownership and copyright
        in everything you submit — code, repositories, screenshots and written
        explanations.
      </p>
      <p>
        By submitting, you give us permission to store your submission, open and
        run it, and review it, for as long as needed to assess your internship and
        to substantiate the certificate afterwards. We do not use your submitted
        work in our own products or services, do not publish it, and do not pass
        it to anyone outside the review team.
      </p>
      <p>You confirm, for each submission, that:</p>
      <ul>
        <li>You are the author of the work.</li>
        <li>
          Any third-party code, libraries or assets you have used are permitted by
          their own licences and are credited where those licences require it.
        </li>
        <li>
          Repositories you link are accessible to the reviewer for the duration of
          the review.
        </li>
      </ul>
      <p>
        Submissions may be rejected with written feedback and resubmitted. There
        is no penalty for a rejection.
      </p>

      <h2>6. Conduct</h2>
      <p>
        Most of this reduces to one idea: the certificate has to mean something,
        which means the work behind it has to be yours. Accounts may be suspended,
        and certificates revoked, for:
      </p>
      <ul>
        <li>Submitting work you did not write, or presenting it as your own.</li>
        <li>Fabricating LinkedIn verification, or any other required evidence.</li>
        <li>Registering under a false identity, or holding multiple accounts.</li>
        <li>
          Misrepresenting your certificate — for example describing the internship
          as paid employment at KLS Tech Solutions.
        </li>
        <li>
          Attempting to gain access to another person&apos;s account or data, or to
          parts of the platform not intended for you.
        </li>
        <li>
          Automated scraping, load testing, or anything else that degrades the
          service for other students.
        </li>
      </ul>
      <p>
        Where the facts allow it, we will ask you about a problem before acting on
        it.
      </p>

      <h2>7. Certificates and verification</h2>
      <p>
        Your certificate is issued automatically the moment your final task is
        approved. It carries a unique number and a QR code leading to a public
        verification page, so anyone you show it to can confirm it is real.
      </p>
      <p>
        We may revoke a certificate if it was obtained through plagiarism or
        misrepresentation. A revoked certificate shows as revoked on the
        verification page. We will tell you at the registered email address if
        this happens, and you can respond.
      </p>
      <p>
        The verification page shows only the recipient&apos;s name, the internship
        domain, its duration and the issue date. Nothing else about you is public.
      </p>

      <h2>8. Availability</h2>
      <p>
        KLS Academy is offered as it is, free of charge, and without a guarantee of
        availability. We may change, suspend or discontinue any part of it. If we
        were ever to shut the platform down, we would give registered students
        reasonable notice by email and a window to download their documents.
      </p>
      <p>
        Keep your own copy of your offer letter and certificate once they are
        issued. They are yours; do not rely on us as your only archive.
      </p>

      <h2>9. Liability</h2>
      <p>
        To the extent Indian law permits, KLS Tech Solutions is not liable for
        indirect or consequential loss arising from your use of the platform —
        including lost opportunities, lost data, or a hiring decision made by
        somebody else. Nothing here limits liability that cannot lawfully be
        limited, including for fraud.
      </p>

      <h2>10. Closing your account</h2>
      <p>
        You can close your account from your dashboard at any time, and you do not
        have to tell us why. Doing so removes your name, phone number, date of
        birth and profile details, and signs out every device.
      </p>
      <p>
        <strong>Certificates already issued stay verifiable.</strong> An employer
        checking your certificate two years from now must not find a dead link
        because you closed your account, so the certificate record and the name
        printed on it survive. Everything else goes. If you want the certificate
        revoked as well, ask us and we will do it.
      </p>
      <p>
        We may suspend or close an account that breaches section 6, or where we are
        required to by law.
      </p>

      <h2>11. Open source</h2>
      <p>
        The KLS Academy software is released under the MIT licence and anyone may
        read it, run their own instance, or contribute to it.
      </p>
      <p>
        The KLS Tech Solutions name, logo and seal are <em>not</em> covered by that
        licence. A certificate issued by somebody else&apos;s instance is theirs,
        not ours, and only certificates verifiable at academy.klstechsolutions.in
        were issued by us.
      </p>

      <h2>12. Changes to these terms</h2>
      <p>
        We may update these terms. The date at the top always reflects the current
        version. If a change materially affects you, we will email registered
        students before it takes effect. Continuing to use the platform afterwards
        means you accept the updated terms.
      </p>

      <h2>13. Governing law</h2>
      <p>
        These terms are governed by the laws of India. The courts at Bangalore,
        Karnataka have jurisdiction. If a dispute arises, please write to us first
        — nearly everything is resolvable that way.
      </p>

      <h2>14. Contact</h2>
      <p>
        Email <strong>klstechsolutions2025@gmail.com</strong> from your registered
        address and we will reply. If you do not see a reply, please check your
        Spam, Junk or Bin folder before writing again — our messages sometimes
        land there.
      </p>
      <p className="text-muted">
        KLS Tech Solutions · MSME registered · Bangalore, Karnataka 560027, India
      </p>
    </>
  );
}
