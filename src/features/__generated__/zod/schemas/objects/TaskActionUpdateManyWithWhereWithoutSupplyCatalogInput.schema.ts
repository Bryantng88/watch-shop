import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskActionScalarWhereInputObjectSchema as TaskActionScalarWhereInputObjectSchema } from './TaskActionScalarWhereInput.schema';
import { TaskActionUpdateManyMutationInputObjectSchema as TaskActionUpdateManyMutationInputObjectSchema } from './TaskActionUpdateManyMutationInput.schema';
import { TaskActionUncheckedUpdateManyWithoutSupplyCatalogInputObjectSchema as TaskActionUncheckedUpdateManyWithoutSupplyCatalogInputObjectSchema } from './TaskActionUncheckedUpdateManyWithoutSupplyCatalogInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskActionScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => TaskActionUpdateManyMutationInputObjectSchema), z.lazy(() => TaskActionUncheckedUpdateManyWithoutSupplyCatalogInputObjectSchema)])
}).strict();
export const TaskActionUpdateManyWithWhereWithoutSupplyCatalogInputObjectSchema: z.ZodType<Prisma.TaskActionUpdateManyWithWhereWithoutSupplyCatalogInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskActionUpdateManyWithWhereWithoutSupplyCatalogInput>;
export const TaskActionUpdateManyWithWhereWithoutSupplyCatalogInputObjectZodSchema = makeSchema();
