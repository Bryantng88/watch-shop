import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueCreateWithoutSupplyCatalogInputObjectSchema as TechnicalIssueCreateWithoutSupplyCatalogInputObjectSchema } from './TechnicalIssueCreateWithoutSupplyCatalogInput.schema';
import { TechnicalIssueUncheckedCreateWithoutSupplyCatalogInputObjectSchema as TechnicalIssueUncheckedCreateWithoutSupplyCatalogInputObjectSchema } from './TechnicalIssueUncheckedCreateWithoutSupplyCatalogInput.schema';
import { TechnicalIssueCreateOrConnectWithoutSupplyCatalogInputObjectSchema as TechnicalIssueCreateOrConnectWithoutSupplyCatalogInputObjectSchema } from './TechnicalIssueCreateOrConnectWithoutSupplyCatalogInput.schema';
import { TechnicalIssueCreateManySupplyCatalogInputEnvelopeObjectSchema as TechnicalIssueCreateManySupplyCatalogInputEnvelopeObjectSchema } from './TechnicalIssueCreateManySupplyCatalogInputEnvelope.schema';
import { TechnicalIssueWhereUniqueInputObjectSchema as TechnicalIssueWhereUniqueInputObjectSchema } from './TechnicalIssueWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TechnicalIssueCreateWithoutSupplyCatalogInputObjectSchema), z.lazy(() => TechnicalIssueCreateWithoutSupplyCatalogInputObjectSchema).array(), z.lazy(() => TechnicalIssueUncheckedCreateWithoutSupplyCatalogInputObjectSchema), z.lazy(() => TechnicalIssueUncheckedCreateWithoutSupplyCatalogInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TechnicalIssueCreateOrConnectWithoutSupplyCatalogInputObjectSchema), z.lazy(() => TechnicalIssueCreateOrConnectWithoutSupplyCatalogInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => TechnicalIssueCreateManySupplyCatalogInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema), z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const TechnicalIssueCreateNestedManyWithoutSupplyCatalogInputObjectSchema: z.ZodType<Prisma.TechnicalIssueCreateNestedManyWithoutSupplyCatalogInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueCreateNestedManyWithoutSupplyCatalogInput>;
export const TechnicalIssueCreateNestedManyWithoutSupplyCatalogInputObjectZodSchema = makeSchema();
