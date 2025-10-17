import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { LengthLabelSchema } from '../enums/LengthLabel.schema';
import { StrapSchema } from '../enums/Strap.schema'

const makeSchema = () => z.object({
  variantId: z.string(),
  widthMM: z.number().int(),
  lengthLabel: LengthLabelSchema.optional().nullable(),
  color: z.string().optional().nullable(),
  material: StrapSchema.optional(),
  quickRelease: z.boolean().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();
export const StrapVariantSpecCreateManyInputObjectSchema: z.ZodType<Prisma.StrapVariantSpecCreateManyInput> = makeSchema() as unknown as z.ZodType<Prisma.StrapVariantSpecCreateManyInput>;
export const StrapVariantSpecCreateManyInputObjectZodSchema = makeSchema();
