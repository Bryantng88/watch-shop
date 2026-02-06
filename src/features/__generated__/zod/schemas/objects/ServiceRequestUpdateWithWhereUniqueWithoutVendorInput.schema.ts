import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestWhereUniqueInputObjectSchema as ServiceRequestWhereUniqueInputObjectSchema } from './ServiceRequestWhereUniqueInput.schema';
import { ServiceRequestUpdateWithoutVendorInputObjectSchema as ServiceRequestUpdateWithoutVendorInputObjectSchema } from './ServiceRequestUpdateWithoutVendorInput.schema';
import { ServiceRequestUncheckedUpdateWithoutVendorInputObjectSchema as ServiceRequestUncheckedUpdateWithoutVendorInputObjectSchema } from './ServiceRequestUncheckedUpdateWithoutVendorInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => ServiceRequestUpdateWithoutVendorInputObjectSchema), z.lazy(() => ServiceRequestUncheckedUpdateWithoutVendorInputObjectSchema)])
}).strict();
export const ServiceRequestUpdateWithWhereUniqueWithoutVendorInputObjectSchema: z.ZodType<Prisma.ServiceRequestUpdateWithWhereUniqueWithoutVendorInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestUpdateWithWhereUniqueWithoutVendorInput>;
export const ServiceRequestUpdateWithWhereUniqueWithoutVendorInputObjectZodSchema = makeSchema();
