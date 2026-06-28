import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AppTagCreateWithoutWorkflowTemplateInputObjectSchema as AppTagCreateWithoutWorkflowTemplateInputObjectSchema } from './AppTagCreateWithoutWorkflowTemplateInput.schema';
import { AppTagUncheckedCreateWithoutWorkflowTemplateInputObjectSchema as AppTagUncheckedCreateWithoutWorkflowTemplateInputObjectSchema } from './AppTagUncheckedCreateWithoutWorkflowTemplateInput.schema';
import { AppTagCreateOrConnectWithoutWorkflowTemplateInputObjectSchema as AppTagCreateOrConnectWithoutWorkflowTemplateInputObjectSchema } from './AppTagCreateOrConnectWithoutWorkflowTemplateInput.schema';
import { AppTagCreateManyWorkflowTemplateInputEnvelopeObjectSchema as AppTagCreateManyWorkflowTemplateInputEnvelopeObjectSchema } from './AppTagCreateManyWorkflowTemplateInputEnvelope.schema';
import { AppTagWhereUniqueInputObjectSchema as AppTagWhereUniqueInputObjectSchema } from './AppTagWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => AppTagCreateWithoutWorkflowTemplateInputObjectSchema), z.lazy(() => AppTagCreateWithoutWorkflowTemplateInputObjectSchema).array(), z.lazy(() => AppTagUncheckedCreateWithoutWorkflowTemplateInputObjectSchema), z.lazy(() => AppTagUncheckedCreateWithoutWorkflowTemplateInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => AppTagCreateOrConnectWithoutWorkflowTemplateInputObjectSchema), z.lazy(() => AppTagCreateOrConnectWithoutWorkflowTemplateInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => AppTagCreateManyWorkflowTemplateInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => AppTagWhereUniqueInputObjectSchema), z.lazy(() => AppTagWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const AppTagCreateNestedManyWithoutWorkflowTemplateInputObjectSchema: z.ZodType<Prisma.AppTagCreateNestedManyWithoutWorkflowTemplateInput> = makeSchema() as unknown as z.ZodType<Prisma.AppTagCreateNestedManyWithoutWorkflowTemplateInput>;
export const AppTagCreateNestedManyWithoutWorkflowTemplateInputObjectZodSchema = makeSchema();
