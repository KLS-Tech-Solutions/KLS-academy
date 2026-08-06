import type { Certificate } from "@/types";

/** Public verification lookup table. Replaced by GET /verify/{id} in Phase 3. */
export const verifiableCertificates: Certificate[] = [
  {
    id: "cert-001",
    student_id: "usr-student-001",
    certificate_number: "KLS-ACAD-2026-00184",
    certificate_url: "#",
    qr_code_url: "#",
    issued_at: "2026-09-26T16:45:00Z",
    student_name: "Ananya Rao",
    domain_title: "Full Stack Python Development",
    duration: "4 weeks",
    batch_name: "Full Stack Python Development — Batch 01",
  },
  {
    id: "cert-002",
    student_id: "usr-student-002",
    certificate_number: "KLS-ACAD-2026-00185",
    certificate_url: "#",
    qr_code_url: "#",
    issued_at: "2026-09-27T11:20:00Z",
    student_name: "Rohit Menon",
    domain_title: "Cyber Security",
    duration: "4 weeks",
    batch_name: "Cyber Security — Batch 01",
  },
];

export const findCertificate = (query: string) =>
  verifiableCertificates.find(
    (c) => c.certificate_number.toLowerCase() === query.trim().toLowerCase(),
  ) ?? null;
