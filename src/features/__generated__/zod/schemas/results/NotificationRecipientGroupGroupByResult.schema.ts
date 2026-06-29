import * as z from 'zod';
export const NotificationRecipientGroupGroupByResultSchema = z.array(z.object({
  id: z.string(),
  key: z.string(),
  name: z.string(),
  enabled: z.boolean(),
  roleNames: z.unknown(),
  userIds: z.unknown(),
  zaloGroupId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  _count: z.object({
    id: z.number(),
    key: z.number(),
    name: z.number(),
    enabled: z.number(),
    roleNames: z.number(),
    userIds: z.number(),
    zaloGroupId: z.number(),
    createdAt: z.number(),
    updatedAt: z.number()
  }).optional(),
  _min: z.object({
    id: z.string().nullable(),
    key: z.string().nullable(),
    name: z.string().nullable(),
    zaloGroupId: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    key: z.string().nullable(),
    name: z.string().nullable(),
    zaloGroupId: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional()
}));