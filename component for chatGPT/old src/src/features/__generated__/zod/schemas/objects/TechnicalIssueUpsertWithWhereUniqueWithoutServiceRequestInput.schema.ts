import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueWhereUniqueInputObjectSchema as TechnicalIssueWhereUniqueInputObjectSchema } from './TechnicalIssueWhereUniqueInput.schema';
import { TechnicalIssueUpdateWithoutServiceRequestInputObjectSchema as TechnicalIssueUpdateWithoutServiceRequestInputObjectSchema } from './TechnicalIssueUpdateWithoutServiceRequestInput.schema';
import { TechnicalIssueUncheckedUpdateWithoutServiceRequestInputObjectSchema as TechnicalIssueUncheckedUpdateWithoutServiceRequestInputObjectSchema } from './TechnicalIssueUncheckedUpdateWithoutServiceRequestInput.schema';
import { TechnicalIssueCreateWithoutServiceRequestInputObjectSchema as TechnicalIssueCreateWithoutServiceRequestInputObjectSchema } from './TechnicalIssueCreateWithoutServiceRequestInput.schema';
import { TechnicalIssueUncheckedCreateWithoutServiceRequestInputObjectSchema as TechnicalIssueUncheckedCreateWithoutServiceRequestInputObjectSchema } from './TechnicalIssueUncheckedCreateWithoutServiceRequestInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => TechnicalIssueUpdateWithoutServiceRequestInputObjectSchema), z.lazy(() => TechnicalIssueUncheckedUpdateWithoutServiceRequestInputObjectSchema)]),
  create: z.union([z.lazy(() => TechnicalIssueCreateWithoutServiceRequestInputObjectSchema), z.lazy(() => TechnicalIssueUncheckedCreateWithoutServiceRequestInputObjectSchema)])
}).strict();
export const TechnicalIssueUpsertWithWhereUniqueWithoutServiceRequestInputObjectSchema: z.ZodType<Prisma.TechnicalIssueUpsertWithWhereUniqueWithoutServiceRequestInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueUpsertWithWhereUniqueWithoutServiceRequestInput>;
export const TechnicalIssueUpsertWithWhereUniqueWithoutServiceRequestInputObjectZodSchema = makeSchema();
