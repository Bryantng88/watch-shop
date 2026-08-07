import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestCreateWithoutItemsInputObjectSchema as PurchaseRequestCreateWithoutItemsInputObjectSchema } from './PurchaseRequestCreateWithoutItemsInput.schema';
import { PurchaseRequestUncheckedCreateWithoutItemsInputObjectSchema as PurchaseRequestUncheckedCreateWithoutItemsInputObjectSchema } from './PurchaseRequestUncheckedCreateWithoutItemsInput.schema';
import { PurchaseRequestCreateOrConnectWithoutItemsInputObjectSchema as PurchaseRequestCreateOrConnectWithoutItemsInputObjectSchema } from './PurchaseRequestCreateOrConnectWithoutItemsInput.schema';
import { PurchaseRequestUpsertWithoutItemsInputObjectSchema as PurchaseRequestUpsertWithoutItemsInputObjectSchema } from './PurchaseRequestUpsertWithoutItemsInput.schema';
import { PurchaseRequestWhereUniqueInputObjectSchema as PurchaseRequestWhereUniqueInputObjectSchema } from './PurchaseRequestWhereUniqueInput.schema';
import { PurchaseRequestUpdateToOneWithWhereWithoutItemsInputObjectSchema as PurchaseRequestUpdateToOneWithWhereWithoutItemsInputObjectSchema } from './PurchaseRequestUpdateToOneWithWhereWithoutItemsInput.schema';
import { PurchaseRequestUpdateWithoutItemsInputObjectSchema as PurchaseRequestUpdateWithoutItemsInputObjectSchema } from './PurchaseRequestUpdateWithoutItemsInput.schema';
import { PurchaseRequestUncheckedUpdateWithoutItemsInputObjectSchema as PurchaseRequestUncheckedUpdateWithoutItemsInputObjectSchema } from './PurchaseRequestUncheckedUpdateWithoutItemsInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => PurchaseRequestCreateWithoutItemsInputObjectSchema), z.lazy(() => PurchaseRequestUncheckedCreateWithoutItemsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => PurchaseRequestCreateOrConnectWithoutItemsInputObjectSchema).optional(),
  upsert: z.lazy(() => PurchaseRequestUpsertWithoutItemsInputObjectSchema).optional(),
  connect: z.lazy(() => PurchaseRequestWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => PurchaseRequestUpdateToOneWithWhereWithoutItemsInputObjectSchema), z.lazy(() => PurchaseRequestUpdateWithoutItemsInputObjectSchema), z.lazy(() => PurchaseRequestUncheckedUpdateWithoutItemsInputObjectSchema)]).optional()
}).strict();
export const PurchaseRequestUpdateOneRequiredWithoutItemsNestedInputObjectSchema: z.ZodType<Prisma.PurchaseRequestUpdateOneRequiredWithoutItemsNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestUpdateOneRequiredWithoutItemsNestedInput>;
export const PurchaseRequestUpdateOneRequiredWithoutItemsNestedInputObjectZodSchema = makeSchema();
