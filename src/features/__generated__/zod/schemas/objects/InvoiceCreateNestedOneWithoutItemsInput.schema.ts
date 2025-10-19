import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceCreateWithoutItemsInputObjectSchema as InvoiceCreateWithoutItemsInputObjectSchema } from './InvoiceCreateWithoutItemsInput.schema';
import { InvoiceUncheckedCreateWithoutItemsInputObjectSchema as InvoiceUncheckedCreateWithoutItemsInputObjectSchema } from './InvoiceUncheckedCreateWithoutItemsInput.schema';
import { InvoiceCreateOrConnectWithoutItemsInputObjectSchema as InvoiceCreateOrConnectWithoutItemsInputObjectSchema } from './InvoiceCreateOrConnectWithoutItemsInput.schema';
import { InvoiceWhereUniqueInputObjectSchema as InvoiceWhereUniqueInputObjectSchema } from './InvoiceWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => InvoiceCreateWithoutItemsInputObjectSchema), z.lazy(() => InvoiceUncheckedCreateWithoutItemsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => InvoiceCreateOrConnectWithoutItemsInputObjectSchema).optional(),
  connect: z.lazy(() => InvoiceWhereUniqueInputObjectSchema).optional()
}).strict();
export const InvoiceCreateNestedOneWithoutItemsInputObjectSchema: z.ZodType<Prisma.InvoiceCreateNestedOneWithoutItemsInput> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceCreateNestedOneWithoutItemsInput>;
export const InvoiceCreateNestedOneWithoutItemsInputObjectZodSchema = makeSchema();
