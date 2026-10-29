import type { OperationsDashboardQueue, OperationsDashboardStage } from "../shared";
import type { StageStatisticsRow, StageThroughputRow } from "@/domains/projection/server/operation-stage-statistics.query";

export function concentratedStages(queue: Pick<OperationsDashboardQueue, "activeCount" | "stages">) {
  if (queue.activeCount <= 0) return [];
  return queue.stages.filter(stage => stage.count >= 3 && stage.count / queue.activeCount >= 0.6);
}

function duration(hours: number | null) {
  if (hours === null) return "—";
  if (hours < 1) return "< 1 giờ";
  if (hours < 24) return `${Number(hours.toFixed(1)).toLocaleString("vi-VN")} giờ`;
  return `${Number((hours / 24).toFixed(1)).toLocaleString("vi-VN")} ngày`;
}

export function stageMetrics(stats?: StageStatisticsRow, throughput?: StageThroughputRow): NonNullable<OperationsDashboardStage["metrics"]> {
  const metrics: NonNullable<OperationsDashboardStage["metrics"]> = [];
  if (stats) {
    metrics.push({ label: "Không cập nhật TB", value: duration(stats.averageIdleHours), detail: "Trung bình thời gian từ cập nhật nghiệp vụ gần nhất của các việc hiện ở stage; không phải thời gian xử lý." });
    metrics.push({ label: "Không cập nhật ≥ 7 ngày", value: `${Number(stats.staleCount)}/${Number(stats.count)} việc`, detail: `Thời gian không cập nhật lâu nhất: ${duration(stats.oldestIdleHours)}. Không mặc định là quá hạn SLA.` });
    if (Number(stats.stepsTotal) > 0) {
      const done = Number(stats.stepsDone), total = Number(stats.stepsTotal);
      metrics.push({ label: "Đầu việc đã hoàn tất", value: `${Math.round(done / total * 100)}%`, detail: `${done}/${total} đầu việc trên ${Number(stats.stepsSampleCount)}/${Number(stats.count)} việc có checklist. Đây là tiến độ đầu việc trong stage hiện tại.` });
    }
  }
  if (throughput) {
    metrics.push({ label: "Đã qua stage · 7 ngày", value: `${Number(throughput.completedCount)} lượt`, detail: "Lượt workflow có mốc hoàn tất trong 7 ngày gần nhất. Một mục có thể có nhiều lượt xử lý." });
    metrics.push({ label: "TG xử lý TB · 7 ngày", value: duration(throughput.averageHandlingHours), detail: "Trung bình từ mốc bắt đầu đến hoàn tất của các lượt hoàn tất trong 7 ngày gần nhất; gồm cả thời gian chờ." });
    const cohort = Number(throughput.cohortCount), completed = Number(throughput.cohortCompletedCount);
    metrics.push({ label: "Hoàn tất nhóm nhận 7 ngày", value: cohort > 0 ? `${Math.round(completed / cohort * 100)}%` : "—", detail: cohort > 0 ? `${completed}/${cohort} lượt bắt đầu trong 7 ngày gần nhất đã hoàn tất đến hiện tại. Loại lượt đã hủy.` : "Chưa có lượt bắt đầu trong 7 ngày gần nhất để tính tỷ lệ." });
  }
  return metrics;
}
