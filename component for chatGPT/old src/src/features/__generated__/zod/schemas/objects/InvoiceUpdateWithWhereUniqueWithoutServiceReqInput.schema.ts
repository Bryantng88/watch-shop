import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceWhereUniqueInputObjectSchema as InvoiceWhereUniqueInputObjectSchema } from './InvoiceWhereUniqueInput.schema';
import { InvoiceUpdateWithoutServiceReqInputObjectSchema as InvoiceUpdateWithoutServiceReqInputObjectSchema } from './InvoiceUpdateWithoutServiceReqInput.schema';
import { InvoiceUncheckedUpdateWithoutServiceReqInputObjectSchema as InvoiceUncheckedUpdateWithoutServiceReqInputObjectSchema } from './InvoiceUncheckedUpdateWithoutServiceReqInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => InvoiceWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => InvoiceUpdateWithoutServiceReqInputObjectSchema), z.lazy(() => InvoiceUncheckedUpdateWithoutServiceReqInputObjectSchema)])
}).strict();
export const InvoiceUpdateWithWhereUniqueWithoutServiceReqInputObjectSchema: z.ZodType<Prisma.InvoiceUpdateWithWhereUniqueWithoutServiceReqInput> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceUpdateWithWhereUniqueWithoutServiceReqInput>;
export const InvoiceUpdateWithWhereUniqueWithoutServiceReqInputObjectZodSchema = makeSchema();
