import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchCaseMaterialFamilySchema } from '../enums/WatchCaseMaterialFamily.schema'

const makeSchema = () => z.object({
  set: WatchCaseMaterialFamilySchema.optional()
}).strict();
export const EnumWatchCaseMaterialFamilyFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumWatchCaseMaterialFamilyFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumWatchCaseMaterialFamilyFieldUpdateOperationsInput>;
export const EnumWatchCaseMaterialFamilyFieldUpdateOperationsInputObjectZodSchema = makeSchema();
