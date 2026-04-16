import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceRecordCreateManyPaymentInputObjectSchema as MaintenanceRecordCreateManyPaymentInputObjectSchema } from './MaintenanceRecordCreateManyPaymentInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => MaintenanceRecordCreateManyPaymentInputObjectSchema), z.lazy(() => MaintenanceRecordCreateManyPaymentInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const MaintenanceRecordCreateManyPaymentInputEnvelopeObjectSchema: z.ZodType<Prisma.MaintenanceRecordCreateManyPaymentInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordCreateManyPaymentInputEnvelope>;
export const MaintenanceRecordCreateManyPaymentInputEnvelopeObjectZodSchema = makeSchema();
