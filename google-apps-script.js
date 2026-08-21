/**
 * =========================================================================
 * GOOGLE APPS SCRIPT - Backend Pencatat Respons Website Permintaan Maaf
 * =========================================================================
 * 
 * CARA MEMASANG (Hanya butuh 2-3 menit):
 * 1. Buka https://sheets.new di browser untuk membuat Google Sheets baru.
 * 2. Beri nama spreadsheet kamu, misalnya: "Respons Permintaan Maaf".
 * 3. Pada baris pertama (Header), buat 4 kolom:
 *    - Kolom A: Timestamp
 *    - Kolom B: Pilihan (Ya / Tidak)
 *    - Kolom C: Catatan / Detail Klik
 *    - Kolom D: Device / User Agent
 * 4. Klik menu "Extensions" (Ekstensi) > pilih "Apps Script".
 * 5. Hapus semua kode yang ada di editor Apps Script, lalu TEMPELKAN seluruh kode di bawah ini.
 * 6. Klik tombol "Save" (ikon disket).
 * 7. Klik tombol biru "Deploy" di kanan atas > pilih "New deployment".
 * 8. Pada ikon gear (Select type), pilih "Web app".
 * 9. Atur pengaturannya:
 *    - Description: Web Tracker
 *    - Execute as: Me (email kamu)
 *    - Who has access: Anyone (PENTING: Pilih "Anyone" agar dapat menerima data dari GitHub Pages)
 * 10. Klik "Deploy". Jika diminta otorisasi izin akun Google, izinkan (Review permissions > Advanced > Go to Untitled project).
 * 11. Salin "Web App URL" (berakhiran /exec) yang muncul.
 * 12. Tempelkan URL tersebut ke file `js/tracker.js` di variabel `GOOGLE_SCRIPT_URL`.
 * =========================================================================
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000); // Mencegah bentrok data jika ada request bersamaan

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Parse data yang dikirim dari fetch()
    var data = {};
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    }

    var timestamp = data.timestamp || new Date().toISOString();
    var choice = data.choice || "Unknown";
    var details = data.details || "";
    var userAgent = data.userAgent || "";

    // Tambahkan baris baru ke Google Sheet
    sheet.appendRow([timestamp, choice, details, userAgent]);

    // Kembalikan respons sukses
    return ContentService
      .createTextOutput(JSON.stringify({ status: "success", message: "Data berhasil dicatat" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}

// Handler cadangan jika diakses via GET di browser
function doGet(e) {
  return ContentService
    .createTextOutput("Backend Google Apps Script aktif dan siap menerima data POST.")
    .setMimeType(ContentService.MimeType.TEXT);
}
