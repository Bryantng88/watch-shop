import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceRecordCreateManyServiceRequestInputObjectSchema as MaintenanceRecordCreateManyServiceRequestInputObjectSchema } from './MaintenanceRecordCreateManyServiceRequestInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => MaintenanceRecordCreateManyServiceRequestInputObjectSchema), z.lazy(() => MaintenanceRecordCreateManyServiceRequestInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const MaintenanceRecordCreateManyServiceRequestInputEnvelopeObjectSchema: z.ZodType<Prisma.MaintenanceRecordCreateManyServiceRequestInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordCreateManyServiceRequestInputEnvelope>;
export const MaintenanceRecordCreateManyServiceRequestInputEnvelopeObjectZodSchema = makeSchema();
