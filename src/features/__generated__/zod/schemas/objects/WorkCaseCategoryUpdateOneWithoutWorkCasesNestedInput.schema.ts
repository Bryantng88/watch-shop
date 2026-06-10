import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseCategoryCreateWithoutWorkCasesInputObjectSchema as WorkCaseCategoryCreateWithoutWorkCasesInputObjectSchema } from './WorkCaseCategoryCreateWithoutWorkCasesInput.schema';
import { WorkCaseCategoryUncheckedCreateWithoutWorkCasesInputObjectSchema as WorkCaseCategoryUncheckedCreateWithoutWorkCasesInputObjectSchema } from './WorkCaseCategoryUncheckedCreateWithoutWorkCasesInput.schema';
import { WorkCaseCategoryCreateOrConnectWithoutWorkCasesInputObjectSchema as WorkCaseCategoryCreateOrConnectWithoutWorkCasesInputObjectSchema } from './WorkCaseCategoryCreateOrConnectWithoutWorkCasesInput.schema';
import { WorkCaseCategoryUpsertWithoutWorkCasesInputObjectSchema as WorkCaseCategoryUpsertWithoutWorkCasesInputObjectSchema } from './WorkCaseCategoryUpsertWithoutWorkCasesInput.schema';
import { WorkCaseCategoryWhereInputObjectSchema as WorkCaseCategoryWhereInputObjectSchema } from './WorkCaseCategoryWhereInput.schema';
import { WorkCaseCategoryWhereUniqueInputObjectSchema as WorkCaseCategoryWhereUniqueInputObjectSchema } from './WorkCaseCategoryWhereUniqueInput.schema';
import { WorkCaseCategoryUpdateToOneWithWhereWithoutWorkCasesInputObjectSchema as WorkCaseCategoryUpdateToOneWithWhereWithoutWorkCasesInputObjectSchema } from './WorkCaseCategoryUpdateToOneWithWhereWithoutWorkCasesInput.schema';
import { WorkCaseCategoryUpdateWithoutWorkCasesInputObjectSchema as WorkCaseCategoryUpdateWithoutWorkCasesInputObjectSchema } from './WorkCaseCategoryUpdateWithoutWorkCasesInput.schema';
import { WorkCaseCategoryUncheckedUpdateWithoutWorkCasesInputObjectSchema as WorkCaseCategoryUncheckedUpdateWithoutWorkCasesInputObjectSchema } from './WorkCaseCategoryUncheckedUpdateWithoutWorkCasesInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => WorkCaseCategoryCreateWithoutWorkCasesInputObjectSchema), z.lazy(() => WorkCaseCategoryUncheckedCreateWithoutWorkCasesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => WorkCaseCategoryCreateOrConnectWithoutWorkCasesInputObjectSchema).optional(),
  upsert: z.lazy(() => WorkCaseCategoryUpsertWithoutWorkCasesInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => WorkCaseCategoryWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => WorkCaseCategoryWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => WorkCaseCategoryWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => WorkCaseCategoryUpdateToOneWithWhereWithoutWorkCasesInputObjectSchema), z.lazy(() => WorkCaseCategoryUpdateWithoutWorkCasesInputObjectSchema), z.lazy(() => WorkCaseCategoryUncheckedUpdateWithoutWorkCasesInputObjectSchema)]).optional()
}).strict();
export const WorkCaseCategoryUpdateOneWithoutWorkCasesNestedInputObjectSchema: z.ZodType<Prisma.WorkCaseCategoryUpdateOneWithoutWorkCasesNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseCategoryUpdateOneWithoutWorkCasesNestedInput>;
export const WorkCaseCategoryUpdateOneWithoutWorkCasesNestedInputObjectZodSchema = makeSchema();
