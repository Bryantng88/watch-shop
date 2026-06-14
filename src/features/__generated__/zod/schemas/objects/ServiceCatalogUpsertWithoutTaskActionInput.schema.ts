import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceCatalogUpdateWithoutTaskActionInputObjectSchema as ServiceCatalogUpdateWithoutTaskActionInputObjectSchema } from './ServiceCatalogUpdateWithoutTaskActionInput.schema';
import { ServiceCatalogUncheckedUpdateWithoutTaskActionInputObjectSchema as ServiceCatalogUncheckedUpdateWithoutTaskActionInputObjectSchema } from './ServiceCatalogUncheckedUpdateWithoutTaskActionInput.schema';
import { ServiceCatalogCreateWithoutTaskActionInputObjectSchema as ServiceCatalogCreateWithoutTaskActionInputObjectSchema } from './ServiceCatalogCreateWithoutTaskActionInput.schema';
import { ServiceCatalogUncheckedCreateWithoutTaskActionInputObjectSchema as ServiceCatalogUncheckedCreateWithoutTaskActionInputObjectSchema } from './ServiceCatalogUncheckedCreateWithoutTaskActionInput.schema';
import { ServiceCatalogWhereInputObjectSchema as ServiceCatalogWhereInputObjectSchema } from './ServiceCatalogWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => ServiceCatalogUpdateWithoutTaskActionInputObjectSchema), z.lazy(() => ServiceCatalogUncheckedUpdateWithoutTaskActionInputObjectSchema)]),
  create: z.union([z.lazy(() => ServiceCatalogCreateWithoutTaskActionInputObjectSchema), z.lazy(() => ServiceCatalogUncheckedCreateWithoutTaskActionInputObjectSchema)]),
  where: z.lazy(() => ServiceCatalogWhereInputObjectSchema).optional()
}).strict();
export const ServiceCatalogUpsertWithoutTaskActionInputObjectSchema: z.ZodType<Prisma.ServiceCatalogUpsertWithoutTaskActionInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceCatalogUpsertWithoutTaskActionInput>;
export const ServiceCatalogUpsertWithoutTaskActionInputObjectZodSchema = makeSchema();
