import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestItemWhereUniqueInputObjectSchema as PurchaseRequestItemWhereUniqueInputObjectSchema } from './PurchaseRequestItemWhereUniqueInput.schema';
import { PurchaseRequestItemCreateWithoutPurchaseRequestInputObjectSchema as PurchaseRequestItemCreateWithoutPurchaseRequestInputObjectSchema } from './PurchaseRequestItemCreateWithoutPurchaseRequestInput.schema';
import { PurchaseRequestItemUncheckedCreateWithoutPurchaseRequestInputObjectSchema as PurchaseRequestItemUncheckedCreateWithoutPurchaseRequestInputObjectSchema } from './PurchaseRequestItemUncheckedCreateWithoutPurchaseRequestInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => PurchaseRequestItemWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => PurchaseRequestItemCreateWithoutPurchaseRequestInputObjectSchema), z.lazy(() => PurchaseRequestItemUncheckedCreateWithoutPurchaseRequestInputObjectSchema)])
}).strict();
export const PurchaseRequestItemCreateOrConnectWithoutPurchaseRequestInputObjectSchema: z.ZodType<Prisma.PurchaseRequestItemCreateOrConnectWithoutPurchaseRequestInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestItemCreateOrConnectWithoutPurchaseRequestInput>;
export const PurchaseRequestItemCreateOrConnectWithoutPurchaseRequestInputObjectZodSchema = makeSchema();
