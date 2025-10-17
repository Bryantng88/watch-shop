import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionWhereInputObjectSchema as AcquisitionWhereInputObjectSchema } from './AcquisitionWhereInput.schema';
import { AcquisitionUpdateWithoutInvoiceInputObjectSchema as AcquisitionUpdateWithoutInvoiceInputObjectSchema } from './AcquisitionUpdateWithoutInvoiceInput.schema';
import { AcquisitionUncheckedUpdateWithoutInvoiceInputObjectSchema as AcquisitionUncheckedUpdateWithoutInvoiceInputObjectSchema } from './AcquisitionUncheckedUpdateWithoutInvoiceInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => AcquisitionWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => AcquisitionUpdateWithoutInvoiceInputObjectSchema), z.lazy(() => AcquisitionUncheckedUpdateWithoutInvoiceInputObjectSchema)])
}).strict();
export const AcquisitionUpdateToOneWithWhereWithoutInvoiceInputObjectSchema: z.ZodType<Prisma.AcquisitionUpdateToOneWithWhereWithoutInvoiceInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionUpdateToOneWithWhereWithoutInvoiceInput>;
export const AcquisitionUpdateToOneWithWhereWithoutInvoiceInputObjectZodSchema = makeSchema();
