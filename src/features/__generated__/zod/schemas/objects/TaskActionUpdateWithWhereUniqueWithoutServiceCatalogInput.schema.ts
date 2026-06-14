import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskActionWhereUniqueInputObjectSchema as TaskActionWhereUniqueInputObjectSchema } from './TaskActionWhereUniqueInput.schema';
import { TaskActionUpdateWithoutServiceCatalogInputObjectSchema as TaskActionUpdateWithoutServiceCatalogInputObjectSchema } from './TaskActionUpdateWithoutServiceCatalogInput.schema';
import { TaskActionUncheckedUpdateWithoutServiceCatalogInputObjectSchema as TaskActionUncheckedUpdateWithoutServiceCatalogInputObjectSchema } from './TaskActionUncheckedUpdateWithoutServiceCatalogInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskActionWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => TaskActionUpdateWithoutServiceCatalogInputObjectSchema), z.lazy(() => TaskActionUncheckedUpdateWithoutServiceCatalogInputObjectSchema)])
}).strict();
export const TaskActionUpdateWithWhereUniqueWithoutServiceCatalogInputObjectSchema: z.ZodType<Prisma.TaskActionUpdateWithWhereUniqueWithoutServiceCatalogInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskActionUpdateWithWhereUniqueWithoutServiceCatalogInput>;
export const TaskActionUpdateWithWhereUniqueWithoutServiceCatalogInputObjectZodSchema = makeSchema();
