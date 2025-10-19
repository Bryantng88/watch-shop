import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceCreateWithoutPaymentsInputObjectSchema as InvoiceCreateWithoutPaymentsInputObjectSchema } from './InvoiceCreateWithoutPaymentsInput.schema';
import { InvoiceUncheckedCreateWithoutPaymentsInputObjectSchema as InvoiceUncheckedCreateWithoutPaymentsInputObjectSchema } from './InvoiceUncheckedCreateWithoutPaymentsInput.schema';
import { InvoiceCreateOrConnectWithoutPaymentsInputObjectSchema as InvoiceCreateOrConnectWithoutPaymentsInputObjectSchema } from './InvoiceCreateOrConnectWithoutPaymentsInput.schema';
import { InvoiceWhereUniqueInputObjectSchema as InvoiceWhereUniqueInputObjectSchema } from './InvoiceWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => InvoiceCreateWithoutPaymentsInputObjectSchema), z.lazy(() => InvoiceUncheckedCreateWithoutPaymentsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => InvoiceCreateOrConnectWithoutPaymentsInputObjectSchema).optional(),
  connect: z.lazy(() => InvoiceWhereUniqueInputObjectSchema).optional()
}).strict();
export const InvoiceCreateNestedOneWithoutPaymentsInputObjectSchema: z.ZodType<Prisma.InvoiceCreateNestedOneWithoutPaymentsInput> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceCreateNestedOneWithoutPaymentsInput>;
export const InvoiceCreateNestedOneWithoutPaymentsInputObjectZodSchema = makeSchema();
