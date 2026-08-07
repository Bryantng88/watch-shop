import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestWhereInputObjectSchema as PurchaseRequestWhereInputObjectSchema } from './PurchaseRequestWhereInput.schema';
import { PurchaseRequestUpdateWithoutOrderInputObjectSchema as PurchaseRequestUpdateWithoutOrderInputObjectSchema } from './PurchaseRequestUpdateWithoutOrderInput.schema';
import { PurchaseRequestUncheckedUpdateWithoutOrderInputObjectSchema as PurchaseRequestUncheckedUpdateWithoutOrderInputObjectSchema } from './PurchaseRequestUncheckedUpdateWithoutOrderInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => PurchaseRequestWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => PurchaseRequestUpdateWithoutOrderInputObjectSchema), z.lazy(() => PurchaseRequestUncheckedUpdateWithoutOrderInputObjectSchema)])
}).strict();
export const PurchaseRequestUpdateToOneWithWhereWithoutOrderInputObjectSchema: z.ZodType<Prisma.PurchaseRequestUpdateToOneWithWhereWithoutOrderInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestUpdateToOneWithWhereWithoutOrderInput>;
export const PurchaseRequestUpdateToOneWithWhereWithoutOrderInputObjectZodSchema = makeSchema();
