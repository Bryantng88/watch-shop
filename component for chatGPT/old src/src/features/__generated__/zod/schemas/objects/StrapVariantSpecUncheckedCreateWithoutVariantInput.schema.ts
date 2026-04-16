import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StrapSchema } from '../enums/Strap.schema'

const makeSchema = () => z.object({
  color: z.string().optional().nullable(),
  material: StrapSchema.optional(),
  quickRelease: z.boolean().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  lugWidthMM: z.number().int(),
  buckleWidthMM: z.number().int().optional().nullable()
}).strict();
export const StrapVariantSpecUncheckedCreateWithoutVariantInputObjectSchema: z.ZodType<Prisma.StrapVariantSpecUncheckedCreateWithoutVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.StrapVariantSpecUncheckedCreateWithoutVariantInput>;
export const StrapVariantSpecUncheckedCreateWithoutVariantInputObjectZodSchema = makeSchema();
