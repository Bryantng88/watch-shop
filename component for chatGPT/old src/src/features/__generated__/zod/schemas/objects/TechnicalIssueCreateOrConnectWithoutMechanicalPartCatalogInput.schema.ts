import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueWhereUniqueInputObjectSchema as TechnicalIssueWhereUniqueInputObjectSchema } from './TechnicalIssueWhereUniqueInput.schema';
import { TechnicalIssueCreateWithoutMechanicalPartCatalogInputObjectSchema as TechnicalIssueCreateWithoutMechanicalPartCatalogInputObjectSchema } from './TechnicalIssueCreateWithoutMechanicalPartCatalogInput.schema';
import { TechnicalIssueUncheckedCreateWithoutMechanicalPartCatalogInputObjectSchema as TechnicalIssueUncheckedCreateWithoutMechanicalPartCatalogInputObjectSchema } from './TechnicalIssueUncheckedCreateWithoutMechanicalPartCatalogInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => TechnicalIssueCreateWithoutMechanicalPartCatalogInputObjectSchema), z.lazy(() => TechnicalIssueUncheckedCreateWithoutMechanicalPartCatalogInputObjectSchema)])
}).strict();
export const TechnicalIssueCreateOrConnectWithoutMechanicalPartCatalogInputObjectSchema: z.ZodType<Prisma.TechnicalIssueCreateOrConnectWithoutMechanicalPartCatalogInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueCreateOrConnectWithoutMechanicalPartCatalogInput>;
export const TechnicalIssueCreateOrConnectWithoutMechanicalPartCatalogInputObjectZodSchema = makeSchema();
