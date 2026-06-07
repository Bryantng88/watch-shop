import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueWhereInputObjectSchema as TechnicalIssueWhereInputObjectSchema } from './TechnicalIssueWhereInput.schema';
import { TechnicalIssueUpdateWithoutPaymentsInputObjectSchema as TechnicalIssueUpdateWithoutPaymentsInputObjectSchema } from './TechnicalIssueUpdateWithoutPaymentsInput.schema';
import { TechnicalIssueUncheckedUpdateWithoutPaymentsInputObjectSchema as TechnicalIssueUncheckedUpdateWithoutPaymentsInputObjectSchema } from './TechnicalIssueUncheckedUpdateWithoutPaymentsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TechnicalIssueWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => TechnicalIssueUpdateWithoutPaymentsInputObjectSchema), z.lazy(() => TechnicalIssueUncheckedUpdateWithoutPaymentsInputObjectSchema)])
}).strict();
export const TechnicalIssueUpdateToOneWithWhereWithoutPaymentsInputObjectSchema: z.ZodType<Prisma.TechnicalIssueUpdateToOneWithWhereWithoutPaymentsInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueUpdateToOneWithWhereWithoutPaymentsInput>;
export const TechnicalIssueUpdateToOneWithWhereWithoutPaymentsInputObjectZodSchema = makeSchema();
