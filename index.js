document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("user").innerHTML = 'Welcome, '+localStorage.token
});
jsonData = []

function getcontent(page,role){
debugger
if(page=='profile_manager'){
window.location.href = './ti-apps-profile-manager/index.html';
}
else if (page=='mcq_quiz'){
    window.location.href = './ti-apps-mcq-quiz/index.html';
}
else if(page =='gen-ai'){
    window.location.href = './ti-apps-gen-ai/index.html';
}
else if(page =='interview_qna'){
    window.location.href = './ti-app-interview-qna/index.html';
    content()
}
}