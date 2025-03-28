let account_type = document.querySelector("#account_type");
let username = document.querySelector("#username");
let password = document.querySelector("#user_password");
let button = document.querySelector("#login");
let message_box = document.querySelector(".message-box")
let message_content = document.querySelector("#message-content")


window.onload = ()=>{
    if(!localStorage.getItem("access") || localStorage.getItem("account_type")=="Security"){
        alert("Not allowed to perform this action")
        window.location.href = "/pages/exeats.html"
    }
}

document.querySelector("#left_side_on_nav").textContent = localStorage.getItem("user_name")
function create_new_user(event) {
    event.preventDefault();


    if (account_type.value === "Select account type" || !username.value || !password.value) {
        alert("All fields are required.");
        return;
    }


    let token = localStorage.getItem("token")
    fetch("https://exapp-ten.vercel.app/signup", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `BEARER ${token}`
        },
        body: JSON.stringify({
            account_type: account_type.value,
            username: username.value,
            user_password: password.value
        })
    })
    .then(response => {

        if (!response.ok) {
            window.location.href = "/pages/login.html"
            
        }
        return response.json(); 
    })
    .then(data => {
        
        message_box.style.display = "block"
        message_content.innerHTML = data.message
        setTimeout(()=>{
            message_box.style.display = "none"
        }, 4000)

        window.location.reload()
    })
    .catch(error => {
        console.error("Error:", error);
        alert("An error occurred: " + error.message);
    });
}

button.addEventListener("click", create_new_user);
