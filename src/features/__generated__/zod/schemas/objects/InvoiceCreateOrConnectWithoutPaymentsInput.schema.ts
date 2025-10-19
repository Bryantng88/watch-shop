import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceWhereUniqueInputObjectSchema as InvoiceWhereUniqueInputObjectSchema } from './InvoiceWhereUniqueInput.schema';
import { InvoiceCreateWithoutPaymentsInputObjectSchema as InvoiceCreateWithoutPaymentsInputObjectSchema } from './InvoiceCreateWithoutPaymentsInput.schema';
import { InvoiceUncheckedCreateWithoutPaymentsInputObjectSchema as InvoiceUncheckedCreateWithoutPaymentsInputObjectSchema } from './InvoiceUncheckedCreateWithoutPaymentsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => InvoiceWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => InvoiceCreateWithoutPaymentsInputObjectSchema), z.lazy(() => InvoiceUncheckedCreateWithoutPaymentsInputObjectSchema)])
}).strict();
export const InvoiceCreateOrConnectWithoutPaymentsInputObjectSchema: z.ZodType<Prisma.InvoiceCreateOrConnectWithoutPaymentsInput> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceCreateOrConnectWithoutPaymentsInput>;
export const InvoiceCreateOrConnectWithoutPaymentsInputObjectZodSchema = makeSchema();
