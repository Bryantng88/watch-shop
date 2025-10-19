import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionWhereUniqueInputObjectSchema as AcquisitionWhereUniqueInputObjectSchema } from './AcquisitionWhereUniqueInput.schema';
import { AcquisitionCreateWithoutInvoiceInputObjectSchema as AcquisitionCreateWithoutInvoiceInputObjectSchema } from './AcquisitionCreateWithoutInvoiceInput.schema';
import { AcquisitionUncheckedCreateWithoutInvoiceInputObjectSchema as AcquisitionUncheckedCreateWithoutInvoiceInputObjectSchema } from './AcquisitionUncheckedCreateWithoutInvoiceInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => AcquisitionWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => AcquisitionCreateWithoutInvoiceInputObjectSchema), z.lazy(() => AcquisitionUncheckedCreateWithoutInvoiceInputObjectSchema)])
}).strict();
export const AcquisitionCreateOrConnectWithoutInvoiceInputObjectSchema: z.ZodType<Prisma.AcquisitionCreateOrConnectWithoutInvoiceInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionCreateOrConnectWithoutInvoiceInput>;
export const AcquisitionCreateOrConnectWithoutInvoiceInputObjectZodSchema = makeSchema();
