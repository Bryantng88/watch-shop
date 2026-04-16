import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestScalarWhereInputObjectSchema as ServiceRequestScalarWhereInputObjectSchema } from './ServiceRequestScalarWhereInput.schema';
import { ServiceRequestUpdateManyMutationInputObjectSchema as ServiceRequestUpdateManyMutationInputObjectSchema } from './ServiceRequestUpdateManyMutationInput.schema';
import { ServiceRequestUncheckedUpdateManyWithoutServiceCatalogInputObjectSchema as ServiceRequestUncheckedUpdateManyWithoutServiceCatalogInputObjectSchema } from './ServiceRequestUncheckedUpdateManyWithoutServiceCatalogInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ServiceRequestScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => ServiceRequestUpdateManyMutationInputObjectSchema), z.lazy(() => ServiceRequestUncheckedUpdateManyWithoutServiceCatalogInputObjectSchema)])
}).strict();
export const ServiceRequestUpdateManyWithWhereWithoutServiceCatalogInputObjectSchema: z.ZodType<Prisma.ServiceRequestUpdateManyWithWhereWithoutServiceCatalogInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestUpdateManyWithWhereWithoutServiceCatalogInput>;
export const ServiceRequestUpdateManyWithWhereWithoutServiceCatalogInputObjectZodSchema = makeSchema();
