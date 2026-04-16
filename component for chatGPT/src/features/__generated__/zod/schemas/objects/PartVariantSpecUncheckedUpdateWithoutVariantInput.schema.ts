import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PartTypeSchema } from '../enums/PartType.schema';
import { EnumPartTypeFieldUpdateOperationsInputObjectSchema as EnumPartTypeFieldUpdateOperationsInputObjectSchema } from './EnumPartTypeFieldUpdateOperationsInput.schema'

const makeSchema = () => z.object({
  partType: z.union([PartTypeSchema, z.lazy(() => EnumPartTypeFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
export const PartVariantSpecUncheckedUpdateWithoutVariantInputObjectSchema: z.ZodType<Prisma.PartVariantSpecUncheckedUpdateWithoutVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.PartVariantSpecUncheckedUpdateWithoutVariantInput>;
export const PartVariantSpecUncheckedUpdateWithoutVariantInputObjectZodSchema = makeSchema();
