import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestUpdateWithoutIngressReceiptsInputObjectSchema as PurchaseRequestUpdateWithoutIngressReceiptsInputObjectSchema } from './PurchaseRequestUpdateWithoutIngressReceiptsInput.schema';
import { PurchaseRequestUncheckedUpdateWithoutIngressReceiptsInputObjectSchema as PurchaseRequestUncheckedUpdateWithoutIngressReceiptsInputObjectSchema } from './PurchaseRequestUncheckedUpdateWithoutIngressReceiptsInput.schema';
import { PurchaseRequestCreateWithoutIngressReceiptsInputObjectSchema as PurchaseRequestCreateWithoutIngressReceiptsInputObjectSchema } from './PurchaseRequestCreateWithoutIngressReceiptsInput.schema';
import { PurchaseRequestUncheckedCreateWithoutIngressReceiptsInputObjectSchema as PurchaseRequestUncheckedCreateWithoutIngressReceiptsInputObjectSchema } from './PurchaseRequestUncheckedCreateWithoutIngressReceiptsInput.schema';
import { PurchaseRequestWhereInputObjectSchema as PurchaseRequestWhereInputObjectSchema } from './PurchaseRequestWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => PurchaseRequestUpdateWithoutIngressReceiptsInputObjectSchema), z.lazy(() => PurchaseRequestUncheckedUpdateWithoutIngressReceiptsInputObjectSchema)]),
  create: z.union([z.lazy(() => PurchaseRequestCreateWithoutIngressReceiptsInputObjectSchema), z.lazy(() => PurchaseRequestUncheckedCreateWithoutIngressReceiptsInputObjectSchema)]),
  where: z.lazy(() => PurchaseRequestWhereInputObjectSchema).optional()
}).strict();
export const PurchaseRequestUpsertWithoutIngressReceiptsInputObjectSchema: z.ZodType<Prisma.PurchaseRequestUpsertWithoutIngressReceiptsInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestUpsertWithoutIngressReceiptsInput>;
export const PurchaseRequestUpsertWithoutIngressReceiptsInputObjectZodSchema = makeSchema();
