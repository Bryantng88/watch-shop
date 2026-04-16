import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceRecordCreateManyUserInputObjectSchema as MaintenanceRecordCreateManyUserInputObjectSchema } from './MaintenanceRecordCreateManyUserInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => MaintenanceRecordCreateManyUserInputObjectSchema), z.lazy(() => MaintenanceRecordCreateManyUserInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const MaintenanceRecordCreateManyUserInputEnvelopeObjectSchema: z.ZodType<Prisma.MaintenanceRecordCreateManyUserInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordCreateManyUserInputEnvelope>;
export const MaintenanceRecordCreateManyUserInputEnvelopeObjectZodSchema = makeSchema();
