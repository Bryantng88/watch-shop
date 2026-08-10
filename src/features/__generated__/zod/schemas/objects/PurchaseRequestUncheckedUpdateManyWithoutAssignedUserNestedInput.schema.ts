import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestCreateWithoutAssignedUserInputObjectSchema as PurchaseRequestCreateWithoutAssignedUserInputObjectSchema } from './PurchaseRequestCreateWithoutAssignedUserInput.schema';
import { PurchaseRequestUncheckedCreateWithoutAssignedUserInputObjectSchema as PurchaseRequestUncheckedCreateWithoutAssignedUserInputObjectSchema } from './PurchaseRequestUncheckedCreateWithoutAssignedUserInput.schema';
import { PurchaseRequestCreateOrConnectWithoutAssignedUserInputObjectSchema as PurchaseRequestCreateOrConnectWithoutAssignedUserInputObjectSchema } from './PurchaseRequestCreateOrConnectWithoutAssignedUserInput.schema';
import { PurchaseRequestUpsertWithWhereUniqueWithoutAssignedUserInputObjectSchema as PurchaseRequestUpsertWithWhereUniqueWithoutAssignedUserInputObjectSchema } from './PurchaseRequestUpsertWithWhereUniqueWithoutAssignedUserInput.schema';
import { PurchaseRequestCreateManyAssignedUserInputEnvelopeObjectSchema as PurchaseRequestCreateManyAssignedUserInputEnvelopeObjectSchema } from './PurchaseRequestCreateManyAssignedUserInputEnvelope.schema';
import { PurchaseRequestWhereUniqueInputObjectSchema as PurchaseRequestWhereUniqueInputObjectSchema } from './PurchaseRequestWhereUniqueInput.schema';
import { PurchaseRequestUpdateWithWhereUniqueWithoutAssignedUserInputObjectSchema as PurchaseRequestUpdateWithWhereUniqueWithoutAssignedUserInputObjectSchema } from './PurchaseRequestUpdateWithWhereUniqueWithoutAssignedUserInput.schema';
import { PurchaseRequestUpdateManyWithWhereWithoutAssignedUserInputObjectSchema as PurchaseRequestUpdateManyWithWhereWithoutAssignedUserInputObjectSchema } from './PurchaseRequestUpdateManyWithWhereWithoutAssignedUserInput.schema';
import { PurchaseRequestScalarWhereInputObjectSchema as PurchaseRequestScalarWhereInputObjectSchema } from './PurchaseRequestScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => PurchaseRequestCreateWithoutAssignedUserInputObjectSchema), z.lazy(() => PurchaseRequestCreateWithoutAssignedUserInputObjectSchema).array(), z.lazy(() => PurchaseRequestUncheckedCreateWithoutAssignedUserInputObjectSchema), z.lazy(() => PurchaseRequestUncheckedCreateWithoutAssignedUserInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => PurchaseRequestCreateOrConnectWithoutAssignedUserInputObjectSchema), z.lazy(() => PurchaseRequestCreateOrConnectWithoutAssignedUserInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => PurchaseRequestUpsertWithWhereUniqueWithoutAssignedUserInputObjectSchema), z.lazy(() => PurchaseRequestUpsertWithWhereUniqueWithoutAssignedUserInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => PurchaseRequestCreateManyAssignedUserInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => PurchaseRequestWhereUniqueInputObjectSchema), z.lazy(() => PurchaseRequestWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => PurchaseRequestWhereUniqueInputObjectSchema), z.lazy(() => PurchaseRequestWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => PurchaseRequestWhereUniqueInputObjectSchema), z.lazy(() => PurchaseRequestWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => PurchaseRequestWhereUniqueInputObjectSchema), z.lazy(() => PurchaseRequestWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => PurchaseRequestUpdateWithWhereUniqueWithoutAssignedUserInputObjectSchema), z.lazy(() => PurchaseRequestUpdateWithWhereUniqueWithoutAssignedUserInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => PurchaseRequestUpdateManyWithWhereWithoutAssignedUserInputObjectSchema), z.lazy(() => PurchaseRequestUpdateManyWithWhereWithoutAssignedUserInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => PurchaseRequestScalarWhereInputObjectSchema), z.lazy(() => PurchaseRequestScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const PurchaseRequestUncheckedUpdateManyWithoutAssignedUserNestedInputObjectSchema: z.ZodType<Prisma.PurchaseRequestUncheckedUpdateManyWithoutAssignedUserNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestUncheckedUpdateManyWithoutAssignedUserNestedInput>;
export const PurchaseRequestUncheckedUpdateManyWithoutAssignedUserNestedInputObjectZodSchema = makeSchema();
