import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueWhereUniqueInputObjectSchema as TechnicalIssueWhereUniqueInputObjectSchema } from './TechnicalIssueWhereUniqueInput.schema';
import { TechnicalIssueCreateWithoutSupplyCatalogInputObjectSchema as TechnicalIssueCreateWithoutSupplyCatalogInputObjectSchema } from './TechnicalIssueCreateWithoutSupplyCatalogInput.schema';
import { TechnicalIssueUncheckedCreateWithoutSupplyCatalogInputObjectSchema as TechnicalIssueUncheckedCreateWithoutSupplyCatalogInputObjectSchema } from './TechnicalIssueUncheckedCreateWithoutSupplyCatalogInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => TechnicalIssueCreateWithoutSupplyCatalogInputObjectSchema), z.lazy(() => TechnicalIssueUncheckedCreateWithoutSupplyCatalogInputObjectSchema)])
}).strict();
export const TechnicalIssueCreateOrConnectWithoutSupplyCatalogInputObjectSchema: z.ZodType<Prisma.TechnicalIssueCreateOrConnectWithoutSupplyCatalogInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueCreateOrConnectWithoutSupplyCatalogInput>;
export const TechnicalIssueCreateOrConnectWithoutSupplyCatalogInputObjectZodSchema = makeSchema();
