import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestCreateWithoutInvoiceInputObjectSchema as ServiceRequestCreateWithoutInvoiceInputObjectSchema } from './ServiceRequestCreateWithoutInvoiceInput.schema';
import { ServiceRequestUncheckedCreateWithoutInvoiceInputObjectSchema as ServiceRequestUncheckedCreateWithoutInvoiceInputObjectSchema } from './ServiceRequestUncheckedCreateWithoutInvoiceInput.schema';
import { ServiceRequestCreateOrConnectWithoutInvoiceInputObjectSchema as ServiceRequestCreateOrConnectWithoutInvoiceInputObjectSchema } from './ServiceRequestCreateOrConnectWithoutInvoiceInput.schema';
import { ServiceRequestUpsertWithoutInvoiceInputObjectSchema as ServiceRequestUpsertWithoutInvoiceInputObjectSchema } from './ServiceRequestUpsertWithoutInvoiceInput.schema';
import { ServiceRequestWhereInputObjectSchema as ServiceRequestWhereInputObjectSchema } from './ServiceRequestWhereInput.schema';
import { ServiceRequestWhereUniqueInputObjectSchema as ServiceRequestWhereUniqueInputObjectSchema } from './ServiceRequestWhereUniqueInput.schema';
import { ServiceRequestUpdateToOneWithWhereWithoutInvoiceInputObjectSchema as ServiceRequestUpdateToOneWithWhereWithoutInvoiceInputObjectSchema } from './ServiceRequestUpdateToOneWithWhereWithoutInvoiceInput.schema';
import { ServiceRequestUpdateWithoutInvoiceInputObjectSchema as ServiceRequestUpdateWithoutInvoiceInputObjectSchema } from './ServiceRequestUpdateWithoutInvoiceInput.schema';
import { ServiceRequestUncheckedUpdateWithoutInvoiceInputObjectSchema as ServiceRequestUncheckedUpdateWithoutInvoiceInputObjectSchema } from './ServiceRequestUncheckedUpdateWithoutInvoiceInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ServiceRequestCreateWithoutInvoiceInputObjectSchema), z.lazy(() => ServiceRequestUncheckedCreateWithoutInvoiceInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ServiceRequestCreateOrConnectWithoutInvoiceInputObjectSchema).optional(),
  upsert: z.lazy(() => ServiceRequestUpsertWithoutInvoiceInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => ServiceRequestWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => ServiceRequestWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => ServiceRequestUpdateToOneWithWhereWithoutInvoiceInputObjectSchema), z.lazy(() => ServiceRequestUpdateWithoutInvoiceInputObjectSchema), z.lazy(() => ServiceRequestUncheckedUpdateWithoutInvoiceInputObjectSchema)]).optional()
}).strict();
export const ServiceRequestUpdateOneWithoutInvoiceNestedInputObjectSchema: z.ZodType<Prisma.ServiceRequestUpdateOneWithoutInvoiceNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestUpdateOneWithoutInvoiceNestedInput>;
export const ServiceRequestUpdateOneWithoutInvoiceNestedInputObjectZodSchema = makeSchema();
