import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueCreateWithoutMechanicalPartCatalogInputObjectSchema as TechnicalIssueCreateWithoutMechanicalPartCatalogInputObjectSchema } from './TechnicalIssueCreateWithoutMechanicalPartCatalogInput.schema';
import { TechnicalIssueUncheckedCreateWithoutMechanicalPartCatalogInputObjectSchema as TechnicalIssueUncheckedCreateWithoutMechanicalPartCatalogInputObjectSchema } from './TechnicalIssueUncheckedCreateWithoutMechanicalPartCatalogInput.schema';
import { TechnicalIssueCreateOrConnectWithoutMechanicalPartCatalogInputObjectSchema as TechnicalIssueCreateOrConnectWithoutMechanicalPartCatalogInputObjectSchema } from './TechnicalIssueCreateOrConnectWithoutMechanicalPartCatalogInput.schema';
import { TechnicalIssueCreateManyMechanicalPartCatalogInputEnvelopeObjectSchema as TechnicalIssueCreateManyMechanicalPartCatalogInputEnvelopeObjectSchema } from './TechnicalIssueCreateManyMechanicalPartCatalogInputEnvelope.schema';
import { TechnicalIssueWhereUniqueInputObjectSchema as TechnicalIssueWhereUniqueInputObjectSchema } from './TechnicalIssueWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TechnicalIssueCreateWithoutMechanicalPartCatalogInputObjectSchema), z.lazy(() => TechnicalIssueCreateWithoutMechanicalPartCatalogInputObjectSchema).array(), z.lazy(() => TechnicalIssueUncheckedCreateWithoutMechanicalPartCatalogInputObjectSchema), z.lazy(() => TechnicalIssueUncheckedCreateWithoutMechanicalPartCatalogInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TechnicalIssueCreateOrConnectWithoutMechanicalPartCatalogInputObjectSchema), z.lazy(() => TechnicalIssueCreateOrConnectWithoutMechanicalPartCatalogInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => TechnicalIssueCreateManyMechanicalPartCatalogInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema), z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const TechnicalIssueUncheckedCreateNestedManyWithoutMechanicalPartCatalogInputObjectSchema: z.ZodType<Prisma.TechnicalIssueUncheckedCreateNestedManyWithoutMechanicalPartCatalogInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueUncheckedCreateNestedManyWithoutMechanicalPartCatalogInput>;
export const TechnicalIssueUncheckedCreateNestedManyWithoutMechanicalPartCatalogInputObjectZodSchema = makeSchema();
