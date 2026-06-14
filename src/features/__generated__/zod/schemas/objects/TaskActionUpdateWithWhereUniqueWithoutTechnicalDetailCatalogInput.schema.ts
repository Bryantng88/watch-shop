import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskActionWhereUniqueInputObjectSchema as TaskActionWhereUniqueInputObjectSchema } from './TaskActionWhereUniqueInput.schema';
import { TaskActionUpdateWithoutTechnicalDetailCatalogInputObjectSchema as TaskActionUpdateWithoutTechnicalDetailCatalogInputObjectSchema } from './TaskActionUpdateWithoutTechnicalDetailCatalogInput.schema';
import { TaskActionUncheckedUpdateWithoutTechnicalDetailCatalogInputObjectSchema as TaskActionUncheckedUpdateWithoutTechnicalDetailCatalogInputObjectSchema } from './TaskActionUncheckedUpdateWithoutTechnicalDetailCatalogInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskActionWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => TaskActionUpdateWithoutTechnicalDetailCatalogInputObjectSchema), z.lazy(() => TaskActionUncheckedUpdateWithoutTechnicalDetailCatalogInputObjectSchema)])
}).strict();
export const TaskActionUpdateWithWhereUniqueWithoutTechnicalDetailCatalogInputObjectSchema: z.ZodType<Prisma.TaskActionUpdateWithWhereUniqueWithoutTechnicalDetailCatalogInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskActionUpdateWithWhereUniqueWithoutTechnicalDetailCatalogInput>;
export const TaskActionUpdateWithWhereUniqueWithoutTechnicalDetailCatalogInputObjectZodSchema = makeSchema();
