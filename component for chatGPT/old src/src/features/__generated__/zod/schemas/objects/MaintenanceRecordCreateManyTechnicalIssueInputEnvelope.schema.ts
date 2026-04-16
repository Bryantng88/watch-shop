import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceRecordCreateManyTechnicalIssueInputObjectSchema as MaintenanceRecordCreateManyTechnicalIssueInputObjectSchema } from './MaintenanceRecordCreateManyTechnicalIssueInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => MaintenanceRecordCreateManyTechnicalIssueInputObjectSchema), z.lazy(() => MaintenanceRecordCreateManyTechnicalIssueInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const MaintenanceRecordCreateManyTechnicalIssueInputEnvelopeObjectSchema: z.ZodType<Prisma.MaintenanceRecordCreateManyTechnicalIssueInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordCreateManyTechnicalIssueInputEnvelope>;
export const MaintenanceRecordCreateManyTechnicalIssueInputEnvelopeObjectZodSchema = makeSchema();
