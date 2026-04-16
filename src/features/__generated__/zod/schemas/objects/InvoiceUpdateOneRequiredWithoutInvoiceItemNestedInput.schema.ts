import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceCreateWithoutInvoiceItemInputObjectSchema as InvoiceCreateWithoutInvoiceItemInputObjectSchema } from './InvoiceCreateWithoutInvoiceItemInput.schema';
import { InvoiceUncheckedCreateWithoutInvoiceItemInputObjectSchema as InvoiceUncheckedCreateWithoutInvoiceItemInputObjectSchema } from './InvoiceUncheckedCreateWithoutInvoiceItemInput.schema';
import { InvoiceCreateOrConnectWithoutInvoiceItemInputObjectSchema as InvoiceCreateOrConnectWithoutInvoiceItemInputObjectSchema } from './InvoiceCreateOrConnectWithoutInvoiceItemInput.schema';
import { InvoiceUpsertWithoutInvoiceItemInputObjectSchema as InvoiceUpsertWithoutInvoiceItemInputObjectSchema } from './InvoiceUpsertWithoutInvoiceItemInput.schema';
import { InvoiceWhereUniqueInputObjectSchema as InvoiceWhereUniqueInputObjectSchema } from './InvoiceWhereUniqueInput.schema';
import { InvoiceUpdateToOneWithWhereWithoutInvoiceItemInputObjectSchema as InvoiceUpdateToOneWithWhereWithoutInvoiceItemInputObjectSchema } from './InvoiceUpdateToOneWithWhereWithoutInvoiceItemInput.schema';
import { InvoiceUpdateWithoutInvoiceItemInputObjectSchema as InvoiceUpdateWithoutInvoiceItemInputObjectSchema } from './InvoiceUpdateWithoutInvoiceItemInput.schema';
import { InvoiceUncheckedUpdateWithoutInvoiceItemInputObjectSchema as InvoiceUncheckedUpdateWithoutInvoiceItemInputObjectSchema } from './InvoiceUncheckedUpdateWithoutInvoiceItemInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => InvoiceCreateWithoutInvoiceItemInputObjectSchema), z.lazy(() => InvoiceUncheckedCreateWithoutInvoiceItemInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => InvoiceCreateOrConnectWithoutInvoiceItemInputObjectSchema).optional(),
  upsert: z.lazy(() => InvoiceUpsertWithoutInvoiceItemInputObjectSchema).optional(),
  connect: z.lazy(() => InvoiceWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => InvoiceUpdateToOneWithWhereWithoutInvoiceItemInputObjectSchema), z.lazy(() => InvoiceUpdateWithoutInvoiceItemInputObjectSchema), z.lazy(() => InvoiceUncheckedUpdateWithoutInvoiceItemInputObjectSchema)]).optional()
}).strict();
export const InvoiceUpdateOneRequiredWithoutInvoiceItemNestedInputObjectSchema: z.ZodType<Prisma.InvoiceUpdateOneRequiredWithoutInvoiceItemNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceUpdateOneRequiredWithoutInvoiceItemNestedInput>;
export const InvoiceUpdateOneRequiredWithoutInvoiceItemNestedInputObjectZodSchema = makeSchema();
