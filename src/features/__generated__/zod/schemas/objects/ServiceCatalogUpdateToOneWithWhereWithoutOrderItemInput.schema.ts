import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceCatalogWhereInputObjectSchema as ServiceCatalogWhereInputObjectSchema } from './ServiceCatalogWhereInput.schema';
import { ServiceCatalogUpdateWithoutOrderItemInputObjectSchema as ServiceCatalogUpdateWithoutOrderItemInputObjectSchema } from './ServiceCatalogUpdateWithoutOrderItemInput.schema';
import { ServiceCatalogUncheckedUpdateWithoutOrderItemInputObjectSchema as ServiceCatalogUncheckedUpdateWithoutOrderItemInputObjectSchema } from './ServiceCatalogUncheckedUpdateWithoutOrderItemInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ServiceCatalogWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => ServiceCatalogUpdateWithoutOrderItemInputObjectSchema), z.lazy(() => ServiceCatalogUncheckedUpdateWithoutOrderItemInputObjectSchema)])
}).strict();
export const ServiceCatalogUpdateToOneWithWhereWithoutOrderItemInputObjectSchema: z.ZodType<Prisma.ServiceCatalogUpdateToOneWithWhereWithoutOrderItemInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceCatalogUpdateToOneWithWhereWithoutOrderItemInput>;
export const ServiceCatalogUpdateToOneWithWhereWithoutOrderItemInputObjectZodSchema = makeSchema();
