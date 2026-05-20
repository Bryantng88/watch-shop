import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ReservationIncludeObjectSchema as ReservationIncludeObjectSchema } from './objects/ReservationInclude.schema';
import { ReservationOrderByWithRelationInputObjectSchema as ReservationOrderByWithRelationInputObjectSchema } from './objects/ReservationOrderByWithRelationInput.schema';
import { ReservationWhereInputObjectSchema as ReservationWhereInputObjectSchema } from './objects/ReservationWhereInput.schema';
import { ReservationWhereUniqueInputObjectSchema as ReservationWhereUniqueInputObjectSchema } from './objects/ReservationWhereUniqueInput.schema';
import { ReservationScalarFieldEnumSchema } from './enums/ReservationScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const ReservationFindFirstOrThrowSelectSchema: z.ZodType<Prisma.ReservationSelect> = z.object({
    id: z.boolean().optional(),
    productId: z.boolean().optional(),
    orderId: z.boolean().optional(),
    status: z.boolean().optional(),
    depositAmt: z.boolean().optional(),
    expiresAt: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    product: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.ReservationSelect>;

export const ReservationFindFirstOrThrowSelectZodSchema = z.object({
    id: z.boolean().optional(),
    productId: z.boolean().optional(),
    orderId: z.boolean().optional(),
    status: z.boolean().optional(),
    depositAmt: z.boolean().optional(),
    expiresAt: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    product: z.boolean().optional()
  }).strict();

export const ReservationFindFirstOrThrowSchema: z.ZodType<Prisma.ReservationFindFirstOrThrowArgs> = z.object({ select: ReservationFindFirstOrThrowSelectSchema.optional(), include: ReservationIncludeObjectSchema.optional(), orderBy: z.union([ReservationOrderByWithRelationInputObjectSchema, ReservationOrderByWithRelationInputObjectSchema.array()]).optional(), where: ReservationWhereInputObjectSchema.optional(), cursor: ReservationWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([ReservationScalarFieldEnumSchema, ReservationScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.ReservationFindFirstOrThrowArgs>;

export const ReservationFindFirstOrThrowZodSchema = z.object({ select: ReservationFindFirstOrThrowSelectSchema.optional(), include: ReservationIncludeObjectSchema.optional(), orderBy: z.union([ReservationOrderByWithRelationInputObjectSchema, ReservationOrderByWithRelationInputObjectSchema.array()]).optional(), where: ReservationWhereInputObjectSchema.optional(), cursor: ReservationWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([ReservationScalarFieldEnumSchema, ReservationScalarFieldEnumSchema.array()]).optional() }).strict();