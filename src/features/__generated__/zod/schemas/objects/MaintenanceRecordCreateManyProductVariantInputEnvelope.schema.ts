import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceRecordCreateManyProductVariantInputObjectSchema as MaintenanceRecordCreateManyProductVariantInputObjectSchema } from './MaintenanceRecordCreateManyProductVariantInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => MaintenanceRecordCreateManyProductVariantInputObjectSchema), z.lazy(() => MaintenanceRecordCreateManyProductVariantInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const MaintenanceRecordCreateManyProductVariantInputEnvelopeObjectSchema: z.ZodType<Prisma.MaintenanceRecordCreateManyProductVariantInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordCreateManyProductVariantInputEnvelope>;
export const MaintenanceRecordCreateManyProductVariantInputEnvelopeObjectZodSchema = makeSchema();
