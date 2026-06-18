import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueWhereUniqueInputObjectSchema as TechnicalIssueWhereUniqueInputObjectSchema } from './TechnicalIssueWhereUniqueInput.schema';
import { TechnicalIssueCreateWithoutTaskExecutionInputObjectSchema as TechnicalIssueCreateWithoutTaskExecutionInputObjectSchema } from './TechnicalIssueCreateWithoutTaskExecutionInput.schema';
import { TechnicalIssueUncheckedCreateWithoutTaskExecutionInputObjectSchema as TechnicalIssueUncheckedCreateWithoutTaskExecutionInputObjectSchema } from './TechnicalIssueUncheckedCreateWithoutTaskExecutionInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => TechnicalIssueCreateWithoutTaskExecutionInputObjectSchema), z.lazy(() => TechnicalIssueUncheckedCreateWithoutTaskExecutionInputObjectSchema)])
}).strict();
export const TechnicalIssueCreateOrConnectWithoutTaskExecutionInputObjectSchema: z.ZodType<Prisma.TechnicalIssueCreateOrConnectWithoutTaskExecutionInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueCreateOrConnectWithoutTaskExecutionInput>;
export const TechnicalIssueCreateOrConnectWithoutTaskExecutionInputObjectZodSchema = makeSchema();
