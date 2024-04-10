
let currentPage = 1;

function fetchData(page) {
    fetch(`/ti-app-interview-qna/data?page=${page}&minSectionsPerPage=3`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('content').innerHTML = data.data.join('');
            currentPage = data.currentPage;

            // Create pagination bar with limited buttons and "..."
            let paginationBar = '';
            const maxButtons = 5;
            let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
            let endPage = Math.min(data.totalPages, startPage + maxButtons - 1);

            if (startPage > 1) {
                paginationBar += `<button class="btn" onclick="fetchData(1)">1</button>`;
                if (startPage > 2) {
                    paginationBar += `<span>...</span>`;
                }
            }

            for (let i = startPage; i <= endPage; i++) {
                paginationBar += `<button id="btn${i}"  class="btn" onclick="fetchData(${i})">${i}</button>`;
            }

            if (endPage < data.totalPages) {
                if (endPage < data.totalPages - 1) {
                    paginationBar += `<span>...</span>`;
                }
                paginationBar += `<button   class="btn" onclick="fetchData(${data.totalPages})">${data.totalPages}</button>`;
            }
            
            document.getElementById('pagination-bar').innerHTML = paginationBar;

            document.getElementById('btn'+page).classList.add('btn-primary');

        })
        .catch(error => console.error('Error fetching data:', error));
}


$('#prev').click(()=> {
    if (currentPage > 1) {
        fetchData(currentPage - 1);
    }
});

$('#next').click(()=> {
    fetchData(currentPage + 1);
});

// Initial fetch

fetchData(currentPage);

/// this portion belongs to the index page where you will define the various tech.....




// Create the table with your contents array

    

