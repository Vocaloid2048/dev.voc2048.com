/**
 * 後台儀表盤 — 流量統計、訪客列表、系統日誌。
 * Dashboard — traffic stats, visitor list, system logs.
 */
import { prisma } from "@/lib/prisma";
import { formatFileSize } from "@/lib/utils";

export default async function DashboardPage() {
  // 取得統計數據
  const [noteCount, workCount, fileCount, visitCount, backups] =
    await Promise.all([
      prisma.note.count().catch(() => 0),
      prisma.work.count().catch(() => 0),
      prisma.file.count().catch(() => 0),
      prisma.visitLog.count().catch(() => 0),
      prisma.backup
        .findMany({ orderBy: { createdAt: "desc" }, take: 5 })
        .catch(() => []),
    ]);

  // 近 7 天訪問量
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const recentVisits = await prisma.visitLog
    .findMany({
      where: { timestamp: { gte: sevenDaysAgo } },
      orderBy: { timestamp: "desc" },
      take: 20,
      select: { ip: true, path: true, country: true, city: true, timestamp: true },
    })
    .catch(() => []);

  const stats = [
    { label: "筆記", value: noteCount },
    { label: "作品", value: workCount },
    { label: "檔案", value: fileCount },
    { label: "總訪問量", value: visitCount },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-[var(--db-text)]">儀表盤</h1>

      {/* 統計卡片 */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="dashboard-card p-4">
            <p className="text-sm text-[var(--db-text-muted)]">{stat.label}</p>
            <p className="mt-1 text-2xl font-bold text-[var(--db-text)]">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* 近期訪客 */}
      <div className="mb-8">
        <h2 className="mb-3 text-lg font-semibold text-[var(--db-text)]">
          近期訪客
        </h2>
        <div className="dashboard-card overflow-hidden">
          <table className="dashboard-table w-full text-sm">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">IP</th>
                <th className="px-4 py-2 text-left">路徑</th>
                <th className="px-4 py-2 text-left">地區</th>
                <th className="px-4 py-2 text-left">時間</th>
              </tr>
            </thead>
            <tbody className="text-[var(--db-text)]">
              {recentVisits.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-[var(--db-text-muted)]">
                    暫無訪問記錄
                  </td>
                </tr>
              ) : (
                recentVisits.map((visit, i) => (
                  <tr key={i}>
                    <td className="px-4 py-2 font-mono text-xs">{visit.ip}</td>
                    <td className="px-4 py-2">{visit.path}</td>
                    <td className="px-4 py-2">
                      {visit.city || visit.country || "—"}
                    </td>
                    <td className="px-4 py-2 text-[var(--db-text-muted)]">
                      {new Date(visit.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 近期備份 */}
      <div>
        <h2 className="mb-3 text-lg font-semibold text-[var(--db-text)]">
          近期備份
        </h2>
        <div className="dashboard-card overflow-hidden">
          <table className="dashboard-table w-full text-sm">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">備份名稱</th>
                <th className="px-4 py-2 text-left">大小</th>
                <th className="px-4 py-2 text-left">狀態</th>
                <th className="px-4 py-2 text-left">觸發</th>
                <th className="px-4 py-2 text-left">時間</th>
              </tr>
            </thead>
            <tbody className="text-[var(--db-text)]">
              {backups.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-[var(--db-text-muted)]">
                    暫無備份記錄
                  </td>
                </tr>
              ) : (
                backups.map((backup) => (
                  <tr key={backup.id}>
                    <td className="px-4 py-2 font-mono text-xs">{backup.filename}</td>
                    <td className="px-4 py-2">{formatFileSize(backup.size)}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs ${
                          backup.status === "COMPLETED"
                            ? "bg-[rgba(140,185,154,0.15)] text-[var(--db-success)]"
                            : "bg-[rgba(201,122,122,0.15)] text-[var(--db-error)]"
                        }`}
                      >
                        {backup.status}
                      </span>
                    </td>
                    <td className="px-4 py-2">{backup.triggeredBy}</td>
                    <td className="px-4 py-2 text-[var(--db-text-muted)]">
                      {new Date(backup.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
