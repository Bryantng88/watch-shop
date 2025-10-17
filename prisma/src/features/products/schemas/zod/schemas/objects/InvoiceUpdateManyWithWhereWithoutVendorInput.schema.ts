import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceScalarWhereInputObjectSchema as InvoiceScalarWhereInputObjectSchema } from './InvoiceScalarWhereInput.schema';
import { InvoiceUpdateManyMutationInputObjectSchema as InvoiceUpdateManyMutationInputObjectSchema } from './InvoiceUpdateManyMutationInput.schema';
import { InvoiceUncheckedUpdateManyWithoutVendorInputObjectSchema as InvoiceUncheckedUpdateManyWithoutVendorInputObjectSchema } from './InvoiceUncheckedUpdateManyWithoutVendorInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => InvoiceScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => InvoiceUpdateManyMutationInputObjectSchema), z.lazy(() => InvoiceUncheckedUpdateManyWithoutVendorInputObjectSchema)])
}).strict();
export const InvoiceUpdateManyWithWhereWithoutVendorInputObjectSchema: z.ZodType<Prisma.InvoiceUpdateManyWithWhereWithoutVendorInput> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceUpdateManyWithWhereWithoutVendorInput>;
export const InvoiceUpdateManyWithWhereWithoutVendorInputObjectZodSchema = makeSchema();
