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
export const WatchSpecResultSchema = z.object({
    productId: z.string(),
    model: z.string().nullable(),
    year: z.string().nullable(),
    caseType: CaseTypeSchema,
    category: CategorySchema.array(),
    gender: GenderSchema,
    length: z.number(),
    width: z.number(),
    thickness: z.number(),
    movement: MovementTypeSchema,
    caliber: z.string().nullable(),
    caseMaterial: CaseMaterialSchema,
    goldKarat: z.number().int().nullable(),
    goldColor: GoldColorSchema.nullable(),
    caseSize: z.string().nullable(),
    dialColor: z.string().nullable(),
    marketSegmentId: z.string().nullable(),
    strap: StrapSchema,
    glass: GlassSchema,
    boxIncluded: z.boolean(),
    bookletIncluded: z.boolean(),
    cardIncluded: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
    sizeCategory: z.string().nullable(),
    product: z.unknown(),
    complication: z.array(z.unknown()),
    marketSegment: z.array(z.unknown())
}).strict();

export type WatchSpecResultType = z.infer<typeof WatchSpecResultSchema>;
