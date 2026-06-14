import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskActionWhereUniqueInputObjectSchema as TaskActionWhereUniqueInputObjectSchema } from './TaskActionWhereUniqueInput.schema';
import { TaskActionCreateWithoutServiceCatalogInputObjectSchema as TaskActionCreateWithoutServiceCatalogInputObjectSchema } from './TaskActionCreateWithoutServiceCatalogInput.schema';
import { TaskActionUncheckedCreateWithoutServiceCatalogInputObjectSchema as TaskActionUncheckedCreateWithoutServiceCatalogInputObjectSchema } from './TaskActionUncheckedCreateWithoutServiceCatalogInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskActionWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => TaskActionCreateWithoutServiceCatalogInputObjectSchema), z.lazy(() => TaskActionUncheckedCreateWithoutServiceCatalogInputObjectSchema)])
}).strict();
export const TaskActionCreateOrConnectWithoutServiceCatalogInputObjectSchema: z.ZodType<Prisma.TaskActionCreateOrConnectWithoutServiceCatalogInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskActionCreateOrConnectWithoutServiceCatalogInput>;
export const TaskActionCreateOrConnectWithoutServiceCatalogInputObjectZodSchema = makeSchema();
