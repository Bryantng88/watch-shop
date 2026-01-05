import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { shipmentstatusSchema } from '../enums/shipmentstatus.schema'

const makeSchema = () => z.object({
  set: shipmentstatusSchema.optional()
}).strict();
export const EnumshipmentstatusFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumshipmentstatusFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumshipmentstatusFieldUpdateOperationsInput>;
export const EnumshipmentstatusFieldUpdateOperationsInputObjectZodSchema = makeSchema();
