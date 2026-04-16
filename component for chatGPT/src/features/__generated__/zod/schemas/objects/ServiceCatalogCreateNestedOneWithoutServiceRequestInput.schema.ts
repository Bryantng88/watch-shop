import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceCatalogCreateWithoutServiceRequestInputObjectSchema as ServiceCatalogCreateWithoutServiceRequestInputObjectSchema } from './ServiceCatalogCreateWithoutServiceRequestInput.schema';
import { ServiceCatalogUncheckedCreateWithoutServiceRequestInputObjectSchema as ServiceCatalogUncheckedCreateWithoutServiceRequestInputObjectSchema } from './ServiceCatalogUncheckedCreateWithoutServiceRequestInput.schema';
import { ServiceCatalogCreateOrConnectWithoutServiceRequestInputObjectSchema as ServiceCatalogCreateOrConnectWithoutServiceRequestInputObjectSchema } from './ServiceCatalogCreateOrConnectWithoutServiceRequestInput.schema';
import { ServiceCatalogWhereUniqueInputObjectSchema as ServiceCatalogWhereUniqueInputObjectSchema } from './ServiceCatalogWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ServiceCatalogCreateWithoutServiceRequestInputObjectSchema), z.lazy(() => ServiceCatalogUncheckedCreateWithoutServiceRequestInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ServiceCatalogCreateOrConnectWithoutServiceRequestInputObjectSchema).optional(),
  connect: z.lazy(() => ServiceCatalogWhereUniqueInputObjectSchema).optional()
}).strict();
export const ServiceCatalogCreateNestedOneWithoutServiceRequestInputObjectSchema: z.ZodType<Prisma.ServiceCatalogCreateNestedOneWithoutServiceRequestInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceCatalogCreateNestedOneWithoutServiceRequestInput>;
export const ServiceCatalogCreateNestedOneWithoutServiceRequestInputObjectZodSchema = makeSchema();
