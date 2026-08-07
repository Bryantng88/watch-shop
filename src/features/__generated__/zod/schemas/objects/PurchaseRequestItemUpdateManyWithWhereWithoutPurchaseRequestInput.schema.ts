import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestItemScalarWhereInputObjectSchema as PurchaseRequestItemScalarWhereInputObjectSchema } from './PurchaseRequestItemScalarWhereInput.schema';
import { PurchaseRequestItemUpdateManyMutationInputObjectSchema as PurchaseRequestItemUpdateManyMutationInputObjectSchema } from './PurchaseRequestItemUpdateManyMutationInput.schema';
import { PurchaseRequestItemUncheckedUpdateManyWithoutPurchaseRequestInputObjectSchema as PurchaseRequestItemUncheckedUpdateManyWithoutPurchaseRequestInputObjectSchema } from './PurchaseRequestItemUncheckedUpdateManyWithoutPurchaseRequestInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => PurchaseRequestItemScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => PurchaseRequestItemUpdateManyMutationInputObjectSchema), z.lazy(() => PurchaseRequestItemUncheckedUpdateManyWithoutPurchaseRequestInputObjectSchema)])
}).strict();
export const PurchaseRequestItemUpdateManyWithWhereWithoutPurchaseRequestInputObjectSchema: z.ZodType<Prisma.PurchaseRequestItemUpdateManyWithWhereWithoutPurchaseRequestInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestItemUpdateManyWithWhereWithoutPurchaseRequestInput>;
export const PurchaseRequestItemUpdateManyWithWhereWithoutPurchaseRequestInputObjectZodSchema = makeSchema();
