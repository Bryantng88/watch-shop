import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestItemWhereUniqueInputObjectSchema as PurchaseRequestItemWhereUniqueInputObjectSchema } from './PurchaseRequestItemWhereUniqueInput.schema';
import { PurchaseRequestItemCreateWithoutProductInputObjectSchema as PurchaseRequestItemCreateWithoutProductInputObjectSchema } from './PurchaseRequestItemCreateWithoutProductInput.schema';
import { PurchaseRequestItemUncheckedCreateWithoutProductInputObjectSchema as PurchaseRequestItemUncheckedCreateWithoutProductInputObjectSchema } from './PurchaseRequestItemUncheckedCreateWithoutProductInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => PurchaseRequestItemWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => PurchaseRequestItemCreateWithoutProductInputObjectSchema), z.lazy(() => PurchaseRequestItemUncheckedCreateWithoutProductInputObjectSchema)])
}).strict();
export const PurchaseRequestItemCreateOrConnectWithoutProductInputObjectSchema: z.ZodType<Prisma.PurchaseRequestItemCreateOrConnectWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestItemCreateOrConnectWithoutProductInput>;
export const PurchaseRequestItemCreateOrConnectWithoutProductInputObjectZodSchema = makeSchema();
