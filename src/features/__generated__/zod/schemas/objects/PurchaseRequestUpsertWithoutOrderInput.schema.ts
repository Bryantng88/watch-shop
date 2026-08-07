import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestUpdateWithoutOrderInputObjectSchema as PurchaseRequestUpdateWithoutOrderInputObjectSchema } from './PurchaseRequestUpdateWithoutOrderInput.schema';
import { PurchaseRequestUncheckedUpdateWithoutOrderInputObjectSchema as PurchaseRequestUncheckedUpdateWithoutOrderInputObjectSchema } from './PurchaseRequestUncheckedUpdateWithoutOrderInput.schema';
import { PurchaseRequestCreateWithoutOrderInputObjectSchema as PurchaseRequestCreateWithoutOrderInputObjectSchema } from './PurchaseRequestCreateWithoutOrderInput.schema';
import { PurchaseRequestUncheckedCreateWithoutOrderInputObjectSchema as PurchaseRequestUncheckedCreateWithoutOrderInputObjectSchema } from './PurchaseRequestUncheckedCreateWithoutOrderInput.schema';
import { PurchaseRequestWhereInputObjectSchema as PurchaseRequestWhereInputObjectSchema } from './PurchaseRequestWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => PurchaseRequestUpdateWithoutOrderInputObjectSchema), z.lazy(() => PurchaseRequestUncheckedUpdateWithoutOrderInputObjectSchema)]),
  create: z.union([z.lazy(() => PurchaseRequestCreateWithoutOrderInputObjectSchema), z.lazy(() => PurchaseRequestUncheckedCreateWithoutOrderInputObjectSchema)]),
  where: z.lazy(() => PurchaseRequestWhereInputObjectSchema).optional()
}).strict();
export const PurchaseRequestUpsertWithoutOrderInputObjectSchema: z.ZodType<Prisma.PurchaseRequestUpsertWithoutOrderInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestUpsertWithoutOrderInput>;
export const PurchaseRequestUpsertWithoutOrderInputObjectZodSchema = makeSchema();
