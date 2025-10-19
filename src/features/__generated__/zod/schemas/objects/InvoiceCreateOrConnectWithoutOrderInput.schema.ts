import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceWhereUniqueInputObjectSchema as InvoiceWhereUniqueInputObjectSchema } from './InvoiceWhereUniqueInput.schema';
import { InvoiceCreateWithoutOrderInputObjectSchema as InvoiceCreateWithoutOrderInputObjectSchema } from './InvoiceCreateWithoutOrderInput.schema';
import { InvoiceUncheckedCreateWithoutOrderInputObjectSchema as InvoiceUncheckedCreateWithoutOrderInputObjectSchema } from './InvoiceUncheckedCreateWithoutOrderInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => InvoiceWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => InvoiceCreateWithoutOrderInputObjectSchema), z.lazy(() => InvoiceUncheckedCreateWithoutOrderInputObjectSchema)])
}).strict();
export const InvoiceCreateOrConnectWithoutOrderInputObjectSchema: z.ZodType<Prisma.InvoiceCreateOrConnectWithoutOrderInput> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceCreateOrConnectWithoutOrderInput>;
export const InvoiceCreateOrConnectWithoutOrderInputObjectZodSchema = makeSchema();
