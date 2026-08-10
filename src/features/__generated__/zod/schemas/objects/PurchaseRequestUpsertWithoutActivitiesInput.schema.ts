import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestUpdateWithoutActivitiesInputObjectSchema as PurchaseRequestUpdateWithoutActivitiesInputObjectSchema } from './PurchaseRequestUpdateWithoutActivitiesInput.schema';
import { PurchaseRequestUncheckedUpdateWithoutActivitiesInputObjectSchema as PurchaseRequestUncheckedUpdateWithoutActivitiesInputObjectSchema } from './PurchaseRequestUncheckedUpdateWithoutActivitiesInput.schema';
import { PurchaseRequestCreateWithoutActivitiesInputObjectSchema as PurchaseRequestCreateWithoutActivitiesInputObjectSchema } from './PurchaseRequestCreateWithoutActivitiesInput.schema';
import { PurchaseRequestUncheckedCreateWithoutActivitiesInputObjectSchema as PurchaseRequestUncheckedCreateWithoutActivitiesInputObjectSchema } from './PurchaseRequestUncheckedCreateWithoutActivitiesInput.schema';
import { PurchaseRequestWhereInputObjectSchema as PurchaseRequestWhereInputObjectSchema } from './PurchaseRequestWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => PurchaseRequestUpdateWithoutActivitiesInputObjectSchema), z.lazy(() => PurchaseRequestUncheckedUpdateWithoutActivitiesInputObjectSchema)]),
  create: z.union([z.lazy(() => PurchaseRequestCreateWithoutActivitiesInputObjectSchema), z.lazy(() => PurchaseRequestUncheckedCreateWithoutActivitiesInputObjectSchema)]),
  where: z.lazy(() => PurchaseRequestWhereInputObjectSchema).optional()
}).strict();
export const PurchaseRequestUpsertWithoutActivitiesInputObjectSchema: z.ZodType<Prisma.PurchaseRequestUpsertWithoutActivitiesInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestUpsertWithoutActivitiesInput>;
export const PurchaseRequestUpsertWithoutActivitiesInputObjectZodSchema = makeSchema();
