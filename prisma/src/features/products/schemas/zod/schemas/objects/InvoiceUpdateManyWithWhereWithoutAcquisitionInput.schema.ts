import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceScalarWhereInputObjectSchema as InvoiceScalarWhereInputObjectSchema } from './InvoiceScalarWhereInput.schema';
import { InvoiceUpdateManyMutationInputObjectSchema as InvoiceUpdateManyMutationInputObjectSchema } from './InvoiceUpdateManyMutationInput.schema';
import { InvoiceUncheckedUpdateManyWithoutAcquisitionInputObjectSchema as InvoiceUncheckedUpdateManyWithoutAcquisitionInputObjectSchema } from './InvoiceUncheckedUpdateManyWithoutAcquisitionInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => InvoiceScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => InvoiceUpdateManyMutationInputObjectSchema), z.lazy(() => InvoiceUncheckedUpdateManyWithoutAcquisitionInputObjectSchema)])
}).strict();
export const InvoiceUpdateManyWithWhereWithoutAcquisitionInputObjectSchema: z.ZodType<Prisma.InvoiceUpdateManyWithWhereWithoutAcquisitionInput> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceUpdateManyWithWhereWithoutAcquisitionInput>;
export const InvoiceUpdateManyWithWhereWithoutAcquisitionInputObjectZodSchema = makeSchema();
