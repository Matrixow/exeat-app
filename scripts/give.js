function check_session(){
    if(!localStorage.getItem("access")){
        window.location.href = "../pages/login.html"
    }
}

document.querySelector("#hidden").value = localStorage.getItem("user_name")

console.log(document.querySelector("#hidden"));

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
    fetch("https://exapp-ten.vercel.app/give",{
        method:'POST',
        headers: {
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
        if(res.ok){
            return res.json()
        }
        loading_img.setAttribute("src", "../images/error.png")

    }).then(data=>{
        loading_img.setAttribute("src", "../images/done.jpeg")
        console.log('done');
        
    })
}catch(error){
    loading_img.setAttribute("src", "../images/error.png")
    alert("An error occured "+ error)
    }

}
submitter.addEventListener("click", give_exeat)
logout_button.addEventListener("click", ()=>{
    console.log('clicked');
    
    localStorage.clear()
    location.reload()
})