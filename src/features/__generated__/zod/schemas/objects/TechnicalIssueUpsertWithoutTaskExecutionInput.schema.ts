import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueUpdateWithoutTaskExecutionInputObjectSchema as TechnicalIssueUpdateWithoutTaskExecutionInputObjectSchema } from './TechnicalIssueUpdateWithoutTaskExecutionInput.schema';
import { TechnicalIssueUncheckedUpdateWithoutTaskExecutionInputObjectSchema as TechnicalIssueUncheckedUpdateWithoutTaskExecutionInputObjectSchema } from './TechnicalIssueUncheckedUpdateWithoutTaskExecutionInput.schema';
import { TechnicalIssueCreateWithoutTaskExecutionInputObjectSchema as TechnicalIssueCreateWithoutTaskExecutionInputObjectSchema } from './TechnicalIssueCreateWithoutTaskExecutionInput.schema';
import { TechnicalIssueUncheckedCreateWithoutTaskExecutionInputObjectSchema as TechnicalIssueUncheckedCreateWithoutTaskExecutionInputObjectSchema } from './TechnicalIssueUncheckedCreateWithoutTaskExecutionInput.schema';
import { TechnicalIssueWhereInputObjectSchema as TechnicalIssueWhereInputObjectSchema } from './TechnicalIssueWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => TechnicalIssueUpdateWithoutTaskExecutionInputObjectSchema), z.lazy(() => TechnicalIssueUncheckedUpdateWithoutTaskExecutionInputObjectSchema)]),
  create: z.union([z.lazy(() => TechnicalIssueCreateWithoutTaskExecutionInputObjectSchema), z.lazy(() => TechnicalIssueUncheckedCreateWithoutTaskExecutionInputObjectSchema)]),
  where: z.lazy(() => TechnicalIssueWhereInputObjectSchema).optional()
}).strict();
export const TechnicalIssueUpsertWithoutTaskExecutionInputObjectSchema: z.ZodType<Prisma.TechnicalIssueUpsertWithoutTaskExecutionInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueUpsertWithoutTaskExecutionInput>;
export const TechnicalIssueUpsertWithoutTaskExecutionInputObjectZodSchema = makeSchema();
