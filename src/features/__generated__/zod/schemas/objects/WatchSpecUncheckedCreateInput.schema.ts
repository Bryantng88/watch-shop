import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CaseTypeSchema } from '../enums/CaseType.schema';
import { WatchSpecCreatecategoryInputObjectSchema as WatchSpecCreatecategoryInputObjectSchema } from './WatchSpecCreatecategoryInput.schema';
import { CategorySchema } from '../enums/Category.schema';
import { GenderSchema } from '../enums/Gender.schema';
import { MovementTypeSchema } from '../enums/MovementType.schema';
import { CaseMaterialSchema } from '../enums/CaseMaterial.schema';
import { GoldColorSchema } from '../enums/GoldColor.schema';
import { StrapSchema } from '../enums/Strap.schema';
import { GlassSchema } from '../enums/Glass.schema';
import { ComplicationUncheckedCreateNestedManyWithoutWatchSpecsInputObjectSchema as ComplicationUncheckedCreateNestedManyWithoutWatchSpecsInputObjectSchema } from './ComplicationUncheckedCreateNestedManyWithoutWatchSpecsInput.schema';
import { MarketSegmentUncheckedCreateNestedManyWithoutWatchSpecsInputObjectSchema as MarketSegmentUncheckedCreateNestedManyWithoutWatchSpecsInputObjectSchema } from './MarketSegmentUncheckedCreateNestedManyWithoutWatchSpecsInput.schema'

const makeSchema = () => z.object({
  productId: z.string(),
  model: z.string().optional().nullable(),
  year: z.string().optional().nullable(),
  caseType: CaseTypeSchema.optional(),
  category: z.union([z.lazy(() => WatchSpecCreatecategoryInputObjectSchema), CategorySchema.array()]),
  gender: GenderSchema.optional(),
  length: z.number(),
  width: z.number(),
  thickness: z.number(),
  movement: MovementTypeSchema.optional(),
  caliber: z.string().optional().nullable(),
  caseMaterial: CaseMaterialSchema.optional(),
  goldKarat: z.number().int().optional().nullable(),
  goldColor: GoldColorSchema.optional().nullable(),
  caseSize: z.string().optional().nullable(),
  dialColor: z.string().optional().nullable(),
  marketSegmentId: z.string().optional().nullable(),
  strap: StrapSchema.optional(),
  glass: GlassSchema.optional(),
  boxIncluded: z.boolean().optional(),
  bookletIncluded: z.boolean().optional(),
  cardIncluded: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  sizeCategory: z.string().optional().nullable(),
  complication: z.lazy(() => ComplicationUncheckedCreateNestedManyWithoutWatchSpecsInputObjectSchema),
  marketSegment: z.lazy(() => MarketSegmentUncheckedCreateNestedManyWithoutWatchSpecsInputObjectSchema)
}).strict();
export const WatchSpecUncheckedCreateInputObjectSchema: z.ZodType<Prisma.WatchSpecUncheckedCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchSpecUncheckedCreateInput>;
export const WatchSpecUncheckedCreateInputObjectZodSchema = makeSchema();
