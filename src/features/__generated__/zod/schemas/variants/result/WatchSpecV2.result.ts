import * as z from 'zod';

import { CaseTypeSchema } from '../../enums/CaseType.schema';
import { WatchMaterialProfileSchema } from '../../enums/WatchMaterialProfile.schema';
import { WatchCaseMaterialFamilySchema } from '../../enums/WatchCaseMaterialFamily.schema';
import { WatchGoldTreatmentSchema } from '../../enums/WatchGoldTreatment.schema';
import { WatchGoldColorV2Schema } from '../../enums/WatchGoldColorV2.schema';
import { GlassSchema } from '../../enums/Glass.schema';
import { MovementTypeSchema } from '../../enums/MovementType.schema';
import { StrapSchema } from '../../enums/Strap.schema';
// prettier-ignore
export const WatchSpecV2ResultSchema = z.object({
    id: z.string(),
    watchId: z.string(),
    brand: z.string().nullable(),
    model: z.string().nullable(),
    referenceNumber: z.string().nullable(),
    nickname: z.string().nullable(),
    caseShape: CaseTypeSchema.nullable(),
    caseSizeMM: z.number().nullable(),
    lugToLugMM: z.number().nullable(),
    lugWidthMM: z.number().nullable(),
    thicknessMM: z.number().nullable(),
    materialProfile: WatchMaterialProfileSchema,
    primaryCaseMaterial: WatchCaseMaterialFamilySchema,
    secondaryCaseMaterial: WatchCaseMaterialFamilySchema.nullable(),
    goldTreatment: WatchGoldTreatmentSchema.nullable(),
    goldColors: WatchGoldColorV2Schema.array(),
    goldKarat: z.number().int().nullable(),
    materialNote: z.string().nullable(),
    dialColor: z.string().nullable(),
    dialFinish: z.string().nullable(),
    crystal: GlassSchema.nullable(),
    movementType: MovementTypeSchema.nullable(),
    calibre: z.string().nullable(),
    powerReserve: z.string().nullable(),
    waterResistance: z.string().nullable(),
    braceletType: StrapSchema.nullable(),
    strapMaterialText: z.string().nullable(),
    buckleType: z.string().nullable(),
    bookletIncluded: z.boolean(),
    cardIncluded: z.boolean(),
    featuresJson: z.unknown().nullable(),
    rawSpecJson: z.unknown().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    watch: z.unknown()
}).strict();

export type WatchSpecV2ResultType = z.infer<typeof WatchSpecV2ResultSchema>;
