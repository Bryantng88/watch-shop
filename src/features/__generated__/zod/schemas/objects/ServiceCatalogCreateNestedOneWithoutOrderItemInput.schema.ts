import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceCatalogCreateWithoutOrderItemInputObjectSchema as ServiceCatalogCreateWithoutOrderItemInputObjectSchema } from './ServiceCatalogCreateWithoutOrderItemInput.schema';
import { ServiceCatalogUncheckedCreateWithoutOrderItemInputObjectSchema as ServiceCatalogUncheckedCreateWithoutOrderItemInputObjectSchema } from './ServiceCatalogUncheckedCreateWithoutOrderItemInput.schema';
import { ServiceCatalogCreateOrConnectWithoutOrderItemInputObjectSchema as ServiceCatalogCreateOrConnectWithoutOrderItemInputObjectSchema } from './ServiceCatalogCreateOrConnectWithoutOrderItemInput.schema';
import { ServiceCatalogWhereUniqueInputObjectSchema as ServiceCatalogWhereUniqueInputObjectSchema } from './ServiceCatalogWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ServiceCatalogCreateWithoutOrderItemInputObjectSchema), z.lazy(() => ServiceCatalogUncheckedCreateWithoutOrderItemInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ServiceCatalogCreateOrConnectWithoutOrderItemInputObjectSchema).optional(),
  connect: z.lazy(() => ServiceCatalogWhereUniqueInputObjectSchema).optional()
}).strict();
export const ServiceCatalogCreateNestedOneWithoutOrderItemInputObjectSchema: z.ZodType<Prisma.ServiceCatalogCreateNestedOneWithoutOrderItemInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceCatalogCreateNestedOneWithoutOrderItemInput>;
export const ServiceCatalogCreateNestedOneWithoutOrderItemInputObjectZodSchema = makeSchema();
