import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceCatalogWhereUniqueInputObjectSchema as ServiceCatalogWhereUniqueInputObjectSchema } from './ServiceCatalogWhereUniqueInput.schema';
import { ServiceCatalogCreateWithoutServiceRequestInputObjectSchema as ServiceCatalogCreateWithoutServiceRequestInputObjectSchema } from './ServiceCatalogCreateWithoutServiceRequestInput.schema';
import { ServiceCatalogUncheckedCreateWithoutServiceRequestInputObjectSchema as ServiceCatalogUncheckedCreateWithoutServiceRequestInputObjectSchema } from './ServiceCatalogUncheckedCreateWithoutServiceRequestInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ServiceCatalogWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ServiceCatalogCreateWithoutServiceRequestInputObjectSchema), z.lazy(() => ServiceCatalogUncheckedCreateWithoutServiceRequestInputObjectSchema)])
}).strict();
export const ServiceCatalogCreateOrConnectWithoutServiceRequestInputObjectSchema: z.ZodType<Prisma.ServiceCatalogCreateOrConnectWithoutServiceRequestInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceCatalogCreateOrConnectWithoutServiceRequestInput>;
export const ServiceCatalogCreateOrConnectWithoutServiceRequestInputObjectZodSchema = makeSchema();
