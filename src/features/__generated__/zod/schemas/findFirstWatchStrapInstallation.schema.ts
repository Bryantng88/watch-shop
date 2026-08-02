import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchStrapInstallationIncludeObjectSchema as WatchStrapInstallationIncludeObjectSchema } from './objects/WatchStrapInstallationInclude.schema';
import { WatchStrapInstallationOrderByWithRelationInputObjectSchema as WatchStrapInstallationOrderByWithRelationInputObjectSchema } from './objects/WatchStrapInstallationOrderByWithRelationInput.schema';
import { WatchStrapInstallationWhereInputObjectSchema as WatchStrapInstallationWhereInputObjectSchema } from './objects/WatchStrapInstallationWhereInput.schema';
import { WatchStrapInstallationWhereUniqueInputObjectSchema as WatchStrapInstallationWhereUniqueInputObjectSchema } from './objects/WatchStrapInstallationWhereUniqueInput.schema';
import { WatchStrapInstallationScalarFieldEnumSchema } from './enums/WatchStrapInstallationScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const WatchStrapInstallationFindFirstSelectSchema: z.ZodType<Prisma.WatchStrapInstallationSelect> = z.object({
    id: z.boolean().optional(),
    watchId: z.boolean().optional(),
    strapVariantId: z.boolean().optional(),
    ownershipMode: z.boolean().optional(),
    installedFullLinks: z.boolean().optional(),
    installedHalfLinks: z.boolean().optional(),
    spareFullLinks: z.boolean().optional(),
    spareHalfLinks: z.boolean().optional(),
    endLinkCount: z.boolean().optional(),
    wristSizeMM: z.boolean().optional(),
    installedAt: z.boolean().optional(),
    removedAt: z.boolean().optional(),
    installedByUserId: z.boolean().optional(),
    removedByUserId: z.boolean().optional(),
    sourceOrderId: z.boolean().optional(),
    serviceRequestId: z.boolean().optional(),
    note: z.boolean().optional(),
    watch: z.boolean().optional(),
    strapVariant: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.WatchStrapInstallationSelect>;

export const WatchStrapInstallationFindFirstSelectZodSchema = z.object({
    id: z.boolean().optional(),
    watchId: z.boolean().optional(),
    strapVariantId: z.boolean().optional(),
    ownershipMode: z.boolean().optional(),
    installedFullLinks: z.boolean().optional(),
    installedHalfLinks: z.boolean().optional(),
    spareFullLinks: z.boolean().optional(),
    spareHalfLinks: z.boolean().optional(),
    endLinkCount: z.boolean().optional(),
    wristSizeMM: z.boolean().optional(),
    installedAt: z.boolean().optional(),
    removedAt: z.boolean().optional(),
    installedByUserId: z.boolean().optional(),
    removedByUserId: z.boolean().optional(),
    sourceOrderId: z.boolean().optional(),
    serviceRequestId: z.boolean().optional(),
    note: z.boolean().optional(),
    watch: z.boolean().optional(),
    strapVariant: z.boolean().optional()
  }).strict();

export const WatchStrapInstallationFindFirstSchema: z.ZodType<Prisma.WatchStrapInstallationFindFirstArgs> = z.object({ select: WatchStrapInstallationFindFirstSelectSchema.optional(), include: WatchStrapInstallationIncludeObjectSchema.optional(), orderBy: z.union([WatchStrapInstallationOrderByWithRelationInputObjectSchema, WatchStrapInstallationOrderByWithRelationInputObjectSchema.array()]).optional(), where: WatchStrapInstallationWhereInputObjectSchema.optional(), cursor: WatchStrapInstallationWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([WatchStrapInstallationScalarFieldEnumSchema, WatchStrapInstallationScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.WatchStrapInstallationFindFirstArgs>;

export const WatchStrapInstallationFindFirstZodSchema = z.object({ select: WatchStrapInstallationFindFirstSelectSchema.optional(), include: WatchStrapInstallationIncludeObjectSchema.optional(), orderBy: z.union([WatchStrapInstallationOrderByWithRelationInputObjectSchema, WatchStrapInstallationOrderByWithRelationInputObjectSchema.array()]).optional(), where: WatchStrapInstallationWhereInputObjectSchema.optional(), cursor: WatchStrapInstallationWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([WatchStrapInstallationScalarFieldEnumSchema, WatchStrapInstallationScalarFieldEnumSchema.array()]).optional() }).strict();