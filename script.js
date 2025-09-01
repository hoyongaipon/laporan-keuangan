const table = document.getElementById("laporan").getElementsByTagName("tbody")[0];

function addRow(copyTanggal = "") {
  const rowCount = table.rows.length + 1;
  const row = table.insertRow();
  row.innerHTML = `
    <td>${rowCount}</td>
    <td><input type="date" value="${copyTanggal}"></td>
    <td contenteditable="true"></td>
    <td contenteditable="true"></td>
    <td contenteditable="true"></td>
    <td contenteditable="true"></td>
    <td contenteditable="true"></td>
  `;
}

function handleEnter(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    const row = event.target.closest("tr");
    const tanggalInput = row.cells[1].querySelector("input");
    const copyTanggal = tanggalInput ? tanggalInput.value : "";
    addRow(copyTanggal);
    updateTotals();
  }
}

function updateTotals() {
  let totalMasuk = 0, totalKeluar = 0;
  Array.from(table.rows).forEach(row => {
    let masuk = parseInt(row.cells[4].innerText.replace(/\D/g,'')) || 0;
    let keluar = parseInt(row.cells[5].innerText.replace(/\D/g,'')) || 0;
    totalMasuk += masuk;
    totalKeluar += keluar;
  });
  document.getElementById("totalMasuk").innerText = "Rp" + totalMasuk.toLocaleString();
  document.getElementById("totalKeluar").innerText = "Rp" + totalKeluar.toLocaleString();
}

table.addEventListener("input", updateTotals);

function saveData() {
  let data = [];
  Array.from(table.rows).forEach(row => {
    let rowData = [];
    for (let i = 0; i < row.cells.length; i++) {
      let input = row.cells[i].querySelector("input");
      rowData.push(input ? input.value : row.cells[i].innerText);
    }
    data.push(rowData);
  });
  localStorage.setItem("laporanKeuangan", JSON.stringify(data));
  alert("Data berhasil disimpan!");
}

function loadData() {
  let data = JSON.parse(localStorage.getItem("laporanKeuangan"));
  if (data) {
    table.innerHTML = "";
    data.forEach((rowData, index) => {
      const row = table.insertRow();
      rowData.forEach((cell, i) => {
        let newCell = row.insertCell();
        if (i === 1) {
          newCell.innerHTML = `<input type="date" value="${cell}">`;
        } else {
          if (i === 0) newCell.innerText = index + 1;
          else newCell.contentEditable = "true", newCell.innerText = cell;
        }
      });
    });
  }
  updateTotals();
}

function downloadExcel() {
  let csv = [];
  let rows = document.querySelectorAll("table tr");
  for (let row of rows) {
    let cols = row.querySelectorAll("td, th");
    let rowData = [];
    for (let col of cols) {
      let input = col.querySelector("input");
      rowData.push(input ? input.value : col.innerText);
    }
    csv.push(rowData.join(","));
  }
  let csvFile = new Blob([csv.join("\n")], { type: "text/csv" });
  let downloadLink = document.createElement("a");
  downloadLink.download = "Laporan_Keuangan.csv";
  downloadLink.href = window.URL.createObjectURL(csvFile);
  downloadLink.click();
}

loadData();
