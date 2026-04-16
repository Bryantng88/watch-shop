import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionUpdateWithoutInvoiceInputObjectSchema as AcquisitionUpdateWithoutInvoiceInputObjectSchema } from './AcquisitionUpdateWithoutInvoiceInput.schema';
import { AcquisitionUncheckedUpdateWithoutInvoiceInputObjectSchema as AcquisitionUncheckedUpdateWithoutInvoiceInputObjectSchema } from './AcquisitionUncheckedUpdateWithoutInvoiceInput.schema';
import { AcquisitionCreateWithoutInvoiceInputObjectSchema as AcquisitionCreateWithoutInvoiceInputObjectSchema } from './AcquisitionCreateWithoutInvoiceInput.schema';
import { AcquisitionUncheckedCreateWithoutInvoiceInputObjectSchema as AcquisitionUncheckedCreateWithoutInvoiceInputObjectSchema } from './AcquisitionUncheckedCreateWithoutInvoiceInput.schema';
import { AcquisitionWhereInputObjectSchema as AcquisitionWhereInputObjectSchema } from './AcquisitionWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => AcquisitionUpdateWithoutInvoiceInputObjectSchema), z.lazy(() => AcquisitionUncheckedUpdateWithoutInvoiceInputObjectSchema)]),
  create: z.union([z.lazy(() => AcquisitionCreateWithoutInvoiceInputObjectSchema), z.lazy(() => AcquisitionUncheckedCreateWithoutInvoiceInputObjectSchema)]),
  where: z.lazy(() => AcquisitionWhereInputObjectSchema).optional()
}).strict();
export const AcquisitionUpsertWithoutInvoiceInputObjectSchema: z.ZodType<Prisma.AcquisitionUpsertWithoutInvoiceInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionUpsertWithoutInvoiceInput>;
export const AcquisitionUpsertWithoutInvoiceInputObjectZodSchema = makeSchema();
