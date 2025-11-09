import * as z from 'zod';

import { CaseTypeSchema } from '../../enums/CaseType.schema';
import { CategorySchema } from '../../enums/Category.schema';
import { GenderSchema } from '../../enums/Gender.schema';
import { MovementTypeSchema } from '../../enums/MovementType.schema';
import { CaseMaterialSchema } from '../../enums/CaseMaterial.schema';
import { GoldColorSchema } from '../../enums/GoldColor.schema';
import { StrapSchema } from '../../enums/Strap.schema';
import { GlassSchema } from '../../enums/Glass.schema';
// prettier-ignore
export const WatchSpecInputSchema = z.object({
    productId: z.string(),
    model: z.string().optional().nullable(),
    year: z.string().optional().nullable(),
    caseType: CaseTypeSchema.optional().nullable(),
    category: CategorySchema.array(),
    gender: GenderSchema.optional().nullable(),
    length: z.number().optional().nullable(),
    width: z.number().optional().nullable(),
    thickness: z.number().optional().nullable(),
    movement: MovementTypeSchema.optional().nullable(),
    caliber: z.string().optional().nullable(),
    caseMaterial: CaseMaterialSchema,
    goldKarat: z.number().int().optional().nullable(),
    goldColor: GoldColorSchema.optional().nullable(),
    caseSize: z.string().optional().nullable(),
    dialColor: z.string().optional().nullable(),
    marketSegmentId: z.string().optional().nullable(),
    strap: StrapSchema.optional().nullable(),
    glass: GlassSchema.optional().nullable(),
    boxIncluded: z.boolean(),
    bookletIncluded: z.boolean(),
    cardIncluded: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
    sizeCategory: z.string().optional().nullable(),
    ref: z.string().optional().nullable(),
    product: z.unknown(),
    complication: z.array(z.unknown()),
    marketSegment: z.array(z.unknown())
}).strict();

export type WatchSpecInputType = z.infer<typeof WatchSpecInputSchema>;
