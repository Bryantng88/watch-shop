import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceWhereUniqueInputObjectSchema as InvoiceWhereUniqueInputObjectSchema } from './InvoiceWhereUniqueInput.schema';
import { InvoiceCreateWithoutServiceReqInputObjectSchema as InvoiceCreateWithoutServiceReqInputObjectSchema } from './InvoiceCreateWithoutServiceReqInput.schema';
import { InvoiceUncheckedCreateWithoutServiceReqInputObjectSchema as InvoiceUncheckedCreateWithoutServiceReqInputObjectSchema } from './InvoiceUncheckedCreateWithoutServiceReqInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => InvoiceWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => InvoiceCreateWithoutServiceReqInputObjectSchema), z.lazy(() => InvoiceUncheckedCreateWithoutServiceReqInputObjectSchema)])
}).strict();
export const InvoiceCreateOrConnectWithoutServiceReqInputObjectSchema: z.ZodType<Prisma.InvoiceCreateOrConnectWithoutServiceReqInput> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceCreateOrConnectWithoutServiceReqInput>;
export const InvoiceCreateOrConnectWithoutServiceReqInputObjectZodSchema = makeSchema();
