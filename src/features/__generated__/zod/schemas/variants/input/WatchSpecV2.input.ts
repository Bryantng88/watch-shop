import * as z from 'zod';

import { CaseTypeSchema } from '../../enums/CaseType.schema';
import { WatchMaterialProfileSchema } from '../../enums/WatchMaterialProfile.schema';
import { WatchCaseMaterialFamilySchema } from '../../enums/WatchCaseMaterialFamily.schema';
import { WatchGoldTreatmentSchema } from '../../enums/WatchGoldTreatment.schema';
import { WatchGoldColorV2Schema } from '../../enums/WatchGoldColorV2.schema';
import { GlassSchema } from '../../enums/Glass.schema';
import { MovementTypeSchema } from '../../enums/MovementType.schema';
import { StrapSchema } from '../../enums/Strap.schema';
import { WatchStrapSetTypeSchema } from '../../enums/WatchStrapSetType.schema';
import { WatchStrapComponentSourceSchema } from '../../enums/WatchStrapComponentSource.schema';
// prettier-ignore
export const WatchSpecV2InputSchema = z.object({
    id: z.string(),
    watchId: z.string(),
    brand: z.string().optional().nullable(),
    model: z.string().optional().nullable(),
    referenceNumber: z.string().optional().nullable(),
    nickname: z.string().optional().nullable(),
    caseShape: CaseTypeSchema.optional().nullable(),
    caseSizeMM: z.number().optional().nullable(),
    lugToLugMM: z.number().optional().nullable(),
    lugWidthMM: z.number().optional().nullable(),
    thicknessMM: z.number().optional().nullable(),
    materialProfile: WatchMaterialProfileSchema,
    primaryCaseMaterial: WatchCaseMaterialFamilySchema,
    secondaryCaseMaterial: WatchCaseMaterialFamilySchema.optional().nullable(),
    goldTreatment: WatchGoldTreatmentSchema.optional().nullable(),
    goldColors: WatchGoldColorV2Schema.array(),
    goldKarat: z.number().int().optional().nullable(),
    materialNote: z.string().optional().nullable(),
    dialColor: z.string().optional().nullable(),
    dialFinish: z.string().optional().nullable(),
    crystal: GlassSchema.optional().nullable(),
    movementType: MovementTypeSchema.optional().nullable(),
    calibre: z.string().optional().nullable(),
    powerReserve: z.string().optional().nullable(),
    waterResistance: z.string().optional().nullable(),
    braceletType: StrapSchema.optional().nullable(),
    strapMaterialText: z.string().optional().nullable(),
    buckleType: z.string().optional().nullable(),
    bookletIncluded: z.boolean(),
    cardIncluded: z.boolean(),
    strapSetType: WatchStrapSetTypeSchema.optional().nullable(),
    strapComponentSource: WatchStrapComponentSourceSchema.optional().nullable(),
    featuresJson: z.unknown().optional().nullable(),
    rawSpecJson: z.unknown().optional().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    watch: z.unknown()
}).strict();

export type WatchSpecV2InputType = z.infer<typeof WatchSpecV2InputSchema>;
