import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchMaterialProfileSchema } from '../enums/WatchMaterialProfile.schema'

const makeSchema = () => z.object({
  set: WatchMaterialProfileSchema.optional()
}).strict();
export const EnumWatchMaterialProfileFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumWatchMaterialProfileFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumWatchMaterialProfileFieldUpdateOperationsInput>;
export const EnumWatchMaterialProfileFieldUpdateOperationsInputObjectZodSchema = makeSchema();
