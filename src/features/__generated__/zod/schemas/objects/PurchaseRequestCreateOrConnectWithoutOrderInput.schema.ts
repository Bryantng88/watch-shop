import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestWhereUniqueInputObjectSchema as PurchaseRequestWhereUniqueInputObjectSchema } from './PurchaseRequestWhereUniqueInput.schema';
import { PurchaseRequestCreateWithoutOrderInputObjectSchema as PurchaseRequestCreateWithoutOrderInputObjectSchema } from './PurchaseRequestCreateWithoutOrderInput.schema';
import { PurchaseRequestUncheckedCreateWithoutOrderInputObjectSchema as PurchaseRequestUncheckedCreateWithoutOrderInputObjectSchema } from './PurchaseRequestUncheckedCreateWithoutOrderInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => PurchaseRequestWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => PurchaseRequestCreateWithoutOrderInputObjectSchema), z.lazy(() => PurchaseRequestUncheckedCreateWithoutOrderInputObjectSchema)])
}).strict();
export const PurchaseRequestCreateOrConnectWithoutOrderInputObjectSchema: z.ZodType<Prisma.PurchaseRequestCreateOrConnectWithoutOrderInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestCreateOrConnectWithoutOrderInput>;
export const PurchaseRequestCreateOrConnectWithoutOrderInputObjectZodSchema = makeSchema();
