const table = document.getElementById("laporanTable").getElementsByTagName("tbody")[0];

// Hitung otomatis pemasukan & total
function hitungSaldo() {
  for (let i = 0; i < table.rows.length; i++) {
    let row = table.rows[i];
    let harga = parseFloat(row.cells[3].children[0].value) || 0;
    let pcs = parseFloat(row.cells[4].children[0].value) || 0;
    let pemasukan = harga * pcs;
    row.cells[5].children[0].value = pemasukan;

    let pengeluaran = parseFloat(row.cells[6].children[0].value) || 0;
    let total = pemasukan - pengeluaran;
    row.cells[7].children[0].value = total;
  }
}

// Tambah baris baru
function tambahBaris(copyTanggal = false, tanggalSebelumnya = "") {
  let rowCount = table.rows.length;
  let row = table.insertRow();
  row.innerHTML = `
    <td>${rowCount+1}</td>
    <td><input type="date" value="${copyTanggal ? tanggalSebelumnya : ""}"></td>
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

    // Enter di pemasukan → baris baru
    row.cells[5].children[0].addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        let tgl = row.cells[1].children[0].value;
        tambahBaris(true, tgl);
      }
    });
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
  alert("✅ Data berhasil disimpan!");
}

// Download ke Excel
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

  let csvContent = "data:text/csv;charset=utf-8," 
    + data.map(e => e.join(",")).join("\n");

  let link = document.createElement("a");
  link.setAttribute("href", encodeURI(csvContent));
  link.setAttribute("download", "laporan_keuangan.csv");
  document.body.appendChild(link);
  link.click();
}

window.onload = () => {
  tambahListener();
  hitungSaldo();
};
