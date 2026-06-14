import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskActionCreateWithoutServiceCatalogInputObjectSchema as TaskActionCreateWithoutServiceCatalogInputObjectSchema } from './TaskActionCreateWithoutServiceCatalogInput.schema';
import { TaskActionUncheckedCreateWithoutServiceCatalogInputObjectSchema as TaskActionUncheckedCreateWithoutServiceCatalogInputObjectSchema } from './TaskActionUncheckedCreateWithoutServiceCatalogInput.schema';
import { TaskActionCreateOrConnectWithoutServiceCatalogInputObjectSchema as TaskActionCreateOrConnectWithoutServiceCatalogInputObjectSchema } from './TaskActionCreateOrConnectWithoutServiceCatalogInput.schema';
import { TaskActionCreateManyServiceCatalogInputEnvelopeObjectSchema as TaskActionCreateManyServiceCatalogInputEnvelopeObjectSchema } from './TaskActionCreateManyServiceCatalogInputEnvelope.schema';
import { TaskActionWhereUniqueInputObjectSchema as TaskActionWhereUniqueInputObjectSchema } from './TaskActionWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskActionCreateWithoutServiceCatalogInputObjectSchema), z.lazy(() => TaskActionCreateWithoutServiceCatalogInputObjectSchema).array(), z.lazy(() => TaskActionUncheckedCreateWithoutServiceCatalogInputObjectSchema), z.lazy(() => TaskActionUncheckedCreateWithoutServiceCatalogInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TaskActionCreateOrConnectWithoutServiceCatalogInputObjectSchema), z.lazy(() => TaskActionCreateOrConnectWithoutServiceCatalogInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => TaskActionCreateManyServiceCatalogInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => TaskActionWhereUniqueInputObjectSchema), z.lazy(() => TaskActionWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const TaskActionCreateNestedManyWithoutServiceCatalogInputObjectSchema: z.ZodType<Prisma.TaskActionCreateNestedManyWithoutServiceCatalogInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskActionCreateNestedManyWithoutServiceCatalogInput>;
export const TaskActionCreateNestedManyWithoutServiceCatalogInputObjectZodSchema = makeSchema();
