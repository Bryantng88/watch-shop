import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalDetailCatalogCreateWithoutTechnicalIssuesInputObjectSchema as TechnicalDetailCatalogCreateWithoutTechnicalIssuesInputObjectSchema } from './TechnicalDetailCatalogCreateWithoutTechnicalIssuesInput.schema';
import { TechnicalDetailCatalogUncheckedCreateWithoutTechnicalIssuesInputObjectSchema as TechnicalDetailCatalogUncheckedCreateWithoutTechnicalIssuesInputObjectSchema } from './TechnicalDetailCatalogUncheckedCreateWithoutTechnicalIssuesInput.schema';
import { TechnicalDetailCatalogCreateOrConnectWithoutTechnicalIssuesInputObjectSchema as TechnicalDetailCatalogCreateOrConnectWithoutTechnicalIssuesInputObjectSchema } from './TechnicalDetailCatalogCreateOrConnectWithoutTechnicalIssuesInput.schema';
import { TechnicalDetailCatalogWhereUniqueInputObjectSchema as TechnicalDetailCatalogWhereUniqueInputObjectSchema } from './TechnicalDetailCatalogWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TechnicalDetailCatalogCreateWithoutTechnicalIssuesInputObjectSchema), z.lazy(() => TechnicalDetailCatalogUncheckedCreateWithoutTechnicalIssuesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => TechnicalDetailCatalogCreateOrConnectWithoutTechnicalIssuesInputObjectSchema).optional(),
  connect: z.lazy(() => TechnicalDetailCatalogWhereUniqueInputObjectSchema).optional()
}).strict();
export const TechnicalDetailCatalogCreateNestedOneWithoutTechnicalIssuesInputObjectSchema: z.ZodType<Prisma.TechnicalDetailCatalogCreateNestedOneWithoutTechnicalIssuesInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalDetailCatalogCreateNestedOneWithoutTechnicalIssuesInput>;
export const TechnicalDetailCatalogCreateNestedOneWithoutTechnicalIssuesInputObjectZodSchema = makeSchema();
