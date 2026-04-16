import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceWhereUniqueInputObjectSchema as InvoiceWhereUniqueInputObjectSchema } from './InvoiceWhereUniqueInput.schema';
import { InvoiceUpdateWithoutCustomerInputObjectSchema as InvoiceUpdateWithoutCustomerInputObjectSchema } from './InvoiceUpdateWithoutCustomerInput.schema';
import { InvoiceUncheckedUpdateWithoutCustomerInputObjectSchema as InvoiceUncheckedUpdateWithoutCustomerInputObjectSchema } from './InvoiceUncheckedUpdateWithoutCustomerInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => InvoiceWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => InvoiceUpdateWithoutCustomerInputObjectSchema), z.lazy(() => InvoiceUncheckedUpdateWithoutCustomerInputObjectSchema)])
}).strict();
export const InvoiceUpdateWithWhereUniqueWithoutCustomerInputObjectSchema: z.ZodType<Prisma.InvoiceUpdateWithWhereUniqueWithoutCustomerInput> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceUpdateWithWhereUniqueWithoutCustomerInput>;
export const InvoiceUpdateWithWhereUniqueWithoutCustomerInputObjectZodSchema = makeSchema();
