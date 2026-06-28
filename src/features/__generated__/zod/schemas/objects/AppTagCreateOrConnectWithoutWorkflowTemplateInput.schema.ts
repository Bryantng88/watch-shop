import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AppTagWhereUniqueInputObjectSchema as AppTagWhereUniqueInputObjectSchema } from './AppTagWhereUniqueInput.schema';
import { AppTagCreateWithoutWorkflowTemplateInputObjectSchema as AppTagCreateWithoutWorkflowTemplateInputObjectSchema } from './AppTagCreateWithoutWorkflowTemplateInput.schema';
import { AppTagUncheckedCreateWithoutWorkflowTemplateInputObjectSchema as AppTagUncheckedCreateWithoutWorkflowTemplateInputObjectSchema } from './AppTagUncheckedCreateWithoutWorkflowTemplateInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => AppTagWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => AppTagCreateWithoutWorkflowTemplateInputObjectSchema), z.lazy(() => AppTagUncheckedCreateWithoutWorkflowTemplateInputObjectSchema)])
}).strict();
export const AppTagCreateOrConnectWithoutWorkflowTemplateInputObjectSchema: z.ZodType<Prisma.AppTagCreateOrConnectWithoutWorkflowTemplateInput> = makeSchema() as unknown as z.ZodType<Prisma.AppTagCreateOrConnectWithoutWorkflowTemplateInput>;
export const AppTagCreateOrConnectWithoutWorkflowTemplateInputObjectZodSchema = makeSchema();
