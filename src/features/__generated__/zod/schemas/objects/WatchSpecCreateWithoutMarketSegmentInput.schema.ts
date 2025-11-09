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
import { ComplicationCreateNestedManyWithoutWatchSpecsInputObjectSchema as ComplicationCreateNestedManyWithoutWatchSpecsInputObjectSchema } from './ComplicationCreateNestedManyWithoutWatchSpecsInput.schema'

const makeSchema = () => z.object({
  model: z.string().optional().nullable(),
  year: z.string().optional().nullable(),
  caseType: CaseTypeSchema.optional().nullable(),
  category: z.union([z.lazy(() => WatchSpecCreatecategoryInputObjectSchema), CategorySchema.array()]).optional(),
  gender: GenderSchema.optional().nullable(),
  length: z.number().optional().nullable(),
  width: z.number().optional().nullable(),
  thickness: z.number().optional().nullable(),
  movement: MovementTypeSchema.optional().nullable(),
  caliber: z.string().optional().nullable(),
  caseMaterial: CaseMaterialSchema.optional(),
  goldKarat: z.number().int().optional().nullable(),
  goldColor: GoldColorSchema.optional().nullable(),
  caseSize: z.string().optional().nullable(),
  dialColor: z.string().optional().nullable(),
  marketSegmentId: z.string().optional().nullable(),
  strap: StrapSchema.optional().nullable(),
  glass: GlassSchema.optional().nullable(),
  boxIncluded: z.boolean().optional(),
  bookletIncluded: z.boolean().optional(),
  cardIncluded: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  sizeCategory: z.string().optional().nullable(),
  ref: z.string().optional().nullable(),
  product: z.lazy(() => ProductCreateNestedOneWithoutWatchSpecInputObjectSchema),
  complication: z.lazy(() => ComplicationCreateNestedManyWithoutWatchSpecsInputObjectSchema).optional()
}).strict();
export const WatchSpecCreateWithoutMarketSegmentInputObjectSchema: z.ZodType<Prisma.WatchSpecCreateWithoutMarketSegmentInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchSpecCreateWithoutMarketSegmentInput>;
export const WatchSpecCreateWithoutMarketSegmentInputObjectZodSchema = makeSchema();
