import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestWhereUniqueInputObjectSchema as ServiceRequestWhereUniqueInputObjectSchema } from './ServiceRequestWhereUniqueInput.schema';
import { ServiceRequestCreateWithoutServiceCatalogInputObjectSchema as ServiceRequestCreateWithoutServiceCatalogInputObjectSchema } from './ServiceRequestCreateWithoutServiceCatalogInput.schema';
import { ServiceRequestUncheckedCreateWithoutServiceCatalogInputObjectSchema as ServiceRequestUncheckedCreateWithoutServiceCatalogInputObjectSchema } from './ServiceRequestUncheckedCreateWithoutServiceCatalogInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ServiceRequestCreateWithoutServiceCatalogInputObjectSchema), z.lazy(() => ServiceRequestUncheckedCreateWithoutServiceCatalogInputObjectSchema)])
}).strict();
export const ServiceRequestCreateOrConnectWithoutServiceCatalogInputObjectSchema: z.ZodType<Prisma.ServiceRequestCreateOrConnectWithoutServiceCatalogInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestCreateOrConnectWithoutServiceCatalogInput>;
export const ServiceRequestCreateOrConnectWithoutServiceCatalogInputObjectZodSchema = makeSchema();
