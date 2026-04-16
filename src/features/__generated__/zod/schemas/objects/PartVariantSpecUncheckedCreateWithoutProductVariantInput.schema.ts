import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PartTypeSchema } from '../enums/PartType.schema'

const makeSchema = () => z.object({
  partType: PartTypeSchema
}).strict();
export const PartVariantSpecUncheckedCreateWithoutProductVariantInputObjectSchema: z.ZodType<Prisma.PartVariantSpecUncheckedCreateWithoutProductVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.PartVariantSpecUncheckedCreateWithoutProductVariantInput>;
export const PartVariantSpecUncheckedCreateWithoutProductVariantInputObjectZodSchema = makeSchema();
