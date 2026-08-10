import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestCreateWithoutActivitiesInputObjectSchema as PurchaseRequestCreateWithoutActivitiesInputObjectSchema } from './PurchaseRequestCreateWithoutActivitiesInput.schema';
import { PurchaseRequestUncheckedCreateWithoutActivitiesInputObjectSchema as PurchaseRequestUncheckedCreateWithoutActivitiesInputObjectSchema } from './PurchaseRequestUncheckedCreateWithoutActivitiesInput.schema';
import { PurchaseRequestCreateOrConnectWithoutActivitiesInputObjectSchema as PurchaseRequestCreateOrConnectWithoutActivitiesInputObjectSchema } from './PurchaseRequestCreateOrConnectWithoutActivitiesInput.schema';
import { PurchaseRequestWhereUniqueInputObjectSchema as PurchaseRequestWhereUniqueInputObjectSchema } from './PurchaseRequestWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => PurchaseRequestCreateWithoutActivitiesInputObjectSchema), z.lazy(() => PurchaseRequestUncheckedCreateWithoutActivitiesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => PurchaseRequestCreateOrConnectWithoutActivitiesInputObjectSchema).optional(),
  connect: z.lazy(() => PurchaseRequestWhereUniqueInputObjectSchema).optional()
}).strict();
export const PurchaseRequestCreateNestedOneWithoutActivitiesInputObjectSchema: z.ZodType<Prisma.PurchaseRequestCreateNestedOneWithoutActivitiesInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestCreateNestedOneWithoutActivitiesInput>;
export const PurchaseRequestCreateNestedOneWithoutActivitiesInputObjectZodSchema = makeSchema();
