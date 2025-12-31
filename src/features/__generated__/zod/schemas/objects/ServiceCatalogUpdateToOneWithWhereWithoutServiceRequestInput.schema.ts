import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceCatalogWhereInputObjectSchema as ServiceCatalogWhereInputObjectSchema } from './ServiceCatalogWhereInput.schema';
import { ServiceCatalogUpdateWithoutServiceRequestInputObjectSchema as ServiceCatalogUpdateWithoutServiceRequestInputObjectSchema } from './ServiceCatalogUpdateWithoutServiceRequestInput.schema';
import { ServiceCatalogUncheckedUpdateWithoutServiceRequestInputObjectSchema as ServiceCatalogUncheckedUpdateWithoutServiceRequestInputObjectSchema } from './ServiceCatalogUncheckedUpdateWithoutServiceRequestInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ServiceCatalogWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => ServiceCatalogUpdateWithoutServiceRequestInputObjectSchema), z.lazy(() => ServiceCatalogUncheckedUpdateWithoutServiceRequestInputObjectSchema)])
}).strict();
export const ServiceCatalogUpdateToOneWithWhereWithoutServiceRequestInputObjectSchema: z.ZodType<Prisma.ServiceCatalogUpdateToOneWithWhereWithoutServiceRequestInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceCatalogUpdateToOneWithWhereWithoutServiceRequestInput>;
export const ServiceCatalogUpdateToOneWithWhereWithoutServiceRequestInputObjectZodSchema = makeSchema();
