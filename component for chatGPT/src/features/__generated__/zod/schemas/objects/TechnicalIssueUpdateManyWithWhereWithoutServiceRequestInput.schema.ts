import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueScalarWhereInputObjectSchema as TechnicalIssueScalarWhereInputObjectSchema } from './TechnicalIssueScalarWhereInput.schema';
import { TechnicalIssueUpdateManyMutationInputObjectSchema as TechnicalIssueUpdateManyMutationInputObjectSchema } from './TechnicalIssueUpdateManyMutationInput.schema';
import { TechnicalIssueUncheckedUpdateManyWithoutServiceRequestInputObjectSchema as TechnicalIssueUncheckedUpdateManyWithoutServiceRequestInputObjectSchema } from './TechnicalIssueUncheckedUpdateManyWithoutServiceRequestInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TechnicalIssueScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => TechnicalIssueUpdateManyMutationInputObjectSchema), z.lazy(() => TechnicalIssueUncheckedUpdateManyWithoutServiceRequestInputObjectSchema)])
}).strict();
export const TechnicalIssueUpdateManyWithWhereWithoutServiceRequestInputObjectSchema: z.ZodType<Prisma.TechnicalIssueUpdateManyWithWhereWithoutServiceRequestInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueUpdateManyWithWhereWithoutServiceRequestInput>;
export const TechnicalIssueUpdateManyWithWhereWithoutServiceRequestInputObjectZodSchema = makeSchema();
