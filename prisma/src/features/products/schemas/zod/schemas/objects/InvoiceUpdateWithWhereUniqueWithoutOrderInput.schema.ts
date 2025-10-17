import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceWhereUniqueInputObjectSchema as InvoiceWhereUniqueInputObjectSchema } from './InvoiceWhereUniqueInput.schema';
import { InvoiceUpdateWithoutOrderInputObjectSchema as InvoiceUpdateWithoutOrderInputObjectSchema } from './InvoiceUpdateWithoutOrderInput.schema';
import { InvoiceUncheckedUpdateWithoutOrderInputObjectSchema as InvoiceUncheckedUpdateWithoutOrderInputObjectSchema } from './InvoiceUncheckedUpdateWithoutOrderInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => InvoiceWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => InvoiceUpdateWithoutOrderInputObjectSchema), z.lazy(() => InvoiceUncheckedUpdateWithoutOrderInputObjectSchema)])
}).strict();
export const InvoiceUpdateWithWhereUniqueWithoutOrderInputObjectSchema: z.ZodType<Prisma.InvoiceUpdateWithWhereUniqueWithoutOrderInput> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceUpdateWithWhereUniqueWithoutOrderInput>;
export const InvoiceUpdateWithWhereUniqueWithoutOrderInputObjectZodSchema = makeSchema();
