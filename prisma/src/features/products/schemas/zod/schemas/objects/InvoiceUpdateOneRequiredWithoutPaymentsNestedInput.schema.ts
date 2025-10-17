import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceCreateWithoutPaymentsInputObjectSchema as InvoiceCreateWithoutPaymentsInputObjectSchema } from './InvoiceCreateWithoutPaymentsInput.schema';
import { InvoiceUncheckedCreateWithoutPaymentsInputObjectSchema as InvoiceUncheckedCreateWithoutPaymentsInputObjectSchema } from './InvoiceUncheckedCreateWithoutPaymentsInput.schema';
import { InvoiceCreateOrConnectWithoutPaymentsInputObjectSchema as InvoiceCreateOrConnectWithoutPaymentsInputObjectSchema } from './InvoiceCreateOrConnectWithoutPaymentsInput.schema';
import { InvoiceUpsertWithoutPaymentsInputObjectSchema as InvoiceUpsertWithoutPaymentsInputObjectSchema } from './InvoiceUpsertWithoutPaymentsInput.schema';
import { InvoiceWhereUniqueInputObjectSchema as InvoiceWhereUniqueInputObjectSchema } from './InvoiceWhereUniqueInput.schema';
import { InvoiceUpdateToOneWithWhereWithoutPaymentsInputObjectSchema as InvoiceUpdateToOneWithWhereWithoutPaymentsInputObjectSchema } from './InvoiceUpdateToOneWithWhereWithoutPaymentsInput.schema';
import { InvoiceUpdateWithoutPaymentsInputObjectSchema as InvoiceUpdateWithoutPaymentsInputObjectSchema } from './InvoiceUpdateWithoutPaymentsInput.schema';
import { InvoiceUncheckedUpdateWithoutPaymentsInputObjectSchema as InvoiceUncheckedUpdateWithoutPaymentsInputObjectSchema } from './InvoiceUncheckedUpdateWithoutPaymentsInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => InvoiceCreateWithoutPaymentsInputObjectSchema), z.lazy(() => InvoiceUncheckedCreateWithoutPaymentsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => InvoiceCreateOrConnectWithoutPaymentsInputObjectSchema).optional(),
  upsert: z.lazy(() => InvoiceUpsertWithoutPaymentsInputObjectSchema).optional(),
  connect: z.lazy(() => InvoiceWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => InvoiceUpdateToOneWithWhereWithoutPaymentsInputObjectSchema), z.lazy(() => InvoiceUpdateWithoutPaymentsInputObjectSchema), z.lazy(() => InvoiceUncheckedUpdateWithoutPaymentsInputObjectSchema)]).optional()
}).strict();
export const InvoiceUpdateOneRequiredWithoutPaymentsNestedInputObjectSchema: z.ZodType<Prisma.InvoiceUpdateOneRequiredWithoutPaymentsNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceUpdateOneRequiredWithoutPaymentsNestedInput>;
export const InvoiceUpdateOneRequiredWithoutPaymentsNestedInputObjectZodSchema = makeSchema();
