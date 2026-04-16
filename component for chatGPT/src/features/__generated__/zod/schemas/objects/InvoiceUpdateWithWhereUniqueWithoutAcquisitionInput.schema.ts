import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceWhereUniqueInputObjectSchema as InvoiceWhereUniqueInputObjectSchema } from './InvoiceWhereUniqueInput.schema';
import { InvoiceUpdateWithoutAcquisitionInputObjectSchema as InvoiceUpdateWithoutAcquisitionInputObjectSchema } from './InvoiceUpdateWithoutAcquisitionInput.schema';
import { InvoiceUncheckedUpdateWithoutAcquisitionInputObjectSchema as InvoiceUncheckedUpdateWithoutAcquisitionInputObjectSchema } from './InvoiceUncheckedUpdateWithoutAcquisitionInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => InvoiceWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => InvoiceUpdateWithoutAcquisitionInputObjectSchema), z.lazy(() => InvoiceUncheckedUpdateWithoutAcquisitionInputObjectSchema)])
}).strict();
export const InvoiceUpdateWithWhereUniqueWithoutAcquisitionInputObjectSchema: z.ZodType<Prisma.InvoiceUpdateWithWhereUniqueWithoutAcquisitionInput> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceUpdateWithWhereUniqueWithoutAcquisitionInput>;
export const InvoiceUpdateWithWhereUniqueWithoutAcquisitionInputObjectZodSchema = makeSchema();
