import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceWhereUniqueInputObjectSchema as InvoiceWhereUniqueInputObjectSchema } from './InvoiceWhereUniqueInput.schema';
import { InvoiceUpdateWithoutServiceRequestInputObjectSchema as InvoiceUpdateWithoutServiceRequestInputObjectSchema } from './InvoiceUpdateWithoutServiceRequestInput.schema';
import { InvoiceUncheckedUpdateWithoutServiceRequestInputObjectSchema as InvoiceUncheckedUpdateWithoutServiceRequestInputObjectSchema } from './InvoiceUncheckedUpdateWithoutServiceRequestInput.schema';
import { InvoiceCreateWithoutServiceRequestInputObjectSchema as InvoiceCreateWithoutServiceRequestInputObjectSchema } from './InvoiceCreateWithoutServiceRequestInput.schema';
import { InvoiceUncheckedCreateWithoutServiceRequestInputObjectSchema as InvoiceUncheckedCreateWithoutServiceRequestInputObjectSchema } from './InvoiceUncheckedCreateWithoutServiceRequestInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => InvoiceWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => InvoiceUpdateWithoutServiceRequestInputObjectSchema), z.lazy(() => InvoiceUncheckedUpdateWithoutServiceRequestInputObjectSchema)]),
  create: z.union([z.lazy(() => InvoiceCreateWithoutServiceRequestInputObjectSchema), z.lazy(() => InvoiceUncheckedCreateWithoutServiceRequestInputObjectSchema)])
}).strict();
export const InvoiceUpsertWithWhereUniqueWithoutServiceRequestInputObjectSchema: z.ZodType<Prisma.InvoiceUpsertWithWhereUniqueWithoutServiceRequestInput> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceUpsertWithWhereUniqueWithoutServiceRequestInput>;
export const InvoiceUpsertWithWhereUniqueWithoutServiceRequestInputObjectZodSchema = makeSchema();
