let account_type = document.querySelector("#account_type");
let username = document.querySelector("#username");
let password = document.querySelector("#user_password");
let button = document.querySelector("#login");

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

    console.log([username.value, account_type.value, password.value]);

    fetch("http://localhost:5000/owass-robotech/us-central1/app/signup", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            account_type: account_type.value,
            username: username.value,
            user_password: password.value
        })
    })
    .then(response => {

        if (!response.ok) {
            return response.json().then(errorData => {
                throw new Error(errorData.message || "An unknown error occurred");
            });
        }
        return response.json(); 
    })
    .then(data => {
        alert(data.message || "User created successfully!");
        console.log("Response Data:", data);
    })
    .catch(error => {
        console.error("Error:", error);
        alert("An error occurred: " + error.message);
    });
}

button.addEventListener("click", create_new_user);
