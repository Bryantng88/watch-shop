import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestScalarWhereInputObjectSchema as ServiceRequestScalarWhereInputObjectSchema } from './ServiceRequestScalarWhereInput.schema';
import { ServiceRequestUpdateManyMutationInputObjectSchema as ServiceRequestUpdateManyMutationInputObjectSchema } from './ServiceRequestUpdateManyMutationInput.schema';
import { ServiceRequestUncheckedUpdateManyWithoutProductVariantInputObjectSchema as ServiceRequestUncheckedUpdateManyWithoutProductVariantInputObjectSchema } from './ServiceRequestUncheckedUpdateManyWithoutProductVariantInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ServiceRequestScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => ServiceRequestUpdateManyMutationInputObjectSchema), z.lazy(() => ServiceRequestUncheckedUpdateManyWithoutProductVariantInputObjectSchema)])
}).strict();
export const ServiceRequestUpdateManyWithWhereWithoutProductVariantInputObjectSchema: z.ZodType<Prisma.ServiceRequestUpdateManyWithWhereWithoutProductVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestUpdateManyWithWhereWithoutProductVariantInput>;
export const ServiceRequestUpdateManyWithWhereWithoutProductVariantInputObjectZodSchema = makeSchema();
