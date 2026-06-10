import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseCategoryCreateWithoutWorkCasesInputObjectSchema as WorkCaseCategoryCreateWithoutWorkCasesInputObjectSchema } from './WorkCaseCategoryCreateWithoutWorkCasesInput.schema';
import { WorkCaseCategoryUncheckedCreateWithoutWorkCasesInputObjectSchema as WorkCaseCategoryUncheckedCreateWithoutWorkCasesInputObjectSchema } from './WorkCaseCategoryUncheckedCreateWithoutWorkCasesInput.schema';
import { WorkCaseCategoryCreateOrConnectWithoutWorkCasesInputObjectSchema as WorkCaseCategoryCreateOrConnectWithoutWorkCasesInputObjectSchema } from './WorkCaseCategoryCreateOrConnectWithoutWorkCasesInput.schema';
import { WorkCaseCategoryWhereUniqueInputObjectSchema as WorkCaseCategoryWhereUniqueInputObjectSchema } from './WorkCaseCategoryWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => WorkCaseCategoryCreateWithoutWorkCasesInputObjectSchema), z.lazy(() => WorkCaseCategoryUncheckedCreateWithoutWorkCasesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => WorkCaseCategoryCreateOrConnectWithoutWorkCasesInputObjectSchema).optional(),
  connect: z.lazy(() => WorkCaseCategoryWhereUniqueInputObjectSchema).optional()
}).strict();
export const WorkCaseCategoryCreateNestedOneWithoutWorkCasesInputObjectSchema: z.ZodType<Prisma.WorkCaseCategoryCreateNestedOneWithoutWorkCasesInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseCategoryCreateNestedOneWithoutWorkCasesInput>;
export const WorkCaseCategoryCreateNestedOneWithoutWorkCasesInputObjectZodSchema = makeSchema();
