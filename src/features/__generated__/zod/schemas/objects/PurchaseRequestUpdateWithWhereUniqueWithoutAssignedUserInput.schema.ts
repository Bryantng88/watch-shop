import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestWhereUniqueInputObjectSchema as PurchaseRequestWhereUniqueInputObjectSchema } from './PurchaseRequestWhereUniqueInput.schema';
import { PurchaseRequestUpdateWithoutAssignedUserInputObjectSchema as PurchaseRequestUpdateWithoutAssignedUserInputObjectSchema } from './PurchaseRequestUpdateWithoutAssignedUserInput.schema';
import { PurchaseRequestUncheckedUpdateWithoutAssignedUserInputObjectSchema as PurchaseRequestUncheckedUpdateWithoutAssignedUserInputObjectSchema } from './PurchaseRequestUncheckedUpdateWithoutAssignedUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => PurchaseRequestWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => PurchaseRequestUpdateWithoutAssignedUserInputObjectSchema), z.lazy(() => PurchaseRequestUncheckedUpdateWithoutAssignedUserInputObjectSchema)])
}).strict();
export const PurchaseRequestUpdateWithWhereUniqueWithoutAssignedUserInputObjectSchema: z.ZodType<Prisma.PurchaseRequestUpdateWithWhereUniqueWithoutAssignedUserInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestUpdateWithWhereUniqueWithoutAssignedUserInput>;
export const PurchaseRequestUpdateWithWhereUniqueWithoutAssignedUserInputObjectZodSchema = makeSchema();
