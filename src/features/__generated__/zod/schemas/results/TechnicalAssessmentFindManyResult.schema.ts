import * as z from 'zod';
export const TechnicalAssessmentFindManyResultSchema = z.object({
  data: z.array(z.object({
  id: z.string(),
  serviceRequestId: z.string(),
  movementKind: z.unknown(),
  preRate: z.number().int().optional(),
  preAmplitude: z.number().int().optional(),
  preBeatError: z.number().optional(),
  postRate: z.number().int().optional(),
  postAmplitude: z.number().int().optional(),
  postBeatError: z.number().optional(),
  actionMode: z.unknown(),
  vendorId: z.string().optional(),
  vendorNameSnap: z.string().optional(),
  conclusion: z.string().optional(),
  imageFileKey: z.string().optional(),
  status: z.unknown(),
  evaluatedById: z.string().optional(),
  evaluatedByNameSnap: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  movementStatus: z.unknown(),
  caseStatus: z.unknown(),
  crystalStatus: z.unknown(),
  crownStatus: z.unknown(),
  ServiceRequest: z.unknown(),
  Vendor: z.unknown().optional(),
  TechnicalIssue: z.array(z.unknown())
})),
  pagination: z.object({
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1),
  total: z.number().int().min(0),
  totalPages: z.number().int().min(0),
  hasNext: z.boolean(),
  hasPrev: z.boolean()
})
});