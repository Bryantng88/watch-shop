import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AppTagWhereUniqueInputObjectSchema as AppTagWhereUniqueInputObjectSchema } from './AppTagWhereUniqueInput.schema';
import { AppTagUpdateWithoutWorkflowTemplateInputObjectSchema as AppTagUpdateWithoutWorkflowTemplateInputObjectSchema } from './AppTagUpdateWithoutWorkflowTemplateInput.schema';
import { AppTagUncheckedUpdateWithoutWorkflowTemplateInputObjectSchema as AppTagUncheckedUpdateWithoutWorkflowTemplateInputObjectSchema } from './AppTagUncheckedUpdateWithoutWorkflowTemplateInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => AppTagWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => AppTagUpdateWithoutWorkflowTemplateInputObjectSchema), z.lazy(() => AppTagUncheckedUpdateWithoutWorkflowTemplateInputObjectSchema)])
}).strict();
export const AppTagUpdateWithWhereUniqueWithoutWorkflowTemplateInputObjectSchema: z.ZodType<Prisma.AppTagUpdateWithWhereUniqueWithoutWorkflowTemplateInput> = makeSchema() as unknown as z.ZodType<Prisma.AppTagUpdateWithWhereUniqueWithoutWorkflowTemplateInput>;
export const AppTagUpdateWithWhereUniqueWithoutWorkflowTemplateInputObjectZodSchema = makeSchema();
