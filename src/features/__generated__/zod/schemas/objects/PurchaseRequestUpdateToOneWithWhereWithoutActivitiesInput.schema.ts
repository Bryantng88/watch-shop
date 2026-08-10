import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestWhereInputObjectSchema as PurchaseRequestWhereInputObjectSchema } from './PurchaseRequestWhereInput.schema';
import { PurchaseRequestUpdateWithoutActivitiesInputObjectSchema as PurchaseRequestUpdateWithoutActivitiesInputObjectSchema } from './PurchaseRequestUpdateWithoutActivitiesInput.schema';
import { PurchaseRequestUncheckedUpdateWithoutActivitiesInputObjectSchema as PurchaseRequestUncheckedUpdateWithoutActivitiesInputObjectSchema } from './PurchaseRequestUncheckedUpdateWithoutActivitiesInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => PurchaseRequestWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => PurchaseRequestUpdateWithoutActivitiesInputObjectSchema), z.lazy(() => PurchaseRequestUncheckedUpdateWithoutActivitiesInputObjectSchema)])
}).strict();
export const PurchaseRequestUpdateToOneWithWhereWithoutActivitiesInputObjectSchema: z.ZodType<Prisma.PurchaseRequestUpdateToOneWithWhereWithoutActivitiesInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestUpdateToOneWithWhereWithoutActivitiesInput>;
export const PurchaseRequestUpdateToOneWithWhereWithoutActivitiesInputObjectZodSchema = makeSchema();
