import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AppTagScopeSchema } from '../enums/AppTagScope.schema'

const makeSchema = () => z.object({
  set: AppTagScopeSchema.optional()
}).strict();
export const EnumAppTagScopeFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumAppTagScopeFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumAppTagScopeFieldUpdateOperationsInput>;
export const EnumAppTagScopeFieldUpdateOperationsInputObjectZodSchema = makeSchema();
