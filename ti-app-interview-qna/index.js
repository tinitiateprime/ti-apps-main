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

    fetch(`/ti-app-interview-qna/data?page=${page}&minSectionsPerPage=5&file=${filename}`)
        .then(response => response.json())
        .then(data => {
            //debugger
            $('.drop').removeClass('active')
            $('#'+data.filename.split('/')[1].split('.')[0]).addClass('drop dropdown-item active')
            window["currenttopic"]=data.filename
            $('#ques_badge').html(data.totalHashes);
            $('#topic_name').html(data.filename.split('/')[0]+'-'+data.filename.split('/')[1].split('.')[0])
            $('#topic_name2').html(data.filename.split('/')[0]+'- Topics')
            document.getElementById('content').innerHTML = data.data;
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
            $('#Content_0').remove()
            $('h1').css('display','inline','margin-right','2%')

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


function attachCheckboxes(checkbox) {
    //debugger
            var iid = checkbox.parentElement.id
            var hhtml = $('#'+iid).html().substr(57);
            if (checkbox.checked) {
                //debugger
               
                selectedQuestions.push(hhtml);                
            } else {
                selectedQuestions = selectedQuestions.filter(q => q !== hhtml);
            }
            
}

$('#showSelected').click(()=>{
    let html = ''
    html+=`<ul class="list-group selques">`
    selectedQuestions.forEach((ele,index)=>{
        html+=`<li class="list-group-item gem">${ele}</li>`
    })
    html+=`</ul>`
    $('#selectedQuestionsBody').append(html)
                
    $('#selectedQuestionsModal').modal('show')
})



function savepdf(){
    debugger
    var ele = []
    let data = ''
    $('.gem').each(function() {
        debugger
               
        data += $(this).html()

        

    });
    ele.push({
        items:data
        })
        

    $.ajax({
        url: '/ti-app-interview-qna/generate-pdf',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(ele),
        success: function(response) {
            console.log('Data saved:', response);
            downloadFile(response)
        },
        error: function(xhr, status, error) {
            console.error('Error:', error);
        }
    });
   

}

function downloadFile() {
    debugger
        const fileName = 'example.txt';
        const fileContent = 'Hello, world!';
    // Create a Blob with the file content
    const blob = new Blob([fileContent], { type: 'text/plain' });
    
    // Create a URL representing the Blob object
    const url = URL.createObjectURL(blob);
    
    // Create a temporary anchor element
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    
    // Trigger a click event on the anchor element to initiate download
    a.click();
    
    // Clean up by revoking the URL object
    URL.revokeObjectURL(url);
}