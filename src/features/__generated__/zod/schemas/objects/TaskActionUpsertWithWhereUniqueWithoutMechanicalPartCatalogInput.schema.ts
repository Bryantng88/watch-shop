import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskActionWhereUniqueInputObjectSchema as TaskActionWhereUniqueInputObjectSchema } from './TaskActionWhereUniqueInput.schema';
import { TaskActionUpdateWithoutMechanicalPartCatalogInputObjectSchema as TaskActionUpdateWithoutMechanicalPartCatalogInputObjectSchema } from './TaskActionUpdateWithoutMechanicalPartCatalogInput.schema';
import { TaskActionUncheckedUpdateWithoutMechanicalPartCatalogInputObjectSchema as TaskActionUncheckedUpdateWithoutMechanicalPartCatalogInputObjectSchema } from './TaskActionUncheckedUpdateWithoutMechanicalPartCatalogInput.schema';
import { TaskActionCreateWithoutMechanicalPartCatalogInputObjectSchema as TaskActionCreateWithoutMechanicalPartCatalogInputObjectSchema } from './TaskActionCreateWithoutMechanicalPartCatalogInput.schema';
import { TaskActionUncheckedCreateWithoutMechanicalPartCatalogInputObjectSchema as TaskActionUncheckedCreateWithoutMechanicalPartCatalogInputObjectSchema } from './TaskActionUncheckedCreateWithoutMechanicalPartCatalogInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskActionWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => TaskActionUpdateWithoutMechanicalPartCatalogInputObjectSchema), z.lazy(() => TaskActionUncheckedUpdateWithoutMechanicalPartCatalogInputObjectSchema)]),
  create: z.union([z.lazy(() => TaskActionCreateWithoutMechanicalPartCatalogInputObjectSchema), z.lazy(() => TaskActionUncheckedCreateWithoutMechanicalPartCatalogInputObjectSchema)])
}).strict();
export const TaskActionUpsertWithWhereUniqueWithoutMechanicalPartCatalogInputObjectSchema: z.ZodType<Prisma.TaskActionUpsertWithWhereUniqueWithoutMechanicalPartCatalogInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskActionUpsertWithWhereUniqueWithoutMechanicalPartCatalogInput>;
export const TaskActionUpsertWithWhereUniqueWithoutMechanicalPartCatalogInputObjectZodSchema = makeSchema();
