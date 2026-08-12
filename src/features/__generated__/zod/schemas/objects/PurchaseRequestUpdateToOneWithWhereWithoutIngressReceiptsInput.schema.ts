import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestWhereInputObjectSchema as PurchaseRequestWhereInputObjectSchema } from './PurchaseRequestWhereInput.schema';
import { PurchaseRequestUpdateWithoutIngressReceiptsInputObjectSchema as PurchaseRequestUpdateWithoutIngressReceiptsInputObjectSchema } from './PurchaseRequestUpdateWithoutIngressReceiptsInput.schema';
import { PurchaseRequestUncheckedUpdateWithoutIngressReceiptsInputObjectSchema as PurchaseRequestUncheckedUpdateWithoutIngressReceiptsInputObjectSchema } from './PurchaseRequestUncheckedUpdateWithoutIngressReceiptsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => PurchaseRequestWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => PurchaseRequestUpdateWithoutIngressReceiptsInputObjectSchema), z.lazy(() => PurchaseRequestUncheckedUpdateWithoutIngressReceiptsInputObjectSchema)])
}).strict();
export const PurchaseRequestUpdateToOneWithWhereWithoutIngressReceiptsInputObjectSchema: z.ZodType<Prisma.PurchaseRequestUpdateToOneWithWhereWithoutIngressReceiptsInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestUpdateToOneWithWhereWithoutIngressReceiptsInput>;
export const PurchaseRequestUpdateToOneWithWhereWithoutIngressReceiptsInputObjectZodSchema = makeSchema();
