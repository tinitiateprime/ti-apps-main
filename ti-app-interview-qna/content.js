fetch('/ti-app-interview-qna/content')
.then(response => response.json())
        .then(data => {
            createTable(data.contents)
        });
    
async function createTable(data) {
    const table = document.createElement('table');
    table.classList='responsive'
    const headerRow = table.insertRow();
    headerRow.insertCell().textContent = 'Content';

    let row, cell, count = 1;
    for (let i = 0; i < data.length; i += 3) {
        row = table.insertRow();
        cell = row.insertCell();
        

        // Add up to 3 elements per row
        for (let j = i; j < i + 3 && j < data.length; j++) {
            cell = row.insertCell();
            cell.textContent = data[j];
            cell.onclick = function() {
                cellClicked(this.innerHTML);
            };
            cell.style.cursor = "pointer";
        }
    }

    // Append the table to the container
    document.getElementById('table-container').appendChild(table);
}

function cellClicked(cellValue) {

const sidebarOrder = parseMarkdownToJSON(cellValue);
    
}
