import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { StrapSchema } from '../enums/Strap.schema';
import { EnumStrapFieldUpdateOperationsInputObjectSchema as EnumStrapFieldUpdateOperationsInputObjectSchema } from './EnumStrapFieldUpdateOperationsInput.schema';
import { NullableBoolFieldUpdateOperationsInputObjectSchema as NullableBoolFieldUpdateOperationsInputObjectSchema } from './NullableBoolFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { IntFieldUpdateOperationsInputObjectSchema as IntFieldUpdateOperationsInputObjectSchema } from './IntFieldUpdateOperationsInput.schema';
import { NullableIntFieldUpdateOperationsInputObjectSchema as NullableIntFieldUpdateOperationsInputObjectSchema } from './NullableIntFieldUpdateOperationsInput.schema';
import { StrapOriginTypeSchema } from '../enums/StrapOriginType.schema';
import { EnumStrapOriginTypeFieldUpdateOperationsInputObjectSchema as EnumStrapOriginTypeFieldUpdateOperationsInputObjectSchema } from './EnumStrapOriginTypeFieldUpdateOperationsInput.schema';
import { StrapSurfaceSchema } from '../enums/StrapSurface.schema';
import { NullableEnumStrapSurfaceFieldUpdateOperationsInputObjectSchema as NullableEnumStrapSurfaceFieldUpdateOperationsInputObjectSchema } from './NullableEnumStrapSurfaceFieldUpdateOperationsInput.schema';
import { StrapInventoryPolicySchema } from '../enums/StrapInventoryPolicy.schema';
import { EnumStrapInventoryPolicyFieldUpdateOperationsInputObjectSchema as EnumStrapInventoryPolicyFieldUpdateOperationsInputObjectSchema } from './EnumStrapInventoryPolicyFieldUpdateOperationsInput.schema';
import { StrapClaspTypeSchema } from '../enums/StrapClaspType.schema';
import { NullableEnumStrapClaspTypeFieldUpdateOperationsInputObjectSchema as NullableEnumStrapClaspTypeFieldUpdateOperationsInputObjectSchema } from './NullableEnumStrapClaspTypeFieldUpdateOperationsInput.schema';
import { NullableEnumStrapOriginTypeFieldUpdateOperationsInputObjectSchema as NullableEnumStrapOriginTypeFieldUpdateOperationsInputObjectSchema } from './NullableEnumStrapOriginTypeFieldUpdateOperationsInput.schema';
import { StrapLengthClassSchema } from '../enums/StrapLengthClass.schema';
import { NullableEnumStrapLengthClassFieldUpdateOperationsInputObjectSchema as NullableEnumStrapLengthClassFieldUpdateOperationsInputObjectSchema } from './NullableEnumStrapLengthClassFieldUpdateOperationsInput.schema'

const makeSchema = () => z.object({
  color: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  material: z.union([StrapSchema, z.lazy(() => EnumStrapFieldUpdateOperationsInputObjectSchema)]).optional(),
  quickRelease: z.union([z.boolean(), z.lazy(() => NullableBoolFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  lugWidthMM: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  buckleWidthMM: z.union([z.number().int(), z.lazy(() => NullableIntFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  originType: z.union([StrapOriginTypeSchema, z.lazy(() => EnumStrapOriginTypeFieldUpdateOperationsInputObjectSchema)]).optional(),
  brandName: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  leatherType: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  surface: z.union([StrapSurfaceSchema, z.lazy(() => NullableEnumStrapSurfaceFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  inventoryPolicy: z.union([StrapInventoryPolicySchema, z.lazy(() => EnumStrapInventoryPolicyFieldUpdateOperationsInputObjectSchema)]).optional(),
  claspType: z.union([StrapClaspTypeSchema, z.lazy(() => NullableEnumStrapClaspTypeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  claspWidthMM: z.union([z.number().int(), z.lazy(() => NullableIntFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  claspOriginType: z.union([StrapOriginTypeSchema, z.lazy(() => NullableEnumStrapOriginTypeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  finish: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  lengthClass: z.union([StrapLengthClassSchema, z.lazy(() => NullableEnumStrapLengthClassFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  minStockQty: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  targetStockQty: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  braceletReference: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  defaultFullLinks: z.union([z.number().int(), z.lazy(() => NullableIntFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  defaultHalfLinks: z.union([z.number().int(), z.lazy(() => NullableIntFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  defaultEndLinks: z.union([z.number().int(), z.lazy(() => NullableIntFieldUpdateOperationsInputObjectSchema)]).optional().nullable()
}).strict();
export const StrapVariantSpecUpdateManyMutationInputObjectSchema: z.ZodType<Prisma.StrapVariantSpecUpdateManyMutationInput> = makeSchema() as unknown as z.ZodType<Prisma.StrapVariantSpecUpdateManyMutationInput>;
export const StrapVariantSpecUpdateManyMutationInputObjectZodSchema = makeSchema();
