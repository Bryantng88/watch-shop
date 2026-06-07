import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueWhereUniqueInputObjectSchema as TechnicalIssueWhereUniqueInputObjectSchema } from './TechnicalIssueWhereUniqueInput.schema';
import { TechnicalIssueCreateWithoutTaskInputObjectSchema as TechnicalIssueCreateWithoutTaskInputObjectSchema } from './TechnicalIssueCreateWithoutTaskInput.schema';
import { TechnicalIssueUncheckedCreateWithoutTaskInputObjectSchema as TechnicalIssueUncheckedCreateWithoutTaskInputObjectSchema } from './TechnicalIssueUncheckedCreateWithoutTaskInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => TechnicalIssueCreateWithoutTaskInputObjectSchema), z.lazy(() => TechnicalIssueUncheckedCreateWithoutTaskInputObjectSchema)])
}).strict();
export const TechnicalIssueCreateOrConnectWithoutTaskInputObjectSchema: z.ZodType<Prisma.TechnicalIssueCreateOrConnectWithoutTaskInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueCreateOrConnectWithoutTaskInput>;
export const TechnicalIssueCreateOrConnectWithoutTaskInputObjectZodSchema = makeSchema();
