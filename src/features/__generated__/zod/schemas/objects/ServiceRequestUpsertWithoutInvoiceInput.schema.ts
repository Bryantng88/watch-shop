import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestUpdateWithoutInvoiceInputObjectSchema as ServiceRequestUpdateWithoutInvoiceInputObjectSchema } from './ServiceRequestUpdateWithoutInvoiceInput.schema';
import { ServiceRequestUncheckedUpdateWithoutInvoiceInputObjectSchema as ServiceRequestUncheckedUpdateWithoutInvoiceInputObjectSchema } from './ServiceRequestUncheckedUpdateWithoutInvoiceInput.schema';
import { ServiceRequestCreateWithoutInvoiceInputObjectSchema as ServiceRequestCreateWithoutInvoiceInputObjectSchema } from './ServiceRequestCreateWithoutInvoiceInput.schema';
import { ServiceRequestUncheckedCreateWithoutInvoiceInputObjectSchema as ServiceRequestUncheckedCreateWithoutInvoiceInputObjectSchema } from './ServiceRequestUncheckedCreateWithoutInvoiceInput.schema';
import { ServiceRequestWhereInputObjectSchema as ServiceRequestWhereInputObjectSchema } from './ServiceRequestWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => ServiceRequestUpdateWithoutInvoiceInputObjectSchema), z.lazy(() => ServiceRequestUncheckedUpdateWithoutInvoiceInputObjectSchema)]),
  create: z.union([z.lazy(() => ServiceRequestCreateWithoutInvoiceInputObjectSchema), z.lazy(() => ServiceRequestUncheckedCreateWithoutInvoiceInputObjectSchema)]),
  where: z.lazy(() => ServiceRequestWhereInputObjectSchema).optional()
}).strict();
export const ServiceRequestUpsertWithoutInvoiceInputObjectSchema: z.ZodType<Prisma.ServiceRequestUpsertWithoutInvoiceInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestUpsertWithoutInvoiceInput>;
export const ServiceRequestUpsertWithoutInvoiceInputObjectZodSchema = makeSchema();
