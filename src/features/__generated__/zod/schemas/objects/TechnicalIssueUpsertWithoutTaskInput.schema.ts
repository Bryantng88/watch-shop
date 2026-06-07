import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueUpdateWithoutTaskInputObjectSchema as TechnicalIssueUpdateWithoutTaskInputObjectSchema } from './TechnicalIssueUpdateWithoutTaskInput.schema';
import { TechnicalIssueUncheckedUpdateWithoutTaskInputObjectSchema as TechnicalIssueUncheckedUpdateWithoutTaskInputObjectSchema } from './TechnicalIssueUncheckedUpdateWithoutTaskInput.schema';
import { TechnicalIssueCreateWithoutTaskInputObjectSchema as TechnicalIssueCreateWithoutTaskInputObjectSchema } from './TechnicalIssueCreateWithoutTaskInput.schema';
import { TechnicalIssueUncheckedCreateWithoutTaskInputObjectSchema as TechnicalIssueUncheckedCreateWithoutTaskInputObjectSchema } from './TechnicalIssueUncheckedCreateWithoutTaskInput.schema';
import { TechnicalIssueWhereInputObjectSchema as TechnicalIssueWhereInputObjectSchema } from './TechnicalIssueWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => TechnicalIssueUpdateWithoutTaskInputObjectSchema), z.lazy(() => TechnicalIssueUncheckedUpdateWithoutTaskInputObjectSchema)]),
  create: z.union([z.lazy(() => TechnicalIssueCreateWithoutTaskInputObjectSchema), z.lazy(() => TechnicalIssueUncheckedCreateWithoutTaskInputObjectSchema)]),
  where: z.lazy(() => TechnicalIssueWhereInputObjectSchema).optional()
}).strict();
export const TechnicalIssueUpsertWithoutTaskInputObjectSchema: z.ZodType<Prisma.TechnicalIssueUpsertWithoutTaskInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueUpsertWithoutTaskInput>;
export const TechnicalIssueUpsertWithoutTaskInputObjectZodSchema = makeSchema();
