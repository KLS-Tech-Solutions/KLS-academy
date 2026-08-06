import { z } from "zod";
import { certificateNumber } from "./common";

export const verifyCertificateSchema = z.object({
  certificate_number: certificateNumber,
});
export type VerifyCertificateValues = z.input<typeof verifyCertificateSchema>;
