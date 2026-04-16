import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestWhereUniqueInputObjectSchema as ServiceRequestWhereUniqueInputObjectSchema } from './ServiceRequestWhereUniqueInput.schema';
import { ServiceRequestUpdateWithoutProductVariantInputObjectSchema as ServiceRequestUpdateWithoutProductVariantInputObjectSchema } from './ServiceRequestUpdateWithoutProductVariantInput.schema';
import { ServiceRequestUncheckedUpdateWithoutProductVariantInputObjectSchema as ServiceRequestUncheckedUpdateWithoutProductVariantInputObjectSchema } from './ServiceRequestUncheckedUpdateWithoutProductVariantInput.schema';
import { ServiceRequestCreateWithoutProductVariantInputObjectSchema as ServiceRequestCreateWithoutProductVariantInputObjectSchema } from './ServiceRequestCreateWithoutProductVariantInput.schema';
import { ServiceRequestUncheckedCreateWithoutProductVariantInputObjectSchema as ServiceRequestUncheckedCreateWithoutProductVariantInputObjectSchema } from './ServiceRequestUncheckedCreateWithoutProductVariantInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => ServiceRequestUpdateWithoutProductVariantInputObjectSchema), z.lazy(() => ServiceRequestUncheckedUpdateWithoutProductVariantInputObjectSchema)]),
  create: z.union([z.lazy(() => ServiceRequestCreateWithoutProductVariantInputObjectSchema), z.lazy(() => ServiceRequestUncheckedCreateWithoutProductVariantInputObjectSchema)])
}).strict();
export const ServiceRequestUpsertWithWhereUniqueWithoutProductVariantInputObjectSchema: z.ZodType<Prisma.ServiceRequestUpsertWithWhereUniqueWithoutProductVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestUpsertWithWhereUniqueWithoutProductVariantInput>;
export const ServiceRequestUpsertWithWhereUniqueWithoutProductVariantInputObjectZodSchema = makeSchema();
