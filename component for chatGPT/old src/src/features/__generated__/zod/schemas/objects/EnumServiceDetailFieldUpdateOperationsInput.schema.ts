import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceDetailSchema } from '../enums/ServiceDetail.schema'

const makeSchema = () => z.object({
  set: ServiceDetailSchema.optional()
}).strict();
export const EnumServiceDetailFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumServiceDetailFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumServiceDetailFieldUpdateOperationsInput>;
export const EnumServiceDetailFieldUpdateOperationsInputObjectZodSchema = makeSchema();
