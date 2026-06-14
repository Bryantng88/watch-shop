import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskActionScalarWhereInputObjectSchema as TaskActionScalarWhereInputObjectSchema } from './TaskActionScalarWhereInput.schema';
import { TaskActionUpdateManyMutationInputObjectSchema as TaskActionUpdateManyMutationInputObjectSchema } from './TaskActionUpdateManyMutationInput.schema';
import { TaskActionUncheckedUpdateManyWithoutTechnicalDetailCatalogInputObjectSchema as TaskActionUncheckedUpdateManyWithoutTechnicalDetailCatalogInputObjectSchema } from './TaskActionUncheckedUpdateManyWithoutTechnicalDetailCatalogInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskActionScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => TaskActionUpdateManyMutationInputObjectSchema), z.lazy(() => TaskActionUncheckedUpdateManyWithoutTechnicalDetailCatalogInputObjectSchema)])
}).strict();
export const TaskActionUpdateManyWithWhereWithoutTechnicalDetailCatalogInputObjectSchema: z.ZodType<Prisma.TaskActionUpdateManyWithWhereWithoutTechnicalDetailCatalogInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskActionUpdateManyWithWhereWithoutTechnicalDetailCatalogInput>;
export const TaskActionUpdateManyWithWhereWithoutTechnicalDetailCatalogInputObjectZodSchema = makeSchema();
