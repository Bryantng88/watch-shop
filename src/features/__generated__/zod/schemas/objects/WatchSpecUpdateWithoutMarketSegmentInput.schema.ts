import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { CaseTypeSchema } from '../enums/CaseType.schema';
import { EnumCaseTypeFieldUpdateOperationsInputObjectSchema as EnumCaseTypeFieldUpdateOperationsInputObjectSchema } from './EnumCaseTypeFieldUpdateOperationsInput.schema';
import { WatchSpecUpdatecategoryInputObjectSchema as WatchSpecUpdatecategoryInputObjectSchema } from './WatchSpecUpdatecategoryInput.schema';
import { CategorySchema } from '../enums/Category.schema';
import { GenderSchema } from '../enums/Gender.schema';
import { EnumGenderFieldUpdateOperationsInputObjectSchema as EnumGenderFieldUpdateOperationsInputObjectSchema } from './EnumGenderFieldUpdateOperationsInput.schema';
import { DecimalFieldUpdateOperationsInputObjectSchema as DecimalFieldUpdateOperationsInputObjectSchema } from './DecimalFieldUpdateOperationsInput.schema';
import { MovementTypeSchema } from '../enums/MovementType.schema';
import { EnumMovementTypeFieldUpdateOperationsInputObjectSchema as EnumMovementTypeFieldUpdateOperationsInputObjectSchema } from './EnumMovementTypeFieldUpdateOperationsInput.schema';
import { CaseMaterialSchema } from '../enums/CaseMaterial.schema';
import { EnumCaseMaterialFieldUpdateOperationsInputObjectSchema as EnumCaseMaterialFieldUpdateOperationsInputObjectSchema } from './EnumCaseMaterialFieldUpdateOperationsInput.schema';
import { NullableIntFieldUpdateOperationsInputObjectSchema as NullableIntFieldUpdateOperationsInputObjectSchema } from './NullableIntFieldUpdateOperationsInput.schema';
import { GoldColorSchema } from '../enums/GoldColor.schema';
import { NullableEnumGoldColorFieldUpdateOperationsInputObjectSchema as NullableEnumGoldColorFieldUpdateOperationsInputObjectSchema } from './NullableEnumGoldColorFieldUpdateOperationsInput.schema';
import { StrapSchema } from '../enums/Strap.schema';
import { EnumStrapFieldUpdateOperationsInputObjectSchema as EnumStrapFieldUpdateOperationsInputObjectSchema } from './EnumStrapFieldUpdateOperationsInput.schema';
import { GlassSchema } from '../enums/Glass.schema';
import { EnumGlassFieldUpdateOperationsInputObjectSchema as EnumGlassFieldUpdateOperationsInputObjectSchema } from './EnumGlassFieldUpdateOperationsInput.schema';
import { BoolFieldUpdateOperationsInputObjectSchema as BoolFieldUpdateOperationsInputObjectSchema } from './BoolFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { ProductUpdateOneRequiredWithoutWatchSpecNestedInputObjectSchema as ProductUpdateOneRequiredWithoutWatchSpecNestedInputObjectSchema } from './ProductUpdateOneRequiredWithoutWatchSpecNestedInput.schema';
import { ComplicationUpdateManyWithoutWatchSpecsNestedInputObjectSchema as ComplicationUpdateManyWithoutWatchSpecsNestedInputObjectSchema } from './ComplicationUpdateManyWithoutWatchSpecsNestedInput.schema'

const makeSchema = () => z.object({
  model: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  year: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  caseType: z.union([CaseTypeSchema, z.lazy(() => EnumCaseTypeFieldUpdateOperationsInputObjectSchema)]).optional(),
  category: z.union([z.lazy(() => WatchSpecUpdatecategoryInputObjectSchema), CategorySchema.array()]).optional(),
  gender: z.union([GenderSchema, z.lazy(() => EnumGenderFieldUpdateOperationsInputObjectSchema)]).optional(),
  length: z.union([z.number(), z.lazy(() => DecimalFieldUpdateOperationsInputObjectSchema)]).optional(),
  width: z.union([z.number(), z.lazy(() => DecimalFieldUpdateOperationsInputObjectSchema)]).optional(),
  thickness: z.union([z.number(), z.lazy(() => DecimalFieldUpdateOperationsInputObjectSchema)]).optional(),
  movement: z.union([MovementTypeSchema, z.lazy(() => EnumMovementTypeFieldUpdateOperationsInputObjectSchema)]).optional(),
  caliber: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  caseMaterial: z.union([CaseMaterialSchema, z.lazy(() => EnumCaseMaterialFieldUpdateOperationsInputObjectSchema)]).optional(),
  goldKarat: z.union([z.number().int(), z.lazy(() => NullableIntFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  goldColor: z.union([GoldColorSchema, z.lazy(() => NullableEnumGoldColorFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  caseSize: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  dialColor: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  marketSegmentId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  strap: z.union([StrapSchema, z.lazy(() => EnumStrapFieldUpdateOperationsInputObjectSchema)]).optional(),
  glass: z.union([GlassSchema, z.lazy(() => EnumGlassFieldUpdateOperationsInputObjectSchema)]).optional(),
  boxIncluded: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)]).optional(),
  bookletIncluded: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)]).optional(),
  cardIncluded: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  sizeCategory: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  product: z.lazy(() => ProductUpdateOneRequiredWithoutWatchSpecNestedInputObjectSchema).optional(),
  complication: z.lazy(() => ComplicationUpdateManyWithoutWatchSpecsNestedInputObjectSchema).optional()
}).strict();
export const WatchSpecUpdateWithoutMarketSegmentInputObjectSchema: z.ZodType<Prisma.WatchSpecUpdateWithoutMarketSegmentInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchSpecUpdateWithoutMarketSegmentInput>;
export const WatchSpecUpdateWithoutMarketSegmentInputObjectZodSchema = makeSchema();
