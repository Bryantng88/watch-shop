import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceWhereUniqueInputObjectSchema as InvoiceWhereUniqueInputObjectSchema } from './InvoiceWhereUniqueInput.schema';
import { InvoiceUpdateWithoutServiceReqInputObjectSchema as InvoiceUpdateWithoutServiceReqInputObjectSchema } from './InvoiceUpdateWithoutServiceReqInput.schema';
import { InvoiceUncheckedUpdateWithoutServiceReqInputObjectSchema as InvoiceUncheckedUpdateWithoutServiceReqInputObjectSchema } from './InvoiceUncheckedUpdateWithoutServiceReqInput.schema';
import { InvoiceCreateWithoutServiceReqInputObjectSchema as InvoiceCreateWithoutServiceReqInputObjectSchema } from './InvoiceCreateWithoutServiceReqInput.schema';
import { InvoiceUncheckedCreateWithoutServiceReqInputObjectSchema as InvoiceUncheckedCreateWithoutServiceReqInputObjectSchema } from './InvoiceUncheckedCreateWithoutServiceReqInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => InvoiceWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => InvoiceUpdateWithoutServiceReqInputObjectSchema), z.lazy(() => InvoiceUncheckedUpdateWithoutServiceReqInputObjectSchema)]),
  create: z.union([z.lazy(() => InvoiceCreateWithoutServiceReqInputObjectSchema), z.lazy(() => InvoiceUncheckedCreateWithoutServiceReqInputObjectSchema)])
}).strict();
export const InvoiceUpsertWithWhereUniqueWithoutServiceReqInputObjectSchema: z.ZodType<Prisma.InvoiceUpsertWithWhereUniqueWithoutServiceReqInput> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceUpsertWithWhereUniqueWithoutServiceReqInput>;
export const InvoiceUpsertWithWhereUniqueWithoutServiceReqInputObjectZodSchema = makeSchema();
