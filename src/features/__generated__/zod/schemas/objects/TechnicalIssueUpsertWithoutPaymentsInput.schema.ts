import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueUpdateWithoutPaymentsInputObjectSchema as TechnicalIssueUpdateWithoutPaymentsInputObjectSchema } from './TechnicalIssueUpdateWithoutPaymentsInput.schema';
import { TechnicalIssueUncheckedUpdateWithoutPaymentsInputObjectSchema as TechnicalIssueUncheckedUpdateWithoutPaymentsInputObjectSchema } from './TechnicalIssueUncheckedUpdateWithoutPaymentsInput.schema';
import { TechnicalIssueCreateWithoutPaymentsInputObjectSchema as TechnicalIssueCreateWithoutPaymentsInputObjectSchema } from './TechnicalIssueCreateWithoutPaymentsInput.schema';
import { TechnicalIssueUncheckedCreateWithoutPaymentsInputObjectSchema as TechnicalIssueUncheckedCreateWithoutPaymentsInputObjectSchema } from './TechnicalIssueUncheckedCreateWithoutPaymentsInput.schema';
import { TechnicalIssueWhereInputObjectSchema as TechnicalIssueWhereInputObjectSchema } from './TechnicalIssueWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => TechnicalIssueUpdateWithoutPaymentsInputObjectSchema), z.lazy(() => TechnicalIssueUncheckedUpdateWithoutPaymentsInputObjectSchema)]),
  create: z.union([z.lazy(() => TechnicalIssueCreateWithoutPaymentsInputObjectSchema), z.lazy(() => TechnicalIssueUncheckedCreateWithoutPaymentsInputObjectSchema)]),
  where: z.lazy(() => TechnicalIssueWhereInputObjectSchema).optional()
}).strict();
export const TechnicalIssueUpsertWithoutPaymentsInputObjectSchema: z.ZodType<Prisma.TechnicalIssueUpsertWithoutPaymentsInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueUpsertWithoutPaymentsInput>;
export const TechnicalIssueUpsertWithoutPaymentsInputObjectZodSchema = makeSchema();
