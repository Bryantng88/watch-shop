import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestItemScalarWhereInputObjectSchema as PurchaseRequestItemScalarWhereInputObjectSchema } from './PurchaseRequestItemScalarWhereInput.schema';
import { PurchaseRequestItemUpdateManyMutationInputObjectSchema as PurchaseRequestItemUpdateManyMutationInputObjectSchema } from './PurchaseRequestItemUpdateManyMutationInput.schema';
import { PurchaseRequestItemUncheckedUpdateManyWithoutProductInputObjectSchema as PurchaseRequestItemUncheckedUpdateManyWithoutProductInputObjectSchema } from './PurchaseRequestItemUncheckedUpdateManyWithoutProductInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => PurchaseRequestItemScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => PurchaseRequestItemUpdateManyMutationInputObjectSchema), z.lazy(() => PurchaseRequestItemUncheckedUpdateManyWithoutProductInputObjectSchema)])
}).strict();
export const PurchaseRequestItemUpdateManyWithWhereWithoutProductInputObjectSchema: z.ZodType<Prisma.PurchaseRequestItemUpdateManyWithWhereWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestItemUpdateManyWithWhereWithoutProductInput>;
export const PurchaseRequestItemUpdateManyWithWhereWithoutProductInputObjectZodSchema = makeSchema();
