import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestCreateWithoutIngressReceiptsInputObjectSchema as PurchaseRequestCreateWithoutIngressReceiptsInputObjectSchema } from './PurchaseRequestCreateWithoutIngressReceiptsInput.schema';
import { PurchaseRequestUncheckedCreateWithoutIngressReceiptsInputObjectSchema as PurchaseRequestUncheckedCreateWithoutIngressReceiptsInputObjectSchema } from './PurchaseRequestUncheckedCreateWithoutIngressReceiptsInput.schema';
import { PurchaseRequestCreateOrConnectWithoutIngressReceiptsInputObjectSchema as PurchaseRequestCreateOrConnectWithoutIngressReceiptsInputObjectSchema } from './PurchaseRequestCreateOrConnectWithoutIngressReceiptsInput.schema';
import { PurchaseRequestUpsertWithoutIngressReceiptsInputObjectSchema as PurchaseRequestUpsertWithoutIngressReceiptsInputObjectSchema } from './PurchaseRequestUpsertWithoutIngressReceiptsInput.schema';
import { PurchaseRequestWhereUniqueInputObjectSchema as PurchaseRequestWhereUniqueInputObjectSchema } from './PurchaseRequestWhereUniqueInput.schema';
import { PurchaseRequestUpdateToOneWithWhereWithoutIngressReceiptsInputObjectSchema as PurchaseRequestUpdateToOneWithWhereWithoutIngressReceiptsInputObjectSchema } from './PurchaseRequestUpdateToOneWithWhereWithoutIngressReceiptsInput.schema';
import { PurchaseRequestUpdateWithoutIngressReceiptsInputObjectSchema as PurchaseRequestUpdateWithoutIngressReceiptsInputObjectSchema } from './PurchaseRequestUpdateWithoutIngressReceiptsInput.schema';
import { PurchaseRequestUncheckedUpdateWithoutIngressReceiptsInputObjectSchema as PurchaseRequestUncheckedUpdateWithoutIngressReceiptsInputObjectSchema } from './PurchaseRequestUncheckedUpdateWithoutIngressReceiptsInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => PurchaseRequestCreateWithoutIngressReceiptsInputObjectSchema), z.lazy(() => PurchaseRequestUncheckedCreateWithoutIngressReceiptsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => PurchaseRequestCreateOrConnectWithoutIngressReceiptsInputObjectSchema).optional(),
  upsert: z.lazy(() => PurchaseRequestUpsertWithoutIngressReceiptsInputObjectSchema).optional(),
  connect: z.lazy(() => PurchaseRequestWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => PurchaseRequestUpdateToOneWithWhereWithoutIngressReceiptsInputObjectSchema), z.lazy(() => PurchaseRequestUpdateWithoutIngressReceiptsInputObjectSchema), z.lazy(() => PurchaseRequestUncheckedUpdateWithoutIngressReceiptsInputObjectSchema)]).optional()
}).strict();
export const PurchaseRequestUpdateOneRequiredWithoutIngressReceiptsNestedInputObjectSchema: z.ZodType<Prisma.PurchaseRequestUpdateOneRequiredWithoutIngressReceiptsNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestUpdateOneRequiredWithoutIngressReceiptsNestedInput>;
export const PurchaseRequestUpdateOneRequiredWithoutIngressReceiptsNestedInputObjectZodSchema = makeSchema();
