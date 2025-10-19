import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceScalarWhereInputObjectSchema as InvoiceScalarWhereInputObjectSchema } from './InvoiceScalarWhereInput.schema';
import { InvoiceUpdateManyMutationInputObjectSchema as InvoiceUpdateManyMutationInputObjectSchema } from './InvoiceUpdateManyMutationInput.schema';
import { InvoiceUncheckedUpdateManyWithoutServiceReqInputObjectSchema as InvoiceUncheckedUpdateManyWithoutServiceReqInputObjectSchema } from './InvoiceUncheckedUpdateManyWithoutServiceReqInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => InvoiceScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => InvoiceUpdateManyMutationInputObjectSchema), z.lazy(() => InvoiceUncheckedUpdateManyWithoutServiceReqInputObjectSchema)])
}).strict();
export const InvoiceUpdateManyWithWhereWithoutServiceReqInputObjectSchema: z.ZodType<Prisma.InvoiceUpdateManyWithWhereWithoutServiceReqInput> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceUpdateManyWithWhereWithoutServiceReqInput>;
export const InvoiceUpdateManyWithWhereWithoutServiceReqInputObjectZodSchema = makeSchema();
