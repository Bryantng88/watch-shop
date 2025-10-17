import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PartTypeSchema } from '../enums/PartType.schema'

const makeSchema = () => z.object({
  partType: PartTypeSchema
}).strict();
export const PartVariantSpecCreateWithoutVariantInputObjectSchema: z.ZodType<Prisma.PartVariantSpecCreateWithoutVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.PartVariantSpecCreateWithoutVariantInput>;
export const PartVariantSpecCreateWithoutVariantInputObjectZodSchema = makeSchema();
