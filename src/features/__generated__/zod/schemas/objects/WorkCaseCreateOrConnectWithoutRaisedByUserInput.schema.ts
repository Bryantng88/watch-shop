import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseWhereUniqueInputObjectSchema as WorkCaseWhereUniqueInputObjectSchema } from './WorkCaseWhereUniqueInput.schema';
import { WorkCaseCreateWithoutRaisedByUserInputObjectSchema as WorkCaseCreateWithoutRaisedByUserInputObjectSchema } from './WorkCaseCreateWithoutRaisedByUserInput.schema';
import { WorkCaseUncheckedCreateWithoutRaisedByUserInputObjectSchema as WorkCaseUncheckedCreateWithoutRaisedByUserInputObjectSchema } from './WorkCaseUncheckedCreateWithoutRaisedByUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WorkCaseWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => WorkCaseCreateWithoutRaisedByUserInputObjectSchema), z.lazy(() => WorkCaseUncheckedCreateWithoutRaisedByUserInputObjectSchema)])
}).strict();
export const WorkCaseCreateOrConnectWithoutRaisedByUserInputObjectSchema: z.ZodType<Prisma.WorkCaseCreateOrConnectWithoutRaisedByUserInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseCreateOrConnectWithoutRaisedByUserInput>;
export const WorkCaseCreateOrConnectWithoutRaisedByUserInputObjectZodSchema = makeSchema();
