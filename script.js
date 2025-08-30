// 🔧 konfigurasi Firebase (ganti dengan punyamu)
const firebaseConfig = {
  apiKey: "AIzaSyBBhDsj86fCeWdySGPsgGa79FKEZqu2iak",
  authDomain: "laporan-keuangan-roti-bakar.firebaseapp.com",
  databaseURL: "https://PROJECT_ID.firebaseio.com",
  projectId: "laporan-keuangan-roti-bakar",
  storageBucket: "laporan-keuangan-roti-bakar.firebasestorage.app",
  messagingSenderId: "78916381045",
  appId: "1:78916381045:web:ea1a2406ba2864b61dcb3c"
};

const app = firebase.initializeApp(firebaseConfig);
const db = firebase.database();

function tambahBaris(data = {}) {
  let table = document.querySelector("#laporanTable tbody");
  let rowCount = table.rows.length + 1;
  let row = table.insertRow();

  row.innerHTML = `
    <td>${rowCount}</td>
    <td><input type="date" value="${data.tanggal || ""}"></td>
    <td><input type="text" value="${data.menu || ""}"></td>
    <td><input type="text" value="${data.rasa || ""}"></td>
    <td><input type="number" class="pcs" value="${data.pcs || 0}"></td>
    <td><input type="number" class="harga" value="${data.harga || 0}"></td>
    <td class="hargaTotal">0</td>
    <td class="saldo">0</td>
    <td><input type="text" value="${data.barangMasuk || ""}"></td>
    <td><input type="number" class="pengeluaran" value="${data.pengeluaran || 0}"></td>
    <td><input type="text" value="${data.namaPengeluaran || ""}"></td>
  `;
  tambahEventListeners();
  hitung();
}

function hitung() {
  let rows = document.querySelectorAll("#laporanTable tbody tr");
  let totalHarga = 0, totalSaldo = 0, totalPengeluaran = 0;

  rows.forEach(row => {
    let pcs = parseInt(row.querySelector(".pcs").value) || 0;
    let harga = parseInt(row.querySelector(".harga").value) || 0;
    let pengeluaran = parseInt(row.querySelector(".pengeluaran").value) || 0;

    let hargaTotal = pcs * harga;
    row.querySelector(".hargaTotal").textContent = hargaTotal;

    let saldo = hargaTotal;
    row.querySelector(".saldo").textContent = saldo;

    totalHarga += hargaTotal;
    totalSaldo += saldo;
    totalPengeluaran += pengeluaran;
  });

  document.getElementById("totalHarga").textContent = totalHarga;
  document.getElementById("totalSaldo").textContent = totalSaldo;
  document.getElementById("totalPengeluaran").textContent = totalPengeluaran;
  document.getElementById("saldoAkhir").textContent = totalSaldo - totalPengeluaran;
}

function tambahEventListeners() {
  document.querySelectorAll(".pcs, .harga, .pengeluaran").forEach(input => {
    input.removeEventListener("input", hitung);
    input.addEventListener("input", hitung);
  });
}

function simpanData() {
  let rows = document.querySelectorAll("#laporanTable tbody tr");
  let data = [];
  rows.forEach(row => {
    data.push({
      tanggal: row.cells[1].querySelector("input").value,
      menu: row.cells[2].querySelector("input").value,
      rasa: row.cells[3].querySelector("input").value,
      pcs: row.cells[4].querySelector("input").value,
      harga: row.cells[5].querySelector("input").value,
      barangMasuk: row.cells[8].querySelector("input").value,
      pengeluaran: row.cells[9].querySelector("input").value,
      namaPengeluaran: row.cells[10].querySelector("input").value,
    });
  });

  db.ref("laporan").set(data);
  alert("✅ Data berhasil disimpan!");
}

// saat pertama kali buka, ambil data dari Firebase
db.ref("laporan").on("value", snapshot => {
  let tbody = document.getElementById("tbody");
  tbody.innerHTML = "";
  let data = snapshot.val() || [];
  data.forEach(item => tambahBaris(item));
});
