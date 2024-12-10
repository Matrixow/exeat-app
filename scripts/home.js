let existing = document.querySelector("#existing")
let give = document.querySelector("#give")
let add = document.querySelector("#signup")
let logout = document.querySelector(".logout")

window.onload = () => {
    if (!localStorage.getItem("access")) {
        window.location.href = "../pages/login.html";
    }
}

existing.addEventListener("click", function(){
    window.location.href = '../pages/exeats.html'
})

give.addEventListener("click", ()=>{
    window.location.href = '../new/index.html'
})

add.addEventListener("click", ()=>{
    window.location.href = '../pages/signup.html'
})

logout.addEventListener("click", event=>{
    localStorage.removeItem("access")
    location.reload()
})