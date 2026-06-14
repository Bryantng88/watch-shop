import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskActionWhereUniqueInputObjectSchema as TaskActionWhereUniqueInputObjectSchema } from './TaskActionWhereUniqueInput.schema';
import { TaskActionUpdateWithoutServiceCatalogInputObjectSchema as TaskActionUpdateWithoutServiceCatalogInputObjectSchema } from './TaskActionUpdateWithoutServiceCatalogInput.schema';
import { TaskActionUncheckedUpdateWithoutServiceCatalogInputObjectSchema as TaskActionUncheckedUpdateWithoutServiceCatalogInputObjectSchema } from './TaskActionUncheckedUpdateWithoutServiceCatalogInput.schema';
import { TaskActionCreateWithoutServiceCatalogInputObjectSchema as TaskActionCreateWithoutServiceCatalogInputObjectSchema } from './TaskActionCreateWithoutServiceCatalogInput.schema';
import { TaskActionUncheckedCreateWithoutServiceCatalogInputObjectSchema as TaskActionUncheckedCreateWithoutServiceCatalogInputObjectSchema } from './TaskActionUncheckedCreateWithoutServiceCatalogInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskActionWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => TaskActionUpdateWithoutServiceCatalogInputObjectSchema), z.lazy(() => TaskActionUncheckedUpdateWithoutServiceCatalogInputObjectSchema)]),
  create: z.union([z.lazy(() => TaskActionCreateWithoutServiceCatalogInputObjectSchema), z.lazy(() => TaskActionUncheckedCreateWithoutServiceCatalogInputObjectSchema)])
}).strict();
export const TaskActionUpsertWithWhereUniqueWithoutServiceCatalogInputObjectSchema: z.ZodType<Prisma.TaskActionUpsertWithWhereUniqueWithoutServiceCatalogInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskActionUpsertWithWhereUniqueWithoutServiceCatalogInput>;
export const TaskActionUpsertWithWhereUniqueWithoutServiceCatalogInputObjectZodSchema = makeSchema();
