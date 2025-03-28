window.onload = () => {
    if (!localStorage.getItem("access")) {
        window.location.href = "../pages/login.html";
    }
}



document.addEventListener('DOMContentLoaded', () => {
    let fetcher = document.querySelector("#get_exeats");
    let loading_gif = document.querySelector("#loading_gif");
    let exeat_tab = document.querySelector(".given_exeats");
    const dropdownToggle = document.getElementById('dropdown-toggle');
    const dropdownOptions = document.querySelector('.dropdown-options');
    const checkboxOptions = document.querySelectorAll('.dropdown-options input[type="checkbox"]');
    const account = document.querySelector("#left_side_on_nav")
    const searchInput = document.querySelector("#searchInput");
    const searchButton = document.querySelector("#searchButton");
    let total = document.querySelector("#total")

    account.textContent = localStorage.getItem("user_name")
    const filters = {
        active: document.querySelector('#active'),
        expired: document.querySelector('#expired'),
        past: document.querySelector('#past'),
        //schoolNumberPattern: document.querySelectorAll('input[name="schoolNumberPattern"]')
    };

    const yeargroup = {
        CA: document.querySelector("#CA"),
        CB: document.querySelector("#CB"),
        CD: document.querySelector("#CD")
    }

    let exeatData = [];


    let message_box = document.querySelector(".message-box")
    let message_content = document.querySelector("#message-content")


    

    function get_exeats() {
        let token = localStorage.getItem("token")
        loading_gif.setAttribute("src", "../images/loading2.gif");
        fetch("https://exapp-ten.vercel.app/exeats", {
            headers: {
                Authorization: `BEARER ${token}`
            }
        })
            .then(res => {

                if (!res.ok) {
                    
                    window.location.href = "/pages/login.html"
                }
                return res.json();
            })
            .then(data => {
                exeatData = data;
                exeatData = data; 
                loading_gif.setAttribute("src", "../images/done.svg");
                total.innerHTML = `Total exeats: ${exeatData.length}`
                applyFilters(); 
                applyFilters();

            })
            .catch(err => {
                console.log("An error occurred: " + err);
                loading_gif.setAttribute("src", "../images/error.png");
                message_box.style.display = "block"
                message_box.style.background = 'red'
                message_content.innerHTML = data.message
                setTimeout(()=>{
                    message_box.style.display = "none"
                }, 4000)
            });
    }


    function applyFilters() {
        const active = filters.active.checked;
        const expired = filters.expired.checked;
        const past = filters.past.checked;
        const selectedHouses = Array.from(checkboxOptions)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);

        // const selectedPatterns = Array.from(filters.schoolNumberPattern)
        //     .filter(checkbox => checkbox.checked)
        //     .map(checkbox => checkbox.value);

        const selectyeargroups = Object.values(yeargroup) 
        .filter(checkbox => checkbox.checked) 
        .map(checkbox => checkbox.value);     
        
        let filteredData = exeatData;

        // house filters
        if (selectedHouses.length > 0) {
            filteredData = filteredData.filter(exeat => {
                return selectedHouses.includes(exeat.housename)
            });
        }
        // year group whether CA CB CD etc
        if (selectyeargroups.length>0){
            filteredData = filteredData.filter(exeat=> {
                try{
                    let str = exeat.schoolnumber
                    let pattern = str.split(" ")
                    return selectyeargroups.includes(pattern[0])

                }catch(error){
                    return
                }
                
            })

        }


        //  status filters
        const today = new Date(new Date().toISOString().split('T')[0]);
        if (active) {
            filteredData = filteredData.filter(exeat => {
                let pastdatestr = exeat.exeat_expiry_date;
                let pastdate = new Date(pastdatestr);
                return pastdate >= today && exeat.has_returned==="No"
            });
        }
        if (expired) {
            filteredData = filteredData.filter(exeat => {
                let pastdatestr = exeat.exeat_expiry_date;
                let pastdate = new Date(pastdatestr);
                return today > pastdate && exeat.has_returned=="No"
            });
        }
        if (past) {
            filteredData = filteredData.filter(exeat => {
                let pastdatestr = exeat.exeat_expiry_date;
                let pastdate = new Date(pastdatestr);
                return (today > pastdate);

            });
        }

        renderExeats(filteredData);
    }

    function searchExeats() {

        if (exeatData.length === 0) {
            alert("Please get exeats first");
            return;
        }
    
        const query = searchInput.value.toLowerCase();

        const results = exeatData.filter(exeat=>exeat.studentname.toLowerCase().includes(query))
        if (results.length > 0) {
                renderExeats(results);
            } else {
                exeat_tab.innerHTML = '<li>No results found</li>';
            }

    }
    


    async function modify_exeat(event) {
        loading_gif.setAttribute("src", '/images/loading2.gif');
        let token = localStorage.getItem("token")
        const docId = event.target.getAttribute("data-id");

        fetch(`http://localhost:4040/modify`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization : `BEARER ${token}`
            },
            body: JSON.stringify({ detail: docId, hasreturned: true })
        })
        .then(res => {
            if(res.ok){
                return res.json()
            }
            else{
                res.json().then(error=>{throw new Error(error.message)})
            }
        }
            )
        .then(data => {
            loading_gif.setAttribute("src", '../images/done.svg');
            message_box.style.display = "block"
            message_content.innerHTML = data.message
            setTimeout(()=>{
                message_box.style.display = "none"
            }, 5000)
        })
        .catch(err => {
            console.error("An error occurred:", err);
            message_box.style.display = "block"
            message_box.style.background = "red"
            message_content.innerHTML = data.message
            setTimeout(()=>{
                message_box.style.display = "none"
            }, 5000)
            loading_gif.setAttribute("src", '../images/error.png');
        });
    }

    function renderExeats(data) {
        exeat_tab.innerHTML = '';
        data.forEach(exeat => {
            let list = document.createElement("ul");
            let studentname = document.createElement("li");
            let schoolnumber = document.createElement("li");
            let housename = document.createElement("li");
            let reason = document.createElement("li");
            let parentscontact = document.createElement("li");
            let exeat_date = document.createElement("li");
            let returndate = document.createElement("li");
            let hasreturned = document.createElement("li");
            let modify_button = document.createElement("button");
            let given_by = document.createElement("li")
            let view_more = document.createElement("button");



            //   buttons
            view_more.setAttribute("id", "view_more_button");
            view_more.setAttribute("id", "vmb")
            view_more.textContent = "View more";
            modify_button.setAttribute("id", "modify_button");
            modify_button.textContent = 'Modify exeat';
            modify_button.setAttribute('data-id', exeat.id); 

            studentname.textContent = `Studentname: ${exeat['studentname']}`;
            schoolnumber.textContent = `Schoolnumber: ${exeat['schoolnumber']}`;
            housename.textContent = `Housename: ${exeat['housename']}`;
            reason.textContent = `Reason: ${exeat['reason']}`;
            parentscontact.textContent = `Parent's contact: ${exeat['parentscontact']}`;
            exeat_date.textContent = `Date given: ${exeat['exeatdate']}`;
            returndate.textContent = `Date to return: ${exeat['exeat_expiry_date']}`;
            hasreturned.textContent = `Has returned: ${exeat['has_returned']}`;
            given_by.textContent = `Given by: ${exeat['given_by']}`

            let items = [studentname, schoolnumber, housename, reason, parentscontact, exeat_date, returndate, hasreturned, given_by, view_more];
            let hiddens = [housename, reason, parentscontact, exeat_date, returndate, hasreturned, given_by];
            items.forEach(item => list.appendChild(item));
            hiddens.forEach(item => item.style.display = 'none');


            view_more.addEventListener("click", event => {
                hiddens.forEach(item => {
                    if (item.style.display == 'none') {
                        item.style.display = 'block';
                        event.target.textContent = 'View less';
                    } else {
                        item.style.display = 'none';
                        event.target.textContent = 'View more';
                    }
                });
            });

            if(localStorage.getItem("account_type")=='Security'){
                modify_button.style.display= 'none'
            }
            else{
                modify_button.addEventListener('click', modify_exeat);
            }

            list.appendChild(modify_button);
            list.appendChild(view_more);
            exeat_tab.appendChild(list);
        });
    }


    checkboxOptions.forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });
    // filters.schoolNumberPattern.forEach(checkbox => {
    //     checkbox.addEventListener('change', applyFilters);
    // });
    filters.active.addEventListener('change', applyFilters);
    filters.expired.addEventListener('change', applyFilters);
    filters.past.addEventListener('change', applyFilters);

    yeargroup.CA.addEventListener("change", applyFilters)
    yeargroup.CB.addEventListener("change", applyFilters)
    yeargroup.CD.addEventListener("change", applyFilters)
    // dropdownToggle.addEventListener('click', function () {
    //     dropdownOptions.classList.toggle('show');
    // });
    searchButton.addEventListener("click", searchExeats)
    fetcher.addEventListener("click", get_exeats);
});
