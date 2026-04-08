import { prisma } from "@/server/db/client";
import type {
    AcquisitionExtractedSpec,
    AcquisitionGeneratedDraft,
    CreateWithAiInput,
} from "./acquisition-ai.types";

export async function createAcquisitionDraftRecord(input: {
    vendorId: string;
    cost: number;
    note?: string | null;
    imageUrls: string[];
    titleHint?: string | null;
    hintText?: string | null;
    aiExtractedSpec: AcquisitionExtractedSpec;
    aiGeneratedDraft: AcquisitionGeneratedDraft;
}) {
    // TODO: map về schema acquisition thật của project bạn
    // Đây là payload mẫu theo pattern repo.
    return {
        vendorId: input.vendorId,
        cost: input.cost,
        note: input.note ?? null,
        imageUrls: input.imageUrls,
        titleHint: input.titleHint ?? null,
        hintText: input.hintText ?? null,
        aiExtractedSpec: input.aiExtractedSpec,
        aiGeneratedDraft: input.aiGeneratedDraft,
    };
}

export async function createProductDraftFromAcquisitionAi(input: {
    vendorId: string;
    categoryId?: string | null;
    imageUrls: string[];
    generatedTitle: string;
    extractedSpec: AcquisitionExtractedSpec;
    generatedDraft: AcquisitionGeneratedDraft;
}) {
    // TODO: nối vào model/service thật của product
    return {
        vendorId: input.vendorId,
        categoryId: input.categoryId ?? null,
        primaryImageUrl: input.imageUrls[0] ?? null,
        title: input.generatedTitle,
        aiDraftPendingReview: true,
        watchSpec: {
            ref: input.extractedSpec.bestRefCandidate,
            model: input.extractedSpec.modelFamily,
            year: input.extractedSpec.yearEstimate,
            caseType: input.extractedSpec.caseType,
            gender: input.extractedSpec.gender,
            movement: input.extractedSpec.movement,
            caliber: input.extractedSpec.bestCaliberCandidate,
            caseMaterial: input.extractedSpec.caseMaterial,
            goldKarat: input.extractedSpec.goldKarat,
            goldColor: input.extractedSpec.goldColor,
            width: input.extractedSpec.widthEstimateMm,
            length: input.extractedSpec.lengthEstimateMm,
            thickness: input.extractedSpec.thicknessEstimateMm,
            strap: input.extractedSpec.strapType,
            glass: input.extractedSpec.glass,
            dialColor: input.extractedSpec.dialColor,
            dialCondition: input.extractedSpec.dialCondition,
            boxIncluded: input.extractedSpec.likelyAccessories.boxIncluded,
            bookletIncluded: input.extractedSpec.likelyAccessories.bookletIncluded,
            cardIncluded: input.extractedSpec.likelyAccessories.cardIncluded,
        },
        content: {
            generatedContent: input.generatedDraft.listingCopy,
            specBullets: input.generatedDraft.specBullets,
            titleOptions: input.generatedDraft.titleOptions,
            hashtags: input.generatedDraft.hashtags,
            missingData: input.generatedDraft.missingData,
            safetyNotes: input.generatedDraft.safetyNotes,
        },
        aiExtractedSpecRaw: input.extractedSpec,
    };
}

export async function persistCreateWithAiPayload(input: {
    createInput: CreateWithAiInput;
    extractedSpec: AcquisitionExtractedSpec;
    generatedDraft: AcquisitionGeneratedDraft;
}) {
    // TODO:
    // Đây là điểm bạn thay bằng transaction thật của project:
    // - tạo acquisition
    // - tạo product draft
    // - link acquisition với product
    //
    // Ví dụ:
    // return prisma.$transaction(async (tx) => { ... })

    const acquisition = await createAcquisitionDraftRecord({
        vendorId: input.createInput.vendorId,
        cost: input.createInput.cost,
        note: input.createInput.note,
        imageUrls: input.createInput.imageUrls,
        titleHint: input.createInput.titleHint,
        hintText: input.createInput.hintText,
        aiExtractedSpec: input.extractedSpec,
        aiGeneratedDraft: input.generatedDraft,
    });

    const productDraft = await createProductDraftFromAcquisitionAi({
        vendorId: input.createInput.vendorId,
        categoryId: input.createInput.categoryId,
        imageUrls: input.createInput.imageUrls,
        generatedTitle: input.generatedDraft.generatedTitle,
        extractedSpec: input.extractedSpec,
        generatedDraft: input.generatedDraft,
    });

    return {
        acquisition,
        productDraft,
    };
}