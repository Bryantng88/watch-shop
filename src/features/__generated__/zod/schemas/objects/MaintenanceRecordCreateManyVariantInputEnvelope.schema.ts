import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceRecordCreateManyVariantInputObjectSchema as MaintenanceRecordCreateManyVariantInputObjectSchema } from './MaintenanceRecordCreateManyVariantInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => MaintenanceRecordCreateManyVariantInputObjectSchema), z.lazy(() => MaintenanceRecordCreateManyVariantInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const MaintenanceRecordCreateManyVariantInputEnvelopeObjectSchema: z.ZodType<Prisma.MaintenanceRecordCreateManyVariantInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordCreateManyVariantInputEnvelope>;
export const MaintenanceRecordCreateManyVariantInputEnvelopeObjectZodSchema = makeSchema();
