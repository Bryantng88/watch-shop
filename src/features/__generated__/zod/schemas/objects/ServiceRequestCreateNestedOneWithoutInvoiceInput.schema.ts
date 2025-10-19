import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestCreateWithoutInvoiceInputObjectSchema as ServiceRequestCreateWithoutInvoiceInputObjectSchema } from './ServiceRequestCreateWithoutInvoiceInput.schema';
import { ServiceRequestUncheckedCreateWithoutInvoiceInputObjectSchema as ServiceRequestUncheckedCreateWithoutInvoiceInputObjectSchema } from './ServiceRequestUncheckedCreateWithoutInvoiceInput.schema';
import { ServiceRequestCreateOrConnectWithoutInvoiceInputObjectSchema as ServiceRequestCreateOrConnectWithoutInvoiceInputObjectSchema } from './ServiceRequestCreateOrConnectWithoutInvoiceInput.schema';
import { ServiceRequestWhereUniqueInputObjectSchema as ServiceRequestWhereUniqueInputObjectSchema } from './ServiceRequestWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ServiceRequestCreateWithoutInvoiceInputObjectSchema), z.lazy(() => ServiceRequestUncheckedCreateWithoutInvoiceInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ServiceRequestCreateOrConnectWithoutInvoiceInputObjectSchema).optional(),
  connect: z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema).optional()
}).strict();
export const ServiceRequestCreateNestedOneWithoutInvoiceInputObjectSchema: z.ZodType<Prisma.ServiceRequestCreateNestedOneWithoutInvoiceInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestCreateNestedOneWithoutInvoiceInput>;
export const ServiceRequestCreateNestedOneWithoutInvoiceInputObjectZodSchema = makeSchema();
