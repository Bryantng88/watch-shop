import * as z from 'zod';

import { TechnicalMovementKindSchema } from '../../enums/TechnicalMovementKind.schema';
import { TechnicalActionModeSchema } from '../../enums/TechnicalActionMode.schema';
import { TechnicalAssessmentStatusSchema } from '../../enums/TechnicalAssessmentStatus.schema';
import { TechnicalSectionStatusSchema } from '../../enums/TechnicalSectionStatus.schema';
// prettier-ignore
export const TechnicalAssessmentInputSchema = z.object({
    id: z.string(),
    serviceRequestId: z.string(),
    movementKind: TechnicalMovementKindSchema,
    preRate: z.number().int().optional().nullable(),
    preAmplitude: z.number().int().optional().nullable(),
    preBeatError: z.number().optional().nullable(),
    postRate: z.number().int().optional().nullable(),
    postAmplitude: z.number().int().optional().nullable(),
    postBeatError: z.number().optional().nullable(),
    actionMode: TechnicalActionModeSchema,
    vendorId: z.string().optional().nullable(),
    vendorNameSnap: z.string().optional().nullable(),
    conclusion: z.string().optional().nullable(),
    imageFileKey: z.string().optional().nullable(),
    status: TechnicalAssessmentStatusSchema,
    evaluatedById: z.string().optional().nullable(),
    evaluatedByNameSnap: z.string().optional().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    movementStatus: TechnicalSectionStatusSchema,
    caseStatus: TechnicalSectionStatusSchema,
    crystalStatus: TechnicalSectionStatusSchema,
    crownStatus: TechnicalSectionStatusSchema,
    ServiceRequest: z.unknown(),
    Vendor: z.unknown().optional().nullable(),
    TechnicalIssue: z.array(z.unknown())
}).strict();

export type TechnicalAssessmentInputType = z.infer<typeof TechnicalAssessmentInputSchema>;
