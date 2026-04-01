import * as z from 'zod';

import { TechnicalMovementKindSchema } from '../../enums/TechnicalMovementKind.schema';
import { TechnicalActionModeSchema } from '../../enums/TechnicalActionMode.schema';
import { TechnicalAssessmentStatusSchema } from '../../enums/TechnicalAssessmentStatus.schema';
// prettier-ignore
export const TechnicalAssessmentInputSchema = z.object({
    id: z.string(),
    serviceRequestId: z.string(),
    movementKind: TechnicalMovementKindSchema,
    runningOk: z.boolean().optional().nullable(),
    batteryWeak: z.boolean().optional().nullable(),
    batteryIssueBattery: z.boolean(),
    batteryIssueIC: z.boolean(),
    batteryIssueCoil: z.boolean(),
    preRate: z.number().int().optional().nullable(),
    preAmplitude: z.number().int().optional().nullable(),
    preBeatError: z.number().optional().nullable(),
    postRate: z.number().int().optional().nullable(),
    postAmplitude: z.number().int().optional().nullable(),
    postBeatError: z.number().optional().nullable(),
    actionMode: TechnicalActionModeSchema,
    vendorId: z.string().optional().nullable(),
    vendorNameSnap: z.string().optional().nullable(),
    diagnosis: z.string().optional().nullable(),
    conclusion: z.string().optional().nullable(),
    imageFileKey: z.string().optional().nullable(),
    status: TechnicalAssessmentStatusSchema,
    evaluatedById: z.string().optional().nullable(),
    evaluatedByNameSnap: z.string().optional().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    ServiceRequest: z.unknown(),
    Vendor: z.unknown().optional().nullable(),
    TechnicalIssue: z.array(z.unknown())
}).strict();

export type TechnicalAssessmentInputType = z.infer<typeof TechnicalAssessmentInputSchema>;
