import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskActionWhereUniqueInputObjectSchema as TaskActionWhereUniqueInputObjectSchema } from './TaskActionWhereUniqueInput.schema';
import { TaskActionUpdateWithoutSupplyCatalogInputObjectSchema as TaskActionUpdateWithoutSupplyCatalogInputObjectSchema } from './TaskActionUpdateWithoutSupplyCatalogInput.schema';
import { TaskActionUncheckedUpdateWithoutSupplyCatalogInputObjectSchema as TaskActionUncheckedUpdateWithoutSupplyCatalogInputObjectSchema } from './TaskActionUncheckedUpdateWithoutSupplyCatalogInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskActionWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => TaskActionUpdateWithoutSupplyCatalogInputObjectSchema), z.lazy(() => TaskActionUncheckedUpdateWithoutSupplyCatalogInputObjectSchema)])
}).strict();
export const TaskActionUpdateWithWhereUniqueWithoutSupplyCatalogInputObjectSchema: z.ZodType<Prisma.TaskActionUpdateWithWhereUniqueWithoutSupplyCatalogInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskActionUpdateWithWhereUniqueWithoutSupplyCatalogInput>;
export const TaskActionUpdateWithWhereUniqueWithoutSupplyCatalogInputObjectZodSchema = makeSchema();
