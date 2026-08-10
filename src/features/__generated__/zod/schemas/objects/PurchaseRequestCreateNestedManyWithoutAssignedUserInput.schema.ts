import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestCreateWithoutAssignedUserInputObjectSchema as PurchaseRequestCreateWithoutAssignedUserInputObjectSchema } from './PurchaseRequestCreateWithoutAssignedUserInput.schema';
import { PurchaseRequestUncheckedCreateWithoutAssignedUserInputObjectSchema as PurchaseRequestUncheckedCreateWithoutAssignedUserInputObjectSchema } from './PurchaseRequestUncheckedCreateWithoutAssignedUserInput.schema';
import { PurchaseRequestCreateOrConnectWithoutAssignedUserInputObjectSchema as PurchaseRequestCreateOrConnectWithoutAssignedUserInputObjectSchema } from './PurchaseRequestCreateOrConnectWithoutAssignedUserInput.schema';
import { PurchaseRequestCreateManyAssignedUserInputEnvelopeObjectSchema as PurchaseRequestCreateManyAssignedUserInputEnvelopeObjectSchema } from './PurchaseRequestCreateManyAssignedUserInputEnvelope.schema';
import { PurchaseRequestWhereUniqueInputObjectSchema as PurchaseRequestWhereUniqueInputObjectSchema } from './PurchaseRequestWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => PurchaseRequestCreateWithoutAssignedUserInputObjectSchema), z.lazy(() => PurchaseRequestCreateWithoutAssignedUserInputObjectSchema).array(), z.lazy(() => PurchaseRequestUncheckedCreateWithoutAssignedUserInputObjectSchema), z.lazy(() => PurchaseRequestUncheckedCreateWithoutAssignedUserInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => PurchaseRequestCreateOrConnectWithoutAssignedUserInputObjectSchema), z.lazy(() => PurchaseRequestCreateOrConnectWithoutAssignedUserInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => PurchaseRequestCreateManyAssignedUserInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => PurchaseRequestWhereUniqueInputObjectSchema), z.lazy(() => PurchaseRequestWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const PurchaseRequestCreateNestedManyWithoutAssignedUserInputObjectSchema: z.ZodType<Prisma.PurchaseRequestCreateNestedManyWithoutAssignedUserInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestCreateNestedManyWithoutAssignedUserInput>;
export const PurchaseRequestCreateNestedManyWithoutAssignedUserInputObjectZodSchema = makeSchema();
