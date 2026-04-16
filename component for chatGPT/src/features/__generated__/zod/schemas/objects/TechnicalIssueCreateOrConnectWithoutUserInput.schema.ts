import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueWhereUniqueInputObjectSchema as TechnicalIssueWhereUniqueInputObjectSchema } from './TechnicalIssueWhereUniqueInput.schema';
import { TechnicalIssueCreateWithoutUserInputObjectSchema as TechnicalIssueCreateWithoutUserInputObjectSchema } from './TechnicalIssueCreateWithoutUserInput.schema';
import { TechnicalIssueUncheckedCreateWithoutUserInputObjectSchema as TechnicalIssueUncheckedCreateWithoutUserInputObjectSchema } from './TechnicalIssueUncheckedCreateWithoutUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => TechnicalIssueCreateWithoutUserInputObjectSchema), z.lazy(() => TechnicalIssueUncheckedCreateWithoutUserInputObjectSchema)])
}).strict();
export const TechnicalIssueCreateOrConnectWithoutUserInputObjectSchema: z.ZodType<Prisma.TechnicalIssueCreateOrConnectWithoutUserInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueCreateOrConnectWithoutUserInput>;
export const TechnicalIssueCreateOrConnectWithoutUserInputObjectZodSchema = makeSchema();
