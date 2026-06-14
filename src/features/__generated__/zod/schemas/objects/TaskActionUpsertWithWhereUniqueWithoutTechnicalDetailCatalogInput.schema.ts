import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskActionWhereUniqueInputObjectSchema as TaskActionWhereUniqueInputObjectSchema } from './TaskActionWhereUniqueInput.schema';
import { TaskActionUpdateWithoutTechnicalDetailCatalogInputObjectSchema as TaskActionUpdateWithoutTechnicalDetailCatalogInputObjectSchema } from './TaskActionUpdateWithoutTechnicalDetailCatalogInput.schema';
import { TaskActionUncheckedUpdateWithoutTechnicalDetailCatalogInputObjectSchema as TaskActionUncheckedUpdateWithoutTechnicalDetailCatalogInputObjectSchema } from './TaskActionUncheckedUpdateWithoutTechnicalDetailCatalogInput.schema';
import { TaskActionCreateWithoutTechnicalDetailCatalogInputObjectSchema as TaskActionCreateWithoutTechnicalDetailCatalogInputObjectSchema } from './TaskActionCreateWithoutTechnicalDetailCatalogInput.schema';
import { TaskActionUncheckedCreateWithoutTechnicalDetailCatalogInputObjectSchema as TaskActionUncheckedCreateWithoutTechnicalDetailCatalogInputObjectSchema } from './TaskActionUncheckedCreateWithoutTechnicalDetailCatalogInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskActionWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => TaskActionUpdateWithoutTechnicalDetailCatalogInputObjectSchema), z.lazy(() => TaskActionUncheckedUpdateWithoutTechnicalDetailCatalogInputObjectSchema)]),
  create: z.union([z.lazy(() => TaskActionCreateWithoutTechnicalDetailCatalogInputObjectSchema), z.lazy(() => TaskActionUncheckedCreateWithoutTechnicalDetailCatalogInputObjectSchema)])
}).strict();
export const TaskActionUpsertWithWhereUniqueWithoutTechnicalDetailCatalogInputObjectSchema: z.ZodType<Prisma.TaskActionUpsertWithWhereUniqueWithoutTechnicalDetailCatalogInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskActionUpsertWithWhereUniqueWithoutTechnicalDetailCatalogInput>;
export const TaskActionUpsertWithWhereUniqueWithoutTechnicalDetailCatalogInputObjectZodSchema = makeSchema();
