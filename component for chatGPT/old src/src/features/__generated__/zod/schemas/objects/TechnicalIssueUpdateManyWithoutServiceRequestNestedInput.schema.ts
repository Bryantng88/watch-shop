import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueCreateWithoutServiceRequestInputObjectSchema as TechnicalIssueCreateWithoutServiceRequestInputObjectSchema } from './TechnicalIssueCreateWithoutServiceRequestInput.schema';
import { TechnicalIssueUncheckedCreateWithoutServiceRequestInputObjectSchema as TechnicalIssueUncheckedCreateWithoutServiceRequestInputObjectSchema } from './TechnicalIssueUncheckedCreateWithoutServiceRequestInput.schema';
import { TechnicalIssueCreateOrConnectWithoutServiceRequestInputObjectSchema as TechnicalIssueCreateOrConnectWithoutServiceRequestInputObjectSchema } from './TechnicalIssueCreateOrConnectWithoutServiceRequestInput.schema';
import { TechnicalIssueUpsertWithWhereUniqueWithoutServiceRequestInputObjectSchema as TechnicalIssueUpsertWithWhereUniqueWithoutServiceRequestInputObjectSchema } from './TechnicalIssueUpsertWithWhereUniqueWithoutServiceRequestInput.schema';
import { TechnicalIssueCreateManyServiceRequestInputEnvelopeObjectSchema as TechnicalIssueCreateManyServiceRequestInputEnvelopeObjectSchema } from './TechnicalIssueCreateManyServiceRequestInputEnvelope.schema';
import { TechnicalIssueWhereUniqueInputObjectSchema as TechnicalIssueWhereUniqueInputObjectSchema } from './TechnicalIssueWhereUniqueInput.schema';
import { TechnicalIssueUpdateWithWhereUniqueWithoutServiceRequestInputObjectSchema as TechnicalIssueUpdateWithWhereUniqueWithoutServiceRequestInputObjectSchema } from './TechnicalIssueUpdateWithWhereUniqueWithoutServiceRequestInput.schema';
import { TechnicalIssueUpdateManyWithWhereWithoutServiceRequestInputObjectSchema as TechnicalIssueUpdateManyWithWhereWithoutServiceRequestInputObjectSchema } from './TechnicalIssueUpdateManyWithWhereWithoutServiceRequestInput.schema';
import { TechnicalIssueScalarWhereInputObjectSchema as TechnicalIssueScalarWhereInputObjectSchema } from './TechnicalIssueScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TechnicalIssueCreateWithoutServiceRequestInputObjectSchema), z.lazy(() => TechnicalIssueCreateWithoutServiceRequestInputObjectSchema).array(), z.lazy(() => TechnicalIssueUncheckedCreateWithoutServiceRequestInputObjectSchema), z.lazy(() => TechnicalIssueUncheckedCreateWithoutServiceRequestInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TechnicalIssueCreateOrConnectWithoutServiceRequestInputObjectSchema), z.lazy(() => TechnicalIssueCreateOrConnectWithoutServiceRequestInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => TechnicalIssueUpsertWithWhereUniqueWithoutServiceRequestInputObjectSchema), z.lazy(() => TechnicalIssueUpsertWithWhereUniqueWithoutServiceRequestInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => TechnicalIssueCreateManyServiceRequestInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema), z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema), z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema), z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema), z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => TechnicalIssueUpdateWithWhereUniqueWithoutServiceRequestInputObjectSchema), z.lazy(() => TechnicalIssueUpdateWithWhereUniqueWithoutServiceRequestInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => TechnicalIssueUpdateManyWithWhereWithoutServiceRequestInputObjectSchema), z.lazy(() => TechnicalIssueUpdateManyWithWhereWithoutServiceRequestInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => TechnicalIssueScalarWhereInputObjectSchema), z.lazy(() => TechnicalIssueScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const TechnicalIssueUpdateManyWithoutServiceRequestNestedInputObjectSchema: z.ZodType<Prisma.TechnicalIssueUpdateManyWithoutServiceRequestNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueUpdateManyWithoutServiceRequestNestedInput>;
export const TechnicalIssueUpdateManyWithoutServiceRequestNestedInputObjectZodSchema = makeSchema();
