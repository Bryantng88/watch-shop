import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ReserveTypeSchema } from '../enums/ReserveType.schema'

const makeSchema = () => z.object({
  set: ReserveTypeSchema.optional()
}).strict();
export const NullableEnumReserveTypeFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.NullableEnumReserveTypeFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.NullableEnumReserveTypeFieldUpdateOperationsInput>;
export const NullableEnumReserveTypeFieldUpdateOperationsInputObjectZodSchema = makeSchema();
