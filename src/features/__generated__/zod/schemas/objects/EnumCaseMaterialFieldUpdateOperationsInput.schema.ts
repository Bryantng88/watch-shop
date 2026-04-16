import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CaseMaterialSchema } from '../enums/CaseMaterial.schema'

const makeSchema = () => z.object({
  set: CaseMaterialSchema.optional()
}).strict();
export const EnumCaseMaterialFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumCaseMaterialFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumCaseMaterialFieldUpdateOperationsInput>;
export const EnumCaseMaterialFieldUpdateOperationsInputObjectZodSchema = makeSchema();
