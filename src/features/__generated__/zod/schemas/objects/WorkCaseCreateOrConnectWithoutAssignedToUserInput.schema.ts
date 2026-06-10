import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseWhereUniqueInputObjectSchema as WorkCaseWhereUniqueInputObjectSchema } from './WorkCaseWhereUniqueInput.schema';
import { WorkCaseCreateWithoutAssignedToUserInputObjectSchema as WorkCaseCreateWithoutAssignedToUserInputObjectSchema } from './WorkCaseCreateWithoutAssignedToUserInput.schema';
import { WorkCaseUncheckedCreateWithoutAssignedToUserInputObjectSchema as WorkCaseUncheckedCreateWithoutAssignedToUserInputObjectSchema } from './WorkCaseUncheckedCreateWithoutAssignedToUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WorkCaseWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => WorkCaseCreateWithoutAssignedToUserInputObjectSchema), z.lazy(() => WorkCaseUncheckedCreateWithoutAssignedToUserInputObjectSchema)])
}).strict();
export const WorkCaseCreateOrConnectWithoutAssignedToUserInputObjectSchema: z.ZodType<Prisma.WorkCaseCreateOrConnectWithoutAssignedToUserInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseCreateOrConnectWithoutAssignedToUserInput>;
export const WorkCaseCreateOrConnectWithoutAssignedToUserInputObjectZodSchema = makeSchema();
