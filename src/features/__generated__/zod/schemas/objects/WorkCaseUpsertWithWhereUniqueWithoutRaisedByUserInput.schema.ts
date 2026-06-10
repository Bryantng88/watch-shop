import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseWhereUniqueInputObjectSchema as WorkCaseWhereUniqueInputObjectSchema } from './WorkCaseWhereUniqueInput.schema';
import { WorkCaseUpdateWithoutRaisedByUserInputObjectSchema as WorkCaseUpdateWithoutRaisedByUserInputObjectSchema } from './WorkCaseUpdateWithoutRaisedByUserInput.schema';
import { WorkCaseUncheckedUpdateWithoutRaisedByUserInputObjectSchema as WorkCaseUncheckedUpdateWithoutRaisedByUserInputObjectSchema } from './WorkCaseUncheckedUpdateWithoutRaisedByUserInput.schema';
import { WorkCaseCreateWithoutRaisedByUserInputObjectSchema as WorkCaseCreateWithoutRaisedByUserInputObjectSchema } from './WorkCaseCreateWithoutRaisedByUserInput.schema';
import { WorkCaseUncheckedCreateWithoutRaisedByUserInputObjectSchema as WorkCaseUncheckedCreateWithoutRaisedByUserInputObjectSchema } from './WorkCaseUncheckedCreateWithoutRaisedByUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WorkCaseWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => WorkCaseUpdateWithoutRaisedByUserInputObjectSchema), z.lazy(() => WorkCaseUncheckedUpdateWithoutRaisedByUserInputObjectSchema)]),
  create: z.union([z.lazy(() => WorkCaseCreateWithoutRaisedByUserInputObjectSchema), z.lazy(() => WorkCaseUncheckedCreateWithoutRaisedByUserInputObjectSchema)])
}).strict();
export const WorkCaseUpsertWithWhereUniqueWithoutRaisedByUserInputObjectSchema: z.ZodType<Prisma.WorkCaseUpsertWithWhereUniqueWithoutRaisedByUserInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseUpsertWithWhereUniqueWithoutRaisedByUserInput>;
export const WorkCaseUpsertWithWhereUniqueWithoutRaisedByUserInputObjectZodSchema = makeSchema();
