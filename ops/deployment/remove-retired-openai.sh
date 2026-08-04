#!/bin/sh
set -eu

if [ ! -f package.json ] || [ ! -f compose.yaml ]; then
    echo "Run this script from the watch-shop project root." >&2
    exit 1
fi

rm -f \
    'src/domains/acquisition/server/acquisition-ai.service.ts' \
    'src/domains/acquisition/server/acquisition-spec-job.service.ts' \
    'src/domains/acquisition/server/acquisition-spec-job-log.service.ts' \
    'src/domains/system/server/jobs/acquisition-spec.processor.ts' \
    'src/app/api/admin/system/jobs/system-jobs/run-acquisition-spec/route.ts' \
    'src/app/api/internal/jobs/run/acquisition-spec/route.ts' \
    'src/app/api/admin/acquisitions/spec-jobs/retry-failed/route.ts' \
    'src/server/jobs/generate-spec.job.ts' \
    'src/app/(admin)/admin/acquisitions/_server/ai/acquisition-ai.service.ts' \
    'src/app/(admin)/admin/acquisitions/_server/ai/acquisition-spec-job.service.ts' \
    'src/app/(admin)/admin/products/_server/ai/product-ai.server.ts' \
    'src/app/(admin)/admin/products/_server/content/product-content.generator.ts' \
    'src/app/(admin)/admin/products/_client/ProductAiPanel.tsx' \
    'src/app/(admin)/admin/products/_client/edit/EditProductForm.tsx' \
    'src/app/(admin)/admin/products/[id]/_client/ProductDetailClient.tsx' \
    'src/app/(admin)/admin/system/jobs/_client/SystemJobPageCilent.tsx'

echo "Retired OpenAI files removed."
