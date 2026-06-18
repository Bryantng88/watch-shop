import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueCreateWithoutTaskExecutionInputObjectSchema as TechnicalIssueCreateWithoutTaskExecutionInputObjectSchema } from './TechnicalIssueCreateWithoutTaskExecutionInput.schema';
import { TechnicalIssueUncheckedCreateWithoutTaskExecutionInputObjectSchema as TechnicalIssueUncheckedCreateWithoutTaskExecutionInputObjectSchema } from './TechnicalIssueUncheckedCreateWithoutTaskExecutionInput.schema';
import { TechnicalIssueCreateOrConnectWithoutTaskExecutionInputObjectSchema as TechnicalIssueCreateOrConnectWithoutTaskExecutionInputObjectSchema } from './TechnicalIssueCreateOrConnectWithoutTaskExecutionInput.schema';
import { TechnicalIssueWhereUniqueInputObjectSchema as TechnicalIssueWhereUniqueInputObjectSchema } from './TechnicalIssueWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TechnicalIssueCreateWithoutTaskExecutionInputObjectSchema), z.lazy(() => TechnicalIssueUncheckedCreateWithoutTaskExecutionInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => TechnicalIssueCreateOrConnectWithoutTaskExecutionInputObjectSchema).optional(),
  connect: z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema).optional()
}).strict();
export const TechnicalIssueCreateNestedOneWithoutTaskExecutionInputObjectSchema: z.ZodType<Prisma.TechnicalIssueCreateNestedOneWithoutTaskExecutionInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueCreateNestedOneWithoutTaskExecutionInput>;
export const TechnicalIssueCreateNestedOneWithoutTaskExecutionInputObjectZodSchema = makeSchema();
