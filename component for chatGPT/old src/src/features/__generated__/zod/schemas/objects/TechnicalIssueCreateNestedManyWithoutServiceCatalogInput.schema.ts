import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueCreateWithoutServiceCatalogInputObjectSchema as TechnicalIssueCreateWithoutServiceCatalogInputObjectSchema } from './TechnicalIssueCreateWithoutServiceCatalogInput.schema';
import { TechnicalIssueUncheckedCreateWithoutServiceCatalogInputObjectSchema as TechnicalIssueUncheckedCreateWithoutServiceCatalogInputObjectSchema } from './TechnicalIssueUncheckedCreateWithoutServiceCatalogInput.schema';
import { TechnicalIssueCreateOrConnectWithoutServiceCatalogInputObjectSchema as TechnicalIssueCreateOrConnectWithoutServiceCatalogInputObjectSchema } from './TechnicalIssueCreateOrConnectWithoutServiceCatalogInput.schema';
import { TechnicalIssueCreateManyServiceCatalogInputEnvelopeObjectSchema as TechnicalIssueCreateManyServiceCatalogInputEnvelopeObjectSchema } from './TechnicalIssueCreateManyServiceCatalogInputEnvelope.schema';
import { TechnicalIssueWhereUniqueInputObjectSchema as TechnicalIssueWhereUniqueInputObjectSchema } from './TechnicalIssueWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TechnicalIssueCreateWithoutServiceCatalogInputObjectSchema), z.lazy(() => TechnicalIssueCreateWithoutServiceCatalogInputObjectSchema).array(), z.lazy(() => TechnicalIssueUncheckedCreateWithoutServiceCatalogInputObjectSchema), z.lazy(() => TechnicalIssueUncheckedCreateWithoutServiceCatalogInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TechnicalIssueCreateOrConnectWithoutServiceCatalogInputObjectSchema), z.lazy(() => TechnicalIssueCreateOrConnectWithoutServiceCatalogInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => TechnicalIssueCreateManyServiceCatalogInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema), z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const TechnicalIssueCreateNestedManyWithoutServiceCatalogInputObjectSchema: z.ZodType<Prisma.TechnicalIssueCreateNestedManyWithoutServiceCatalogInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueCreateNestedManyWithoutServiceCatalogInput>;
export const TechnicalIssueCreateNestedManyWithoutServiceCatalogInputObjectZodSchema = makeSchema();
