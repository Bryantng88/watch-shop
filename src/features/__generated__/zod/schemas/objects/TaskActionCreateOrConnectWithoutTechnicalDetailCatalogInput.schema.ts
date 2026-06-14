import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskActionWhereUniqueInputObjectSchema as TaskActionWhereUniqueInputObjectSchema } from './TaskActionWhereUniqueInput.schema';
import { TaskActionCreateWithoutTechnicalDetailCatalogInputObjectSchema as TaskActionCreateWithoutTechnicalDetailCatalogInputObjectSchema } from './TaskActionCreateWithoutTechnicalDetailCatalogInput.schema';
import { TaskActionUncheckedCreateWithoutTechnicalDetailCatalogInputObjectSchema as TaskActionUncheckedCreateWithoutTechnicalDetailCatalogInputObjectSchema } from './TaskActionUncheckedCreateWithoutTechnicalDetailCatalogInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskActionWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => TaskActionCreateWithoutTechnicalDetailCatalogInputObjectSchema), z.lazy(() => TaskActionUncheckedCreateWithoutTechnicalDetailCatalogInputObjectSchema)])
}).strict();
export const TaskActionCreateOrConnectWithoutTechnicalDetailCatalogInputObjectSchema: z.ZodType<Prisma.TaskActionCreateOrConnectWithoutTechnicalDetailCatalogInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskActionCreateOrConnectWithoutTechnicalDetailCatalogInput>;
export const TaskActionCreateOrConnectWithoutTechnicalDetailCatalogInputObjectZodSchema = makeSchema();
