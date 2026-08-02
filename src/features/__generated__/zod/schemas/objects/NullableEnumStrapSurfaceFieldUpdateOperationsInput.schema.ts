import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StrapSurfaceSchema } from '../enums/StrapSurface.schema'

const makeSchema = () => z.object({
  set: StrapSurfaceSchema.optional()
}).strict();
export const NullableEnumStrapSurfaceFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.NullableEnumStrapSurfaceFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.NullableEnumStrapSurfaceFieldUpdateOperationsInput>;
export const NullableEnumStrapSurfaceFieldUpdateOperationsInputObjectZodSchema = makeSchema();
