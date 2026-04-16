import * as z from 'zod';

import { VendorRoleSchema } from '../../enums/VendorRole.schema';
// prettier-ignore
export const VendorInputSchema = z.object({
    id: z.string(),
    name: z.string(),
    role: VendorRoleSchema,
    isAuthorized: z.boolean(),
    email: z.string().optional().nullable(),
    phone: z.string().optional().nullable(),
    address: z.string().optional().nullable(),
    note: z.string().optional().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    bankName: z.string().optional().nullable(),
    bankAcc: z.string().optional().nullable(),
    isActive: z.boolean(),
    Acquisition: z.array(z.unknown()),
    Invoice: z.array(z.unknown()),
    MaintenanceRecord: z.array(z.unknown()),
    product: z.array(z.unknown()),
    serviceRequest: z.array(z.unknown()),
    technicalAssessment: z.array(z.unknown()),
    technicalIssue: z.array(z.unknown()),
    bank: z.unknown().optional().nullable()
}).strict();

export type VendorInputType = z.infer<typeof VendorInputSchema>;
