import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestUpdateWithoutItemsInputObjectSchema as PurchaseRequestUpdateWithoutItemsInputObjectSchema } from './PurchaseRequestUpdateWithoutItemsInput.schema';
import { PurchaseRequestUncheckedUpdateWithoutItemsInputObjectSchema as PurchaseRequestUncheckedUpdateWithoutItemsInputObjectSchema } from './PurchaseRequestUncheckedUpdateWithoutItemsInput.schema';
import { PurchaseRequestCreateWithoutItemsInputObjectSchema as PurchaseRequestCreateWithoutItemsInputObjectSchema } from './PurchaseRequestCreateWithoutItemsInput.schema';
import { PurchaseRequestUncheckedCreateWithoutItemsInputObjectSchema as PurchaseRequestUncheckedCreateWithoutItemsInputObjectSchema } from './PurchaseRequestUncheckedCreateWithoutItemsInput.schema';
import { PurchaseRequestWhereInputObjectSchema as PurchaseRequestWhereInputObjectSchema } from './PurchaseRequestWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => PurchaseRequestUpdateWithoutItemsInputObjectSchema), z.lazy(() => PurchaseRequestUncheckedUpdateWithoutItemsInputObjectSchema)]),
  create: z.union([z.lazy(() => PurchaseRequestCreateWithoutItemsInputObjectSchema), z.lazy(() => PurchaseRequestUncheckedCreateWithoutItemsInputObjectSchema)]),
  where: z.lazy(() => PurchaseRequestWhereInputObjectSchema).optional()
}).strict();
export const PurchaseRequestUpsertWithoutItemsInputObjectSchema: z.ZodType<Prisma.PurchaseRequestUpsertWithoutItemsInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestUpsertWithoutItemsInput>;
export const PurchaseRequestUpsertWithoutItemsInputObjectZodSchema = makeSchema();
