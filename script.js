const table = document.getElementById("laporanTable").getElementsByTagName("tbody")[0];
const totalKeseluruhanEl = document.getElementById("totalKeseluruhan");

// Hitung otomatis pemasukan & total
function hitungSaldo() {
  let totalKeseluruhan = 0;
  for (let i = 0; i < table.rows.length; i++) {
    let row = table.rows[i];
    let harga = parseFloat(row.cells[3].children[0].value) || 0;
    let pcs = parseFloat(row.cells[4].children[0].value) || 0;
    let pemasukan = harga * pcs;
    row.cells[5].children[0].value = pemasukan;

    let pengeluaran = parseFloat(row.cells[6].children[0].value) || 0;
    let total = pemasukan - pengeluaran;
    row.cells[7].children[0].value = total;

    totalKeseluruhan += total;
  }
  totalKeseluruhanEl.value = totalKeseluruhan;
  simpanData(); // auto save tiap kali hitung
}

// Tambah baris baru (salin tanggal dari baris sebelumnya)
function tambahBaris() {
  let rowCount = table.rows.length;
  let tanggalSebelumnya = rowCount > 0 ? table.rows[rowCount-1].cells[1].children[0].value : "";

  let row = table.insertRow();
  row.innerHTML = `
    <td>${rowCount+1}</td>
    <td><input type="date" value="${tanggalSebelumnya}"></td>
    <td><input type="text"></td>
    <td><input type="number" value="0"></td>
    <td><input type="number" value="0"></td>
    <td><input type="number" value="0" readonly></td>
    <td><input type="number" value="0"></td>
    <td><input type="number" value="0" readonly></td>
    <td><input type="text"></td>
  `;
  tambahListener();
  hitungSaldo();
}

// Listener otomatis
function tambahListener() {
  for (let i = 0; i < table.rows.length; i++) {
    let row = table.rows[i];
    row.cells[3].children[0].addEventListener("input", hitungSaldo);
    row.cells[4].children[0].addEventListener("input", hitungSaldo);
    row.cells[6].children[0].addEventListener("input", hitungSaldo);
  }
}

// Save ke localStorage
function simpanData() {
  let data = [];
  for (let i = 0; i < table.rows.length; i++) {
    let row = table.rows[i];
    data.push({
      no: row.cells[0].innerText,
      tanggal: row.cells[1].children[0].value,
      menu: row.cells[2].children[0].value,
      harga: row.cells[3].children[0].value,
      pcs: row.cells[4].children[0].value,
      pemasukan: row.cells[5].children[0].value,
      pengeluaran: row.cells[6].children[0].value,
      total: row.cells[7].children[0].value,
      ket: row.cells[8].children[0].value
    });
  }
  localStorage.setItem("laporanData", JSON.stringify(data));
}

// Load data dari localStorage
function loadData() {
  let data = JSON.parse(localStorage.getItem("laporanData")) || [];
  if (data.length > 0) {
    for (let i = 0; i < data.length; i++) {
      let row = table.insertRow();
      row.innerHTML = `
        <td>${i+1}</td>
        <td><input type="date" value="${data[i].tanggal}"></td>
        <td><input type="text" value="${data[i].menu}"></td>
        <td><input type="number" value="${data[i].harga}"></td>
        <td><input type="number" value="${data[i].pcs}"></td>
        <td><input type="number" value="${data[i].pemasukan}" readonly></td>
        <td><input type="number" value="${data[i].pengeluaran}"></td>
        <td><input type="number" value="${data[i].total}" readonly></td>
        <td><input type="text" value="${data[i].ket}"></td>
      `;
    }
  } else {
    tambahBaris();
  }
  tambahListener();
  hitungSaldo();
}

// Download ke Excel (CSV)
function downloadExcel() {
  let data = [["No","Tanggal","Nama Menu","Harga","PCS","Pemasukan","Pengeluaran","Total","Keterangan"]];
  for (let i = 0; i < table.rows.length; i++) {
    let row = table.rows[i];
    data.push([
      row.cells[0].innerText,
      row.cells[1].children[0].value,
      row.cells[2].children[0].value,
      row.cells[3].children[0].value,
      row.cells[4].children[0].value,
      row.cells[5].children[0].value,
      row.cells[6].children[0].value,
      row.cells[7].children[0].value,
      row.cells[8].children[0].value
    ]);
  }
  data.push(["","","","","","","TOTAL KESELURUHAN", totalKeseluruhanEl.value, ""]);

  let csvContent = "data:text/csv;charset=utf-8," 
    + data.map(e => e.join(",")).join("\n");

  let link = document.createElement("a");
  link.setAttribute("href", encodeURI(csvContent));
  link.setAttribute("download", "laporan_keuangan.csv");
  document.body.appendChild(link);
  link.click();
}

window.onload = loadData;
