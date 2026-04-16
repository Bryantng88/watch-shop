import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueCreateWithoutUserInputObjectSchema as TechnicalIssueCreateWithoutUserInputObjectSchema } from './TechnicalIssueCreateWithoutUserInput.schema';
import { TechnicalIssueUncheckedCreateWithoutUserInputObjectSchema as TechnicalIssueUncheckedCreateWithoutUserInputObjectSchema } from './TechnicalIssueUncheckedCreateWithoutUserInput.schema';
import { TechnicalIssueCreateOrConnectWithoutUserInputObjectSchema as TechnicalIssueCreateOrConnectWithoutUserInputObjectSchema } from './TechnicalIssueCreateOrConnectWithoutUserInput.schema';
import { TechnicalIssueUpsertWithWhereUniqueWithoutUserInputObjectSchema as TechnicalIssueUpsertWithWhereUniqueWithoutUserInputObjectSchema } from './TechnicalIssueUpsertWithWhereUniqueWithoutUserInput.schema';
import { TechnicalIssueCreateManyUserInputEnvelopeObjectSchema as TechnicalIssueCreateManyUserInputEnvelopeObjectSchema } from './TechnicalIssueCreateManyUserInputEnvelope.schema';
import { TechnicalIssueWhereUniqueInputObjectSchema as TechnicalIssueWhereUniqueInputObjectSchema } from './TechnicalIssueWhereUniqueInput.schema';
import { TechnicalIssueUpdateWithWhereUniqueWithoutUserInputObjectSchema as TechnicalIssueUpdateWithWhereUniqueWithoutUserInputObjectSchema } from './TechnicalIssueUpdateWithWhereUniqueWithoutUserInput.schema';
import { TechnicalIssueUpdateManyWithWhereWithoutUserInputObjectSchema as TechnicalIssueUpdateManyWithWhereWithoutUserInputObjectSchema } from './TechnicalIssueUpdateManyWithWhereWithoutUserInput.schema';
import { TechnicalIssueScalarWhereInputObjectSchema as TechnicalIssueScalarWhereInputObjectSchema } from './TechnicalIssueScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TechnicalIssueCreateWithoutUserInputObjectSchema), z.lazy(() => TechnicalIssueCreateWithoutUserInputObjectSchema).array(), z.lazy(() => TechnicalIssueUncheckedCreateWithoutUserInputObjectSchema), z.lazy(() => TechnicalIssueUncheckedCreateWithoutUserInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TechnicalIssueCreateOrConnectWithoutUserInputObjectSchema), z.lazy(() => TechnicalIssueCreateOrConnectWithoutUserInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => TechnicalIssueUpsertWithWhereUniqueWithoutUserInputObjectSchema), z.lazy(() => TechnicalIssueUpsertWithWhereUniqueWithoutUserInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => TechnicalIssueCreateManyUserInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema), z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema), z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema), z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema), z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => TechnicalIssueUpdateWithWhereUniqueWithoutUserInputObjectSchema), z.lazy(() => TechnicalIssueUpdateWithWhereUniqueWithoutUserInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => TechnicalIssueUpdateManyWithWhereWithoutUserInputObjectSchema), z.lazy(() => TechnicalIssueUpdateManyWithWhereWithoutUserInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => TechnicalIssueScalarWhereInputObjectSchema), z.lazy(() => TechnicalIssueScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const TechnicalIssueUncheckedUpdateManyWithoutUserNestedInputObjectSchema: z.ZodType<Prisma.TechnicalIssueUncheckedUpdateManyWithoutUserNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueUncheckedUpdateManyWithoutUserNestedInput>;
export const TechnicalIssueUncheckedUpdateManyWithoutUserNestedInputObjectZodSchema = makeSchema();
