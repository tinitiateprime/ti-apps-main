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
                        var sel = 'active'
                    }
                   
                    html+=` <li><a class="drop dropdown-item ${sel}" id="${element.split('.')[0].split('/')[3]}"  onclick="fetchData(${currentPage},'${window["cellValue"]}/${element.split('/')[3]}')">${element.split('.')[0].split('/')[3]}</a></li>`
                });
                $('#list_topics').append(html)
                fetchData(currentPage,window["cellValue"]+'/'+window["list1"])
            });
    
        }
        
let currentPage = 1;
let selectedQuestions = [];
function fetchData(page,filename) {
    //debugger
    $('#content').html('')
        $('#content').append('<div class="d-flex justify-content-center"> <div class="spinner-border text-muted"></div></div>')
    return new Promise((resolve, reject) => {

    fetch(`/ti-app-interview-qna/data?page=${page}&minSectionsPerPage=3&file=${filename}`)
        .then(response => response.json())
        .then(data => {
            //debugger
            $('.drop').removeClass('active')
            $('#'+data.filename.split('/')[1].split('.')[0]).addClass('drop dropdown-item active')
            window["currenttopic"]=data.filename
            $('#ques_badge').html(data.totalHashes);
            $('#topic_name').html(data.filename.split('/')[0]+'-'+data.filename.split('/')[1].split('.')[0])
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
            attachCheckboxes();

        })
        .catch(error => console.error('Error fetching data:', error));
});
}

$('.prev').click(()=> {
    if (currentPage > 1) {
        fetchData(currentPage - 1,window["currenttopic"]);
       
    }
});

$('.next').click(()=> {
    
    fetchData(currentPage + 1,window["currenttopic"]);
});


listobj(localStorage.getqna)


function attachCheckboxes() {
    //debugger
    document.querySelectorAll('#content h1').forEach((question, index) => {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `question-${index}`;
        checkbox.className = 'question-checkbox';
        checkbox.style = 'margin-right:7px';
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                selectedQuestions.push(question.innerText);                
            } else {
                selectedQuestions = selectedQuestions.filter(q => q !== question.innerText);
            }
        });
        question.insertBefore(checkbox, question.firstChild);
    });
}

$('#showSelected').click(()=>{
    $('#selectedQuestionsBody').append(selectedQuestions+'<br>')
                
    $('#selectedQuestionsModal').modal('show')
})