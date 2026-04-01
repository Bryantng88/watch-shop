import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueWhereUniqueInputObjectSchema as TechnicalIssueWhereUniqueInputObjectSchema } from './TechnicalIssueWhereUniqueInput.schema';
import { TechnicalIssueCreateWithoutServiceCatalogInputObjectSchema as TechnicalIssueCreateWithoutServiceCatalogInputObjectSchema } from './TechnicalIssueCreateWithoutServiceCatalogInput.schema';
import { TechnicalIssueUncheckedCreateWithoutServiceCatalogInputObjectSchema as TechnicalIssueUncheckedCreateWithoutServiceCatalogInputObjectSchema } from './TechnicalIssueUncheckedCreateWithoutServiceCatalogInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => TechnicalIssueCreateWithoutServiceCatalogInputObjectSchema), z.lazy(() => TechnicalIssueUncheckedCreateWithoutServiceCatalogInputObjectSchema)])
}).strict();
export const TechnicalIssueCreateOrConnectWithoutServiceCatalogInputObjectSchema: z.ZodType<Prisma.TechnicalIssueCreateOrConnectWithoutServiceCatalogInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueCreateOrConnectWithoutServiceCatalogInput>;
export const TechnicalIssueCreateOrConnectWithoutServiceCatalogInputObjectZodSchema = makeSchema();
