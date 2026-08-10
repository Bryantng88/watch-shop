import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestScalarWhereInputObjectSchema as PurchaseRequestScalarWhereInputObjectSchema } from './PurchaseRequestScalarWhereInput.schema';
import { PurchaseRequestUpdateManyMutationInputObjectSchema as PurchaseRequestUpdateManyMutationInputObjectSchema } from './PurchaseRequestUpdateManyMutationInput.schema';
import { PurchaseRequestUncheckedUpdateManyWithoutAssignedUserInputObjectSchema as PurchaseRequestUncheckedUpdateManyWithoutAssignedUserInputObjectSchema } from './PurchaseRequestUncheckedUpdateManyWithoutAssignedUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => PurchaseRequestScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => PurchaseRequestUpdateManyMutationInputObjectSchema), z.lazy(() => PurchaseRequestUncheckedUpdateManyWithoutAssignedUserInputObjectSchema)])
}).strict();
export const PurchaseRequestUpdateManyWithWhereWithoutAssignedUserInputObjectSchema: z.ZodType<Prisma.PurchaseRequestUpdateManyWithWhereWithoutAssignedUserInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestUpdateManyWithWhereWithoutAssignedUserInput>;
export const PurchaseRequestUpdateManyWithWhereWithoutAssignedUserInputObjectZodSchema = makeSchema();
