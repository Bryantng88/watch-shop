import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskActionCreateWithoutMechanicalPartCatalogInputObjectSchema as TaskActionCreateWithoutMechanicalPartCatalogInputObjectSchema } from './TaskActionCreateWithoutMechanicalPartCatalogInput.schema';
import { TaskActionUncheckedCreateWithoutMechanicalPartCatalogInputObjectSchema as TaskActionUncheckedCreateWithoutMechanicalPartCatalogInputObjectSchema } from './TaskActionUncheckedCreateWithoutMechanicalPartCatalogInput.schema';
import { TaskActionCreateOrConnectWithoutMechanicalPartCatalogInputObjectSchema as TaskActionCreateOrConnectWithoutMechanicalPartCatalogInputObjectSchema } from './TaskActionCreateOrConnectWithoutMechanicalPartCatalogInput.schema';
import { TaskActionCreateManyMechanicalPartCatalogInputEnvelopeObjectSchema as TaskActionCreateManyMechanicalPartCatalogInputEnvelopeObjectSchema } from './TaskActionCreateManyMechanicalPartCatalogInputEnvelope.schema';
import { TaskActionWhereUniqueInputObjectSchema as TaskActionWhereUniqueInputObjectSchema } from './TaskActionWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskActionCreateWithoutMechanicalPartCatalogInputObjectSchema), z.lazy(() => TaskActionCreateWithoutMechanicalPartCatalogInputObjectSchema).array(), z.lazy(() => TaskActionUncheckedCreateWithoutMechanicalPartCatalogInputObjectSchema), z.lazy(() => TaskActionUncheckedCreateWithoutMechanicalPartCatalogInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TaskActionCreateOrConnectWithoutMechanicalPartCatalogInputObjectSchema), z.lazy(() => TaskActionCreateOrConnectWithoutMechanicalPartCatalogInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => TaskActionCreateManyMechanicalPartCatalogInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => TaskActionWhereUniqueInputObjectSchema), z.lazy(() => TaskActionWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const TaskActionCreateNestedManyWithoutMechanicalPartCatalogInputObjectSchema: z.ZodType<Prisma.TaskActionCreateNestedManyWithoutMechanicalPartCatalogInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskActionCreateNestedManyWithoutMechanicalPartCatalogInput>;
export const TaskActionCreateNestedManyWithoutMechanicalPartCatalogInputObjectZodSchema = makeSchema();
