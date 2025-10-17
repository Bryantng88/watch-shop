import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceTypeSchema } from '../enums/ServiceType.schema'

const makeSchema = () => z.object({
  set: ServiceTypeSchema.optional()
}).strict();
export const EnumServiceTypeFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumServiceTypeFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumServiceTypeFieldUpdateOperationsInput>;
export const EnumServiceTypeFieldUpdateOperationsInputObjectZodSchema = makeSchema();
