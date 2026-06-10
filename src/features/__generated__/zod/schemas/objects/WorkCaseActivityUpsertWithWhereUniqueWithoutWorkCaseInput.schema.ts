import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseActivityWhereUniqueInputObjectSchema as WorkCaseActivityWhereUniqueInputObjectSchema } from './WorkCaseActivityWhereUniqueInput.schema';
import { WorkCaseActivityUpdateWithoutWorkCaseInputObjectSchema as WorkCaseActivityUpdateWithoutWorkCaseInputObjectSchema } from './WorkCaseActivityUpdateWithoutWorkCaseInput.schema';
import { WorkCaseActivityUncheckedUpdateWithoutWorkCaseInputObjectSchema as WorkCaseActivityUncheckedUpdateWithoutWorkCaseInputObjectSchema } from './WorkCaseActivityUncheckedUpdateWithoutWorkCaseInput.schema';
import { WorkCaseActivityCreateWithoutWorkCaseInputObjectSchema as WorkCaseActivityCreateWithoutWorkCaseInputObjectSchema } from './WorkCaseActivityCreateWithoutWorkCaseInput.schema';
import { WorkCaseActivityUncheckedCreateWithoutWorkCaseInputObjectSchema as WorkCaseActivityUncheckedCreateWithoutWorkCaseInputObjectSchema } from './WorkCaseActivityUncheckedCreateWithoutWorkCaseInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WorkCaseActivityWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => WorkCaseActivityUpdateWithoutWorkCaseInputObjectSchema), z.lazy(() => WorkCaseActivityUncheckedUpdateWithoutWorkCaseInputObjectSchema)]),
  create: z.union([z.lazy(() => WorkCaseActivityCreateWithoutWorkCaseInputObjectSchema), z.lazy(() => WorkCaseActivityUncheckedCreateWithoutWorkCaseInputObjectSchema)])
}).strict();
export const WorkCaseActivityUpsertWithWhereUniqueWithoutWorkCaseInputObjectSchema: z.ZodType<Prisma.WorkCaseActivityUpsertWithWhereUniqueWithoutWorkCaseInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseActivityUpsertWithWhereUniqueWithoutWorkCaseInput>;
export const WorkCaseActivityUpsertWithWhereUniqueWithoutWorkCaseInputObjectZodSchema = makeSchema();
