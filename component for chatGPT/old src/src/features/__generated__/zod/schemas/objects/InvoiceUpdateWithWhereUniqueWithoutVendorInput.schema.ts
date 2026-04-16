import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceWhereUniqueInputObjectSchema as InvoiceWhereUniqueInputObjectSchema } from './InvoiceWhereUniqueInput.schema';
import { InvoiceUpdateWithoutVendorInputObjectSchema as InvoiceUpdateWithoutVendorInputObjectSchema } from './InvoiceUpdateWithoutVendorInput.schema';
import { InvoiceUncheckedUpdateWithoutVendorInputObjectSchema as InvoiceUncheckedUpdateWithoutVendorInputObjectSchema } from './InvoiceUncheckedUpdateWithoutVendorInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => InvoiceWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => InvoiceUpdateWithoutVendorInputObjectSchema), z.lazy(() => InvoiceUncheckedUpdateWithoutVendorInputObjectSchema)])
}).strict();
export const InvoiceUpdateWithWhereUniqueWithoutVendorInputObjectSchema: z.ZodType<Prisma.InvoiceUpdateWithWhereUniqueWithoutVendorInput> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceUpdateWithWhereUniqueWithoutVendorInput>;
export const InvoiceUpdateWithWhereUniqueWithoutVendorInputObjectZodSchema = makeSchema();
