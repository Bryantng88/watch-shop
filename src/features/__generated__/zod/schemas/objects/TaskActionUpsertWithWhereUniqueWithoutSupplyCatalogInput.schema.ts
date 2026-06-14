import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskActionWhereUniqueInputObjectSchema as TaskActionWhereUniqueInputObjectSchema } from './TaskActionWhereUniqueInput.schema';
import { TaskActionUpdateWithoutSupplyCatalogInputObjectSchema as TaskActionUpdateWithoutSupplyCatalogInputObjectSchema } from './TaskActionUpdateWithoutSupplyCatalogInput.schema';
import { TaskActionUncheckedUpdateWithoutSupplyCatalogInputObjectSchema as TaskActionUncheckedUpdateWithoutSupplyCatalogInputObjectSchema } from './TaskActionUncheckedUpdateWithoutSupplyCatalogInput.schema';
import { TaskActionCreateWithoutSupplyCatalogInputObjectSchema as TaskActionCreateWithoutSupplyCatalogInputObjectSchema } from './TaskActionCreateWithoutSupplyCatalogInput.schema';
import { TaskActionUncheckedCreateWithoutSupplyCatalogInputObjectSchema as TaskActionUncheckedCreateWithoutSupplyCatalogInputObjectSchema } from './TaskActionUncheckedCreateWithoutSupplyCatalogInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskActionWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => TaskActionUpdateWithoutSupplyCatalogInputObjectSchema), z.lazy(() => TaskActionUncheckedUpdateWithoutSupplyCatalogInputObjectSchema)]),
  create: z.union([z.lazy(() => TaskActionCreateWithoutSupplyCatalogInputObjectSchema), z.lazy(() => TaskActionUncheckedCreateWithoutSupplyCatalogInputObjectSchema)])
}).strict();
export const TaskActionUpsertWithWhereUniqueWithoutSupplyCatalogInputObjectSchema: z.ZodType<Prisma.TaskActionUpsertWithWhereUniqueWithoutSupplyCatalogInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskActionUpsertWithWhereUniqueWithoutSupplyCatalogInput>;
export const TaskActionUpsertWithWhereUniqueWithoutSupplyCatalogInputObjectZodSchema = makeSchema();
