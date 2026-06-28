import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AppTagScalarWhereInputObjectSchema as AppTagScalarWhereInputObjectSchema } from './AppTagScalarWhereInput.schema';
import { AppTagUpdateManyMutationInputObjectSchema as AppTagUpdateManyMutationInputObjectSchema } from './AppTagUpdateManyMutationInput.schema';
import { AppTagUncheckedUpdateManyWithoutWorkflowTemplateInputObjectSchema as AppTagUncheckedUpdateManyWithoutWorkflowTemplateInputObjectSchema } from './AppTagUncheckedUpdateManyWithoutWorkflowTemplateInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => AppTagScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => AppTagUpdateManyMutationInputObjectSchema), z.lazy(() => AppTagUncheckedUpdateManyWithoutWorkflowTemplateInputObjectSchema)])
}).strict();
export const AppTagUpdateManyWithWhereWithoutWorkflowTemplateInputObjectSchema: z.ZodType<Prisma.AppTagUpdateManyWithWhereWithoutWorkflowTemplateInput> = makeSchema() as unknown as z.ZodType<Prisma.AppTagUpdateManyWithWhereWithoutWorkflowTemplateInput>;
export const AppTagUpdateManyWithWhereWithoutWorkflowTemplateInputObjectZodSchema = makeSchema();
