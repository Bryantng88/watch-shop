import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestWhereUniqueInputObjectSchema as ServiceRequestWhereUniqueInputObjectSchema } from './ServiceRequestWhereUniqueInput.schema';
import { ServiceRequestUpdateWithoutServiceCatalogInputObjectSchema as ServiceRequestUpdateWithoutServiceCatalogInputObjectSchema } from './ServiceRequestUpdateWithoutServiceCatalogInput.schema';
import { ServiceRequestUncheckedUpdateWithoutServiceCatalogInputObjectSchema as ServiceRequestUncheckedUpdateWithoutServiceCatalogInputObjectSchema } from './ServiceRequestUncheckedUpdateWithoutServiceCatalogInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => ServiceRequestUpdateWithoutServiceCatalogInputObjectSchema), z.lazy(() => ServiceRequestUncheckedUpdateWithoutServiceCatalogInputObjectSchema)])
}).strict();
export const ServiceRequestUpdateWithWhereUniqueWithoutServiceCatalogInputObjectSchema: z.ZodType<Prisma.ServiceRequestUpdateWithWhereUniqueWithoutServiceCatalogInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestUpdateWithWhereUniqueWithoutServiceCatalogInput>;
export const ServiceRequestUpdateWithWhereUniqueWithoutServiceCatalogInputObjectZodSchema = makeSchema();
