import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueCreateWithoutTechnicalDetailCatalogInputObjectSchema as TechnicalIssueCreateWithoutTechnicalDetailCatalogInputObjectSchema } from './TechnicalIssueCreateWithoutTechnicalDetailCatalogInput.schema';
import { TechnicalIssueUncheckedCreateWithoutTechnicalDetailCatalogInputObjectSchema as TechnicalIssueUncheckedCreateWithoutTechnicalDetailCatalogInputObjectSchema } from './TechnicalIssueUncheckedCreateWithoutTechnicalDetailCatalogInput.schema';
import { TechnicalIssueCreateOrConnectWithoutTechnicalDetailCatalogInputObjectSchema as TechnicalIssueCreateOrConnectWithoutTechnicalDetailCatalogInputObjectSchema } from './TechnicalIssueCreateOrConnectWithoutTechnicalDetailCatalogInput.schema';
import { TechnicalIssueUpsertWithWhereUniqueWithoutTechnicalDetailCatalogInputObjectSchema as TechnicalIssueUpsertWithWhereUniqueWithoutTechnicalDetailCatalogInputObjectSchema } from './TechnicalIssueUpsertWithWhereUniqueWithoutTechnicalDetailCatalogInput.schema';
import { TechnicalIssueCreateManyTechnicalDetailCatalogInputEnvelopeObjectSchema as TechnicalIssueCreateManyTechnicalDetailCatalogInputEnvelopeObjectSchema } from './TechnicalIssueCreateManyTechnicalDetailCatalogInputEnvelope.schema';
import { TechnicalIssueWhereUniqueInputObjectSchema as TechnicalIssueWhereUniqueInputObjectSchema } from './TechnicalIssueWhereUniqueInput.schema';
import { TechnicalIssueUpdateWithWhereUniqueWithoutTechnicalDetailCatalogInputObjectSchema as TechnicalIssueUpdateWithWhereUniqueWithoutTechnicalDetailCatalogInputObjectSchema } from './TechnicalIssueUpdateWithWhereUniqueWithoutTechnicalDetailCatalogInput.schema';
import { TechnicalIssueUpdateManyWithWhereWithoutTechnicalDetailCatalogInputObjectSchema as TechnicalIssueUpdateManyWithWhereWithoutTechnicalDetailCatalogInputObjectSchema } from './TechnicalIssueUpdateManyWithWhereWithoutTechnicalDetailCatalogInput.schema';
import { TechnicalIssueScalarWhereInputObjectSchema as TechnicalIssueScalarWhereInputObjectSchema } from './TechnicalIssueScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TechnicalIssueCreateWithoutTechnicalDetailCatalogInputObjectSchema), z.lazy(() => TechnicalIssueCreateWithoutTechnicalDetailCatalogInputObjectSchema).array(), z.lazy(() => TechnicalIssueUncheckedCreateWithoutTechnicalDetailCatalogInputObjectSchema), z.lazy(() => TechnicalIssueUncheckedCreateWithoutTechnicalDetailCatalogInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TechnicalIssueCreateOrConnectWithoutTechnicalDetailCatalogInputObjectSchema), z.lazy(() => TechnicalIssueCreateOrConnectWithoutTechnicalDetailCatalogInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => TechnicalIssueUpsertWithWhereUniqueWithoutTechnicalDetailCatalogInputObjectSchema), z.lazy(() => TechnicalIssueUpsertWithWhereUniqueWithoutTechnicalDetailCatalogInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => TechnicalIssueCreateManyTechnicalDetailCatalogInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema), z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema), z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema), z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema), z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => TechnicalIssueUpdateWithWhereUniqueWithoutTechnicalDetailCatalogInputObjectSchema), z.lazy(() => TechnicalIssueUpdateWithWhereUniqueWithoutTechnicalDetailCatalogInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => TechnicalIssueUpdateManyWithWhereWithoutTechnicalDetailCatalogInputObjectSchema), z.lazy(() => TechnicalIssueUpdateManyWithWhereWithoutTechnicalDetailCatalogInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => TechnicalIssueScalarWhereInputObjectSchema), z.lazy(() => TechnicalIssueScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const TechnicalIssueUpdateManyWithoutTechnicalDetailCatalogNestedInputObjectSchema: z.ZodType<Prisma.TechnicalIssueUpdateManyWithoutTechnicalDetailCatalogNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueUpdateManyWithoutTechnicalDetailCatalogNestedInput>;
export const TechnicalIssueUpdateManyWithoutTechnicalDetailCatalogNestedInputObjectZodSchema = makeSchema();
