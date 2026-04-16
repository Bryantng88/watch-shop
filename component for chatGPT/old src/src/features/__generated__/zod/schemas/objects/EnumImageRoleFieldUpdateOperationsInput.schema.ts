import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ImageRoleSchema } from '../enums/ImageRole.schema'

const makeSchema = () => z.object({
  set: ImageRoleSchema.optional()
}).strict();
export const EnumImageRoleFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumImageRoleFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumImageRoleFieldUpdateOperationsInput>;
export const EnumImageRoleFieldUpdateOperationsInputObjectZodSchema = makeSchema();
