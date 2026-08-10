import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestActivityWhereUniqueInputObjectSchema as PurchaseRequestActivityWhereUniqueInputObjectSchema } from './PurchaseRequestActivityWhereUniqueInput.schema';
import { PurchaseRequestActivityCreateWithoutPurchaseRequestInputObjectSchema as PurchaseRequestActivityCreateWithoutPurchaseRequestInputObjectSchema } from './PurchaseRequestActivityCreateWithoutPurchaseRequestInput.schema';
import { PurchaseRequestActivityUncheckedCreateWithoutPurchaseRequestInputObjectSchema as PurchaseRequestActivityUncheckedCreateWithoutPurchaseRequestInputObjectSchema } from './PurchaseRequestActivityUncheckedCreateWithoutPurchaseRequestInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => PurchaseRequestActivityWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => PurchaseRequestActivityCreateWithoutPurchaseRequestInputObjectSchema), z.lazy(() => PurchaseRequestActivityUncheckedCreateWithoutPurchaseRequestInputObjectSchema)])
}).strict();
export const PurchaseRequestActivityCreateOrConnectWithoutPurchaseRequestInputObjectSchema: z.ZodType<Prisma.PurchaseRequestActivityCreateOrConnectWithoutPurchaseRequestInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestActivityCreateOrConnectWithoutPurchaseRequestInput>;
export const PurchaseRequestActivityCreateOrConnectWithoutPurchaseRequestInputObjectZodSchema = makeSchema();
