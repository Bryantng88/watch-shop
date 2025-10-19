import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceScalarWhereInputObjectSchema as InvoiceScalarWhereInputObjectSchema } from './InvoiceScalarWhereInput.schema';
import { InvoiceUpdateManyMutationInputObjectSchema as InvoiceUpdateManyMutationInputObjectSchema } from './InvoiceUpdateManyMutationInput.schema';
import { InvoiceUncheckedUpdateManyWithoutCustomerInputObjectSchema as InvoiceUncheckedUpdateManyWithoutCustomerInputObjectSchema } from './InvoiceUncheckedUpdateManyWithoutCustomerInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => InvoiceScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => InvoiceUpdateManyMutationInputObjectSchema), z.lazy(() => InvoiceUncheckedUpdateManyWithoutCustomerInputObjectSchema)])
}).strict();
export const InvoiceUpdateManyWithWhereWithoutCustomerInputObjectSchema: z.ZodType<Prisma.InvoiceUpdateManyWithWhereWithoutCustomerInput> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceUpdateManyWithWhereWithoutCustomerInput>;
export const InvoiceUpdateManyWithWhereWithoutCustomerInputObjectZodSchema = makeSchema();
