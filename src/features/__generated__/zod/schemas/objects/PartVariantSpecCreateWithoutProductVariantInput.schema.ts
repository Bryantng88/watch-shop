import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PartTypeSchema } from '../enums/PartType.schema'

const makeSchema = () => z.object({
  partType: PartTypeSchema
}).strict();
export const PartVariantSpecCreateWithoutProductVariantInputObjectSchema: z.ZodType<Prisma.PartVariantSpecCreateWithoutProductVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.PartVariantSpecCreateWithoutProductVariantInput>;
export const PartVariantSpecCreateWithoutProductVariantInputObjectZodSchema = makeSchema();
