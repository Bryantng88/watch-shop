import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestWhereUniqueInputObjectSchema as PurchaseRequestWhereUniqueInputObjectSchema } from './PurchaseRequestWhereUniqueInput.schema';
import { PurchaseRequestCreateWithoutAssignedUserInputObjectSchema as PurchaseRequestCreateWithoutAssignedUserInputObjectSchema } from './PurchaseRequestCreateWithoutAssignedUserInput.schema';
import { PurchaseRequestUncheckedCreateWithoutAssignedUserInputObjectSchema as PurchaseRequestUncheckedCreateWithoutAssignedUserInputObjectSchema } from './PurchaseRequestUncheckedCreateWithoutAssignedUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => PurchaseRequestWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => PurchaseRequestCreateWithoutAssignedUserInputObjectSchema), z.lazy(() => PurchaseRequestUncheckedCreateWithoutAssignedUserInputObjectSchema)])
}).strict();
export const PurchaseRequestCreateOrConnectWithoutAssignedUserInputObjectSchema: z.ZodType<Prisma.PurchaseRequestCreateOrConnectWithoutAssignedUserInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestCreateOrConnectWithoutAssignedUserInput>;
export const PurchaseRequestCreateOrConnectWithoutAssignedUserInputObjectZodSchema = makeSchema();
