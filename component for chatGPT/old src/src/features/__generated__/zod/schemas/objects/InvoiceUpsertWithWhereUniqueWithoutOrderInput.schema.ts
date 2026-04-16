import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceWhereUniqueInputObjectSchema as InvoiceWhereUniqueInputObjectSchema } from './InvoiceWhereUniqueInput.schema';
import { InvoiceUpdateWithoutOrderInputObjectSchema as InvoiceUpdateWithoutOrderInputObjectSchema } from './InvoiceUpdateWithoutOrderInput.schema';
import { InvoiceUncheckedUpdateWithoutOrderInputObjectSchema as InvoiceUncheckedUpdateWithoutOrderInputObjectSchema } from './InvoiceUncheckedUpdateWithoutOrderInput.schema';
import { InvoiceCreateWithoutOrderInputObjectSchema as InvoiceCreateWithoutOrderInputObjectSchema } from './InvoiceCreateWithoutOrderInput.schema';
import { InvoiceUncheckedCreateWithoutOrderInputObjectSchema as InvoiceUncheckedCreateWithoutOrderInputObjectSchema } from './InvoiceUncheckedCreateWithoutOrderInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => InvoiceWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => InvoiceUpdateWithoutOrderInputObjectSchema), z.lazy(() => InvoiceUncheckedUpdateWithoutOrderInputObjectSchema)]),
  create: z.union([z.lazy(() => InvoiceCreateWithoutOrderInputObjectSchema), z.lazy(() => InvoiceUncheckedCreateWithoutOrderInputObjectSchema)])
}).strict();
export const InvoiceUpsertWithWhereUniqueWithoutOrderInputObjectSchema: z.ZodType<Prisma.InvoiceUpsertWithWhereUniqueWithoutOrderInput> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceUpsertWithWhereUniqueWithoutOrderInput>;
export const InvoiceUpsertWithWhereUniqueWithoutOrderInputObjectZodSchema = makeSchema();
