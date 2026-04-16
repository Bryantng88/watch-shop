import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueCreateWithoutMechanicalPartCatalogInputObjectSchema as TechnicalIssueCreateWithoutMechanicalPartCatalogInputObjectSchema } from './TechnicalIssueCreateWithoutMechanicalPartCatalogInput.schema';
import { TechnicalIssueUncheckedCreateWithoutMechanicalPartCatalogInputObjectSchema as TechnicalIssueUncheckedCreateWithoutMechanicalPartCatalogInputObjectSchema } from './TechnicalIssueUncheckedCreateWithoutMechanicalPartCatalogInput.schema';
import { TechnicalIssueCreateOrConnectWithoutMechanicalPartCatalogInputObjectSchema as TechnicalIssueCreateOrConnectWithoutMechanicalPartCatalogInputObjectSchema } from './TechnicalIssueCreateOrConnectWithoutMechanicalPartCatalogInput.schema';
import { TechnicalIssueUpsertWithWhereUniqueWithoutMechanicalPartCatalogInputObjectSchema as TechnicalIssueUpsertWithWhereUniqueWithoutMechanicalPartCatalogInputObjectSchema } from './TechnicalIssueUpsertWithWhereUniqueWithoutMechanicalPartCatalogInput.schema';
import { TechnicalIssueCreateManyMechanicalPartCatalogInputEnvelopeObjectSchema as TechnicalIssueCreateManyMechanicalPartCatalogInputEnvelopeObjectSchema } from './TechnicalIssueCreateManyMechanicalPartCatalogInputEnvelope.schema';
import { TechnicalIssueWhereUniqueInputObjectSchema as TechnicalIssueWhereUniqueInputObjectSchema } from './TechnicalIssueWhereUniqueInput.schema';
import { TechnicalIssueUpdateWithWhereUniqueWithoutMechanicalPartCatalogInputObjectSchema as TechnicalIssueUpdateWithWhereUniqueWithoutMechanicalPartCatalogInputObjectSchema } from './TechnicalIssueUpdateWithWhereUniqueWithoutMechanicalPartCatalogInput.schema';
import { TechnicalIssueUpdateManyWithWhereWithoutMechanicalPartCatalogInputObjectSchema as TechnicalIssueUpdateManyWithWhereWithoutMechanicalPartCatalogInputObjectSchema } from './TechnicalIssueUpdateManyWithWhereWithoutMechanicalPartCatalogInput.schema';
import { TechnicalIssueScalarWhereInputObjectSchema as TechnicalIssueScalarWhereInputObjectSchema } from './TechnicalIssueScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TechnicalIssueCreateWithoutMechanicalPartCatalogInputObjectSchema), z.lazy(() => TechnicalIssueCreateWithoutMechanicalPartCatalogInputObjectSchema).array(), z.lazy(() => TechnicalIssueUncheckedCreateWithoutMechanicalPartCatalogInputObjectSchema), z.lazy(() => TechnicalIssueUncheckedCreateWithoutMechanicalPartCatalogInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TechnicalIssueCreateOrConnectWithoutMechanicalPartCatalogInputObjectSchema), z.lazy(() => TechnicalIssueCreateOrConnectWithoutMechanicalPartCatalogInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => TechnicalIssueUpsertWithWhereUniqueWithoutMechanicalPartCatalogInputObjectSchema), z.lazy(() => TechnicalIssueUpsertWithWhereUniqueWithoutMechanicalPartCatalogInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => TechnicalIssueCreateManyMechanicalPartCatalogInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema), z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema), z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema), z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema), z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => TechnicalIssueUpdateWithWhereUniqueWithoutMechanicalPartCatalogInputObjectSchema), z.lazy(() => TechnicalIssueUpdateWithWhereUniqueWithoutMechanicalPartCatalogInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => TechnicalIssueUpdateManyWithWhereWithoutMechanicalPartCatalogInputObjectSchema), z.lazy(() => TechnicalIssueUpdateManyWithWhereWithoutMechanicalPartCatalogInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => TechnicalIssueScalarWhereInputObjectSchema), z.lazy(() => TechnicalIssueScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const TechnicalIssueUncheckedUpdateManyWithoutMechanicalPartCatalogNestedInputObjectSchema: z.ZodType<Prisma.TechnicalIssueUncheckedUpdateManyWithoutMechanicalPartCatalogNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueUncheckedUpdateManyWithoutMechanicalPartCatalogNestedInput>;
export const TechnicalIssueUncheckedUpdateManyWithoutMechanicalPartCatalogNestedInputObjectZodSchema = makeSchema();
