/**
 * 備份與復原服務 — PostgreSQL pg_dump + uploads 壓縮。
 * Backup & restore service — PostgreSQL pg_dump + uploads tar.gz.
 *
 * 功能:
 * - 每日自動備份 (node-cron, 03:00 UTC+8)
 * - 保留最近 14 天
 * - 手動觸發備份
 * - 復原指定備份
 */
import { exec } from "child_process";
import { promisify } from "util";
import { promises as fs } from "fs";
import path from "path";
import { prisma } from "./prisma";

const execAsync = promisify(exec);

const BACKUP_DIR = process.env.BACKUP_DIR || "./backups";
const UPLOAD_DIR = process.env.UPLOAD_DIR || "./uploads";
const RETENTION_DAYS = parseInt(
  process.env.BACKUP_RETENTION_DAYS || "14",
  10
);
const DATABASE_URL = process.env.DATABASE_URL || "";

/**
 * 從 DATABASE_URL 解析連線參數。
 * Parses connection parameters from DATABASE_URL.
 */
function parseDbUrl(url: string) {
  const match = url.match(
    /^postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)$/
  );
  if (!match) throw new Error("Invalid DATABASE_URL format");
  return {
    user: match[1],
    password: match[2],
    host: match[3],
    port: match[4],
    database: match[5],
  };
}

/**
 * 執行每日備份。
 * Performs a daily backup (pg_dump + uploads tar.gz).
 * @param triggeredBy - 觸發來源 ("cron" | "manual") / Trigger source.
 * @returns 備份記錄 / Backup record.
 */
export async function performBackup(triggeredBy: string = "cron") {
  const date = new Date();
  const dateStr = date.toISOString().split("T")[0]; // YYYY-MM-DD
  const backupName = dateStr;
  const backupPath = path.join(BACKUP_DIR, dateStr);

  // 確保備份目錄存在
  await fs.mkdir(backupPath, { recursive: true });

  const db = parseDbUrl(DATABASE_URL);
  const dbDumpPath = path.join(backupPath, "db_dump.sql");
  const assetsPath = path.join(backupPath, "uploads.tar.gz");

  try {
    // 1. PostgreSQL 備份 (pg_dump)
    const dumpCmd = `PGPASSWORD="${db.password}" pg_dump -h ${db.host} -p ${db.port} -U ${db.user} -d ${db.database} -F p -f "${dbDumpPath}"`;
    await execAsync(dumpCmd);

    // 2. uploads 目錄壓縮
    try {
      await execAsync(`tar -czf "${assetsPath}" -C "${UPLOAD_DIR}" .`);
    } catch {
      // uploads 目錄可能為空或不存在
      console.warn("uploads 目錄備份跳過 (可能為空)");
    }

    // 3. 計算總大小
    const dbStat = await fs.stat(dbDumpPath).catch(() => ({ size: 0 }));
    const assetsStat = await fs.stat(assetsPath).catch(() => ({ size: 0 }));
    const totalSize = (dbStat as { size: number }).size + (assetsStat as { size: number }).size;

    // 4. 記錄到資料庫
    const backup = await prisma.backup.create({
      data: {
        filename: backupName,
        size: totalSize,
        type: "FULL",
        status: "COMPLETED",
        dbDumpPath,
        assetsPath,
        triggeredBy,
      },
    });

    // 5. 清理過期備份
    await cleanOldBackups();

    console.log(`✓ 備份完成: ${backupName}`);
    return backup;
  } catch (error) {
    // 記錄失敗
    await prisma.backup.create({
      data: {
        filename: backupName,
        size: 0,
        type: "FULL",
        status: "FAILED",
        triggeredBy,
      },
    });
    console.error(`✗ 備份失敗:`, error);
    throw error;
  }
}

/**
 * 清理過期備份 (超過保留天數)。
 * Cleans up backups older than the retention period.
 */
export async function cleanOldBackups() {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - RETENTION_DAYS);

  const oldBackups = await prisma.backup.findMany({
    where: { createdAt: { lt: cutoff } },
  });

  for (const backup of oldBackups) {
    // 刪除檔案
    const backupDir = path.join(BACKUP_DIR, backup.filename);
    await fs.rm(backupDir, { recursive: true, force: true }).catch(() => {});

    // 刪除資料庫記錄
    await prisma.backup.delete({ where: { id: backup.id } });
  }

  if (oldBackups.length > 0) {
    console.log(`✓ 清理 ${oldBackups.length} 個過期備份`);
  }
}

/**
 * 復原指定備份。
 * Restores a specific backup.
 * @param backupId - 備份記錄 ID / Backup record ID.
 */
export async function restoreBackup(backupId: string) {
  const backup = await prisma.backup.findUnique({
    where: { id: backupId },
  });

  if (!backup) throw new Error("備份不存在");
  if (backup.status !== "COMPLETED") throw new Error("備份狀態不可用");

  const db = parseDbUrl(DATABASE_URL);

  // 1. 復原資料庫
  if (backup.dbDumpPath) {
    const restoreCmd = `PGPASSWORD="${db.password}" psql -h ${db.host} -p ${db.port} -U ${db.user} -d ${db.database} -f "${backup.dbDumpPath}"`;
    await execAsync(restoreCmd);
    console.log("✓ 資料庫復原完成");
  }

  // 2. 復原 uploads
  if (backup.assetsPath) {
    await execAsync(`tar -xzf "${backup.assetsPath}" -C "${UPLOAD_DIR}"`);
    console.log("✓ uploads 復原完成");
  }

  console.log(`✓ 復原完成: ${backup.filename}`);
  return backup;
}

/**
 * 列出所有備份。
 * Lists all backups.
 */
export async function listBackups() {
  return prisma.backup.findMany({
    orderBy: { createdAt: "desc" },
  });
}

/**
 * 刪除指定備份。
 * Deletes a specific backup.
 * @param backupId - 備份記錄 ID / Backup record ID.
 */
export async function deleteBackup(backupId: string) {
  const backup = await prisma.backup.findUnique({
    where: { id: backupId },
  });

  if (!backup) throw new Error("備份不存在");

  // 刪除檔案
  const backupDir = path.join(BACKUP_DIR, backup.filename);
  await fs.rm(backupDir, { recursive: true, force: true }).catch(() => {});

  // 刪除資料庫記錄
  await prisma.backup.delete({ where: { id: backupId } });

  console.log(`✓ 備份已刪除: ${backup.filename}`);
}
