import * as z from 'zod';
export const UserAggregateResultSchema = z.object({  _count: z.object({
    id: z.number(),
    email: z.number(),
    passwordHash: z.number(),
    name: z.number(),
    avatarUrl: z.number(),
    isActive: z.number(),
    createdAt: z.number(),
    updatedAt: z.number(),
    roleId: z.number(),
    customer: z.number(),
    roles: z.number()
  }).optional(),
  _min: z.object({
    id: z.string().nullable(),
    email: z.string().nullable(),
    passwordHash: z.string().nullable(),
    name: z.string().nullable(),
    avatarUrl: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable(),
    roleId: z.string().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    email: z.string().nullable(),
    passwordHash: z.string().nullable(),
    name: z.string().nullable(),
    avatarUrl: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable(),
    roleId: z.string().nullable()
  }).nullable().optional()});