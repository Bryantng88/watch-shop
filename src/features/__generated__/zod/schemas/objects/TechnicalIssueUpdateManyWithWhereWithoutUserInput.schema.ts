import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueScalarWhereInputObjectSchema as TechnicalIssueScalarWhereInputObjectSchema } from './TechnicalIssueScalarWhereInput.schema';
import { TechnicalIssueUpdateManyMutationInputObjectSchema as TechnicalIssueUpdateManyMutationInputObjectSchema } from './TechnicalIssueUpdateManyMutationInput.schema';
import { TechnicalIssueUncheckedUpdateManyWithoutUserInputObjectSchema as TechnicalIssueUncheckedUpdateManyWithoutUserInputObjectSchema } from './TechnicalIssueUncheckedUpdateManyWithoutUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TechnicalIssueScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => TechnicalIssueUpdateManyMutationInputObjectSchema), z.lazy(() => TechnicalIssueUncheckedUpdateManyWithoutUserInputObjectSchema)])
}).strict();
export const TechnicalIssueUpdateManyWithWhereWithoutUserInputObjectSchema: z.ZodType<Prisma.TechnicalIssueUpdateManyWithWhereWithoutUserInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueUpdateManyWithWhereWithoutUserInput>;
export const TechnicalIssueUpdateManyWithWhereWithoutUserInputObjectZodSchema = makeSchema();
