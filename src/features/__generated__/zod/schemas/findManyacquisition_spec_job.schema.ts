import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { acquisition_spec_jobOrderByWithRelationInputObjectSchema as acquisition_spec_jobOrderByWithRelationInputObjectSchema } from './objects/acquisition_spec_jobOrderByWithRelationInput.schema';
import { acquisition_spec_jobWhereInputObjectSchema as acquisition_spec_jobWhereInputObjectSchema } from './objects/acquisition_spec_jobWhereInput.schema';
import { acquisition_spec_jobWhereUniqueInputObjectSchema as acquisition_spec_jobWhereUniqueInputObjectSchema } from './objects/acquisition_spec_jobWhereUniqueInput.schema';
import { AcquisitionSpecJobScalarFieldEnumSchema } from './enums/AcquisitionSpecJobScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const acquisition_spec_jobFindManySelectSchema: z.ZodType<Prisma.acquisition_spec_jobSelect> = z.object({
    id: z.boolean().optional(),
    acquisition_item_id: z.boolean().optional(),
    product_id: z.boolean().optional(),
    status: z.boolean().optional(),
    attempts: z.boolean().optional(),
    last_error: z.boolean().optional(),
    priority: z.boolean().optional(),
    run_after: z.boolean().optional(),
    started_at: z.boolean().optional(),
    finished_at: z.boolean().optional(),
    created_at: z.boolean().optional(),
    updated_at: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.acquisition_spec_jobSelect>;

export const acquisition_spec_jobFindManySelectZodSchema = z.object({
    id: z.boolean().optional(),
    acquisition_item_id: z.boolean().optional(),
    product_id: z.boolean().optional(),
    status: z.boolean().optional(),
    attempts: z.boolean().optional(),
    last_error: z.boolean().optional(),
    priority: z.boolean().optional(),
    run_after: z.boolean().optional(),
    started_at: z.boolean().optional(),
    finished_at: z.boolean().optional(),
    created_at: z.boolean().optional(),
    updated_at: z.boolean().optional()
  }).strict();

export const acquisition_spec_jobFindManySchema: z.ZodType<Prisma.acquisition_spec_jobFindManyArgs> = z.object({ select: acquisition_spec_jobFindManySelectSchema.optional(),  orderBy: z.union([acquisition_spec_jobOrderByWithRelationInputObjectSchema, acquisition_spec_jobOrderByWithRelationInputObjectSchema.array()]).optional(), where: acquisition_spec_jobWhereInputObjectSchema.optional(), cursor: acquisition_spec_jobWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([AcquisitionSpecJobScalarFieldEnumSchema, AcquisitionSpecJobScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.acquisition_spec_jobFindManyArgs>;

export const acquisition_spec_jobFindManyZodSchema = z.object({ select: acquisition_spec_jobFindManySelectSchema.optional(),  orderBy: z.union([acquisition_spec_jobOrderByWithRelationInputObjectSchema, acquisition_spec_jobOrderByWithRelationInputObjectSchema.array()]).optional(), where: acquisition_spec_jobWhereInputObjectSchema.optional(), cursor: acquisition_spec_jobWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([AcquisitionSpecJobScalarFieldEnumSchema, AcquisitionSpecJobScalarFieldEnumSchema.array()]).optional() }).strict();