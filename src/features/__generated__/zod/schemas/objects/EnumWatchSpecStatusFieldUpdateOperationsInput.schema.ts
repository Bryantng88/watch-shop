import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchSpecStatusSchema } from '../enums/WatchSpecStatus.schema'

const makeSchema = () => z.object({
  set: WatchSpecStatusSchema.optional()
}).strict();
export const EnumWatchSpecStatusFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumWatchSpecStatusFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumWatchSpecStatusFieldUpdateOperationsInput>;
export const EnumWatchSpecStatusFieldUpdateOperationsInputObjectZodSchema = makeSchema();
