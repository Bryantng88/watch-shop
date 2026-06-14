import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskActionWhereUniqueInputObjectSchema as TaskActionWhereUniqueInputObjectSchema } from './TaskActionWhereUniqueInput.schema';
import { TaskActionCreateWithoutSupplyCatalogInputObjectSchema as TaskActionCreateWithoutSupplyCatalogInputObjectSchema } from './TaskActionCreateWithoutSupplyCatalogInput.schema';
import { TaskActionUncheckedCreateWithoutSupplyCatalogInputObjectSchema as TaskActionUncheckedCreateWithoutSupplyCatalogInputObjectSchema } from './TaskActionUncheckedCreateWithoutSupplyCatalogInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskActionWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => TaskActionCreateWithoutSupplyCatalogInputObjectSchema), z.lazy(() => TaskActionUncheckedCreateWithoutSupplyCatalogInputObjectSchema)])
}).strict();
export const TaskActionCreateOrConnectWithoutSupplyCatalogInputObjectSchema: z.ZodType<Prisma.TaskActionCreateOrConnectWithoutSupplyCatalogInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskActionCreateOrConnectWithoutSupplyCatalogInput>;
export const TaskActionCreateOrConnectWithoutSupplyCatalogInputObjectZodSchema = makeSchema();
