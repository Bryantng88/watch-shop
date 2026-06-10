import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseCategoryWhereInputObjectSchema as WorkCaseCategoryWhereInputObjectSchema } from './WorkCaseCategoryWhereInput.schema';
import { WorkCaseCategoryUpdateWithoutWorkCasesInputObjectSchema as WorkCaseCategoryUpdateWithoutWorkCasesInputObjectSchema } from './WorkCaseCategoryUpdateWithoutWorkCasesInput.schema';
import { WorkCaseCategoryUncheckedUpdateWithoutWorkCasesInputObjectSchema as WorkCaseCategoryUncheckedUpdateWithoutWorkCasesInputObjectSchema } from './WorkCaseCategoryUncheckedUpdateWithoutWorkCasesInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WorkCaseCategoryWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => WorkCaseCategoryUpdateWithoutWorkCasesInputObjectSchema), z.lazy(() => WorkCaseCategoryUncheckedUpdateWithoutWorkCasesInputObjectSchema)])
}).strict();
export const WorkCaseCategoryUpdateToOneWithWhereWithoutWorkCasesInputObjectSchema: z.ZodType<Prisma.WorkCaseCategoryUpdateToOneWithWhereWithoutWorkCasesInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseCategoryUpdateToOneWithWhereWithoutWorkCasesInput>;
export const WorkCaseCategoryUpdateToOneWithWhereWithoutWorkCasesInputObjectZodSchema = makeSchema();
