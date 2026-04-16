import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestWhereUniqueInputObjectSchema as ServiceRequestWhereUniqueInputObjectSchema } from './ServiceRequestWhereUniqueInput.schema';
import { ServiceRequestCreateWithoutProductVariantInputObjectSchema as ServiceRequestCreateWithoutProductVariantInputObjectSchema } from './ServiceRequestCreateWithoutProductVariantInput.schema';
import { ServiceRequestUncheckedCreateWithoutProductVariantInputObjectSchema as ServiceRequestUncheckedCreateWithoutProductVariantInputObjectSchema } from './ServiceRequestUncheckedCreateWithoutProductVariantInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ServiceRequestCreateWithoutProductVariantInputObjectSchema), z.lazy(() => ServiceRequestUncheckedCreateWithoutProductVariantInputObjectSchema)])
}).strict();
export const ServiceRequestCreateOrConnectWithoutProductVariantInputObjectSchema: z.ZodType<Prisma.ServiceRequestCreateOrConnectWithoutProductVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestCreateOrConnectWithoutProductVariantInput>;
export const ServiceRequestCreateOrConnectWithoutProductVariantInputObjectZodSchema = makeSchema();
