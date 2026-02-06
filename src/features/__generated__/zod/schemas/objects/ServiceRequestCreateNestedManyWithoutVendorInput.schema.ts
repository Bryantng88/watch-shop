import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestCreateWithoutVendorInputObjectSchema as ServiceRequestCreateWithoutVendorInputObjectSchema } from './ServiceRequestCreateWithoutVendorInput.schema';
import { ServiceRequestUncheckedCreateWithoutVendorInputObjectSchema as ServiceRequestUncheckedCreateWithoutVendorInputObjectSchema } from './ServiceRequestUncheckedCreateWithoutVendorInput.schema';
import { ServiceRequestCreateOrConnectWithoutVendorInputObjectSchema as ServiceRequestCreateOrConnectWithoutVendorInputObjectSchema } from './ServiceRequestCreateOrConnectWithoutVendorInput.schema';
import { ServiceRequestCreateManyVendorInputEnvelopeObjectSchema as ServiceRequestCreateManyVendorInputEnvelopeObjectSchema } from './ServiceRequestCreateManyVendorInputEnvelope.schema';
import { ServiceRequestWhereUniqueInputObjectSchema as ServiceRequestWhereUniqueInputObjectSchema } from './ServiceRequestWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ServiceRequestCreateWithoutVendorInputObjectSchema), z.lazy(() => ServiceRequestCreateWithoutVendorInputObjectSchema).array(), z.lazy(() => ServiceRequestUncheckedCreateWithoutVendorInputObjectSchema), z.lazy(() => ServiceRequestUncheckedCreateWithoutVendorInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => ServiceRequestCreateOrConnectWithoutVendorInputObjectSchema), z.lazy(() => ServiceRequestCreateOrConnectWithoutVendorInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => ServiceRequestCreateManyVendorInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema), z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const ServiceRequestCreateNestedManyWithoutVendorInputObjectSchema: z.ZodType<Prisma.ServiceRequestCreateNestedManyWithoutVendorInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestCreateNestedManyWithoutVendorInput>;
export const ServiceRequestCreateNestedManyWithoutVendorInputObjectZodSchema = makeSchema();
