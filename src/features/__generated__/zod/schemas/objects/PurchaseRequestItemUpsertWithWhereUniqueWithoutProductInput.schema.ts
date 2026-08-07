import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestItemWhereUniqueInputObjectSchema as PurchaseRequestItemWhereUniqueInputObjectSchema } from './PurchaseRequestItemWhereUniqueInput.schema';
import { PurchaseRequestItemUpdateWithoutProductInputObjectSchema as PurchaseRequestItemUpdateWithoutProductInputObjectSchema } from './PurchaseRequestItemUpdateWithoutProductInput.schema';
import { PurchaseRequestItemUncheckedUpdateWithoutProductInputObjectSchema as PurchaseRequestItemUncheckedUpdateWithoutProductInputObjectSchema } from './PurchaseRequestItemUncheckedUpdateWithoutProductInput.schema';
import { PurchaseRequestItemCreateWithoutProductInputObjectSchema as PurchaseRequestItemCreateWithoutProductInputObjectSchema } from './PurchaseRequestItemCreateWithoutProductInput.schema';
import { PurchaseRequestItemUncheckedCreateWithoutProductInputObjectSchema as PurchaseRequestItemUncheckedCreateWithoutProductInputObjectSchema } from './PurchaseRequestItemUncheckedCreateWithoutProductInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => PurchaseRequestItemWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => PurchaseRequestItemUpdateWithoutProductInputObjectSchema), z.lazy(() => PurchaseRequestItemUncheckedUpdateWithoutProductInputObjectSchema)]),
  create: z.union([z.lazy(() => PurchaseRequestItemCreateWithoutProductInputObjectSchema), z.lazy(() => PurchaseRequestItemUncheckedCreateWithoutProductInputObjectSchema)])
}).strict();
export const PurchaseRequestItemUpsertWithWhereUniqueWithoutProductInputObjectSchema: z.ZodType<Prisma.PurchaseRequestItemUpsertWithWhereUniqueWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestItemUpsertWithWhereUniqueWithoutProductInput>;
export const PurchaseRequestItemUpsertWithWhereUniqueWithoutProductInputObjectZodSchema = makeSchema();
