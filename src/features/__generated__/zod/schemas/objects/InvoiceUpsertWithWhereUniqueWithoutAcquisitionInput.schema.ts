import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceWhereUniqueInputObjectSchema as InvoiceWhereUniqueInputObjectSchema } from './InvoiceWhereUniqueInput.schema';
import { InvoiceUpdateWithoutAcquisitionInputObjectSchema as InvoiceUpdateWithoutAcquisitionInputObjectSchema } from './InvoiceUpdateWithoutAcquisitionInput.schema';
import { InvoiceUncheckedUpdateWithoutAcquisitionInputObjectSchema as InvoiceUncheckedUpdateWithoutAcquisitionInputObjectSchema } from './InvoiceUncheckedUpdateWithoutAcquisitionInput.schema';
import { InvoiceCreateWithoutAcquisitionInputObjectSchema as InvoiceCreateWithoutAcquisitionInputObjectSchema } from './InvoiceCreateWithoutAcquisitionInput.schema';
import { InvoiceUncheckedCreateWithoutAcquisitionInputObjectSchema as InvoiceUncheckedCreateWithoutAcquisitionInputObjectSchema } from './InvoiceUncheckedCreateWithoutAcquisitionInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => InvoiceWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => InvoiceUpdateWithoutAcquisitionInputObjectSchema), z.lazy(() => InvoiceUncheckedUpdateWithoutAcquisitionInputObjectSchema)]),
  create: z.union([z.lazy(() => InvoiceCreateWithoutAcquisitionInputObjectSchema), z.lazy(() => InvoiceUncheckedCreateWithoutAcquisitionInputObjectSchema)])
}).strict();
export const InvoiceUpsertWithWhereUniqueWithoutAcquisitionInputObjectSchema: z.ZodType<Prisma.InvoiceUpsertWithWhereUniqueWithoutAcquisitionInput> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceUpsertWithWhereUniqueWithoutAcquisitionInput>;
export const InvoiceUpsertWithWhereUniqueWithoutAcquisitionInputObjectZodSchema = makeSchema();
