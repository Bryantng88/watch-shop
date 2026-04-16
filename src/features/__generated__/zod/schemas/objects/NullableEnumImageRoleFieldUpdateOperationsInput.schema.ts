import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ImageRoleSchema } from '../enums/ImageRole.schema'

const makeSchema = () => z.object({
  set: ImageRoleSchema.optional()
}).strict();
export const NullableEnumImageRoleFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.NullableEnumImageRoleFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.NullableEnumImageRoleFieldUpdateOperationsInput>;
export const NullableEnumImageRoleFieldUpdateOperationsInputObjectZodSchema = makeSchema();
