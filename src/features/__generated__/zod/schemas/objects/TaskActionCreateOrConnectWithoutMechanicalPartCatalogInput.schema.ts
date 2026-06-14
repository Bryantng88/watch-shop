import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskActionWhereUniqueInputObjectSchema as TaskActionWhereUniqueInputObjectSchema } from './TaskActionWhereUniqueInput.schema';
import { TaskActionCreateWithoutMechanicalPartCatalogInputObjectSchema as TaskActionCreateWithoutMechanicalPartCatalogInputObjectSchema } from './TaskActionCreateWithoutMechanicalPartCatalogInput.schema';
import { TaskActionUncheckedCreateWithoutMechanicalPartCatalogInputObjectSchema as TaskActionUncheckedCreateWithoutMechanicalPartCatalogInputObjectSchema } from './TaskActionUncheckedCreateWithoutMechanicalPartCatalogInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskActionWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => TaskActionCreateWithoutMechanicalPartCatalogInputObjectSchema), z.lazy(() => TaskActionUncheckedCreateWithoutMechanicalPartCatalogInputObjectSchema)])
}).strict();
export const TaskActionCreateOrConnectWithoutMechanicalPartCatalogInputObjectSchema: z.ZodType<Prisma.TaskActionCreateOrConnectWithoutMechanicalPartCatalogInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskActionCreateOrConnectWithoutMechanicalPartCatalogInput>;
export const TaskActionCreateOrConnectWithoutMechanicalPartCatalogInputObjectZodSchema = makeSchema();
