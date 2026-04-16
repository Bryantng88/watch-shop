import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PartTypeSchema } from '../enums/PartType.schema'

const makeSchema = () => z.object({
  variantId: z.string(),
  partType: PartTypeSchema
}).strict();
export const PartVariantSpecCreateManyInputObjectSchema: z.ZodType<Prisma.PartVariantSpecCreateManyInput> = makeSchema() as unknown as z.ZodType<Prisma.PartVariantSpecCreateManyInput>;
export const PartVariantSpecCreateManyInputObjectZodSchema = makeSchema();
