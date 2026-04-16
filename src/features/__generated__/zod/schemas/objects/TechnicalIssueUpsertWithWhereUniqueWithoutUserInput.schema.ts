import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueWhereUniqueInputObjectSchema as TechnicalIssueWhereUniqueInputObjectSchema } from './TechnicalIssueWhereUniqueInput.schema';
import { TechnicalIssueUpdateWithoutUserInputObjectSchema as TechnicalIssueUpdateWithoutUserInputObjectSchema } from './TechnicalIssueUpdateWithoutUserInput.schema';
import { TechnicalIssueUncheckedUpdateWithoutUserInputObjectSchema as TechnicalIssueUncheckedUpdateWithoutUserInputObjectSchema } from './TechnicalIssueUncheckedUpdateWithoutUserInput.schema';
import { TechnicalIssueCreateWithoutUserInputObjectSchema as TechnicalIssueCreateWithoutUserInputObjectSchema } from './TechnicalIssueCreateWithoutUserInput.schema';
import { TechnicalIssueUncheckedCreateWithoutUserInputObjectSchema as TechnicalIssueUncheckedCreateWithoutUserInputObjectSchema } from './TechnicalIssueUncheckedCreateWithoutUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => TechnicalIssueUpdateWithoutUserInputObjectSchema), z.lazy(() => TechnicalIssueUncheckedUpdateWithoutUserInputObjectSchema)]),
  create: z.union([z.lazy(() => TechnicalIssueCreateWithoutUserInputObjectSchema), z.lazy(() => TechnicalIssueUncheckedCreateWithoutUserInputObjectSchema)])
}).strict();
export const TechnicalIssueUpsertWithWhereUniqueWithoutUserInputObjectSchema: z.ZodType<Prisma.TechnicalIssueUpsertWithWhereUniqueWithoutUserInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueUpsertWithWhereUniqueWithoutUserInput>;
export const TechnicalIssueUpsertWithWhereUniqueWithoutUserInputObjectZodSchema = makeSchema();
