import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceWhereUniqueInputObjectSchema as InvoiceWhereUniqueInputObjectSchema } from './InvoiceWhereUniqueInput.schema';
import { InvoiceUpdateWithoutCustomerInputObjectSchema as InvoiceUpdateWithoutCustomerInputObjectSchema } from './InvoiceUpdateWithoutCustomerInput.schema';
import { InvoiceUncheckedUpdateWithoutCustomerInputObjectSchema as InvoiceUncheckedUpdateWithoutCustomerInputObjectSchema } from './InvoiceUncheckedUpdateWithoutCustomerInput.schema';
import { InvoiceCreateWithoutCustomerInputObjectSchema as InvoiceCreateWithoutCustomerInputObjectSchema } from './InvoiceCreateWithoutCustomerInput.schema';
import { InvoiceUncheckedCreateWithoutCustomerInputObjectSchema as InvoiceUncheckedCreateWithoutCustomerInputObjectSchema } from './InvoiceUncheckedCreateWithoutCustomerInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => InvoiceWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => InvoiceUpdateWithoutCustomerInputObjectSchema), z.lazy(() => InvoiceUncheckedUpdateWithoutCustomerInputObjectSchema)]),
  create: z.union([z.lazy(() => InvoiceCreateWithoutCustomerInputObjectSchema), z.lazy(() => InvoiceUncheckedCreateWithoutCustomerInputObjectSchema)])
}).strict();
export const InvoiceUpsertWithWhereUniqueWithoutCustomerInputObjectSchema: z.ZodType<Prisma.InvoiceUpsertWithWhereUniqueWithoutCustomerInput> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceUpsertWithWhereUniqueWithoutCustomerInput>;
export const InvoiceUpsertWithWhereUniqueWithoutCustomerInputObjectZodSchema = makeSchema();
