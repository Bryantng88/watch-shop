import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskActionScalarWhereInputObjectSchema as TaskActionScalarWhereInputObjectSchema } from './TaskActionScalarWhereInput.schema';
import { TaskActionUpdateManyMutationInputObjectSchema as TaskActionUpdateManyMutationInputObjectSchema } from './TaskActionUpdateManyMutationInput.schema';
import { TaskActionUncheckedUpdateManyWithoutMechanicalPartCatalogInputObjectSchema as TaskActionUncheckedUpdateManyWithoutMechanicalPartCatalogInputObjectSchema } from './TaskActionUncheckedUpdateManyWithoutMechanicalPartCatalogInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskActionScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => TaskActionUpdateManyMutationInputObjectSchema), z.lazy(() => TaskActionUncheckedUpdateManyWithoutMechanicalPartCatalogInputObjectSchema)])
}).strict();
export const TaskActionUpdateManyWithWhereWithoutMechanicalPartCatalogInputObjectSchema: z.ZodType<Prisma.TaskActionUpdateManyWithWhereWithoutMechanicalPartCatalogInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskActionUpdateManyWithWhereWithoutMechanicalPartCatalogInput>;
export const TaskActionUpdateManyWithWhereWithoutMechanicalPartCatalogInputObjectZodSchema = makeSchema();
