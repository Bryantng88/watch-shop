import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaBindingLifecycleSchema } from '../enums/MediaBindingLifecycle.schema'

const makeSchema = () => z.object({
  set: MediaBindingLifecycleSchema.optional()
}).strict();
export const EnumMediaBindingLifecycleFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumMediaBindingLifecycleFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumMediaBindingLifecycleFieldUpdateOperationsInput>;
export const EnumMediaBindingLifecycleFieldUpdateOperationsInputObjectZodSchema = makeSchema();
