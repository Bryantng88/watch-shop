import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueWhereUniqueInputObjectSchema as TechnicalIssueWhereUniqueInputObjectSchema } from './TechnicalIssueWhereUniqueInput.schema';
import { TechnicalIssueUpdateWithoutUserInputObjectSchema as TechnicalIssueUpdateWithoutUserInputObjectSchema } from './TechnicalIssueUpdateWithoutUserInput.schema';
import { TechnicalIssueUncheckedUpdateWithoutUserInputObjectSchema as TechnicalIssueUncheckedUpdateWithoutUserInputObjectSchema } from './TechnicalIssueUncheckedUpdateWithoutUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => TechnicalIssueUpdateWithoutUserInputObjectSchema), z.lazy(() => TechnicalIssueUncheckedUpdateWithoutUserInputObjectSchema)])
}).strict();
export const TechnicalIssueUpdateWithWhereUniqueWithoutUserInputObjectSchema: z.ZodType<Prisma.TechnicalIssueUpdateWithWhereUniqueWithoutUserInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueUpdateWithWhereUniqueWithoutUserInput>;
export const TechnicalIssueUpdateWithWhereUniqueWithoutUserInputObjectZodSchema = makeSchema();
