import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchStrapSetTypeSchema } from '../enums/WatchStrapSetType.schema'

const makeSchema = () => z.object({
  set: WatchStrapSetTypeSchema.optional()
}).strict();
export const NullableEnumWatchStrapSetTypeFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.NullableEnumWatchStrapSetTypeFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.NullableEnumWatchStrapSetTypeFieldUpdateOperationsInput>;
export const NullableEnumWatchStrapSetTypeFieldUpdateOperationsInputObjectZodSchema = makeSchema();
