import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueCreateWithoutPaymentsInputObjectSchema as TechnicalIssueCreateWithoutPaymentsInputObjectSchema } from './TechnicalIssueCreateWithoutPaymentsInput.schema';
import { TechnicalIssueUncheckedCreateWithoutPaymentsInputObjectSchema as TechnicalIssueUncheckedCreateWithoutPaymentsInputObjectSchema } from './TechnicalIssueUncheckedCreateWithoutPaymentsInput.schema';
import { TechnicalIssueCreateOrConnectWithoutPaymentsInputObjectSchema as TechnicalIssueCreateOrConnectWithoutPaymentsInputObjectSchema } from './TechnicalIssueCreateOrConnectWithoutPaymentsInput.schema';
import { TechnicalIssueWhereUniqueInputObjectSchema as TechnicalIssueWhereUniqueInputObjectSchema } from './TechnicalIssueWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TechnicalIssueCreateWithoutPaymentsInputObjectSchema), z.lazy(() => TechnicalIssueUncheckedCreateWithoutPaymentsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => TechnicalIssueCreateOrConnectWithoutPaymentsInputObjectSchema).optional(),
  connect: z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema).optional()
}).strict();
export const TechnicalIssueCreateNestedOneWithoutPaymentsInputObjectSchema: z.ZodType<Prisma.TechnicalIssueCreateNestedOneWithoutPaymentsInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueCreateNestedOneWithoutPaymentsInput>;
export const TechnicalIssueCreateNestedOneWithoutPaymentsInputObjectZodSchema = makeSchema();
