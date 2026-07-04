/**
 * 定時任務 — 每日自動備份。
 * Cron jobs — daily automatic backup.
 *
 * 每日凌晨 03:00 (UTC+8) 自動執行備份。
 * Runs daily backup at 03:00 UTC+8 (19:00 UTC previous day).
 */
import cron from "node-cron";
import { performBackup } from "./backup";

/**
 * 啟動定時備份任務。
 * Starts the scheduled backup task.
 */
export function startBackupCron() {
  // 每日 03:00 UTC+8 = 19:00 UTC (前一天)
  // cron 格式: 分 時 日 月 週
  // 使用 "0 19 * * *" (UTC 19:00 = UTC+8 03:00)
  cron.schedule(
    "0 19 * * *",
    async () => {
      console.log("🕐 開始每日自動備份...");
      try {
        await performBackup("cron");
      } catch (error) {
        console.error("✗ 自動備份失敗:", error);
      }
    },
    {
      timezone: "UTC",
    }
  );

  console.log("✓ 定時備份任務已啟動 (每日 03:00 UTC+8)");
}
