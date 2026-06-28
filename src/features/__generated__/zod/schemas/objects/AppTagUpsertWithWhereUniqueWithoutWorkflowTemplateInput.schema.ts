import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AppTagWhereUniqueInputObjectSchema as AppTagWhereUniqueInputObjectSchema } from './AppTagWhereUniqueInput.schema';
import { AppTagUpdateWithoutWorkflowTemplateInputObjectSchema as AppTagUpdateWithoutWorkflowTemplateInputObjectSchema } from './AppTagUpdateWithoutWorkflowTemplateInput.schema';
import { AppTagUncheckedUpdateWithoutWorkflowTemplateInputObjectSchema as AppTagUncheckedUpdateWithoutWorkflowTemplateInputObjectSchema } from './AppTagUncheckedUpdateWithoutWorkflowTemplateInput.schema';
import { AppTagCreateWithoutWorkflowTemplateInputObjectSchema as AppTagCreateWithoutWorkflowTemplateInputObjectSchema } from './AppTagCreateWithoutWorkflowTemplateInput.schema';
import { AppTagUncheckedCreateWithoutWorkflowTemplateInputObjectSchema as AppTagUncheckedCreateWithoutWorkflowTemplateInputObjectSchema } from './AppTagUncheckedCreateWithoutWorkflowTemplateInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => AppTagWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => AppTagUpdateWithoutWorkflowTemplateInputObjectSchema), z.lazy(() => AppTagUncheckedUpdateWithoutWorkflowTemplateInputObjectSchema)]),
  create: z.union([z.lazy(() => AppTagCreateWithoutWorkflowTemplateInputObjectSchema), z.lazy(() => AppTagUncheckedCreateWithoutWorkflowTemplateInputObjectSchema)])
}).strict();
export const AppTagUpsertWithWhereUniqueWithoutWorkflowTemplateInputObjectSchema: z.ZodType<Prisma.AppTagUpsertWithWhereUniqueWithoutWorkflowTemplateInput> = makeSchema() as unknown as z.ZodType<Prisma.AppTagUpsertWithWhereUniqueWithoutWorkflowTemplateInput>;
export const AppTagUpsertWithWhereUniqueWithoutWorkflowTemplateInputObjectZodSchema = makeSchema();
