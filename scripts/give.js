let year = document.querySelector("#year")
const thisYear = new Date().getFullYear()
year.textContent = `© ${thisYear} OWASSROBOTECH.`
let message_box = document.querySelector(".message-box")
let message_content = document.querySelector("#message-content")



function check_session(){
    if(!localStorage.getItem("access")){
        window.location.href = "../pages/login.html"
    }
}

document.querySelector("#left_side_on_nav").textContent = localStorage.getItem("user_name")



let account_name = document.querySelector("#left_side_on_nav").textContent
account_name.textContent = localStorage.getItem("user_name")
if(localStorage.getItem("account_type")=='Security'){
    document.body.innerHTML = ""
    alert("Not permitted to give exeat")
    window.location.href = '/pages/exeats.html'
}

window.onload = check_session()



let studname = document.querySelector("#student_name")
let school_number = document.querySelector("#sch_number")
let housename = document.querySelector("#student_house")
let phone = document.querySelector("#contact")
let reason = document.querySelector("#exreason")
let returndate = document.querySelector("#return_date") 
let submitter = document.querySelector("#upload")
let loading_img = document.querySelector("#loading_img")
let logout_button = document.querySelector("#logout")

function give_exeat(event){
    event.preventDefault()

    if(!studname.value ||!school_number.value || !housename.value || !phone.value ||!reason.value ||!returndate.value){
        alert("All fields are required")
        return
    }
    loading_img.setAttribute("src", "../images/laoding.gif")
    try{
    let token = localStorage.getItem("token")
    fetch("https://exapp-ten.vercel.app/give",{
        method:'POST',
        headers: {
            Authorization: `BEARER ${token}`,
            'Content-Type': 'application/json'
        },

        body:JSON.stringify({
            studentname:studname.value,
            schoolnumber: school_number.value,
            housename: housename.value,
            parentscontact: phone.value,
            reason:reason.value,
            has_returned:'No',
            given_by: account_name,
            returndate:returndate.value
        })
    }).then(res=>{

        if(res.status === 401){
             window.location.href = "/pages/login.html"
             loading_img.setAttribute("src", "../images/error.png")
        }

        else{
            return res.json()
        }


    }).then(data=>{
        loading_img.setAttribute("src", "../images/done.svg")
        message_box.style.display = "block"
        message_content.innerHTML = data.message;
        setTimeout(()=>{
        message_box.style.display = "none"
            }, 4000)
        console.log('done');
        
    })
}catch(error){
    loading_img.setAttribute("src", "../images/error.png")
    alert("An error occured "+ error)
    }

}
submitter.addEventListener("click", give_exeat)
logout_button.addEventListener("click", ()=>{

    
    localStorage.clear()
    location.reload()
})