import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskActionCreateWithoutSupplyCatalogInputObjectSchema as TaskActionCreateWithoutSupplyCatalogInputObjectSchema } from './TaskActionCreateWithoutSupplyCatalogInput.schema';
import { TaskActionUncheckedCreateWithoutSupplyCatalogInputObjectSchema as TaskActionUncheckedCreateWithoutSupplyCatalogInputObjectSchema } from './TaskActionUncheckedCreateWithoutSupplyCatalogInput.schema';
import { TaskActionCreateOrConnectWithoutSupplyCatalogInputObjectSchema as TaskActionCreateOrConnectWithoutSupplyCatalogInputObjectSchema } from './TaskActionCreateOrConnectWithoutSupplyCatalogInput.schema';
import { TaskActionCreateManySupplyCatalogInputEnvelopeObjectSchema as TaskActionCreateManySupplyCatalogInputEnvelopeObjectSchema } from './TaskActionCreateManySupplyCatalogInputEnvelope.schema';
import { TaskActionWhereUniqueInputObjectSchema as TaskActionWhereUniqueInputObjectSchema } from './TaskActionWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskActionCreateWithoutSupplyCatalogInputObjectSchema), z.lazy(() => TaskActionCreateWithoutSupplyCatalogInputObjectSchema).array(), z.lazy(() => TaskActionUncheckedCreateWithoutSupplyCatalogInputObjectSchema), z.lazy(() => TaskActionUncheckedCreateWithoutSupplyCatalogInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TaskActionCreateOrConnectWithoutSupplyCatalogInputObjectSchema), z.lazy(() => TaskActionCreateOrConnectWithoutSupplyCatalogInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => TaskActionCreateManySupplyCatalogInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => TaskActionWhereUniqueInputObjectSchema), z.lazy(() => TaskActionWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const TaskActionCreateNestedManyWithoutSupplyCatalogInputObjectSchema: z.ZodType<Prisma.TaskActionCreateNestedManyWithoutSupplyCatalogInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskActionCreateNestedManyWithoutSupplyCatalogInput>;
export const TaskActionCreateNestedManyWithoutSupplyCatalogInputObjectZodSchema = makeSchema();
