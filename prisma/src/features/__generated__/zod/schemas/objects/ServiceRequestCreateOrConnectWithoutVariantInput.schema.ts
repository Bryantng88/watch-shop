import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestWhereUniqueInputObjectSchema as ServiceRequestWhereUniqueInputObjectSchema } from './ServiceRequestWhereUniqueInput.schema';
import { ServiceRequestCreateWithoutVariantInputObjectSchema as ServiceRequestCreateWithoutVariantInputObjectSchema } from './ServiceRequestCreateWithoutVariantInput.schema';
import { ServiceRequestUncheckedCreateWithoutVariantInputObjectSchema as ServiceRequestUncheckedCreateWithoutVariantInputObjectSchema } from './ServiceRequestUncheckedCreateWithoutVariantInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ServiceRequestCreateWithoutVariantInputObjectSchema), z.lazy(() => ServiceRequestUncheckedCreateWithoutVariantInputObjectSchema)])
}).strict();
export const ServiceRequestCreateOrConnectWithoutVariantInputObjectSchema: z.ZodType<Prisma.ServiceRequestCreateOrConnectWithoutVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestCreateOrConnectWithoutVariantInput>;
export const ServiceRequestCreateOrConnectWithoutVariantInputObjectZodSchema = makeSchema();
