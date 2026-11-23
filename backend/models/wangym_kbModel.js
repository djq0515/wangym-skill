// 姓名：王一鸣 | 学号：24002060518 | 时间：2026-11-23 | 大模型：DeepSeek-V4.1-Flash
// 知识库数据模型
const wangymPool = require('../config/wangym_db');

async function wangymListKb() {
  const [wangymRows] = await wangymPool.query(
    `SELECT k.wangym_id, k.wangym_name, k.wangym_description, k.wangym_created_at,
            (SELECT COUNT(*) FROM wangym_kb_file f WHERE f.wangym_kb_id = k.wangym_id) AS wangym_file_count,
            (SELECT COUNT(*) FROM wangym_kb_chunk c WHERE c.wangym_kb_id = k.wangym_id) AS wangym_chunk_count
       FROM wangym_kb k
      ORDER BY k.wangym_id`
  );
  return wangymRows;
}

async function wangymGetKb(wangymId) {
  const [wangymRows] = await wangymPool.query('SELECT * FROM wangym_kb WHERE wangym_id = ?', [wangymId]);
  return wangymRows[0] || null;
}

async function wangymCreateKb(wangymName, wangymDescription) {
  const [wangymResult] = await wangymPool.query(
    'INSERT INTO wangym_kb (wangym_name, wangym_description) VALUES (?, ?)',
    [wangymName, wangymDescription]
  );
  return wangymResult.insertId;
}

async function wangymDeleteKb(wangymId) {
  await wangymPool.query('DELETE FROM wangym_kb_chunk WHERE wangym_kb_id = ?', [wangymId]);
  await wangymPool.query('DELETE FROM wangym_kb_file WHERE wangym_kb_id = ?', [wangymId]);
  await wangymPool.query('DELETE FROM wangym_kb WHERE wangym_id = ?', [wangymId]);
}

async function wangymListFiles(wangymKbId) {
  const [wangymRows] = await wangymPool.query(
    'SELECT wangym_id, wangym_file_name, wangym_file_type, wangym_file_size, wangym_chunk_count, wangym_status, wangym_created_at FROM wangym_kb_file WHERE wangym_kb_id = ? ORDER BY wangym_id',
    [wangymKbId]
  );
  return wangymRows;
}

async function wangymInsertFile(wangymKbId, wangymFileName, wangymFileType, wangymFileSize, wangymChunkCount) {
  const [wangymResult] = await wangymPool.query(
    'INSERT INTO wangym_kb_file (wangym_kb_id, wangym_file_name, wangym_file_type, wangym_file_size, wangym_chunk_count, wangym_status) VALUES (?, ?, ?, ?, ?, ?)',
    [wangymKbId, wangymFileName, wangymFileType, wangymFileSize, wangymChunkCount, 'ready']
  );
  return wangymResult.insertId;
}

async function wangymInsertChunks(wangymKbId, wangymFileId, wangymChunks) {
  if (!wangymChunks.length) {
    return;
  }
  const wangymValues = wangymChunks.map((wangymContent, wangymIndex) => [
    wangymKbId,
    wangymFileId,
    wangymIndex,
    wangymContent
  ]);
  await wangymPool.query(
    'INSERT INTO wangym_kb_chunk (wangym_kb_id, wangym_file_id, wangym_chunk_index, wangym_content) VALUES ?',
    [wangymValues]
  );
}

async function wangymDeleteFile(wangymFileId) {
  await wangymPool.query('DELETE FROM wangym_kb_chunk WHERE wangym_file_id = ?', [wangymFileId]);
  await wangymPool.query('DELETE FROM wangym_kb_file WHERE wangym_id = ?', [wangymFileId]);
}

async function wangymGetChunks(wangymKbId) {
  const [wangymRows] = await wangymPool.query(
    `SELECT c.wangym_id, c.wangym_file_id, c.wangym_chunk_index, c.wangym_content, f.wangym_file_name
       FROM wangym_kb_chunk c
       JOIN wangym_kb_file f ON f.wangym_id = c.wangym_file_id
      WHERE c.wangym_kb_id = ?
      ORDER BY c.wangym_id`,
    [wangymKbId]
  );
  return wangymRows;
}

module.exports = {
  wangymListKb,
  wangymGetKb,
  wangymCreateKb,
  wangymDeleteKb,
  wangymListFiles,
  wangymInsertFile,
  wangymInsertChunks,
  wangymDeleteFile,
  wangymGetChunks
};
