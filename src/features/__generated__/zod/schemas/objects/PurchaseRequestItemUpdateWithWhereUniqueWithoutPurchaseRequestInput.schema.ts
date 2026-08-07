import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestItemWhereUniqueInputObjectSchema as PurchaseRequestItemWhereUniqueInputObjectSchema } from './PurchaseRequestItemWhereUniqueInput.schema';
import { PurchaseRequestItemUpdateWithoutPurchaseRequestInputObjectSchema as PurchaseRequestItemUpdateWithoutPurchaseRequestInputObjectSchema } from './PurchaseRequestItemUpdateWithoutPurchaseRequestInput.schema';
import { PurchaseRequestItemUncheckedUpdateWithoutPurchaseRequestInputObjectSchema as PurchaseRequestItemUncheckedUpdateWithoutPurchaseRequestInputObjectSchema } from './PurchaseRequestItemUncheckedUpdateWithoutPurchaseRequestInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => PurchaseRequestItemWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => PurchaseRequestItemUpdateWithoutPurchaseRequestInputObjectSchema), z.lazy(() => PurchaseRequestItemUncheckedUpdateWithoutPurchaseRequestInputObjectSchema)])
}).strict();
export const PurchaseRequestItemUpdateWithWhereUniqueWithoutPurchaseRequestInputObjectSchema: z.ZodType<Prisma.PurchaseRequestItemUpdateWithWhereUniqueWithoutPurchaseRequestInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestItemUpdateWithWhereUniqueWithoutPurchaseRequestInput>;
export const PurchaseRequestItemUpdateWithWhereUniqueWithoutPurchaseRequestInputObjectZodSchema = makeSchema();
