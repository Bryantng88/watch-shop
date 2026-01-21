import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { service_scopeSchema } from '../enums/service_scope.schema'

const makeSchema = () => z.object({
  set: service_scopeSchema.optional()
}).strict();
export const NullableEnumservice_scopeFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.NullableEnumservice_scopeFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.NullableEnumservice_scopeFieldUpdateOperationsInput>;
export const NullableEnumservice_scopeFieldUpdateOperationsInputObjectZodSchema = makeSchema();
