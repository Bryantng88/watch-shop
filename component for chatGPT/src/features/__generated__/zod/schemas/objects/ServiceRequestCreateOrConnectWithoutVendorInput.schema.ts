import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestWhereUniqueInputObjectSchema as ServiceRequestWhereUniqueInputObjectSchema } from './ServiceRequestWhereUniqueInput.schema';
import { ServiceRequestCreateWithoutVendorInputObjectSchema as ServiceRequestCreateWithoutVendorInputObjectSchema } from './ServiceRequestCreateWithoutVendorInput.schema';
import { ServiceRequestUncheckedCreateWithoutVendorInputObjectSchema as ServiceRequestUncheckedCreateWithoutVendorInputObjectSchema } from './ServiceRequestUncheckedCreateWithoutVendorInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ServiceRequestCreateWithoutVendorInputObjectSchema), z.lazy(() => ServiceRequestUncheckedCreateWithoutVendorInputObjectSchema)])
}).strict();
export const ServiceRequestCreateOrConnectWithoutVendorInputObjectSchema: z.ZodType<Prisma.ServiceRequestCreateOrConnectWithoutVendorInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestCreateOrConnectWithoutVendorInput>;
export const ServiceRequestCreateOrConnectWithoutVendorInputObjectZodSchema = makeSchema();
