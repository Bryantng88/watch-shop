import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceRecordCreateManyProductInputObjectSchema as MaintenanceRecordCreateManyProductInputObjectSchema } from './MaintenanceRecordCreateManyProductInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => MaintenanceRecordCreateManyProductInputObjectSchema), z.lazy(() => MaintenanceRecordCreateManyProductInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const MaintenanceRecordCreateManyProductInputEnvelopeObjectSchema: z.ZodType<Prisma.MaintenanceRecordCreateManyProductInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordCreateManyProductInputEnvelope>;
export const MaintenanceRecordCreateManyProductInputEnvelopeObjectZodSchema = makeSchema();
