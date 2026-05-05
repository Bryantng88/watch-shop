import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchStrapComponentSourceSchema } from '../enums/WatchStrapComponentSource.schema'

const makeSchema = () => z.object({
  set: WatchStrapComponentSourceSchema.optional()
}).strict();
export const NullableEnumWatchStrapComponentSourceFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.NullableEnumWatchStrapComponentSourceFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.NullableEnumWatchStrapComponentSourceFieldUpdateOperationsInput>;
export const NullableEnumWatchStrapComponentSourceFieldUpdateOperationsInputObjectZodSchema = makeSchema();
