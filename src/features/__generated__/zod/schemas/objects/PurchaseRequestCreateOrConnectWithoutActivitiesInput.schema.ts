import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestWhereUniqueInputObjectSchema as PurchaseRequestWhereUniqueInputObjectSchema } from './PurchaseRequestWhereUniqueInput.schema';
import { PurchaseRequestCreateWithoutActivitiesInputObjectSchema as PurchaseRequestCreateWithoutActivitiesInputObjectSchema } from './PurchaseRequestCreateWithoutActivitiesInput.schema';
import { PurchaseRequestUncheckedCreateWithoutActivitiesInputObjectSchema as PurchaseRequestUncheckedCreateWithoutActivitiesInputObjectSchema } from './PurchaseRequestUncheckedCreateWithoutActivitiesInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => PurchaseRequestWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => PurchaseRequestCreateWithoutActivitiesInputObjectSchema), z.lazy(() => PurchaseRequestUncheckedCreateWithoutActivitiesInputObjectSchema)])
}).strict();
export const PurchaseRequestCreateOrConnectWithoutActivitiesInputObjectSchema: z.ZodType<Prisma.PurchaseRequestCreateOrConnectWithoutActivitiesInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestCreateOrConnectWithoutActivitiesInput>;
export const PurchaseRequestCreateOrConnectWithoutActivitiesInputObjectZodSchema = makeSchema();
