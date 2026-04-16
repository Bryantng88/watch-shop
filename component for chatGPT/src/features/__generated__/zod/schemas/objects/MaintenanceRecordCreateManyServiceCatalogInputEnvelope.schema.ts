import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceRecordCreateManyServiceCatalogInputObjectSchema as MaintenanceRecordCreateManyServiceCatalogInputObjectSchema } from './MaintenanceRecordCreateManyServiceCatalogInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => MaintenanceRecordCreateManyServiceCatalogInputObjectSchema), z.lazy(() => MaintenanceRecordCreateManyServiceCatalogInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const MaintenanceRecordCreateManyServiceCatalogInputEnvelopeObjectSchema: z.ZodType<Prisma.MaintenanceRecordCreateManyServiceCatalogInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordCreateManyServiceCatalogInputEnvelope>;
export const MaintenanceRecordCreateManyServiceCatalogInputEnvelopeObjectZodSchema = makeSchema();
