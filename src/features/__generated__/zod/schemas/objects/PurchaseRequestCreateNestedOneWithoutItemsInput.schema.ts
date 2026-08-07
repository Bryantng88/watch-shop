import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestCreateWithoutItemsInputObjectSchema as PurchaseRequestCreateWithoutItemsInputObjectSchema } from './PurchaseRequestCreateWithoutItemsInput.schema';
import { PurchaseRequestUncheckedCreateWithoutItemsInputObjectSchema as PurchaseRequestUncheckedCreateWithoutItemsInputObjectSchema } from './PurchaseRequestUncheckedCreateWithoutItemsInput.schema';
import { PurchaseRequestCreateOrConnectWithoutItemsInputObjectSchema as PurchaseRequestCreateOrConnectWithoutItemsInputObjectSchema } from './PurchaseRequestCreateOrConnectWithoutItemsInput.schema';
import { PurchaseRequestWhereUniqueInputObjectSchema as PurchaseRequestWhereUniqueInputObjectSchema } from './PurchaseRequestWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => PurchaseRequestCreateWithoutItemsInputObjectSchema), z.lazy(() => PurchaseRequestUncheckedCreateWithoutItemsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => PurchaseRequestCreateOrConnectWithoutItemsInputObjectSchema).optional(),
  connect: z.lazy(() => PurchaseRequestWhereUniqueInputObjectSchema).optional()
}).strict();
export const PurchaseRequestCreateNestedOneWithoutItemsInputObjectSchema: z.ZodType<Prisma.PurchaseRequestCreateNestedOneWithoutItemsInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestCreateNestedOneWithoutItemsInput>;
export const PurchaseRequestCreateNestedOneWithoutItemsInputObjectZodSchema = makeSchema();
