import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseActivityWhereUniqueInputObjectSchema as WorkCaseActivityWhereUniqueInputObjectSchema } from './WorkCaseActivityWhereUniqueInput.schema';
import { WorkCaseActivityCreateWithoutWorkCaseInputObjectSchema as WorkCaseActivityCreateWithoutWorkCaseInputObjectSchema } from './WorkCaseActivityCreateWithoutWorkCaseInput.schema';
import { WorkCaseActivityUncheckedCreateWithoutWorkCaseInputObjectSchema as WorkCaseActivityUncheckedCreateWithoutWorkCaseInputObjectSchema } from './WorkCaseActivityUncheckedCreateWithoutWorkCaseInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WorkCaseActivityWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => WorkCaseActivityCreateWithoutWorkCaseInputObjectSchema), z.lazy(() => WorkCaseActivityUncheckedCreateWithoutWorkCaseInputObjectSchema)])
}).strict();
export const WorkCaseActivityCreateOrConnectWithoutWorkCaseInputObjectSchema: z.ZodType<Prisma.WorkCaseActivityCreateOrConnectWithoutWorkCaseInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseActivityCreateOrConnectWithoutWorkCaseInput>;
export const WorkCaseActivityCreateOrConnectWithoutWorkCaseInputObjectZodSchema = makeSchema();
