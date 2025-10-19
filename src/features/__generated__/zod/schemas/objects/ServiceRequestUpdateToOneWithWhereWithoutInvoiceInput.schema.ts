import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestWhereInputObjectSchema as ServiceRequestWhereInputObjectSchema } from './ServiceRequestWhereInput.schema';
import { ServiceRequestUpdateWithoutInvoiceInputObjectSchema as ServiceRequestUpdateWithoutInvoiceInputObjectSchema } from './ServiceRequestUpdateWithoutInvoiceInput.schema';
import { ServiceRequestUncheckedUpdateWithoutInvoiceInputObjectSchema as ServiceRequestUncheckedUpdateWithoutInvoiceInputObjectSchema } from './ServiceRequestUncheckedUpdateWithoutInvoiceInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ServiceRequestWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => ServiceRequestUpdateWithoutInvoiceInputObjectSchema), z.lazy(() => ServiceRequestUncheckedUpdateWithoutInvoiceInputObjectSchema)])
}).strict();
export const ServiceRequestUpdateToOneWithWhereWithoutInvoiceInputObjectSchema: z.ZodType<Prisma.ServiceRequestUpdateToOneWithWhereWithoutInvoiceInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestUpdateToOneWithWhereWithoutInvoiceInput>;
export const ServiceRequestUpdateToOneWithWhereWithoutInvoiceInputObjectZodSchema = makeSchema();
