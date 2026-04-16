import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestWhereUniqueInputObjectSchema as ServiceRequestWhereUniqueInputObjectSchema } from './ServiceRequestWhereUniqueInput.schema';
import { ServiceRequestUpdateWithoutServiceCatalogInputObjectSchema as ServiceRequestUpdateWithoutServiceCatalogInputObjectSchema } from './ServiceRequestUpdateWithoutServiceCatalogInput.schema';
import { ServiceRequestUncheckedUpdateWithoutServiceCatalogInputObjectSchema as ServiceRequestUncheckedUpdateWithoutServiceCatalogInputObjectSchema } from './ServiceRequestUncheckedUpdateWithoutServiceCatalogInput.schema';
import { ServiceRequestCreateWithoutServiceCatalogInputObjectSchema as ServiceRequestCreateWithoutServiceCatalogInputObjectSchema } from './ServiceRequestCreateWithoutServiceCatalogInput.schema';
import { ServiceRequestUncheckedCreateWithoutServiceCatalogInputObjectSchema as ServiceRequestUncheckedCreateWithoutServiceCatalogInputObjectSchema } from './ServiceRequestUncheckedCreateWithoutServiceCatalogInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => ServiceRequestUpdateWithoutServiceCatalogInputObjectSchema), z.lazy(() => ServiceRequestUncheckedUpdateWithoutServiceCatalogInputObjectSchema)]),
  create: z.union([z.lazy(() => ServiceRequestCreateWithoutServiceCatalogInputObjectSchema), z.lazy(() => ServiceRequestUncheckedCreateWithoutServiceCatalogInputObjectSchema)])
}).strict();
export const ServiceRequestUpsertWithWhereUniqueWithoutServiceCatalogInputObjectSchema: z.ZodType<Prisma.ServiceRequestUpsertWithWhereUniqueWithoutServiceCatalogInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestUpsertWithWhereUniqueWithoutServiceCatalogInput>;
export const ServiceRequestUpsertWithWhereUniqueWithoutServiceCatalogInputObjectZodSchema = makeSchema();
