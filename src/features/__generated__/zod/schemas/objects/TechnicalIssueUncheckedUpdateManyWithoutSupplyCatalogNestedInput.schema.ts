import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueCreateWithoutSupplyCatalogInputObjectSchema as TechnicalIssueCreateWithoutSupplyCatalogInputObjectSchema } from './TechnicalIssueCreateWithoutSupplyCatalogInput.schema';
import { TechnicalIssueUncheckedCreateWithoutSupplyCatalogInputObjectSchema as TechnicalIssueUncheckedCreateWithoutSupplyCatalogInputObjectSchema } from './TechnicalIssueUncheckedCreateWithoutSupplyCatalogInput.schema';
import { TechnicalIssueCreateOrConnectWithoutSupplyCatalogInputObjectSchema as TechnicalIssueCreateOrConnectWithoutSupplyCatalogInputObjectSchema } from './TechnicalIssueCreateOrConnectWithoutSupplyCatalogInput.schema';
import { TechnicalIssueUpsertWithWhereUniqueWithoutSupplyCatalogInputObjectSchema as TechnicalIssueUpsertWithWhereUniqueWithoutSupplyCatalogInputObjectSchema } from './TechnicalIssueUpsertWithWhereUniqueWithoutSupplyCatalogInput.schema';
import { TechnicalIssueCreateManySupplyCatalogInputEnvelopeObjectSchema as TechnicalIssueCreateManySupplyCatalogInputEnvelopeObjectSchema } from './TechnicalIssueCreateManySupplyCatalogInputEnvelope.schema';
import { TechnicalIssueWhereUniqueInputObjectSchema as TechnicalIssueWhereUniqueInputObjectSchema } from './TechnicalIssueWhereUniqueInput.schema';
import { TechnicalIssueUpdateWithWhereUniqueWithoutSupplyCatalogInputObjectSchema as TechnicalIssueUpdateWithWhereUniqueWithoutSupplyCatalogInputObjectSchema } from './TechnicalIssueUpdateWithWhereUniqueWithoutSupplyCatalogInput.schema';
import { TechnicalIssueUpdateManyWithWhereWithoutSupplyCatalogInputObjectSchema as TechnicalIssueUpdateManyWithWhereWithoutSupplyCatalogInputObjectSchema } from './TechnicalIssueUpdateManyWithWhereWithoutSupplyCatalogInput.schema';
import { TechnicalIssueScalarWhereInputObjectSchema as TechnicalIssueScalarWhereInputObjectSchema } from './TechnicalIssueScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TechnicalIssueCreateWithoutSupplyCatalogInputObjectSchema), z.lazy(() => TechnicalIssueCreateWithoutSupplyCatalogInputObjectSchema).array(), z.lazy(() => TechnicalIssueUncheckedCreateWithoutSupplyCatalogInputObjectSchema), z.lazy(() => TechnicalIssueUncheckedCreateWithoutSupplyCatalogInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TechnicalIssueCreateOrConnectWithoutSupplyCatalogInputObjectSchema), z.lazy(() => TechnicalIssueCreateOrConnectWithoutSupplyCatalogInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => TechnicalIssueUpsertWithWhereUniqueWithoutSupplyCatalogInputObjectSchema), z.lazy(() => TechnicalIssueUpsertWithWhereUniqueWithoutSupplyCatalogInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => TechnicalIssueCreateManySupplyCatalogInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema), z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema), z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema), z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema), z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => TechnicalIssueUpdateWithWhereUniqueWithoutSupplyCatalogInputObjectSchema), z.lazy(() => TechnicalIssueUpdateWithWhereUniqueWithoutSupplyCatalogInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => TechnicalIssueUpdateManyWithWhereWithoutSupplyCatalogInputObjectSchema), z.lazy(() => TechnicalIssueUpdateManyWithWhereWithoutSupplyCatalogInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => TechnicalIssueScalarWhereInputObjectSchema), z.lazy(() => TechnicalIssueScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const TechnicalIssueUncheckedUpdateManyWithoutSupplyCatalogNestedInputObjectSchema: z.ZodType<Prisma.TechnicalIssueUncheckedUpdateManyWithoutSupplyCatalogNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueUncheckedUpdateManyWithoutSupplyCatalogNestedInput>;
export const TechnicalIssueUncheckedUpdateManyWithoutSupplyCatalogNestedInputObjectZodSchema = makeSchema();
