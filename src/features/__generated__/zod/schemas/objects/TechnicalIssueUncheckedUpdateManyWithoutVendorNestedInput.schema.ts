import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueCreateWithoutVendorInputObjectSchema as TechnicalIssueCreateWithoutVendorInputObjectSchema } from './TechnicalIssueCreateWithoutVendorInput.schema';
import { TechnicalIssueUncheckedCreateWithoutVendorInputObjectSchema as TechnicalIssueUncheckedCreateWithoutVendorInputObjectSchema } from './TechnicalIssueUncheckedCreateWithoutVendorInput.schema';
import { TechnicalIssueCreateOrConnectWithoutVendorInputObjectSchema as TechnicalIssueCreateOrConnectWithoutVendorInputObjectSchema } from './TechnicalIssueCreateOrConnectWithoutVendorInput.schema';
import { TechnicalIssueUpsertWithWhereUniqueWithoutVendorInputObjectSchema as TechnicalIssueUpsertWithWhereUniqueWithoutVendorInputObjectSchema } from './TechnicalIssueUpsertWithWhereUniqueWithoutVendorInput.schema';
import { TechnicalIssueCreateManyVendorInputEnvelopeObjectSchema as TechnicalIssueCreateManyVendorInputEnvelopeObjectSchema } from './TechnicalIssueCreateManyVendorInputEnvelope.schema';
import { TechnicalIssueWhereUniqueInputObjectSchema as TechnicalIssueWhereUniqueInputObjectSchema } from './TechnicalIssueWhereUniqueInput.schema';
import { TechnicalIssueUpdateWithWhereUniqueWithoutVendorInputObjectSchema as TechnicalIssueUpdateWithWhereUniqueWithoutVendorInputObjectSchema } from './TechnicalIssueUpdateWithWhereUniqueWithoutVendorInput.schema';
import { TechnicalIssueUpdateManyWithWhereWithoutVendorInputObjectSchema as TechnicalIssueUpdateManyWithWhereWithoutVendorInputObjectSchema } from './TechnicalIssueUpdateManyWithWhereWithoutVendorInput.schema';
import { TechnicalIssueScalarWhereInputObjectSchema as TechnicalIssueScalarWhereInputObjectSchema } from './TechnicalIssueScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TechnicalIssueCreateWithoutVendorInputObjectSchema), z.lazy(() => TechnicalIssueCreateWithoutVendorInputObjectSchema).array(), z.lazy(() => TechnicalIssueUncheckedCreateWithoutVendorInputObjectSchema), z.lazy(() => TechnicalIssueUncheckedCreateWithoutVendorInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TechnicalIssueCreateOrConnectWithoutVendorInputObjectSchema), z.lazy(() => TechnicalIssueCreateOrConnectWithoutVendorInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => TechnicalIssueUpsertWithWhereUniqueWithoutVendorInputObjectSchema), z.lazy(() => TechnicalIssueUpsertWithWhereUniqueWithoutVendorInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => TechnicalIssueCreateManyVendorInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema), z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema), z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema), z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema), z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => TechnicalIssueUpdateWithWhereUniqueWithoutVendorInputObjectSchema), z.lazy(() => TechnicalIssueUpdateWithWhereUniqueWithoutVendorInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => TechnicalIssueUpdateManyWithWhereWithoutVendorInputObjectSchema), z.lazy(() => TechnicalIssueUpdateManyWithWhereWithoutVendorInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => TechnicalIssueScalarWhereInputObjectSchema), z.lazy(() => TechnicalIssueScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const TechnicalIssueUncheckedUpdateManyWithoutVendorNestedInputObjectSchema: z.ZodType<Prisma.TechnicalIssueUncheckedUpdateManyWithoutVendorNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueUncheckedUpdateManyWithoutVendorNestedInput>;
export const TechnicalIssueUncheckedUpdateManyWithoutVendorNestedInputObjectZodSchema = makeSchema();
