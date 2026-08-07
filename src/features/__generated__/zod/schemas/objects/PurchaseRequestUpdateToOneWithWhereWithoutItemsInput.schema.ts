import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestWhereInputObjectSchema as PurchaseRequestWhereInputObjectSchema } from './PurchaseRequestWhereInput.schema';
import { PurchaseRequestUpdateWithoutItemsInputObjectSchema as PurchaseRequestUpdateWithoutItemsInputObjectSchema } from './PurchaseRequestUpdateWithoutItemsInput.schema';
import { PurchaseRequestUncheckedUpdateWithoutItemsInputObjectSchema as PurchaseRequestUncheckedUpdateWithoutItemsInputObjectSchema } from './PurchaseRequestUncheckedUpdateWithoutItemsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => PurchaseRequestWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => PurchaseRequestUpdateWithoutItemsInputObjectSchema), z.lazy(() => PurchaseRequestUncheckedUpdateWithoutItemsInputObjectSchema)])
}).strict();
export const PurchaseRequestUpdateToOneWithWhereWithoutItemsInputObjectSchema: z.ZodType<Prisma.PurchaseRequestUpdateToOneWithWhereWithoutItemsInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestUpdateToOneWithWhereWithoutItemsInput>;
export const PurchaseRequestUpdateToOneWithWhereWithoutItemsInputObjectZodSchema = makeSchema();
