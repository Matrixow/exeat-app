function check_session(){
    if(!localStorage.getItem("access")){
        window.location.href = "https://www.google.com";
    }
}

document.querySelector("#hidden").value = localStorage.getItem("user_name");

console.log(document.querySelector("#hidden"));

let account_name = localStorage.getItem("user_name");
let account_name_element = document.querySelector("#account_name");
if(account_name_element) {
    account_name_element.textContent = account_name;
}

if(localStorage.getItem("account_type")=='Security'){
    document.body.innerHTML = "";
    alert("Not permitted to give exeat");
    window.location.href = 'https://www.google.com';
}

window.onload = check_session;

let name = document.querySelector("#student_name");
let school_number = document.querySelector("#sch_number");
let housename = document.querySelector("#student_house");
let phone = document.querySelector("#contact");
let reason = document.querySelector("#exreason");
let returndate = document.querySelector("#return_date");
let submitter = document.querySelector("#upload");
let loading_img= document.querySelector("#loading_img")
let message_box = document.querySelector(".message-box")
let message_content = document.querySelector("#message-content")



function give_exeat(event){
    event.preventDefault();
    let img = document.createElement("img")
    img.setAttribute("src", "../images/laoding.gif")
    footer.appendChild(img)
    fetch("http://localhost:5000/owass-robotech/us-central1/app/give",{
        method:'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            student_name: name.value,
            school_number: school_number.value,
            house_name: housename.value,
            parent_contact: phone.value,
            reason: reason.value,
            has_returned: 'No',
            given_by: account_name,
            return_date: returndate.value
        })
    }).then(res => {
        if(res.ok){
            return res.json();
        } else {
            return res.json().then(err => { throw new Error(err.message); });
        }
    }).then(data => {
        message_box.style.display = "block"
        message_content.innerHTML = data.message;
        setTimeout(()=>{
            message_box.style.display = "none"
    }, 4000)
    }).catch(error => {
        
        message_box.style.display = "block"
        message_content.innerHTML = data.message;
        setTimeout(()=>{
            message_box.style.display = "none"
    }, 4000)
    });
}

submitter.addEventListener("click", give_exeat);


