import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { BrandStatusSchema } from '../enums/BrandStatus.schema'

const makeSchema = () => z.object({
  set: BrandStatusSchema.optional()
}).strict();
export const EnumBrandStatusFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumBrandStatusFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumBrandStatusFieldUpdateOperationsInput>;
export const EnumBrandStatusFieldUpdateOperationsInputObjectZodSchema = makeSchema();
