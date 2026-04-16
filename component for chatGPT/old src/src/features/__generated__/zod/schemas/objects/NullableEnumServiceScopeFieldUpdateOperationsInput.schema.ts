import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceScopeSchema } from '../enums/ServiceScope.schema'

const makeSchema = () => z.object({
  set: ServiceScopeSchema.optional()
}).strict();
export const NullableEnumServiceScopeFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.NullableEnumServiceScopeFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.NullableEnumServiceScopeFieldUpdateOperationsInput>;
export const NullableEnumServiceScopeFieldUpdateOperationsInputObjectZodSchema = makeSchema();
