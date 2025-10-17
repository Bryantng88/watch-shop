import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionCreateWithoutInvoiceInputObjectSchema as AcquisitionCreateWithoutInvoiceInputObjectSchema } from './AcquisitionCreateWithoutInvoiceInput.schema';
import { AcquisitionUncheckedCreateWithoutInvoiceInputObjectSchema as AcquisitionUncheckedCreateWithoutInvoiceInputObjectSchema } from './AcquisitionUncheckedCreateWithoutInvoiceInput.schema';
import { AcquisitionCreateOrConnectWithoutInvoiceInputObjectSchema as AcquisitionCreateOrConnectWithoutInvoiceInputObjectSchema } from './AcquisitionCreateOrConnectWithoutInvoiceInput.schema';
import { AcquisitionWhereUniqueInputObjectSchema as AcquisitionWhereUniqueInputObjectSchema } from './AcquisitionWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => AcquisitionCreateWithoutInvoiceInputObjectSchema), z.lazy(() => AcquisitionUncheckedCreateWithoutInvoiceInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => AcquisitionCreateOrConnectWithoutInvoiceInputObjectSchema).optional(),
  connect: z.lazy(() => AcquisitionWhereUniqueInputObjectSchema).optional()
}).strict();
export const AcquisitionCreateNestedOneWithoutInvoiceInputObjectSchema: z.ZodType<Prisma.AcquisitionCreateNestedOneWithoutInvoiceInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionCreateNestedOneWithoutInvoiceInput>;
export const AcquisitionCreateNestedOneWithoutInvoiceInputObjectZodSchema = makeSchema();
