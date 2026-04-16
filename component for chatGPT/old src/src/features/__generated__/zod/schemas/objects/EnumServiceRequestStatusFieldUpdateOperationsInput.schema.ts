import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestStatusSchema } from '../enums/ServiceRequestStatus.schema'

const makeSchema = () => z.object({
  set: ServiceRequestStatusSchema.optional()
}).strict();
export const EnumServiceRequestStatusFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumServiceRequestStatusFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumServiceRequestStatusFieldUpdateOperationsInput>;
export const EnumServiceRequestStatusFieldUpdateOperationsInputObjectZodSchema = makeSchema();
