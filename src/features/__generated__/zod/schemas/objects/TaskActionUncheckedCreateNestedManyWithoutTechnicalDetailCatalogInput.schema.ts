import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskActionCreateWithoutTechnicalDetailCatalogInputObjectSchema as TaskActionCreateWithoutTechnicalDetailCatalogInputObjectSchema } from './TaskActionCreateWithoutTechnicalDetailCatalogInput.schema';
import { TaskActionUncheckedCreateWithoutTechnicalDetailCatalogInputObjectSchema as TaskActionUncheckedCreateWithoutTechnicalDetailCatalogInputObjectSchema } from './TaskActionUncheckedCreateWithoutTechnicalDetailCatalogInput.schema';
import { TaskActionCreateOrConnectWithoutTechnicalDetailCatalogInputObjectSchema as TaskActionCreateOrConnectWithoutTechnicalDetailCatalogInputObjectSchema } from './TaskActionCreateOrConnectWithoutTechnicalDetailCatalogInput.schema';
import { TaskActionCreateManyTechnicalDetailCatalogInputEnvelopeObjectSchema as TaskActionCreateManyTechnicalDetailCatalogInputEnvelopeObjectSchema } from './TaskActionCreateManyTechnicalDetailCatalogInputEnvelope.schema';
import { TaskActionWhereUniqueInputObjectSchema as TaskActionWhereUniqueInputObjectSchema } from './TaskActionWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskActionCreateWithoutTechnicalDetailCatalogInputObjectSchema), z.lazy(() => TaskActionCreateWithoutTechnicalDetailCatalogInputObjectSchema).array(), z.lazy(() => TaskActionUncheckedCreateWithoutTechnicalDetailCatalogInputObjectSchema), z.lazy(() => TaskActionUncheckedCreateWithoutTechnicalDetailCatalogInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TaskActionCreateOrConnectWithoutTechnicalDetailCatalogInputObjectSchema), z.lazy(() => TaskActionCreateOrConnectWithoutTechnicalDetailCatalogInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => TaskActionCreateManyTechnicalDetailCatalogInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => TaskActionWhereUniqueInputObjectSchema), z.lazy(() => TaskActionWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const TaskActionUncheckedCreateNestedManyWithoutTechnicalDetailCatalogInputObjectSchema: z.ZodType<Prisma.TaskActionUncheckedCreateNestedManyWithoutTechnicalDetailCatalogInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskActionUncheckedCreateNestedManyWithoutTechnicalDetailCatalogInput>;
export const TaskActionUncheckedCreateNestedManyWithoutTechnicalDetailCatalogInputObjectZodSchema = makeSchema();
