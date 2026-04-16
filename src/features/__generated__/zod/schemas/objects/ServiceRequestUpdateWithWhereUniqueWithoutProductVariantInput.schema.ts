import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestWhereUniqueInputObjectSchema as ServiceRequestWhereUniqueInputObjectSchema } from './ServiceRequestWhereUniqueInput.schema';
import { ServiceRequestUpdateWithoutProductVariantInputObjectSchema as ServiceRequestUpdateWithoutProductVariantInputObjectSchema } from './ServiceRequestUpdateWithoutProductVariantInput.schema';
import { ServiceRequestUncheckedUpdateWithoutProductVariantInputObjectSchema as ServiceRequestUncheckedUpdateWithoutProductVariantInputObjectSchema } from './ServiceRequestUncheckedUpdateWithoutProductVariantInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => ServiceRequestUpdateWithoutProductVariantInputObjectSchema), z.lazy(() => ServiceRequestUncheckedUpdateWithoutProductVariantInputObjectSchema)])
}).strict();
export const ServiceRequestUpdateWithWhereUniqueWithoutProductVariantInputObjectSchema: z.ZodType<Prisma.ServiceRequestUpdateWithWhereUniqueWithoutProductVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestUpdateWithWhereUniqueWithoutProductVariantInput>;
export const ServiceRequestUpdateWithWhereUniqueWithoutProductVariantInputObjectZodSchema = makeSchema();
