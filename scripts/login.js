let username = document.querySelector("#username");
let password = document.querySelector("#password");
let loading_gif = document.querySelector("#loading");
let button = document.querySelector("#login");
let forgot = document.querySelector("#fgpass")
let loadingDiv = document.getElementById('loading');
window.onload = localStorage.clear()
window.onload = loadingDiv.style.display = 'none'

forgot.addEventListener("click", event=>{alert("See an admin to change your password")})

function login(event) {
    event.preventDefault();
    loadingDiv.setAttribute("src", "../images/image.png")
    loadingDiv.classList.add("spin")
    loadingDiv.style.display = loadingDiv.style.display === 'none' ? 'block' : 'none';
    if (!username.value || !password.value) {
        alert("All fields are required!");
        return;
    }

    fetch("https://exapp-ten.vercel.app/login", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
            username: username.value,
            user_password: password.value
        })
    })
    .then(res => {
        loading_gif.style.display = 'none'; // Hide loading GIF
        if (res.ok) {
            return res.json();
        } else {
            
            return res.json().then(error => { throw new Error(error.message) });
        }
    })
    .then(async data => {
        if (data.acc_type) {
          console.log(data.acc_type)
          localStorage.setItem("access", true)
          localStorage.setItem("account_type", data.acc_type);
          localStorage.setItem("user_name", data.user_name);
          localStorage.setItem("token", data.token)
          console.log(data.token)
          window.location.href = data.redirect_page
        }
    })
    .catch(error => {
        loading_gif.classList.remove("spin")
        loading_gif.setAttribute("src", "../images/error.png")
        alert('An error occurred:' + error);
        console.log(error)
    });
}

button.addEventListener("click", login);

// try{
//     button.addEventListener("click", login);
// }catch(err){
//     alert("An error occured "+err)
// }
