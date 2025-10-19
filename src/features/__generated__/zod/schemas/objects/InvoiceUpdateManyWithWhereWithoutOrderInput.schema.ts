import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceScalarWhereInputObjectSchema as InvoiceScalarWhereInputObjectSchema } from './InvoiceScalarWhereInput.schema';
import { InvoiceUpdateManyMutationInputObjectSchema as InvoiceUpdateManyMutationInputObjectSchema } from './InvoiceUpdateManyMutationInput.schema';
import { InvoiceUncheckedUpdateManyWithoutOrderInputObjectSchema as InvoiceUncheckedUpdateManyWithoutOrderInputObjectSchema } from './InvoiceUncheckedUpdateManyWithoutOrderInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => InvoiceScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => InvoiceUpdateManyMutationInputObjectSchema), z.lazy(() => InvoiceUncheckedUpdateManyWithoutOrderInputObjectSchema)])
}).strict();
export const InvoiceUpdateManyWithWhereWithoutOrderInputObjectSchema: z.ZodType<Prisma.InvoiceUpdateManyWithWhereWithoutOrderInput> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceUpdateManyWithWhereWithoutOrderInput>;
export const InvoiceUpdateManyWithWhereWithoutOrderInputObjectZodSchema = makeSchema();
