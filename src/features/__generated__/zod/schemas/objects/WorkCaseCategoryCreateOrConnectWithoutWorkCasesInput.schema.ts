import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseCategoryWhereUniqueInputObjectSchema as WorkCaseCategoryWhereUniqueInputObjectSchema } from './WorkCaseCategoryWhereUniqueInput.schema';
import { WorkCaseCategoryCreateWithoutWorkCasesInputObjectSchema as WorkCaseCategoryCreateWithoutWorkCasesInputObjectSchema } from './WorkCaseCategoryCreateWithoutWorkCasesInput.schema';
import { WorkCaseCategoryUncheckedCreateWithoutWorkCasesInputObjectSchema as WorkCaseCategoryUncheckedCreateWithoutWorkCasesInputObjectSchema } from './WorkCaseCategoryUncheckedCreateWithoutWorkCasesInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WorkCaseCategoryWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => WorkCaseCategoryCreateWithoutWorkCasesInputObjectSchema), z.lazy(() => WorkCaseCategoryUncheckedCreateWithoutWorkCasesInputObjectSchema)])
}).strict();
export const WorkCaseCategoryCreateOrConnectWithoutWorkCasesInputObjectSchema: z.ZodType<Prisma.WorkCaseCategoryCreateOrConnectWithoutWorkCasesInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseCategoryCreateOrConnectWithoutWorkCasesInput>;
export const WorkCaseCategoryCreateOrConnectWithoutWorkCasesInputObjectZodSchema = makeSchema();
