import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceScalarWhereInputObjectSchema as InvoiceScalarWhereInputObjectSchema } from './InvoiceScalarWhereInput.schema';
import { InvoiceUpdateManyMutationInputObjectSchema as InvoiceUpdateManyMutationInputObjectSchema } from './InvoiceUpdateManyMutationInput.schema';
import { InvoiceUncheckedUpdateManyWithoutServiceRequestInputObjectSchema as InvoiceUncheckedUpdateManyWithoutServiceRequestInputObjectSchema } from './InvoiceUncheckedUpdateManyWithoutServiceRequestInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => InvoiceScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => InvoiceUpdateManyMutationInputObjectSchema), z.lazy(() => InvoiceUncheckedUpdateManyWithoutServiceRequestInputObjectSchema)])
}).strict();
export const InvoiceUpdateManyWithWhereWithoutServiceRequestInputObjectSchema: z.ZodType<Prisma.InvoiceUpdateManyWithWhereWithoutServiceRequestInput> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceUpdateManyWithWhereWithoutServiceRequestInput>;
export const InvoiceUpdateManyWithWhereWithoutServiceRequestInputObjectZodSchema = makeSchema();
