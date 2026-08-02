import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StrapSchema } from '../enums/Strap.schema';
import { StrapOriginTypeSchema } from '../enums/StrapOriginType.schema';
import { StrapSurfaceSchema } from '../enums/StrapSurface.schema';
import { StrapInventoryPolicySchema } from '../enums/StrapInventoryPolicy.schema';
import { StrapClaspTypeSchema } from '../enums/StrapClaspType.schema';
import { StrapLengthClassSchema } from '../enums/StrapLengthClass.schema'

const makeSchema = () => z.object({
  color: z.string().optional().nullable(),
  material: StrapSchema.optional(),
  quickRelease: z.boolean().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date(),
  lugWidthMM: z.number().int(),
  buckleWidthMM: z.number().int().optional().nullable(),
  originType: StrapOriginTypeSchema.optional(),
  brandName: z.string().optional().nullable(),
  leatherType: z.string().optional().nullable(),
  surface: StrapSurfaceSchema.optional().nullable(),
  inventoryPolicy: StrapInventoryPolicySchema.optional(),
  claspType: StrapClaspTypeSchema.optional().nullable(),
  claspWidthMM: z.number().int().optional().nullable(),
  claspOriginType: StrapOriginTypeSchema.optional().nullable(),
  finish: z.string().optional().nullable(),
  lengthClass: StrapLengthClassSchema.optional().nullable(),
  minStockQty: z.number().int().optional(),
  targetStockQty: z.number().int().optional(),
  braceletReference: z.string().optional().nullable(),
  defaultFullLinks: z.number().int().optional().nullable(),
  defaultHalfLinks: z.number().int().optional().nullable(),
  defaultEndLinks: z.number().int().optional().nullable()
}).strict();
export const StrapVariantSpecUncheckedCreateWithoutProductVariantInputObjectSchema: z.ZodType<Prisma.StrapVariantSpecUncheckedCreateWithoutProductVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.StrapVariantSpecUncheckedCreateWithoutProductVariantInput>;
export const StrapVariantSpecUncheckedCreateWithoutProductVariantInputObjectZodSchema = makeSchema();
