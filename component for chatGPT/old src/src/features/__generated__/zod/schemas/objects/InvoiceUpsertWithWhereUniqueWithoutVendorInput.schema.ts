import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceWhereUniqueInputObjectSchema as InvoiceWhereUniqueInputObjectSchema } from './InvoiceWhereUniqueInput.schema';
import { InvoiceUpdateWithoutVendorInputObjectSchema as InvoiceUpdateWithoutVendorInputObjectSchema } from './InvoiceUpdateWithoutVendorInput.schema';
import { InvoiceUncheckedUpdateWithoutVendorInputObjectSchema as InvoiceUncheckedUpdateWithoutVendorInputObjectSchema } from './InvoiceUncheckedUpdateWithoutVendorInput.schema';
import { InvoiceCreateWithoutVendorInputObjectSchema as InvoiceCreateWithoutVendorInputObjectSchema } from './InvoiceCreateWithoutVendorInput.schema';
import { InvoiceUncheckedCreateWithoutVendorInputObjectSchema as InvoiceUncheckedCreateWithoutVendorInputObjectSchema } from './InvoiceUncheckedCreateWithoutVendorInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => InvoiceWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => InvoiceUpdateWithoutVendorInputObjectSchema), z.lazy(() => InvoiceUncheckedUpdateWithoutVendorInputObjectSchema)]),
  create: z.union([z.lazy(() => InvoiceCreateWithoutVendorInputObjectSchema), z.lazy(() => InvoiceUncheckedCreateWithoutVendorInputObjectSchema)])
}).strict();
export const InvoiceUpsertWithWhereUniqueWithoutVendorInputObjectSchema: z.ZodType<Prisma.InvoiceUpsertWithWhereUniqueWithoutVendorInput> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceUpsertWithWhereUniqueWithoutVendorInput>;
export const InvoiceUpsertWithWhereUniqueWithoutVendorInputObjectZodSchema = makeSchema();
