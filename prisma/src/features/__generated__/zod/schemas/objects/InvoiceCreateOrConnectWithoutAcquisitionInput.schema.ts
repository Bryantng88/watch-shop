import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceWhereUniqueInputObjectSchema as InvoiceWhereUniqueInputObjectSchema } from './InvoiceWhereUniqueInput.schema';
import { InvoiceCreateWithoutAcquisitionInputObjectSchema as InvoiceCreateWithoutAcquisitionInputObjectSchema } from './InvoiceCreateWithoutAcquisitionInput.schema';
import { InvoiceUncheckedCreateWithoutAcquisitionInputObjectSchema as InvoiceUncheckedCreateWithoutAcquisitionInputObjectSchema } from './InvoiceUncheckedCreateWithoutAcquisitionInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => InvoiceWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => InvoiceCreateWithoutAcquisitionInputObjectSchema), z.lazy(() => InvoiceUncheckedCreateWithoutAcquisitionInputObjectSchema)])
}).strict();
export const InvoiceCreateOrConnectWithoutAcquisitionInputObjectSchema: z.ZodType<Prisma.InvoiceCreateOrConnectWithoutAcquisitionInput> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceCreateOrConnectWithoutAcquisitionInput>;
export const InvoiceCreateOrConnectWithoutAcquisitionInputObjectZodSchema = makeSchema();
