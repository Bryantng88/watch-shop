import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceCatalogWhereUniqueInputObjectSchema as ServiceCatalogWhereUniqueInputObjectSchema } from './ServiceCatalogWhereUniqueInput.schema';
import { ServiceCatalogCreateWithoutOrderItemInputObjectSchema as ServiceCatalogCreateWithoutOrderItemInputObjectSchema } from './ServiceCatalogCreateWithoutOrderItemInput.schema';
import { ServiceCatalogUncheckedCreateWithoutOrderItemInputObjectSchema as ServiceCatalogUncheckedCreateWithoutOrderItemInputObjectSchema } from './ServiceCatalogUncheckedCreateWithoutOrderItemInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ServiceCatalogWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ServiceCatalogCreateWithoutOrderItemInputObjectSchema), z.lazy(() => ServiceCatalogUncheckedCreateWithoutOrderItemInputObjectSchema)])
}).strict();
export const ServiceCatalogCreateOrConnectWithoutOrderItemInputObjectSchema: z.ZodType<Prisma.ServiceCatalogCreateOrConnectWithoutOrderItemInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceCatalogCreateOrConnectWithoutOrderItemInput>;
export const ServiceCatalogCreateOrConnectWithoutOrderItemInputObjectZodSchema = makeSchema();
