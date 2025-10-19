import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceCreateWithoutItemsInputObjectSchema as InvoiceCreateWithoutItemsInputObjectSchema } from './InvoiceCreateWithoutItemsInput.schema';
import { InvoiceUncheckedCreateWithoutItemsInputObjectSchema as InvoiceUncheckedCreateWithoutItemsInputObjectSchema } from './InvoiceUncheckedCreateWithoutItemsInput.schema';
import { InvoiceCreateOrConnectWithoutItemsInputObjectSchema as InvoiceCreateOrConnectWithoutItemsInputObjectSchema } from './InvoiceCreateOrConnectWithoutItemsInput.schema';
import { InvoiceUpsertWithoutItemsInputObjectSchema as InvoiceUpsertWithoutItemsInputObjectSchema } from './InvoiceUpsertWithoutItemsInput.schema';
import { InvoiceWhereUniqueInputObjectSchema as InvoiceWhereUniqueInputObjectSchema } from './InvoiceWhereUniqueInput.schema';
import { InvoiceUpdateToOneWithWhereWithoutItemsInputObjectSchema as InvoiceUpdateToOneWithWhereWithoutItemsInputObjectSchema } from './InvoiceUpdateToOneWithWhereWithoutItemsInput.schema';
import { InvoiceUpdateWithoutItemsInputObjectSchema as InvoiceUpdateWithoutItemsInputObjectSchema } from './InvoiceUpdateWithoutItemsInput.schema';
import { InvoiceUncheckedUpdateWithoutItemsInputObjectSchema as InvoiceUncheckedUpdateWithoutItemsInputObjectSchema } from './InvoiceUncheckedUpdateWithoutItemsInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => InvoiceCreateWithoutItemsInputObjectSchema), z.lazy(() => InvoiceUncheckedCreateWithoutItemsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => InvoiceCreateOrConnectWithoutItemsInputObjectSchema).optional(),
  upsert: z.lazy(() => InvoiceUpsertWithoutItemsInputObjectSchema).optional(),
  connect: z.lazy(() => InvoiceWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => InvoiceUpdateToOneWithWhereWithoutItemsInputObjectSchema), z.lazy(() => InvoiceUpdateWithoutItemsInputObjectSchema), z.lazy(() => InvoiceUncheckedUpdateWithoutItemsInputObjectSchema)]).optional()
}).strict();
export const InvoiceUpdateOneRequiredWithoutItemsNestedInputObjectSchema: z.ZodType<Prisma.InvoiceUpdateOneRequiredWithoutItemsNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceUpdateOneRequiredWithoutItemsNestedInput>;
export const InvoiceUpdateOneRequiredWithoutItemsNestedInputObjectZodSchema = makeSchema();
