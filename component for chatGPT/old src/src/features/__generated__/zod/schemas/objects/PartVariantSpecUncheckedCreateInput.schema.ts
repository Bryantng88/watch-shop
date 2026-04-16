import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PartTypeSchema } from '../enums/PartType.schema'

const makeSchema = () => z.object({
  variantId: z.string(),
  partType: PartTypeSchema
}).strict();
export const PartVariantSpecUncheckedCreateInputObjectSchema: z.ZodType<Prisma.PartVariantSpecUncheckedCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.PartVariantSpecUncheckedCreateInput>;
export const PartVariantSpecUncheckedCreateInputObjectZodSchema = makeSchema();
