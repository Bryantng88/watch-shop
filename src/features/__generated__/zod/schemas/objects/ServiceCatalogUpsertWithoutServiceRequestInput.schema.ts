import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceCatalogUpdateWithoutServiceRequestInputObjectSchema as ServiceCatalogUpdateWithoutServiceRequestInputObjectSchema } from './ServiceCatalogUpdateWithoutServiceRequestInput.schema';
import { ServiceCatalogUncheckedUpdateWithoutServiceRequestInputObjectSchema as ServiceCatalogUncheckedUpdateWithoutServiceRequestInputObjectSchema } from './ServiceCatalogUncheckedUpdateWithoutServiceRequestInput.schema';
import { ServiceCatalogCreateWithoutServiceRequestInputObjectSchema as ServiceCatalogCreateWithoutServiceRequestInputObjectSchema } from './ServiceCatalogCreateWithoutServiceRequestInput.schema';
import { ServiceCatalogUncheckedCreateWithoutServiceRequestInputObjectSchema as ServiceCatalogUncheckedCreateWithoutServiceRequestInputObjectSchema } from './ServiceCatalogUncheckedCreateWithoutServiceRequestInput.schema';
import { ServiceCatalogWhereInputObjectSchema as ServiceCatalogWhereInputObjectSchema } from './ServiceCatalogWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => ServiceCatalogUpdateWithoutServiceRequestInputObjectSchema), z.lazy(() => ServiceCatalogUncheckedUpdateWithoutServiceRequestInputObjectSchema)]),
  create: z.union([z.lazy(() => ServiceCatalogCreateWithoutServiceRequestInputObjectSchema), z.lazy(() => ServiceCatalogUncheckedCreateWithoutServiceRequestInputObjectSchema)]),
  where: z.lazy(() => ServiceCatalogWhereInputObjectSchema).optional()
}).strict();
export const ServiceCatalogUpsertWithoutServiceRequestInputObjectSchema: z.ZodType<Prisma.ServiceCatalogUpsertWithoutServiceRequestInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceCatalogUpsertWithoutServiceRequestInput>;
export const ServiceCatalogUpsertWithoutServiceRequestInputObjectZodSchema = makeSchema();
