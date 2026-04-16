import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchCaseMaterialFamilySchema } from '../enums/WatchCaseMaterialFamily.schema'

const makeSchema = () => z.object({
  set: WatchCaseMaterialFamilySchema.optional()
}).strict();
export const NullableEnumWatchCaseMaterialFamilyFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.NullableEnumWatchCaseMaterialFamilyFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.NullableEnumWatchCaseMaterialFamilyFieldUpdateOperationsInput>;
export const NullableEnumWatchCaseMaterialFamilyFieldUpdateOperationsInputObjectZodSchema = makeSchema();
