import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestItemWhereUniqueInputObjectSchema as PurchaseRequestItemWhereUniqueInputObjectSchema } from './PurchaseRequestItemWhereUniqueInput.schema';
import { PurchaseRequestItemUpdateWithoutProductInputObjectSchema as PurchaseRequestItemUpdateWithoutProductInputObjectSchema } from './PurchaseRequestItemUpdateWithoutProductInput.schema';
import { PurchaseRequestItemUncheckedUpdateWithoutProductInputObjectSchema as PurchaseRequestItemUncheckedUpdateWithoutProductInputObjectSchema } from './PurchaseRequestItemUncheckedUpdateWithoutProductInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => PurchaseRequestItemWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => PurchaseRequestItemUpdateWithoutProductInputObjectSchema), z.lazy(() => PurchaseRequestItemUncheckedUpdateWithoutProductInputObjectSchema)])
}).strict();
export const PurchaseRequestItemUpdateWithWhereUniqueWithoutProductInputObjectSchema: z.ZodType<Prisma.PurchaseRequestItemUpdateWithWhereUniqueWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestItemUpdateWithWhereUniqueWithoutProductInput>;
export const PurchaseRequestItemUpdateWithWhereUniqueWithoutProductInputObjectZodSchema = makeSchema();
