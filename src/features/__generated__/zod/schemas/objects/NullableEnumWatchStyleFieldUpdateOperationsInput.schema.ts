import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchStyleSchema } from '../enums/WatchStyle.schema'

const makeSchema = () => z.object({
  set: WatchStyleSchema.optional()
}).strict();
export const NullableEnumWatchStyleFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.NullableEnumWatchStyleFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.NullableEnumWatchStyleFieldUpdateOperationsInput>;
export const NullableEnumWatchStyleFieldUpdateOperationsInputObjectZodSchema = makeSchema();
