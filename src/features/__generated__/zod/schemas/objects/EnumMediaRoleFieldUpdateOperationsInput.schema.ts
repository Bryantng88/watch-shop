import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaRoleSchema } from '../enums/MediaRole.schema'

const makeSchema = () => z.object({
  set: MediaRoleSchema.optional()
}).strict();
export const EnumMediaRoleFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumMediaRoleFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumMediaRoleFieldUpdateOperationsInput>;
export const EnumMediaRoleFieldUpdateOperationsInputObjectZodSchema = makeSchema();
