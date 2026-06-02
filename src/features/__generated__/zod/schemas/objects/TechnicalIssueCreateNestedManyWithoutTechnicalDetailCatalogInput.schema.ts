import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueCreateWithoutTechnicalDetailCatalogInputObjectSchema as TechnicalIssueCreateWithoutTechnicalDetailCatalogInputObjectSchema } from './TechnicalIssueCreateWithoutTechnicalDetailCatalogInput.schema';
import { TechnicalIssueUncheckedCreateWithoutTechnicalDetailCatalogInputObjectSchema as TechnicalIssueUncheckedCreateWithoutTechnicalDetailCatalogInputObjectSchema } from './TechnicalIssueUncheckedCreateWithoutTechnicalDetailCatalogInput.schema';
import { TechnicalIssueCreateOrConnectWithoutTechnicalDetailCatalogInputObjectSchema as TechnicalIssueCreateOrConnectWithoutTechnicalDetailCatalogInputObjectSchema } from './TechnicalIssueCreateOrConnectWithoutTechnicalDetailCatalogInput.schema';
import { TechnicalIssueCreateManyTechnicalDetailCatalogInputEnvelopeObjectSchema as TechnicalIssueCreateManyTechnicalDetailCatalogInputEnvelopeObjectSchema } from './TechnicalIssueCreateManyTechnicalDetailCatalogInputEnvelope.schema';
import { TechnicalIssueWhereUniqueInputObjectSchema as TechnicalIssueWhereUniqueInputObjectSchema } from './TechnicalIssueWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TechnicalIssueCreateWithoutTechnicalDetailCatalogInputObjectSchema), z.lazy(() => TechnicalIssueCreateWithoutTechnicalDetailCatalogInputObjectSchema).array(), z.lazy(() => TechnicalIssueUncheckedCreateWithoutTechnicalDetailCatalogInputObjectSchema), z.lazy(() => TechnicalIssueUncheckedCreateWithoutTechnicalDetailCatalogInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TechnicalIssueCreateOrConnectWithoutTechnicalDetailCatalogInputObjectSchema), z.lazy(() => TechnicalIssueCreateOrConnectWithoutTechnicalDetailCatalogInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => TechnicalIssueCreateManyTechnicalDetailCatalogInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema), z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const TechnicalIssueCreateNestedManyWithoutTechnicalDetailCatalogInputObjectSchema: z.ZodType<Prisma.TechnicalIssueCreateNestedManyWithoutTechnicalDetailCatalogInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueCreateNestedManyWithoutTechnicalDetailCatalogInput>;
export const TechnicalIssueCreateNestedManyWithoutTechnicalDetailCatalogInputObjectZodSchema = makeSchema();
