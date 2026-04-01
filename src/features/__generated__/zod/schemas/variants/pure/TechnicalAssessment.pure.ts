import * as z from 'zod';

import { TechnicalMovementKindSchema } from '../../enums/TechnicalMovementKind.schema';
import { TechnicalActionModeSchema } from '../../enums/TechnicalActionMode.schema';
import { TechnicalAssessmentStatusSchema } from '../../enums/TechnicalAssessmentStatus.schema';
// prettier-ignore
export const TechnicalAssessmentModelSchema = z.object({
    id: z.string(),
    serviceRequestId: z.string(),
    movementKind: TechnicalMovementKindSchema,
    runningOk: z.boolean().nullable(),
    batteryWeak: z.boolean().nullable(),
    batteryIssueBattery: z.boolean(),
    batteryIssueIC: z.boolean(),
    batteryIssueCoil: z.boolean(),
    preRate: z.number().int().nullable(),
    preAmplitude: z.number().int().nullable(),
    preBeatError: z.number().nullable(),
    postRate: z.number().int().nullable(),
    postAmplitude: z.number().int().nullable(),
    postBeatError: z.number().nullable(),
    actionMode: TechnicalActionModeSchema,
    vendorId: z.string().nullable(),
    vendorNameSnap: z.string().nullable(),
    diagnosis: z.string().nullable(),
    conclusion: z.string().nullable(),
    imageFileKey: z.string().nullable(),
    status: TechnicalAssessmentStatusSchema,
    evaluatedById: z.string().nullable(),
    evaluatedByNameSnap: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    ServiceRequest: z.unknown(),
    Vendor: z.unknown().nullable(),
    TechnicalIssue: z.array(z.unknown())
}).strict();

export type TechnicalAssessmentPureType = z.infer<typeof TechnicalAssessmentModelSchema>;
