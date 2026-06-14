import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceCatalogWhereInputObjectSchema as ServiceCatalogWhereInputObjectSchema } from './ServiceCatalogWhereInput.schema';
import { ServiceCatalogUpdateWithoutTaskActionInputObjectSchema as ServiceCatalogUpdateWithoutTaskActionInputObjectSchema } from './ServiceCatalogUpdateWithoutTaskActionInput.schema';
import { ServiceCatalogUncheckedUpdateWithoutTaskActionInputObjectSchema as ServiceCatalogUncheckedUpdateWithoutTaskActionInputObjectSchema } from './ServiceCatalogUncheckedUpdateWithoutTaskActionInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ServiceCatalogWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => ServiceCatalogUpdateWithoutTaskActionInputObjectSchema), z.lazy(() => ServiceCatalogUncheckedUpdateWithoutTaskActionInputObjectSchema)])
}).strict();
export const ServiceCatalogUpdateToOneWithWhereWithoutTaskActionInputObjectSchema: z.ZodType<Prisma.ServiceCatalogUpdateToOneWithWhereWithoutTaskActionInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceCatalogUpdateToOneWithWhereWithoutTaskActionInput>;
export const ServiceCatalogUpdateToOneWithWhereWithoutTaskActionInputObjectZodSchema = makeSchema();
