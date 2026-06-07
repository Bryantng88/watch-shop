import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueCreateWithoutTaskInputObjectSchema as TechnicalIssueCreateWithoutTaskInputObjectSchema } from './TechnicalIssueCreateWithoutTaskInput.schema';
import { TechnicalIssueUncheckedCreateWithoutTaskInputObjectSchema as TechnicalIssueUncheckedCreateWithoutTaskInputObjectSchema } from './TechnicalIssueUncheckedCreateWithoutTaskInput.schema';
import { TechnicalIssueCreateOrConnectWithoutTaskInputObjectSchema as TechnicalIssueCreateOrConnectWithoutTaskInputObjectSchema } from './TechnicalIssueCreateOrConnectWithoutTaskInput.schema';
import { TechnicalIssueWhereUniqueInputObjectSchema as TechnicalIssueWhereUniqueInputObjectSchema } from './TechnicalIssueWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TechnicalIssueCreateWithoutTaskInputObjectSchema), z.lazy(() => TechnicalIssueUncheckedCreateWithoutTaskInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => TechnicalIssueCreateOrConnectWithoutTaskInputObjectSchema).optional(),
  connect: z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema).optional()
}).strict();
export const TechnicalIssueCreateNestedOneWithoutTaskInputObjectSchema: z.ZodType<Prisma.TechnicalIssueCreateNestedOneWithoutTaskInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueCreateNestedOneWithoutTaskInput>;
export const TechnicalIssueCreateNestedOneWithoutTaskInputObjectZodSchema = makeSchema();
