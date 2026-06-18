import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueWhereInputObjectSchema as TechnicalIssueWhereInputObjectSchema } from './TechnicalIssueWhereInput.schema';
import { TechnicalIssueUpdateWithoutTaskExecutionInputObjectSchema as TechnicalIssueUpdateWithoutTaskExecutionInputObjectSchema } from './TechnicalIssueUpdateWithoutTaskExecutionInput.schema';
import { TechnicalIssueUncheckedUpdateWithoutTaskExecutionInputObjectSchema as TechnicalIssueUncheckedUpdateWithoutTaskExecutionInputObjectSchema } from './TechnicalIssueUncheckedUpdateWithoutTaskExecutionInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TechnicalIssueWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => TechnicalIssueUpdateWithoutTaskExecutionInputObjectSchema), z.lazy(() => TechnicalIssueUncheckedUpdateWithoutTaskExecutionInputObjectSchema)])
}).strict();
export const TechnicalIssueUpdateToOneWithWhereWithoutTaskExecutionInputObjectSchema: z.ZodType<Prisma.TechnicalIssueUpdateToOneWithWhereWithoutTaskExecutionInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueUpdateToOneWithWhereWithoutTaskExecutionInput>;
export const TechnicalIssueUpdateToOneWithWhereWithoutTaskExecutionInputObjectZodSchema = makeSchema();
