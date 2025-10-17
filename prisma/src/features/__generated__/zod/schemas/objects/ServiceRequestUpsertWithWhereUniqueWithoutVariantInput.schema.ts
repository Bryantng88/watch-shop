import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestWhereUniqueInputObjectSchema as ServiceRequestWhereUniqueInputObjectSchema } from './ServiceRequestWhereUniqueInput.schema';
import { ServiceRequestUpdateWithoutVariantInputObjectSchema as ServiceRequestUpdateWithoutVariantInputObjectSchema } from './ServiceRequestUpdateWithoutVariantInput.schema';
import { ServiceRequestUncheckedUpdateWithoutVariantInputObjectSchema as ServiceRequestUncheckedUpdateWithoutVariantInputObjectSchema } from './ServiceRequestUncheckedUpdateWithoutVariantInput.schema';
import { ServiceRequestCreateWithoutVariantInputObjectSchema as ServiceRequestCreateWithoutVariantInputObjectSchema } from './ServiceRequestCreateWithoutVariantInput.schema';
import { ServiceRequestUncheckedCreateWithoutVariantInputObjectSchema as ServiceRequestUncheckedCreateWithoutVariantInputObjectSchema } from './ServiceRequestUncheckedCreateWithoutVariantInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => ServiceRequestUpdateWithoutVariantInputObjectSchema), z.lazy(() => ServiceRequestUncheckedUpdateWithoutVariantInputObjectSchema)]),
  create: z.union([z.lazy(() => ServiceRequestCreateWithoutVariantInputObjectSchema), z.lazy(() => ServiceRequestUncheckedCreateWithoutVariantInputObjectSchema)])
}).strict();
export const ServiceRequestUpsertWithWhereUniqueWithoutVariantInputObjectSchema: z.ZodType<Prisma.ServiceRequestUpsertWithWhereUniqueWithoutVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestUpsertWithWhereUniqueWithoutVariantInput>;
export const ServiceRequestUpsertWithWhereUniqueWithoutVariantInputObjectZodSchema = makeSchema();
