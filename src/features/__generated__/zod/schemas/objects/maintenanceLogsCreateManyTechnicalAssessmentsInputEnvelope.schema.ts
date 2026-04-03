import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { maintenanceLogsCreateManyTechnicalAssessmentsInputObjectSchema as maintenanceLogsCreateManyTechnicalAssessmentsInputObjectSchema } from './maintenanceLogsCreateManyTechnicalAssessmentsInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => maintenanceLogsCreateManyTechnicalAssessmentsInputObjectSchema), z.lazy(() => maintenanceLogsCreateManyTechnicalAssessmentsInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const maintenanceLogsCreateManyTechnicalAssessmentsInputEnvelopeObjectSchema: z.ZodType<Prisma.maintenanceLogsCreateManyTechnicalAssessmentsInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.maintenanceLogsCreateManyTechnicalAssessmentsInputEnvelope>;
export const maintenanceLogsCreateManyTechnicalAssessmentsInputEnvelopeObjectZodSchema = makeSchema();
