import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseCategoryUpdateWithoutWorkCasesInputObjectSchema as WorkCaseCategoryUpdateWithoutWorkCasesInputObjectSchema } from './WorkCaseCategoryUpdateWithoutWorkCasesInput.schema';
import { WorkCaseCategoryUncheckedUpdateWithoutWorkCasesInputObjectSchema as WorkCaseCategoryUncheckedUpdateWithoutWorkCasesInputObjectSchema } from './WorkCaseCategoryUncheckedUpdateWithoutWorkCasesInput.schema';
import { WorkCaseCategoryCreateWithoutWorkCasesInputObjectSchema as WorkCaseCategoryCreateWithoutWorkCasesInputObjectSchema } from './WorkCaseCategoryCreateWithoutWorkCasesInput.schema';
import { WorkCaseCategoryUncheckedCreateWithoutWorkCasesInputObjectSchema as WorkCaseCategoryUncheckedCreateWithoutWorkCasesInputObjectSchema } from './WorkCaseCategoryUncheckedCreateWithoutWorkCasesInput.schema';
import { WorkCaseCategoryWhereInputObjectSchema as WorkCaseCategoryWhereInputObjectSchema } from './WorkCaseCategoryWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => WorkCaseCategoryUpdateWithoutWorkCasesInputObjectSchema), z.lazy(() => WorkCaseCategoryUncheckedUpdateWithoutWorkCasesInputObjectSchema)]),
  create: z.union([z.lazy(() => WorkCaseCategoryCreateWithoutWorkCasesInputObjectSchema), z.lazy(() => WorkCaseCategoryUncheckedCreateWithoutWorkCasesInputObjectSchema)]),
  where: z.lazy(() => WorkCaseCategoryWhereInputObjectSchema).optional()
}).strict();
export const WorkCaseCategoryUpsertWithoutWorkCasesInputObjectSchema: z.ZodType<Prisma.WorkCaseCategoryUpsertWithoutWorkCasesInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseCategoryUpsertWithoutWorkCasesInput>;
export const WorkCaseCategoryUpsertWithoutWorkCasesInputObjectZodSchema = makeSchema();
