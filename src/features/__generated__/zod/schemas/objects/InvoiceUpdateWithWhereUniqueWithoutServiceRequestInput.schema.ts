import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceWhereUniqueInputObjectSchema as InvoiceWhereUniqueInputObjectSchema } from './InvoiceWhereUniqueInput.schema';
import { InvoiceUpdateWithoutServiceRequestInputObjectSchema as InvoiceUpdateWithoutServiceRequestInputObjectSchema } from './InvoiceUpdateWithoutServiceRequestInput.schema';
import { InvoiceUncheckedUpdateWithoutServiceRequestInputObjectSchema as InvoiceUncheckedUpdateWithoutServiceRequestInputObjectSchema } from './InvoiceUncheckedUpdateWithoutServiceRequestInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => InvoiceWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => InvoiceUpdateWithoutServiceRequestInputObjectSchema), z.lazy(() => InvoiceUncheckedUpdateWithoutServiceRequestInputObjectSchema)])
}).strict();
export const InvoiceUpdateWithWhereUniqueWithoutServiceRequestInputObjectSchema: z.ZodType<Prisma.InvoiceUpdateWithWhereUniqueWithoutServiceRequestInput> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceUpdateWithWhereUniqueWithoutServiceRequestInput>;
export const InvoiceUpdateWithWhereUniqueWithoutServiceRequestInputObjectZodSchema = makeSchema();
