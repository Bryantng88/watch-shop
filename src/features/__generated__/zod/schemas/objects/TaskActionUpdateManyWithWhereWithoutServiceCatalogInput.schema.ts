import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskActionScalarWhereInputObjectSchema as TaskActionScalarWhereInputObjectSchema } from './TaskActionScalarWhereInput.schema';
import { TaskActionUpdateManyMutationInputObjectSchema as TaskActionUpdateManyMutationInputObjectSchema } from './TaskActionUpdateManyMutationInput.schema';
import { TaskActionUncheckedUpdateManyWithoutServiceCatalogInputObjectSchema as TaskActionUncheckedUpdateManyWithoutServiceCatalogInputObjectSchema } from './TaskActionUncheckedUpdateManyWithoutServiceCatalogInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskActionScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => TaskActionUpdateManyMutationInputObjectSchema), z.lazy(() => TaskActionUncheckedUpdateManyWithoutServiceCatalogInputObjectSchema)])
}).strict();
export const TaskActionUpdateManyWithWhereWithoutServiceCatalogInputObjectSchema: z.ZodType<Prisma.TaskActionUpdateManyWithWhereWithoutServiceCatalogInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskActionUpdateManyWithWhereWithoutServiceCatalogInput>;
export const TaskActionUpdateManyWithWhereWithoutServiceCatalogInputObjectZodSchema = makeSchema();
