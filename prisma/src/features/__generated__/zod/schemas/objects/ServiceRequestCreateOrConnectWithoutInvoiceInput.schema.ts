import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestWhereUniqueInputObjectSchema as ServiceRequestWhereUniqueInputObjectSchema } from './ServiceRequestWhereUniqueInput.schema';
import { ServiceRequestCreateWithoutInvoiceInputObjectSchema as ServiceRequestCreateWithoutInvoiceInputObjectSchema } from './ServiceRequestCreateWithoutInvoiceInput.schema';
import { ServiceRequestUncheckedCreateWithoutInvoiceInputObjectSchema as ServiceRequestUncheckedCreateWithoutInvoiceInputObjectSchema } from './ServiceRequestUncheckedCreateWithoutInvoiceInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ServiceRequestCreateWithoutInvoiceInputObjectSchema), z.lazy(() => ServiceRequestUncheckedCreateWithoutInvoiceInputObjectSchema)])
}).strict();
export const ServiceRequestCreateOrConnectWithoutInvoiceInputObjectSchema: z.ZodType<Prisma.ServiceRequestCreateOrConnectWithoutInvoiceInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestCreateOrConnectWithoutInvoiceInput>;
export const ServiceRequestCreateOrConnectWithoutInvoiceInputObjectZodSchema = makeSchema();
