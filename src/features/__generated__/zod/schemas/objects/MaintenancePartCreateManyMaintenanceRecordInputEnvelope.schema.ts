import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenancePartCreateManyMaintenanceRecordInputObjectSchema as MaintenancePartCreateManyMaintenanceRecordInputObjectSchema } from './MaintenancePartCreateManyMaintenanceRecordInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => MaintenancePartCreateManyMaintenanceRecordInputObjectSchema), z.lazy(() => MaintenancePartCreateManyMaintenanceRecordInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const MaintenancePartCreateManyMaintenanceRecordInputEnvelopeObjectSchema: z.ZodType<Prisma.MaintenancePartCreateManyMaintenanceRecordInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.MaintenancePartCreateManyMaintenanceRecordInputEnvelope>;
export const MaintenancePartCreateManyMaintenanceRecordInputEnvelopeObjectZodSchema = makeSchema();
