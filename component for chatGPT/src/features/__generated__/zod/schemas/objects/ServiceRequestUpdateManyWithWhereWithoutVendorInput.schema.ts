import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestScalarWhereInputObjectSchema as ServiceRequestScalarWhereInputObjectSchema } from './ServiceRequestScalarWhereInput.schema';
import { ServiceRequestUpdateManyMutationInputObjectSchema as ServiceRequestUpdateManyMutationInputObjectSchema } from './ServiceRequestUpdateManyMutationInput.schema';
import { ServiceRequestUncheckedUpdateManyWithoutVendorInputObjectSchema as ServiceRequestUncheckedUpdateManyWithoutVendorInputObjectSchema } from './ServiceRequestUncheckedUpdateManyWithoutVendorInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ServiceRequestScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => ServiceRequestUpdateManyMutationInputObjectSchema), z.lazy(() => ServiceRequestUncheckedUpdateManyWithoutVendorInputObjectSchema)])
}).strict();
export const ServiceRequestUpdateManyWithWhereWithoutVendorInputObjectSchema: z.ZodType<Prisma.ServiceRequestUpdateManyWithWhereWithoutVendorInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestUpdateManyWithWhereWithoutVendorInput>;
export const ServiceRequestUpdateManyWithWhereWithoutVendorInputObjectZodSchema = makeSchema();
