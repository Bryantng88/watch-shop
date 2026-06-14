import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskActionWhereUniqueInputObjectSchema as TaskActionWhereUniqueInputObjectSchema } from './TaskActionWhereUniqueInput.schema';
import { TaskActionUpdateWithoutMechanicalPartCatalogInputObjectSchema as TaskActionUpdateWithoutMechanicalPartCatalogInputObjectSchema } from './TaskActionUpdateWithoutMechanicalPartCatalogInput.schema';
import { TaskActionUncheckedUpdateWithoutMechanicalPartCatalogInputObjectSchema as TaskActionUncheckedUpdateWithoutMechanicalPartCatalogInputObjectSchema } from './TaskActionUncheckedUpdateWithoutMechanicalPartCatalogInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskActionWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => TaskActionUpdateWithoutMechanicalPartCatalogInputObjectSchema), z.lazy(() => TaskActionUncheckedUpdateWithoutMechanicalPartCatalogInputObjectSchema)])
}).strict();
export const TaskActionUpdateWithWhereUniqueWithoutMechanicalPartCatalogInputObjectSchema: z.ZodType<Prisma.TaskActionUpdateWithWhereUniqueWithoutMechanicalPartCatalogInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskActionUpdateWithWhereUniqueWithoutMechanicalPartCatalogInput>;
export const TaskActionUpdateWithWhereUniqueWithoutMechanicalPartCatalogInputObjectZodSchema = makeSchema();
