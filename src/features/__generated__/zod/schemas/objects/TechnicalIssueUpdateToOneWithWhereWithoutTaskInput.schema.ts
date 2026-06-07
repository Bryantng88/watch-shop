import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueWhereInputObjectSchema as TechnicalIssueWhereInputObjectSchema } from './TechnicalIssueWhereInput.schema';
import { TechnicalIssueUpdateWithoutTaskInputObjectSchema as TechnicalIssueUpdateWithoutTaskInputObjectSchema } from './TechnicalIssueUpdateWithoutTaskInput.schema';
import { TechnicalIssueUncheckedUpdateWithoutTaskInputObjectSchema as TechnicalIssueUncheckedUpdateWithoutTaskInputObjectSchema } from './TechnicalIssueUncheckedUpdateWithoutTaskInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TechnicalIssueWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => TechnicalIssueUpdateWithoutTaskInputObjectSchema), z.lazy(() => TechnicalIssueUncheckedUpdateWithoutTaskInputObjectSchema)])
}).strict();
export const TechnicalIssueUpdateToOneWithWhereWithoutTaskInputObjectSchema: z.ZodType<Prisma.TechnicalIssueUpdateToOneWithWhereWithoutTaskInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueUpdateToOneWithWhereWithoutTaskInput>;
export const TechnicalIssueUpdateToOneWithWhereWithoutTaskInputObjectZodSchema = makeSchema();
