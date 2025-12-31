import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestCreateWithoutServiceCatalogInputObjectSchema as ServiceRequestCreateWithoutServiceCatalogInputObjectSchema } from './ServiceRequestCreateWithoutServiceCatalogInput.schema';
import { ServiceRequestUncheckedCreateWithoutServiceCatalogInputObjectSchema as ServiceRequestUncheckedCreateWithoutServiceCatalogInputObjectSchema } from './ServiceRequestUncheckedCreateWithoutServiceCatalogInput.schema';
import { ServiceRequestCreateOrConnectWithoutServiceCatalogInputObjectSchema as ServiceRequestCreateOrConnectWithoutServiceCatalogInputObjectSchema } from './ServiceRequestCreateOrConnectWithoutServiceCatalogInput.schema';
import { ServiceRequestCreateManyServiceCatalogInputEnvelopeObjectSchema as ServiceRequestCreateManyServiceCatalogInputEnvelopeObjectSchema } from './ServiceRequestCreateManyServiceCatalogInputEnvelope.schema';
import { ServiceRequestWhereUniqueInputObjectSchema as ServiceRequestWhereUniqueInputObjectSchema } from './ServiceRequestWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ServiceRequestCreateWithoutServiceCatalogInputObjectSchema), z.lazy(() => ServiceRequestCreateWithoutServiceCatalogInputObjectSchema).array(), z.lazy(() => ServiceRequestUncheckedCreateWithoutServiceCatalogInputObjectSchema), z.lazy(() => ServiceRequestUncheckedCreateWithoutServiceCatalogInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => ServiceRequestCreateOrConnectWithoutServiceCatalogInputObjectSchema), z.lazy(() => ServiceRequestCreateOrConnectWithoutServiceCatalogInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => ServiceRequestCreateManyServiceCatalogInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema), z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const ServiceRequestCreateNestedManyWithoutServiceCatalogInputObjectSchema: z.ZodType<Prisma.ServiceRequestCreateNestedManyWithoutServiceCatalogInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestCreateNestedManyWithoutServiceCatalogInput>;
export const ServiceRequestCreateNestedManyWithoutServiceCatalogInputObjectZodSchema = makeSchema();
