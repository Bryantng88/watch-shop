import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceWhereUniqueInputObjectSchema as InvoiceWhereUniqueInputObjectSchema } from './InvoiceWhereUniqueInput.schema';
import { InvoiceCreateWithoutServiceRequestInputObjectSchema as InvoiceCreateWithoutServiceRequestInputObjectSchema } from './InvoiceCreateWithoutServiceRequestInput.schema';
import { InvoiceUncheckedCreateWithoutServiceRequestInputObjectSchema as InvoiceUncheckedCreateWithoutServiceRequestInputObjectSchema } from './InvoiceUncheckedCreateWithoutServiceRequestInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => InvoiceWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => InvoiceCreateWithoutServiceRequestInputObjectSchema), z.lazy(() => InvoiceUncheckedCreateWithoutServiceRequestInputObjectSchema)])
}).strict();
export const InvoiceCreateOrConnectWithoutServiceRequestInputObjectSchema: z.ZodType<Prisma.InvoiceCreateOrConnectWithoutServiceRequestInput> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceCreateOrConnectWithoutServiceRequestInput>;
export const InvoiceCreateOrConnectWithoutServiceRequestInputObjectZodSchema = makeSchema();
