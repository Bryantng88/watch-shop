import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseWhereUniqueInputObjectSchema as WorkCaseWhereUniqueInputObjectSchema } from './WorkCaseWhereUniqueInput.schema';
import { WorkCaseUpdateWithoutOrderInputObjectSchema as WorkCaseUpdateWithoutOrderInputObjectSchema } from './WorkCaseUpdateWithoutOrderInput.schema';
import { WorkCaseUncheckedUpdateWithoutOrderInputObjectSchema as WorkCaseUncheckedUpdateWithoutOrderInputObjectSchema } from './WorkCaseUncheckedUpdateWithoutOrderInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WorkCaseWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => WorkCaseUpdateWithoutOrderInputObjectSchema), z.lazy(() => WorkCaseUncheckedUpdateWithoutOrderInputObjectSchema)])
}).strict();
export const WorkCaseUpdateWithWhereUniqueWithoutOrderInputObjectSchema: z.ZodType<Prisma.WorkCaseUpdateWithWhereUniqueWithoutOrderInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseUpdateWithWhereUniqueWithoutOrderInput>;
export const WorkCaseUpdateWithWhereUniqueWithoutOrderInputObjectZodSchema = makeSchema();
