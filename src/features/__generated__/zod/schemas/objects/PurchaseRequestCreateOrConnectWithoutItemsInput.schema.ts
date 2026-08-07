import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestWhereUniqueInputObjectSchema as PurchaseRequestWhereUniqueInputObjectSchema } from './PurchaseRequestWhereUniqueInput.schema';
import { PurchaseRequestCreateWithoutItemsInputObjectSchema as PurchaseRequestCreateWithoutItemsInputObjectSchema } from './PurchaseRequestCreateWithoutItemsInput.schema';
import { PurchaseRequestUncheckedCreateWithoutItemsInputObjectSchema as PurchaseRequestUncheckedCreateWithoutItemsInputObjectSchema } from './PurchaseRequestUncheckedCreateWithoutItemsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => PurchaseRequestWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => PurchaseRequestCreateWithoutItemsInputObjectSchema), z.lazy(() => PurchaseRequestUncheckedCreateWithoutItemsInputObjectSchema)])
}).strict();
export const PurchaseRequestCreateOrConnectWithoutItemsInputObjectSchema: z.ZodType<Prisma.PurchaseRequestCreateOrConnectWithoutItemsInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestCreateOrConnectWithoutItemsInput>;
export const PurchaseRequestCreateOrConnectWithoutItemsInputObjectZodSchema = makeSchema();
