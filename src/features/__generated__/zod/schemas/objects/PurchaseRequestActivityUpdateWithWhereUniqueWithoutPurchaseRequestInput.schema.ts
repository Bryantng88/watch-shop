import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestActivityWhereUniqueInputObjectSchema as PurchaseRequestActivityWhereUniqueInputObjectSchema } from './PurchaseRequestActivityWhereUniqueInput.schema';
import { PurchaseRequestActivityUpdateWithoutPurchaseRequestInputObjectSchema as PurchaseRequestActivityUpdateWithoutPurchaseRequestInputObjectSchema } from './PurchaseRequestActivityUpdateWithoutPurchaseRequestInput.schema';
import { PurchaseRequestActivityUncheckedUpdateWithoutPurchaseRequestInputObjectSchema as PurchaseRequestActivityUncheckedUpdateWithoutPurchaseRequestInputObjectSchema } from './PurchaseRequestActivityUncheckedUpdateWithoutPurchaseRequestInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => PurchaseRequestActivityWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => PurchaseRequestActivityUpdateWithoutPurchaseRequestInputObjectSchema), z.lazy(() => PurchaseRequestActivityUncheckedUpdateWithoutPurchaseRequestInputObjectSchema)])
}).strict();
export const PurchaseRequestActivityUpdateWithWhereUniqueWithoutPurchaseRequestInputObjectSchema: z.ZodType<Prisma.PurchaseRequestActivityUpdateWithWhereUniqueWithoutPurchaseRequestInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestActivityUpdateWithWhereUniqueWithoutPurchaseRequestInput>;
export const PurchaseRequestActivityUpdateWithWhereUniqueWithoutPurchaseRequestInputObjectZodSchema = makeSchema();
