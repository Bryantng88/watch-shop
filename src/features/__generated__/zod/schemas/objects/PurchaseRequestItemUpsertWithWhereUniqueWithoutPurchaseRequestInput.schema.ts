import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestItemWhereUniqueInputObjectSchema as PurchaseRequestItemWhereUniqueInputObjectSchema } from './PurchaseRequestItemWhereUniqueInput.schema';
import { PurchaseRequestItemUpdateWithoutPurchaseRequestInputObjectSchema as PurchaseRequestItemUpdateWithoutPurchaseRequestInputObjectSchema } from './PurchaseRequestItemUpdateWithoutPurchaseRequestInput.schema';
import { PurchaseRequestItemUncheckedUpdateWithoutPurchaseRequestInputObjectSchema as PurchaseRequestItemUncheckedUpdateWithoutPurchaseRequestInputObjectSchema } from './PurchaseRequestItemUncheckedUpdateWithoutPurchaseRequestInput.schema';
import { PurchaseRequestItemCreateWithoutPurchaseRequestInputObjectSchema as PurchaseRequestItemCreateWithoutPurchaseRequestInputObjectSchema } from './PurchaseRequestItemCreateWithoutPurchaseRequestInput.schema';
import { PurchaseRequestItemUncheckedCreateWithoutPurchaseRequestInputObjectSchema as PurchaseRequestItemUncheckedCreateWithoutPurchaseRequestInputObjectSchema } from './PurchaseRequestItemUncheckedCreateWithoutPurchaseRequestInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => PurchaseRequestItemWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => PurchaseRequestItemUpdateWithoutPurchaseRequestInputObjectSchema), z.lazy(() => PurchaseRequestItemUncheckedUpdateWithoutPurchaseRequestInputObjectSchema)]),
  create: z.union([z.lazy(() => PurchaseRequestItemCreateWithoutPurchaseRequestInputObjectSchema), z.lazy(() => PurchaseRequestItemUncheckedCreateWithoutPurchaseRequestInputObjectSchema)])
}).strict();
export const PurchaseRequestItemUpsertWithWhereUniqueWithoutPurchaseRequestInputObjectSchema: z.ZodType<Prisma.PurchaseRequestItemUpsertWithWhereUniqueWithoutPurchaseRequestInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestItemUpsertWithWhereUniqueWithoutPurchaseRequestInput>;
export const PurchaseRequestItemUpsertWithWhereUniqueWithoutPurchaseRequestInputObjectZodSchema = makeSchema();
