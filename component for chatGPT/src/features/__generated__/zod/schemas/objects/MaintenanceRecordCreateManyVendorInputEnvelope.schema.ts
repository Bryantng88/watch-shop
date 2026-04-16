import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceRecordCreateManyVendorInputObjectSchema as MaintenanceRecordCreateManyVendorInputObjectSchema } from './MaintenanceRecordCreateManyVendorInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => MaintenanceRecordCreateManyVendorInputObjectSchema), z.lazy(() => MaintenanceRecordCreateManyVendorInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const MaintenanceRecordCreateManyVendorInputEnvelopeObjectSchema: z.ZodType<Prisma.MaintenanceRecordCreateManyVendorInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordCreateManyVendorInputEnvelope>;
export const MaintenanceRecordCreateManyVendorInputEnvelopeObjectZodSchema = makeSchema();
