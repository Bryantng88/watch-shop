import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { CaseTypeSchema } from '../enums/CaseType.schema';
import { NullableEnumCaseTypeFieldUpdateOperationsInputObjectSchema as NullableEnumCaseTypeFieldUpdateOperationsInputObjectSchema } from './NullableEnumCaseTypeFieldUpdateOperationsInput.schema';
import { WatchSpecUpdatecategoryInputObjectSchema as WatchSpecUpdatecategoryInputObjectSchema } from './WatchSpecUpdatecategoryInput.schema';
import { CategorySchema } from '../enums/Category.schema';
import { GenderSchema } from '../enums/Gender.schema';
import { NullableEnumGenderFieldUpdateOperationsInputObjectSchema as NullableEnumGenderFieldUpdateOperationsInputObjectSchema } from './NullableEnumGenderFieldUpdateOperationsInput.schema';
import { NullableDecimalFieldUpdateOperationsInputObjectSchema as NullableDecimalFieldUpdateOperationsInputObjectSchema } from './NullableDecimalFieldUpdateOperationsInput.schema';
import { MovementTypeSchema } from '../enums/MovementType.schema';
import { NullableEnumMovementTypeFieldUpdateOperationsInputObjectSchema as NullableEnumMovementTypeFieldUpdateOperationsInputObjectSchema } from './NullableEnumMovementTypeFieldUpdateOperationsInput.schema';
import { CaseMaterialSchema } from '../enums/CaseMaterial.schema';
import { EnumCaseMaterialFieldUpdateOperationsInputObjectSchema as EnumCaseMaterialFieldUpdateOperationsInputObjectSchema } from './EnumCaseMaterialFieldUpdateOperationsInput.schema';
import { NullableIntFieldUpdateOperationsInputObjectSchema as NullableIntFieldUpdateOperationsInputObjectSchema } from './NullableIntFieldUpdateOperationsInput.schema';
import { GoldColorSchema } from '../enums/GoldColor.schema';
import { NullableEnumGoldColorFieldUpdateOperationsInputObjectSchema as NullableEnumGoldColorFieldUpdateOperationsInputObjectSchema } from './NullableEnumGoldColorFieldUpdateOperationsInput.schema';
import { StrapSchema } from '../enums/Strap.schema';
import { NullableEnumStrapFieldUpdateOperationsInputObjectSchema as NullableEnumStrapFieldUpdateOperationsInputObjectSchema } from './NullableEnumStrapFieldUpdateOperationsInput.schema';
import { GlassSchema } from '../enums/Glass.schema';
import { NullableEnumGlassFieldUpdateOperationsInputObjectSchema as NullableEnumGlassFieldUpdateOperationsInputObjectSchema } from './NullableEnumGlassFieldUpdateOperationsInput.schema';
import { BoolFieldUpdateOperationsInputObjectSchema as BoolFieldUpdateOperationsInputObjectSchema } from './BoolFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { ProductUpdateOneRequiredWithoutWatchSpecNestedInputObjectSchema as ProductUpdateOneRequiredWithoutWatchSpecNestedInputObjectSchema } from './ProductUpdateOneRequiredWithoutWatchSpecNestedInput.schema';
import { MarketSegmentUpdateManyWithoutWatchSpecsNestedInputObjectSchema as MarketSegmentUpdateManyWithoutWatchSpecsNestedInputObjectSchema } from './MarketSegmentUpdateManyWithoutWatchSpecsNestedInput.schema'

const makeSchema = () => z.object({
  model: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  year: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  caseType: z.union([CaseTypeSchema, z.lazy(() => NullableEnumCaseTypeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  category: z.union([z.lazy(() => WatchSpecUpdatecategoryInputObjectSchema), CategorySchema.array()]).optional(),
  gender: z.union([GenderSchema, z.lazy(() => NullableEnumGenderFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  length: z.union([z.number(), z.lazy(() => NullableDecimalFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  width: z.union([z.number(), z.lazy(() => NullableDecimalFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  thickness: z.union([z.number(), z.lazy(() => NullableDecimalFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  movement: z.union([MovementTypeSchema, z.lazy(() => NullableEnumMovementTypeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  caliber: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  caseMaterial: z.union([CaseMaterialSchema, z.lazy(() => EnumCaseMaterialFieldUpdateOperationsInputObjectSchema)]).optional(),
  goldKarat: z.union([z.number().int(), z.lazy(() => NullableIntFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  goldColor: z.union([GoldColorSchema, z.lazy(() => NullableEnumGoldColorFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  caseSize: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  dialColor: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  marketSegmentId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  strap: z.union([StrapSchema, z.lazy(() => NullableEnumStrapFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  glass: z.union([GlassSchema, z.lazy(() => NullableEnumGlassFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  boxIncluded: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)]).optional(),
  bookletIncluded: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)]).optional(),
  cardIncluded: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  sizeCategory: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  product: z.lazy(() => ProductUpdateOneRequiredWithoutWatchSpecNestedInputObjectSchema).optional(),
  marketSegment: z.lazy(() => MarketSegmentUpdateManyWithoutWatchSpecsNestedInputObjectSchema).optional()
}).strict();
export const WatchSpecUpdateWithoutComplicationInputObjectSchema: z.ZodType<Prisma.WatchSpecUpdateWithoutComplicationInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchSpecUpdateWithoutComplicationInput>;
export const WatchSpecUpdateWithoutComplicationInputObjectZodSchema = makeSchema();
