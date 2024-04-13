function listobj(cellValue){
   window["cellValue"] =cellValue
    fetch(`/ti-app-interview/listobj?page=${cellValue}`)
    .then(response => response.json())
            .then(data => {
                //debugger
                data = JSON.parse(data.listobj)
                let html = ''
                data.forEach((element,index) => {
                    if(index==0){
                        window["list1"] =''+ element.split('/')[3]+''
                    }
                    html+=` <li><a class="dropdown-item" onclick="fetchData(${currentPage},'${window["cellValue"]}/${element.split('/')[3]}')">${element.split('.')[0].split('/')[3]}</a></li>`
                });
                $('#list_topics').append(html)
                fetchData(currentPage,window["cellValue"]+'/'+window["list1"])
            });
    
        }
        
let currentPage = 1;

function fetchData(page,filename) {
    debugger
    $('#content').html('')
        $('#content').append('<div class="d-flex justify-content-center"> <div class="spinner-border text-muted"></div></div>')
    return new Promise((resolve, reject) => {

    fetch(`/ti-app-interview-qna/data?page=${page}&minSectionsPerPage=3&file=${filename}`)
        .then(response => response.json())
        .then(data => {
            debugger
            
            document.getElementById('content').innerHTML = data.data.join('');
            currentPage = data.currentPage;
            numberofmd= data.noofmd
            // Create pagination bar with limited buttons and "..."
            let paginationBar = '';
            const maxButtons = 5;
            let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
            let endPage = Math.min(data.totalPages, startPage + maxButtons - 1);

            if (startPage > 1) {
                paginationBar += `<button class="btn" onclick="fetchData(1,'${filename}')">1</button>`;
                if (startPage > 2) {
                    paginationBar += `<span>...</span>`;
                }
            }

            for (let i = startPage; i <= endPage; i++) {
                paginationBar += `<button id="btn${i}"  class="btn" onclick="fetchData(${i},'${filename}')">${i}</button>`;
            }

            if (endPage < data.totalPages) {
                if (endPage < data.totalPages - 1) {
                    paginationBar += `<span>...</span>`;
                }
                paginationBar += `<button   class="btn" onclick="fetchData(${data.totalPages},'${filename}')">${data.totalPages}</button>`;
            }
            
            document.getElementById('pagination-bar').innerHTML = paginationBar;

            document.getElementById('btn'+page).classList.add('btn-primary');


        })
        .catch(error => console.error('Error fetching data:', error));
});
}

$('#prev').click(()=> {
    if (currentPage > 1) {
        fetchData(currentPage - 1,window["cellValue"]+'/data1.md');
       
    }
});

$('#next').click(()=> {
    
    fetchData(currentPage + 1,window["cellValue"]+'/data1.md');
});


           listobj(localStorage.getqna)
