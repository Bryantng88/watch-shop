import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PartTypeSchema } from '../enums/PartType.schema'

const makeSchema = () => z.object({
  partType: PartTypeSchema
}).strict();
export const PartVariantSpecUncheckedCreateWithoutVariantInputObjectSchema: z.ZodType<Prisma.PartVariantSpecUncheckedCreateWithoutVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.PartVariantSpecUncheckedCreateWithoutVariantInput>;
export const PartVariantSpecUncheckedCreateWithoutVariantInputObjectZodSchema = makeSchema();
