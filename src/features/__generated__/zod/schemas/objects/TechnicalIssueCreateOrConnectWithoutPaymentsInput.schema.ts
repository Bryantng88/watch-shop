import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueWhereUniqueInputObjectSchema as TechnicalIssueWhereUniqueInputObjectSchema } from './TechnicalIssueWhereUniqueInput.schema';
import { TechnicalIssueCreateWithoutPaymentsInputObjectSchema as TechnicalIssueCreateWithoutPaymentsInputObjectSchema } from './TechnicalIssueCreateWithoutPaymentsInput.schema';
import { TechnicalIssueUncheckedCreateWithoutPaymentsInputObjectSchema as TechnicalIssueUncheckedCreateWithoutPaymentsInputObjectSchema } from './TechnicalIssueUncheckedCreateWithoutPaymentsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => TechnicalIssueCreateWithoutPaymentsInputObjectSchema), z.lazy(() => TechnicalIssueUncheckedCreateWithoutPaymentsInputObjectSchema)])
}).strict();
export const TechnicalIssueCreateOrConnectWithoutPaymentsInputObjectSchema: z.ZodType<Prisma.TechnicalIssueCreateOrConnectWithoutPaymentsInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueCreateOrConnectWithoutPaymentsInput>;
export const TechnicalIssueCreateOrConnectWithoutPaymentsInputObjectZodSchema = makeSchema();
