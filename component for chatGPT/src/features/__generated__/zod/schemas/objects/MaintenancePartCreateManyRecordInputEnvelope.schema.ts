import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenancePartCreateManyRecordInputObjectSchema as MaintenancePartCreateManyRecordInputObjectSchema } from './MaintenancePartCreateManyRecordInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => MaintenancePartCreateManyRecordInputObjectSchema), z.lazy(() => MaintenancePartCreateManyRecordInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const MaintenancePartCreateManyRecordInputEnvelopeObjectSchema: z.ZodType<Prisma.MaintenancePartCreateManyRecordInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.MaintenancePartCreateManyRecordInputEnvelope>;
export const MaintenancePartCreateManyRecordInputEnvelopeObjectZodSchema = makeSchema();
