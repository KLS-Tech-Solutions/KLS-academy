import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Privacy Policy",
  description:
    "What data KLS Academy collects, why we collect it, who else sees it, how long we keep it, and the rights you have under India's DPDP Act 2023.",
  path: "/legal/privacy",
});

/**
 * The privacy notice.
 *
 * Written against what the code actually does — the tables that exist, the
 * third parties the application really calls, the fields the deletion routine
 * really clears. A privacy policy that describes a system nobody built is
 * worse than none, because it is a written record of a claim that is not true.
 *
 * Structured around the DPDP Act 2023's notice requirements: what is
 * collected, the purpose, how to withdraw consent, how to exercise rights, and
 * how to complain.
 */
export default function PrivacyPage() {
  return (
    <>
      <h1>Privacy policy</h1>
      <p className="text-muted">Last updated: 22 August 2026</p>

      <p>
        This describes what KLS Academy does with your personal data. It is
        written to be accurate rather than comprehensive-sounding: everything
        below reflects what the software actually does today.
      </p>
      <p>
        KLS Tech Solutions, an MSME registered organisation in Bangalore,
        Karnataka, decides how and why your data is handled here. In the language
        of the Digital Personal Data Protection Act, 2023, we are the Data
        Fiduciary and you are the Data Principal.
      </p>

      <h2>The short version</h2>
      <ul>
        <li>We collect what the internship needs, and not much else.</li>
        <li>We do not sell your data, and we do not advertise to you.</li>
        <li>
          Only your name, domain, duration and issue date appear publicly, and
          only on a certificate verification page someone has to know the number
          to reach.
        </li>
        <li>You can see it, correct it, or delete it, at any time.</li>
      </ul>

      <h2>What we collect</h2>

      <h3>Because you gave it to us</h3>
      <ul>
        <li>
          <strong>At registration:</strong> your name, email address, phone number
          and date of birth.
        </li>
        <li>
          <strong>On your profile, if you fill it in:</strong> college, degree,
          branch, year of study, and your LinkedIn and GitHub links. These are
          optional.
        </li>
        <li>
          <strong>In your submissions:</strong> repository links, screenshots you
          upload, written explanations, and the LinkedIn post you submit for
          verification.
        </li>
        <li>
          <strong>If you write to us:</strong> whatever is in your message.
        </li>
      </ul>

      <h3>Because the system records it</h3>
      <ul>
        <li>
          <strong>Activity log:</strong> significant actions on your account —
          signing in, enrolling, submitting, closing the account — with the time
          and the IP address the request came from. This is what lets us
          investigate a compromised account or a disputed submission.
        </li>
        <li>
          <strong>Email log:</strong> which of our emails were sent to you and
          whether delivery succeeded, so we can tell &quot;never sent&quot; from
          &quot;sent, went to spam&quot;.
        </li>
        <li>
          <strong>Certificate verification log:</strong> when a certificate number
          is looked up on the public page, with the IP address and browser of
          whoever looked. This detects someone walking through numbers hunting for
          valid ones. It records the <em>checker</em>, not you.
        </li>
      </ul>

      <h3>Why we ask for your date of birth</h3>
      <p>
        Under the DPDP Act anyone below 18 is a child, and their data may only be
        processed with verifiable parental consent. We have no way to collect that
        consent, so instead of handling children&apos;s data badly we do not handle
        it at all — registration requires a date of birth and refuses anyone under
        18. The date is stored, used for that check, and used for nothing else. It
        is never shown publicly and never appears on a certificate.
      </p>

      <h2>Why we use it</h2>
      <ul>
        <li>
          <strong>To run your internship:</strong> creating your account,
          generating your offer letter, showing your tasks and notes, letting a
          reviewer assess your work, and issuing your certificate.
        </li>
        <li>
          <strong>To contact you about it:</strong> a welcome message when you
          register, resetting your password, and notifying you when a submission
          is reviewed or a certificate is issued. These are part of the service,
          not marketing.
        </li>
        <li>
          <strong>To keep the platform safe:</strong> rate limiting, detecting
          abuse of the verification page, and investigating account compromise.
        </li>
        <li>
          <strong>To understand how the site is used,</strong> in aggregate — see
          Analytics below.
        </li>
      </ul>
      <p>
        We do not sell your data, we do not share it with advertisers, we do not
        build a profile of you for advertising, and we do not make automated
        decisions with legal effect about you. Every submission is reviewed by a
        person.
      </p>

      <h2>Your consent</h2>
      <p>
        You give consent by creating an account, having read this notice. You can
        withdraw it at any time by closing your account from your dashboard, which
        is as easy as giving it was. Withdrawal is not retrospective: it stops
        further processing but does not undo what was lawfully done before.
      </p>
      <p>
        One consequence is worth stating plainly. If you withdraw consent, we
        cannot continue running your internship — there is no way to review work
        for someone whose account no longer exists.
      </p>

      <h2>What is public</h2>
      <p>
        One thing, and only when someone enters a valid certificate number: the
        certificate verification page shows the recipient&apos;s name, the
        internship domain, its duration, the issue date, and whether the
        certificate is still valid.
      </p>
      <p>
        The page is not listed or browsable, and certificate numbers are random
        rather than sequential precisely so that holding one tells you nothing
        about any other. Your email address, phone number, date of birth, college
        and submissions are never public.
      </p>

      <h2>Who else sees your data</h2>
      <p>
        A small number of service providers process data on our instructions, for
        the purposes above and nothing else:
      </p>
      <ul>
        <li>
          <strong>Our hosting provider</strong> — where the application runs.
        </li>
        <li>
          <strong>Our database provider</strong> — a managed PostgreSQL service
          that stores your account and internship records.
        </li>
        <li>
          <strong>Our email provider</strong> — delivers verification, password
          reset and notification emails. It necessarily sees your email address
          and the content of those messages.
        </li>
        <li>
          <strong>Mixpanel</strong> — product analytics, in the limited form
          described below.
        </li>
      </ul>
      <p>
        Beyond these, we disclose personal data only where the law requires it,
        and we would tell you unless we were forbidden to.
      </p>

      <h2>Analytics</h2>
      <p>
        We use Mixpanel to count things like how many people reached the
        enrolment page and how many finished. It is configured so that:
      </p>
      <ul>
        <li>No name, email address, phone number or user identifier is sent.</li>
        <li>
          Event properties are filtered before they leave your browser, and
          anything resembling an email address is dropped rather than transmitted.
        </li>
        <li>IP-based geolocation is switched off.</li>
        <li>
          If the analytics key is not configured, the code does nothing at all.
        </li>
      </ul>
      <p>
        The result is counts of events, not a record of a person. We cannot look
        up what you personally did in Mixpanel, and neither can anyone else.
      </p>

      <h2>Cookies</h2>
      <p>
        We do not use advertising or tracking cookies, and there is no consent
        banner because there is nothing to consent to.
      </p>
      <p>
        Signing in sets session cookies that hold your access and refresh tokens.
        They are <code>httpOnly</code>, so no JavaScript — ours or anyone
        else&apos;s — can read them, which is what stops a script on the page from
        stealing your session. They are essential: the site cannot keep you signed
        in without them. Signing out clears them.
      </p>

      <h2>How long we keep it</h2>
      <ul>
        <li>
          <strong>Account and internship records:</strong> while your account is
          open.
        </li>
        <li>
          <strong>Submissions and screenshots:</strong> for the internship and
          afterwards as evidence behind the certificate, so a challenge to it can
          be answered.
        </li>
        <li>
          <strong>Certificate records:</strong> indefinitely, including after you
          close your account, so the credential stays verifiable. This is
          deliberate — see below.
        </li>
        <li>
          <strong>Password reset links:</strong> 30 minutes, and they work once.
        </li>
        <li>
          <strong>Activity and verification logs:</strong> retained for security
          investigation and audit.
        </li>
      </ul>

      <h2>What happens when you close your account</h2>
      <p>
        Closing your account is irreversible and takes effect immediately. It asks
        for your password first, so that an unattended signed-in laptop cannot do
        it for you.
      </p>
      <p>We erase:</p>
      <ul>
        <li>Your name, phone number and date of birth.</li>
        <li>
          Your entire profile — college, degree, branch, year, LinkedIn and GitHub.
        </li>
        <li>Your password.</li>
        <li>
          Your email address, replaced with an unusable placeholder. This also
          frees the real address, so you can sign up again later if you want to.
        </li>
      </ul>
      <p>
        Every token your account holds stops working at that moment, on every
        device.
      </p>
      <p>
        <strong>One thing survives, and you should know why.</strong> Certificates
        already issued remain verifiable, and the certificate keeps its own copy of
        the name printed on it. An employer checking your certificate two years
        from now must not find a dead link because you closed your account — the
        credential you earned would become worthless at the moment you exercised a
        privacy right, which is the wrong trade. If you would rather the
        certificate were revoked as well, write to us and we will revoke it.
      </p>

      <h2>Your rights</h2>
      <p>Under the DPDP Act 2023 you can:</p>
      <ul>
        <li>
          <strong>Ask what we hold</strong> about you, and a summary of how it is
          processed and who it has been shared with.
        </li>
        <li>
          <strong>Correct anything wrong</strong> — most of it you can edit
          yourself on your profile; write to us for the rest.
        </li>
        <li>
          <strong>Erase it</strong>, by closing your account or by asking us,
          subject to the certificate exception above.
        </li>
        <li>
          <strong>Nominate someone</strong> to exercise these rights on your behalf
          if you die or become incapable of exercising them yourself.
        </li>
        <li>
          <strong>Complain</strong> to us, and to the Data Protection Board of
          India if our answer does not satisfy you.
        </li>
      </ul>
      <p>
        Write to <strong>klstechsolutions2025@gmail.com</strong> from your
        registered email address. We aim to respond within 30 days. Please check
        your Spam, Junk or Bin folder before assuming we have not replied.
      </p>

      <h2>How we protect it</h2>
      <ul>
        <li>Passwords are hashed with Argon2 and are not recoverable — not by us either.</li>
        <li>All traffic is served over HTTPS.</li>
        <li>
          Uploaded files are stored on our own server, outside the public web
          root, and are validated by content rather than by what the upload
          claims to be. They are reachable only through a request we have
          authenticated — there is no link that works without signing in.
        </li>
        <li>
          Sign-in, registration and email-sending endpoints are rate limited
          against brute force.
        </li>
        <li>
          Administrator access is restricted by role, checked against the database
          on every request rather than trusted from a token.
        </li>
        <li>
          Resetting a password ends every existing session, so a stolen one cannot
          outlive the reset.
        </li>
      </ul>
      <p>
        No system is perfectly secure. If a breach affects your data we will inform
        you and the Data Protection Board of India as the DPDP Rules require, and
        tell you what happened and what to do about it.
      </p>

      <h2>Where your data is</h2>
      <p>
        Data is stored on infrastructure that may be located outside India. Where
        that happens it remains subject to this notice and to our contracts with
        those providers, and to any restrictions the Government of India places on
        transfers under the DPDP Act.
      </p>

      <h2>Changes</h2>
      <p>
        We may update this notice. The date at the top reflects the current
        version. If a change materially affects how your data is used, we will
        email registered students before it takes effect.
      </p>

      <h2>Contact and grievances</h2>
      <p>
        For any question about this notice, to exercise a right, or to raise a
        grievance, write to <strong>klstechsolutions2025@gmail.com</strong>. If
        you are not satisfied with how we handle it, you may complain to the Data
        Protection Board of India.
      </p>
      <p className="text-muted">
        KLS Tech Solutions · MSME registered · Bangalore, Karnataka 560027, India
      </p>
    </>
  );
}
