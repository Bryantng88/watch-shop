import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestWhereUniqueInputObjectSchema as ServiceRequestWhereUniqueInputObjectSchema } from './ServiceRequestWhereUniqueInput.schema';
import { ServiceRequestUpdateWithoutVendorInputObjectSchema as ServiceRequestUpdateWithoutVendorInputObjectSchema } from './ServiceRequestUpdateWithoutVendorInput.schema';
import { ServiceRequestUncheckedUpdateWithoutVendorInputObjectSchema as ServiceRequestUncheckedUpdateWithoutVendorInputObjectSchema } from './ServiceRequestUncheckedUpdateWithoutVendorInput.schema';
import { ServiceRequestCreateWithoutVendorInputObjectSchema as ServiceRequestCreateWithoutVendorInputObjectSchema } from './ServiceRequestCreateWithoutVendorInput.schema';
import { ServiceRequestUncheckedCreateWithoutVendorInputObjectSchema as ServiceRequestUncheckedCreateWithoutVendorInputObjectSchema } from './ServiceRequestUncheckedCreateWithoutVendorInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => ServiceRequestUpdateWithoutVendorInputObjectSchema), z.lazy(() => ServiceRequestUncheckedUpdateWithoutVendorInputObjectSchema)]),
  create: z.union([z.lazy(() => ServiceRequestCreateWithoutVendorInputObjectSchema), z.lazy(() => ServiceRequestUncheckedCreateWithoutVendorInputObjectSchema)])
}).strict();
export const ServiceRequestUpsertWithWhereUniqueWithoutVendorInputObjectSchema: z.ZodType<Prisma.ServiceRequestUpsertWithWhereUniqueWithoutVendorInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestUpsertWithWhereUniqueWithoutVendorInput>;
export const ServiceRequestUpsertWithWhereUniqueWithoutVendorInputObjectZodSchema = makeSchema();
