import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AppTagCreateWithoutWorkflowTemplateInputObjectSchema as AppTagCreateWithoutWorkflowTemplateInputObjectSchema } from './AppTagCreateWithoutWorkflowTemplateInput.schema';
import { AppTagUncheckedCreateWithoutWorkflowTemplateInputObjectSchema as AppTagUncheckedCreateWithoutWorkflowTemplateInputObjectSchema } from './AppTagUncheckedCreateWithoutWorkflowTemplateInput.schema';
import { AppTagCreateOrConnectWithoutWorkflowTemplateInputObjectSchema as AppTagCreateOrConnectWithoutWorkflowTemplateInputObjectSchema } from './AppTagCreateOrConnectWithoutWorkflowTemplateInput.schema';
import { AppTagUpsertWithWhereUniqueWithoutWorkflowTemplateInputObjectSchema as AppTagUpsertWithWhereUniqueWithoutWorkflowTemplateInputObjectSchema } from './AppTagUpsertWithWhereUniqueWithoutWorkflowTemplateInput.schema';
import { AppTagCreateManyWorkflowTemplateInputEnvelopeObjectSchema as AppTagCreateManyWorkflowTemplateInputEnvelopeObjectSchema } from './AppTagCreateManyWorkflowTemplateInputEnvelope.schema';
import { AppTagWhereUniqueInputObjectSchema as AppTagWhereUniqueInputObjectSchema } from './AppTagWhereUniqueInput.schema';
import { AppTagUpdateWithWhereUniqueWithoutWorkflowTemplateInputObjectSchema as AppTagUpdateWithWhereUniqueWithoutWorkflowTemplateInputObjectSchema } from './AppTagUpdateWithWhereUniqueWithoutWorkflowTemplateInput.schema';
import { AppTagUpdateManyWithWhereWithoutWorkflowTemplateInputObjectSchema as AppTagUpdateManyWithWhereWithoutWorkflowTemplateInputObjectSchema } from './AppTagUpdateManyWithWhereWithoutWorkflowTemplateInput.schema';
import { AppTagScalarWhereInputObjectSchema as AppTagScalarWhereInputObjectSchema } from './AppTagScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => AppTagCreateWithoutWorkflowTemplateInputObjectSchema), z.lazy(() => AppTagCreateWithoutWorkflowTemplateInputObjectSchema).array(), z.lazy(() => AppTagUncheckedCreateWithoutWorkflowTemplateInputObjectSchema), z.lazy(() => AppTagUncheckedCreateWithoutWorkflowTemplateInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => AppTagCreateOrConnectWithoutWorkflowTemplateInputObjectSchema), z.lazy(() => AppTagCreateOrConnectWithoutWorkflowTemplateInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => AppTagUpsertWithWhereUniqueWithoutWorkflowTemplateInputObjectSchema), z.lazy(() => AppTagUpsertWithWhereUniqueWithoutWorkflowTemplateInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => AppTagCreateManyWorkflowTemplateInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => AppTagWhereUniqueInputObjectSchema), z.lazy(() => AppTagWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => AppTagWhereUniqueInputObjectSchema), z.lazy(() => AppTagWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => AppTagWhereUniqueInputObjectSchema), z.lazy(() => AppTagWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => AppTagWhereUniqueInputObjectSchema), z.lazy(() => AppTagWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => AppTagUpdateWithWhereUniqueWithoutWorkflowTemplateInputObjectSchema), z.lazy(() => AppTagUpdateWithWhereUniqueWithoutWorkflowTemplateInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => AppTagUpdateManyWithWhereWithoutWorkflowTemplateInputObjectSchema), z.lazy(() => AppTagUpdateManyWithWhereWithoutWorkflowTemplateInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => AppTagScalarWhereInputObjectSchema), z.lazy(() => AppTagScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const AppTagUpdateManyWithoutWorkflowTemplateNestedInputObjectSchema: z.ZodType<Prisma.AppTagUpdateManyWithoutWorkflowTemplateNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.AppTagUpdateManyWithoutWorkflowTemplateNestedInput>;
export const AppTagUpdateManyWithoutWorkflowTemplateNestedInputObjectZodSchema = makeSchema();
