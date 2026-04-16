import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueCreateWithoutServiceCatalogInputObjectSchema as TechnicalIssueCreateWithoutServiceCatalogInputObjectSchema } from './TechnicalIssueCreateWithoutServiceCatalogInput.schema';
import { TechnicalIssueUncheckedCreateWithoutServiceCatalogInputObjectSchema as TechnicalIssueUncheckedCreateWithoutServiceCatalogInputObjectSchema } from './TechnicalIssueUncheckedCreateWithoutServiceCatalogInput.schema';
import { TechnicalIssueCreateOrConnectWithoutServiceCatalogInputObjectSchema as TechnicalIssueCreateOrConnectWithoutServiceCatalogInputObjectSchema } from './TechnicalIssueCreateOrConnectWithoutServiceCatalogInput.schema';
import { TechnicalIssueUpsertWithWhereUniqueWithoutServiceCatalogInputObjectSchema as TechnicalIssueUpsertWithWhereUniqueWithoutServiceCatalogInputObjectSchema } from './TechnicalIssueUpsertWithWhereUniqueWithoutServiceCatalogInput.schema';
import { TechnicalIssueCreateManyServiceCatalogInputEnvelopeObjectSchema as TechnicalIssueCreateManyServiceCatalogInputEnvelopeObjectSchema } from './TechnicalIssueCreateManyServiceCatalogInputEnvelope.schema';
import { TechnicalIssueWhereUniqueInputObjectSchema as TechnicalIssueWhereUniqueInputObjectSchema } from './TechnicalIssueWhereUniqueInput.schema';
import { TechnicalIssueUpdateWithWhereUniqueWithoutServiceCatalogInputObjectSchema as TechnicalIssueUpdateWithWhereUniqueWithoutServiceCatalogInputObjectSchema } from './TechnicalIssueUpdateWithWhereUniqueWithoutServiceCatalogInput.schema';
import { TechnicalIssueUpdateManyWithWhereWithoutServiceCatalogInputObjectSchema as TechnicalIssueUpdateManyWithWhereWithoutServiceCatalogInputObjectSchema } from './TechnicalIssueUpdateManyWithWhereWithoutServiceCatalogInput.schema';
import { TechnicalIssueScalarWhereInputObjectSchema as TechnicalIssueScalarWhereInputObjectSchema } from './TechnicalIssueScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TechnicalIssueCreateWithoutServiceCatalogInputObjectSchema), z.lazy(() => TechnicalIssueCreateWithoutServiceCatalogInputObjectSchema).array(), z.lazy(() => TechnicalIssueUncheckedCreateWithoutServiceCatalogInputObjectSchema), z.lazy(() => TechnicalIssueUncheckedCreateWithoutServiceCatalogInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TechnicalIssueCreateOrConnectWithoutServiceCatalogInputObjectSchema), z.lazy(() => TechnicalIssueCreateOrConnectWithoutServiceCatalogInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => TechnicalIssueUpsertWithWhereUniqueWithoutServiceCatalogInputObjectSchema), z.lazy(() => TechnicalIssueUpsertWithWhereUniqueWithoutServiceCatalogInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => TechnicalIssueCreateManyServiceCatalogInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema), z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema), z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema), z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema), z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => TechnicalIssueUpdateWithWhereUniqueWithoutServiceCatalogInputObjectSchema), z.lazy(() => TechnicalIssueUpdateWithWhereUniqueWithoutServiceCatalogInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => TechnicalIssueUpdateManyWithWhereWithoutServiceCatalogInputObjectSchema), z.lazy(() => TechnicalIssueUpdateManyWithWhereWithoutServiceCatalogInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => TechnicalIssueScalarWhereInputObjectSchema), z.lazy(() => TechnicalIssueScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const TechnicalIssueUpdateManyWithoutServiceCatalogNestedInputObjectSchema: z.ZodType<Prisma.TechnicalIssueUpdateManyWithoutServiceCatalogNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueUpdateManyWithoutServiceCatalogNestedInput>;
export const TechnicalIssueUpdateManyWithoutServiceCatalogNestedInputObjectZodSchema = makeSchema();
