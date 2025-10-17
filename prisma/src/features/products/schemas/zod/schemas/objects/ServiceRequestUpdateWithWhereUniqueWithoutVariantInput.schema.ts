import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestWhereUniqueInputObjectSchema as ServiceRequestWhereUniqueInputObjectSchema } from './ServiceRequestWhereUniqueInput.schema';
import { ServiceRequestUpdateWithoutVariantInputObjectSchema as ServiceRequestUpdateWithoutVariantInputObjectSchema } from './ServiceRequestUpdateWithoutVariantInput.schema';
import { ServiceRequestUncheckedUpdateWithoutVariantInputObjectSchema as ServiceRequestUncheckedUpdateWithoutVariantInputObjectSchema } from './ServiceRequestUncheckedUpdateWithoutVariantInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => ServiceRequestUpdateWithoutVariantInputObjectSchema), z.lazy(() => ServiceRequestUncheckedUpdateWithoutVariantInputObjectSchema)])
}).strict();
export const ServiceRequestUpdateWithWhereUniqueWithoutVariantInputObjectSchema: z.ZodType<Prisma.ServiceRequestUpdateWithWhereUniqueWithoutVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestUpdateWithWhereUniqueWithoutVariantInput>;
export const ServiceRequestUpdateWithWhereUniqueWithoutVariantInputObjectZodSchema = makeSchema();
