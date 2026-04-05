import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueCreateWithoutUserInputObjectSchema as TechnicalIssueCreateWithoutUserInputObjectSchema } from './TechnicalIssueCreateWithoutUserInput.schema';
import { TechnicalIssueUncheckedCreateWithoutUserInputObjectSchema as TechnicalIssueUncheckedCreateWithoutUserInputObjectSchema } from './TechnicalIssueUncheckedCreateWithoutUserInput.schema';
import { TechnicalIssueCreateOrConnectWithoutUserInputObjectSchema as TechnicalIssueCreateOrConnectWithoutUserInputObjectSchema } from './TechnicalIssueCreateOrConnectWithoutUserInput.schema';
import { TechnicalIssueCreateManyUserInputEnvelopeObjectSchema as TechnicalIssueCreateManyUserInputEnvelopeObjectSchema } from './TechnicalIssueCreateManyUserInputEnvelope.schema';
import { TechnicalIssueWhereUniqueInputObjectSchema as TechnicalIssueWhereUniqueInputObjectSchema } from './TechnicalIssueWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TechnicalIssueCreateWithoutUserInputObjectSchema), z.lazy(() => TechnicalIssueCreateWithoutUserInputObjectSchema).array(), z.lazy(() => TechnicalIssueUncheckedCreateWithoutUserInputObjectSchema), z.lazy(() => TechnicalIssueUncheckedCreateWithoutUserInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TechnicalIssueCreateOrConnectWithoutUserInputObjectSchema), z.lazy(() => TechnicalIssueCreateOrConnectWithoutUserInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => TechnicalIssueCreateManyUserInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema), z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const TechnicalIssueUncheckedCreateNestedManyWithoutUserInputObjectSchema: z.ZodType<Prisma.TechnicalIssueUncheckedCreateNestedManyWithoutUserInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueUncheckedCreateNestedManyWithoutUserInput>;
export const TechnicalIssueUncheckedCreateNestedManyWithoutUserInputObjectZodSchema = makeSchema();
