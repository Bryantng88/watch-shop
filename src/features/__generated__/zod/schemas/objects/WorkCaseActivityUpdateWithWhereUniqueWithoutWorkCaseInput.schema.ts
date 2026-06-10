import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseActivityWhereUniqueInputObjectSchema as WorkCaseActivityWhereUniqueInputObjectSchema } from './WorkCaseActivityWhereUniqueInput.schema';
import { WorkCaseActivityUpdateWithoutWorkCaseInputObjectSchema as WorkCaseActivityUpdateWithoutWorkCaseInputObjectSchema } from './WorkCaseActivityUpdateWithoutWorkCaseInput.schema';
import { WorkCaseActivityUncheckedUpdateWithoutWorkCaseInputObjectSchema as WorkCaseActivityUncheckedUpdateWithoutWorkCaseInputObjectSchema } from './WorkCaseActivityUncheckedUpdateWithoutWorkCaseInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WorkCaseActivityWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => WorkCaseActivityUpdateWithoutWorkCaseInputObjectSchema), z.lazy(() => WorkCaseActivityUncheckedUpdateWithoutWorkCaseInputObjectSchema)])
}).strict();
export const WorkCaseActivityUpdateWithWhereUniqueWithoutWorkCaseInputObjectSchema: z.ZodType<Prisma.WorkCaseActivityUpdateWithWhereUniqueWithoutWorkCaseInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseActivityUpdateWithWhereUniqueWithoutWorkCaseInput>;
export const WorkCaseActivityUpdateWithWhereUniqueWithoutWorkCaseInputObjectZodSchema = makeSchema();
