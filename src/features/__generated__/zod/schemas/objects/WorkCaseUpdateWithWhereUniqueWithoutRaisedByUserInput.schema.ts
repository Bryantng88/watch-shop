import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseWhereUniqueInputObjectSchema as WorkCaseWhereUniqueInputObjectSchema } from './WorkCaseWhereUniqueInput.schema';
import { WorkCaseUpdateWithoutRaisedByUserInputObjectSchema as WorkCaseUpdateWithoutRaisedByUserInputObjectSchema } from './WorkCaseUpdateWithoutRaisedByUserInput.schema';
import { WorkCaseUncheckedUpdateWithoutRaisedByUserInputObjectSchema as WorkCaseUncheckedUpdateWithoutRaisedByUserInputObjectSchema } from './WorkCaseUncheckedUpdateWithoutRaisedByUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WorkCaseWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => WorkCaseUpdateWithoutRaisedByUserInputObjectSchema), z.lazy(() => WorkCaseUncheckedUpdateWithoutRaisedByUserInputObjectSchema)])
}).strict();
export const WorkCaseUpdateWithWhereUniqueWithoutRaisedByUserInputObjectSchema: z.ZodType<Prisma.WorkCaseUpdateWithWhereUniqueWithoutRaisedByUserInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseUpdateWithWhereUniqueWithoutRaisedByUserInput>;
export const WorkCaseUpdateWithWhereUniqueWithoutRaisedByUserInputObjectZodSchema = makeSchema();
