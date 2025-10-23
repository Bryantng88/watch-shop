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
import { ProductCreateNestedOneWithoutWatchSpecInputObjectSchema as ProductCreateNestedOneWithoutWatchSpecInputObjectSchema } from './ProductCreateNestedOneWithoutWatchSpecInput.schema';
import { ComplicationCreateNestedManyWithoutWatchSpecsInputObjectSchema as ComplicationCreateNestedManyWithoutWatchSpecsInputObjectSchema } from './ComplicationCreateNestedManyWithoutWatchSpecsInput.schema';
import { MarketSegmentCreateNestedManyWithoutWatchSpecsInputObjectSchema as MarketSegmentCreateNestedManyWithoutWatchSpecsInputObjectSchema } from './MarketSegmentCreateNestedManyWithoutWatchSpecsInput.schema'

const makeSchema = () => z.object({
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
  product: z.lazy(() => ProductCreateNestedOneWithoutWatchSpecInputObjectSchema),
  complication: z.lazy(() => ComplicationCreateNestedManyWithoutWatchSpecsInputObjectSchema),
  marketSegment: z.lazy(() => MarketSegmentCreateNestedManyWithoutWatchSpecsInputObjectSchema)
}).strict();
export const WatchSpecCreateInputObjectSchema: z.ZodType<Prisma.WatchSpecCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchSpecCreateInput>;
export const WatchSpecCreateInputObjectZodSchema = makeSchema();
