import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceCatalogUpdateWithoutOrderItemInputObjectSchema as ServiceCatalogUpdateWithoutOrderItemInputObjectSchema } from './ServiceCatalogUpdateWithoutOrderItemInput.schema';
import { ServiceCatalogUncheckedUpdateWithoutOrderItemInputObjectSchema as ServiceCatalogUncheckedUpdateWithoutOrderItemInputObjectSchema } from './ServiceCatalogUncheckedUpdateWithoutOrderItemInput.schema';
import { ServiceCatalogCreateWithoutOrderItemInputObjectSchema as ServiceCatalogCreateWithoutOrderItemInputObjectSchema } from './ServiceCatalogCreateWithoutOrderItemInput.schema';
import { ServiceCatalogUncheckedCreateWithoutOrderItemInputObjectSchema as ServiceCatalogUncheckedCreateWithoutOrderItemInputObjectSchema } from './ServiceCatalogUncheckedCreateWithoutOrderItemInput.schema';
import { ServiceCatalogWhereInputObjectSchema as ServiceCatalogWhereInputObjectSchema } from './ServiceCatalogWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => ServiceCatalogUpdateWithoutOrderItemInputObjectSchema), z.lazy(() => ServiceCatalogUncheckedUpdateWithoutOrderItemInputObjectSchema)]),
  create: z.union([z.lazy(() => ServiceCatalogCreateWithoutOrderItemInputObjectSchema), z.lazy(() => ServiceCatalogUncheckedCreateWithoutOrderItemInputObjectSchema)]),
  where: z.lazy(() => ServiceCatalogWhereInputObjectSchema).optional()
}).strict();
export const ServiceCatalogUpsertWithoutOrderItemInputObjectSchema: z.ZodType<Prisma.ServiceCatalogUpsertWithoutOrderItemInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceCatalogUpsertWithoutOrderItemInput>;
export const ServiceCatalogUpsertWithoutOrderItemInputObjectZodSchema = makeSchema();
