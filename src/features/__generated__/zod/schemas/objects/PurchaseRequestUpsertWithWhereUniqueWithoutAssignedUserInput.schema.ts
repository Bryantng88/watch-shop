import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestWhereUniqueInputObjectSchema as PurchaseRequestWhereUniqueInputObjectSchema } from './PurchaseRequestWhereUniqueInput.schema';
import { PurchaseRequestUpdateWithoutAssignedUserInputObjectSchema as PurchaseRequestUpdateWithoutAssignedUserInputObjectSchema } from './PurchaseRequestUpdateWithoutAssignedUserInput.schema';
import { PurchaseRequestUncheckedUpdateWithoutAssignedUserInputObjectSchema as PurchaseRequestUncheckedUpdateWithoutAssignedUserInputObjectSchema } from './PurchaseRequestUncheckedUpdateWithoutAssignedUserInput.schema';
import { PurchaseRequestCreateWithoutAssignedUserInputObjectSchema as PurchaseRequestCreateWithoutAssignedUserInputObjectSchema } from './PurchaseRequestCreateWithoutAssignedUserInput.schema';
import { PurchaseRequestUncheckedCreateWithoutAssignedUserInputObjectSchema as PurchaseRequestUncheckedCreateWithoutAssignedUserInputObjectSchema } from './PurchaseRequestUncheckedCreateWithoutAssignedUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => PurchaseRequestWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => PurchaseRequestUpdateWithoutAssignedUserInputObjectSchema), z.lazy(() => PurchaseRequestUncheckedUpdateWithoutAssignedUserInputObjectSchema)]),
  create: z.union([z.lazy(() => PurchaseRequestCreateWithoutAssignedUserInputObjectSchema), z.lazy(() => PurchaseRequestUncheckedCreateWithoutAssignedUserInputObjectSchema)])
}).strict();
export const PurchaseRequestUpsertWithWhereUniqueWithoutAssignedUserInputObjectSchema: z.ZodType<Prisma.PurchaseRequestUpsertWithWhereUniqueWithoutAssignedUserInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestUpsertWithWhereUniqueWithoutAssignedUserInput>;
export const PurchaseRequestUpsertWithWhereUniqueWithoutAssignedUserInputObjectZodSchema = makeSchema();
