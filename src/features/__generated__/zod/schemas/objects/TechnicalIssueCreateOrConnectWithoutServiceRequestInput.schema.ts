import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueWhereUniqueInputObjectSchema as TechnicalIssueWhereUniqueInputObjectSchema } from './TechnicalIssueWhereUniqueInput.schema';
import { TechnicalIssueCreateWithoutServiceRequestInputObjectSchema as TechnicalIssueCreateWithoutServiceRequestInputObjectSchema } from './TechnicalIssueCreateWithoutServiceRequestInput.schema';
import { TechnicalIssueUncheckedCreateWithoutServiceRequestInputObjectSchema as TechnicalIssueUncheckedCreateWithoutServiceRequestInputObjectSchema } from './TechnicalIssueUncheckedCreateWithoutServiceRequestInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => TechnicalIssueCreateWithoutServiceRequestInputObjectSchema), z.lazy(() => TechnicalIssueUncheckedCreateWithoutServiceRequestInputObjectSchema)])
}).strict();
export const TechnicalIssueCreateOrConnectWithoutServiceRequestInputObjectSchema: z.ZodType<Prisma.TechnicalIssueCreateOrConnectWithoutServiceRequestInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueCreateOrConnectWithoutServiceRequestInput>;
export const TechnicalIssueCreateOrConnectWithoutServiceRequestInputObjectZodSchema = makeSchema();
