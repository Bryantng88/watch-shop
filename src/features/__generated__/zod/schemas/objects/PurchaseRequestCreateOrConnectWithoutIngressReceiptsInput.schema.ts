import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestWhereUniqueInputObjectSchema as PurchaseRequestWhereUniqueInputObjectSchema } from './PurchaseRequestWhereUniqueInput.schema';
import { PurchaseRequestCreateWithoutIngressReceiptsInputObjectSchema as PurchaseRequestCreateWithoutIngressReceiptsInputObjectSchema } from './PurchaseRequestCreateWithoutIngressReceiptsInput.schema';
import { PurchaseRequestUncheckedCreateWithoutIngressReceiptsInputObjectSchema as PurchaseRequestUncheckedCreateWithoutIngressReceiptsInputObjectSchema } from './PurchaseRequestUncheckedCreateWithoutIngressReceiptsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => PurchaseRequestWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => PurchaseRequestCreateWithoutIngressReceiptsInputObjectSchema), z.lazy(() => PurchaseRequestUncheckedCreateWithoutIngressReceiptsInputObjectSchema)])
}).strict();
export const PurchaseRequestCreateOrConnectWithoutIngressReceiptsInputObjectSchema: z.ZodType<Prisma.PurchaseRequestCreateOrConnectWithoutIngressReceiptsInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestCreateOrConnectWithoutIngressReceiptsInput>;
export const PurchaseRequestCreateOrConnectWithoutIngressReceiptsInputObjectZodSchema = makeSchema();
