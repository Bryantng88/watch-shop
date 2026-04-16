import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestCreateManyServiceCatalogInputObjectSchema as ServiceRequestCreateManyServiceCatalogInputObjectSchema } from './ServiceRequestCreateManyServiceCatalogInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => ServiceRequestCreateManyServiceCatalogInputObjectSchema), z.lazy(() => ServiceRequestCreateManyServiceCatalogInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const ServiceRequestCreateManyServiceCatalogInputEnvelopeObjectSchema: z.ZodType<Prisma.ServiceRequestCreateManyServiceCatalogInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestCreateManyServiceCatalogInputEnvelope>;
export const ServiceRequestCreateManyServiceCatalogInputEnvelopeObjectZodSchema = makeSchema();
