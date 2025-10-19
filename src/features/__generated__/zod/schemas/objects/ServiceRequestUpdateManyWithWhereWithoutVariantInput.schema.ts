import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestScalarWhereInputObjectSchema as ServiceRequestScalarWhereInputObjectSchema } from './ServiceRequestScalarWhereInput.schema';
import { ServiceRequestUpdateManyMutationInputObjectSchema as ServiceRequestUpdateManyMutationInputObjectSchema } from './ServiceRequestUpdateManyMutationInput.schema';
import { ServiceRequestUncheckedUpdateManyWithoutVariantInputObjectSchema as ServiceRequestUncheckedUpdateManyWithoutVariantInputObjectSchema } from './ServiceRequestUncheckedUpdateManyWithoutVariantInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ServiceRequestScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => ServiceRequestUpdateManyMutationInputObjectSchema), z.lazy(() => ServiceRequestUncheckedUpdateManyWithoutVariantInputObjectSchema)])
}).strict();
export const ServiceRequestUpdateManyWithWhereWithoutVariantInputObjectSchema: z.ZodType<Prisma.ServiceRequestUpdateManyWithWhereWithoutVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestUpdateManyWithWhereWithoutVariantInput>;
export const ServiceRequestUpdateManyWithWhereWithoutVariantInputObjectZodSchema = makeSchema();
