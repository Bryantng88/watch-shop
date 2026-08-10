import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestCreateWithoutActivitiesInputObjectSchema as PurchaseRequestCreateWithoutActivitiesInputObjectSchema } from './PurchaseRequestCreateWithoutActivitiesInput.schema';
import { PurchaseRequestUncheckedCreateWithoutActivitiesInputObjectSchema as PurchaseRequestUncheckedCreateWithoutActivitiesInputObjectSchema } from './PurchaseRequestUncheckedCreateWithoutActivitiesInput.schema';
import { PurchaseRequestCreateOrConnectWithoutActivitiesInputObjectSchema as PurchaseRequestCreateOrConnectWithoutActivitiesInputObjectSchema } from './PurchaseRequestCreateOrConnectWithoutActivitiesInput.schema';
import { PurchaseRequestUpsertWithoutActivitiesInputObjectSchema as PurchaseRequestUpsertWithoutActivitiesInputObjectSchema } from './PurchaseRequestUpsertWithoutActivitiesInput.schema';
import { PurchaseRequestWhereUniqueInputObjectSchema as PurchaseRequestWhereUniqueInputObjectSchema } from './PurchaseRequestWhereUniqueInput.schema';
import { PurchaseRequestUpdateToOneWithWhereWithoutActivitiesInputObjectSchema as PurchaseRequestUpdateToOneWithWhereWithoutActivitiesInputObjectSchema } from './PurchaseRequestUpdateToOneWithWhereWithoutActivitiesInput.schema';
import { PurchaseRequestUpdateWithoutActivitiesInputObjectSchema as PurchaseRequestUpdateWithoutActivitiesInputObjectSchema } from './PurchaseRequestUpdateWithoutActivitiesInput.schema';
import { PurchaseRequestUncheckedUpdateWithoutActivitiesInputObjectSchema as PurchaseRequestUncheckedUpdateWithoutActivitiesInputObjectSchema } from './PurchaseRequestUncheckedUpdateWithoutActivitiesInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => PurchaseRequestCreateWithoutActivitiesInputObjectSchema), z.lazy(() => PurchaseRequestUncheckedCreateWithoutActivitiesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => PurchaseRequestCreateOrConnectWithoutActivitiesInputObjectSchema).optional(),
  upsert: z.lazy(() => PurchaseRequestUpsertWithoutActivitiesInputObjectSchema).optional(),
  connect: z.lazy(() => PurchaseRequestWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => PurchaseRequestUpdateToOneWithWhereWithoutActivitiesInputObjectSchema), z.lazy(() => PurchaseRequestUpdateWithoutActivitiesInputObjectSchema), z.lazy(() => PurchaseRequestUncheckedUpdateWithoutActivitiesInputObjectSchema)]).optional()
}).strict();
export const PurchaseRequestUpdateOneRequiredWithoutActivitiesNestedInputObjectSchema: z.ZodType<Prisma.PurchaseRequestUpdateOneRequiredWithoutActivitiesNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestUpdateOneRequiredWithoutActivitiesNestedInput>;
export const PurchaseRequestUpdateOneRequiredWithoutActivitiesNestedInputObjectZodSchema = makeSchema();
