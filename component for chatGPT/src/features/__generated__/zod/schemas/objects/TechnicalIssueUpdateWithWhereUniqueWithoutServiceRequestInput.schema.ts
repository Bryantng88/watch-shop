import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueWhereUniqueInputObjectSchema as TechnicalIssueWhereUniqueInputObjectSchema } from './TechnicalIssueWhereUniqueInput.schema';
import { TechnicalIssueUpdateWithoutServiceRequestInputObjectSchema as TechnicalIssueUpdateWithoutServiceRequestInputObjectSchema } from './TechnicalIssueUpdateWithoutServiceRequestInput.schema';
import { TechnicalIssueUncheckedUpdateWithoutServiceRequestInputObjectSchema as TechnicalIssueUncheckedUpdateWithoutServiceRequestInputObjectSchema } from './TechnicalIssueUncheckedUpdateWithoutServiceRequestInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => TechnicalIssueUpdateWithoutServiceRequestInputObjectSchema), z.lazy(() => TechnicalIssueUncheckedUpdateWithoutServiceRequestInputObjectSchema)])
}).strict();
export const TechnicalIssueUpdateWithWhereUniqueWithoutServiceRequestInputObjectSchema: z.ZodType<Prisma.TechnicalIssueUpdateWithWhereUniqueWithoutServiceRequestInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueUpdateWithWhereUniqueWithoutServiceRequestInput>;
export const TechnicalIssueUpdateWithWhereUniqueWithoutServiceRequestInputObjectZodSchema = makeSchema();
