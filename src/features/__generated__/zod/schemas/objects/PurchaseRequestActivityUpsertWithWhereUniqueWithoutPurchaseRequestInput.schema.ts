import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestActivityWhereUniqueInputObjectSchema as PurchaseRequestActivityWhereUniqueInputObjectSchema } from './PurchaseRequestActivityWhereUniqueInput.schema';
import { PurchaseRequestActivityUpdateWithoutPurchaseRequestInputObjectSchema as PurchaseRequestActivityUpdateWithoutPurchaseRequestInputObjectSchema } from './PurchaseRequestActivityUpdateWithoutPurchaseRequestInput.schema';
import { PurchaseRequestActivityUncheckedUpdateWithoutPurchaseRequestInputObjectSchema as PurchaseRequestActivityUncheckedUpdateWithoutPurchaseRequestInputObjectSchema } from './PurchaseRequestActivityUncheckedUpdateWithoutPurchaseRequestInput.schema';
import { PurchaseRequestActivityCreateWithoutPurchaseRequestInputObjectSchema as PurchaseRequestActivityCreateWithoutPurchaseRequestInputObjectSchema } from './PurchaseRequestActivityCreateWithoutPurchaseRequestInput.schema';
import { PurchaseRequestActivityUncheckedCreateWithoutPurchaseRequestInputObjectSchema as PurchaseRequestActivityUncheckedCreateWithoutPurchaseRequestInputObjectSchema } from './PurchaseRequestActivityUncheckedCreateWithoutPurchaseRequestInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => PurchaseRequestActivityWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => PurchaseRequestActivityUpdateWithoutPurchaseRequestInputObjectSchema), z.lazy(() => PurchaseRequestActivityUncheckedUpdateWithoutPurchaseRequestInputObjectSchema)]),
  create: z.union([z.lazy(() => PurchaseRequestActivityCreateWithoutPurchaseRequestInputObjectSchema), z.lazy(() => PurchaseRequestActivityUncheckedCreateWithoutPurchaseRequestInputObjectSchema)])
}).strict();
export const PurchaseRequestActivityUpsertWithWhereUniqueWithoutPurchaseRequestInputObjectSchema: z.ZodType<Prisma.PurchaseRequestActivityUpsertWithWhereUniqueWithoutPurchaseRequestInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestActivityUpsertWithWhereUniqueWithoutPurchaseRequestInput>;
export const PurchaseRequestActivityUpsertWithWhereUniqueWithoutPurchaseRequestInputObjectZodSchema = makeSchema();
