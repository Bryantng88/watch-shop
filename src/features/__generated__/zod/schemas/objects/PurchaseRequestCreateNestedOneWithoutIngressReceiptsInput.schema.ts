import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestCreateWithoutIngressReceiptsInputObjectSchema as PurchaseRequestCreateWithoutIngressReceiptsInputObjectSchema } from './PurchaseRequestCreateWithoutIngressReceiptsInput.schema';
import { PurchaseRequestUncheckedCreateWithoutIngressReceiptsInputObjectSchema as PurchaseRequestUncheckedCreateWithoutIngressReceiptsInputObjectSchema } from './PurchaseRequestUncheckedCreateWithoutIngressReceiptsInput.schema';
import { PurchaseRequestCreateOrConnectWithoutIngressReceiptsInputObjectSchema as PurchaseRequestCreateOrConnectWithoutIngressReceiptsInputObjectSchema } from './PurchaseRequestCreateOrConnectWithoutIngressReceiptsInput.schema';
import { PurchaseRequestWhereUniqueInputObjectSchema as PurchaseRequestWhereUniqueInputObjectSchema } from './PurchaseRequestWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => PurchaseRequestCreateWithoutIngressReceiptsInputObjectSchema), z.lazy(() => PurchaseRequestUncheckedCreateWithoutIngressReceiptsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => PurchaseRequestCreateOrConnectWithoutIngressReceiptsInputObjectSchema).optional(),
  connect: z.lazy(() => PurchaseRequestWhereUniqueInputObjectSchema).optional()
}).strict();
export const PurchaseRequestCreateNestedOneWithoutIngressReceiptsInputObjectSchema: z.ZodType<Prisma.PurchaseRequestCreateNestedOneWithoutIngressReceiptsInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestCreateNestedOneWithoutIngressReceiptsInput>;
export const PurchaseRequestCreateNestedOneWithoutIngressReceiptsInputObjectZodSchema = makeSchema();
