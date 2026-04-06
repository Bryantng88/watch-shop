import { getTechnicalIssueBoardData } from "../_server/technical-issue-board.service";

import TechnicalIssueBoardClient from "../_client/TechnicalIssuesBoardClient";

function serialize(obj: any) {
    return JSON.parse(
        JSON.stringify(obj, (_key, value) => {
            if (value instanceof Date) return value.toISOString();
            if (typeof value === "object" && value?._isDecimal) return Number(value);
            return value;
        })
    );
}

export default async function TechnicalIssueBoardPage() {
    const data = await getTechnicalIssueBoardData();

    return (
        <TechnicalIssueBoardClient
            items={serialize(data.items)}
            counts={serialize(data.counts)}
        />
    );
}