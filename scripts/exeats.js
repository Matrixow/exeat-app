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
        schoolNumberPattern: document.querySelectorAll('input[name="schoolNumberPattern"]')
    };

    let exeatData = [];

    // Fetch data from the server
    function get_exeats() {
        loading_gif.setAttribute("src", "../images/loading2.gif");
        fetch("http://localhost:5000/owass-robotech/us-central1/app/")
            .then(res => {
                if (!res.ok) {
                    throw new Error("Response was not ok");
                }
                return res.json();
            })
            .then(data => {
                exeatData = data; // Store data locally
                loading_gif.setAttribute("src", "../images/done.svg");
                total.innerHTML = `Total exeats: ${exeatData.length}`
                applyFilters(); // Apply filters to the data
            })
            .catch(err => {
                console.log("An error occurred: " + err);
                loading_gif.setAttribute("src", "../images/error.png");
            });
    }

    // Apply filters to the data
    function applyFilters() {
        const active = filters.active.checked;
        const expired = filters.expired.checked;
        const past = filters.past.checked;
        const selectedHouses = Array.from(checkboxOptions)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);

        const selectedPatterns = Array.from(filters.schoolNumberPattern)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);

        let filteredData = exeatData;

        // Apply house filters
        if (selectedHouses.length > 0) {
            filteredData = filteredData.filter(exeat => selectedHouses.includes(exeat.housename));
        }

        // Apply school number pattern filter
        if (selectedPatterns.length > 0) {
            filteredData = filteredData.filter(exeat => selectedPatterns.some(pattern => exeat.schoolnumber.startsWith(pattern)));
        }

        // Apply status filters
        const today = new Date().toISOString().split('T')[0];
        if (active) {
            filteredData = filteredData.filter(exeat => exeat.exeat_expiry_date >= today && !exeat.hasreturned);
        }
        if (expired) {
            filteredData = filteredData.filter(exeat => exeat.exeat_expiry_date < today && !exeat.hasreturned);
        }
        if (past) {
            filteredData = filteredData.filter(exeat => exeat.exeat_expiry_date < today && exeat.hasreturned);
        }

        renderExeats(filteredData);
    }

    function searchExeats() {

        if (exeatData.length === 0) {
            alert("Please get exeats first");
            return;
        }
    
        const query = searchInput.value.toLowerCase();
    
        const results = exeatData.filter(exeat => {
            // Create an array of values for each exeat object
            const valuesArray = Object.values(exeat).map(value => (typeof value === 'string') ? value.toLowerCase() : value);
    
            // Check if any value includes the search query
            return valuesArray.some(value => {
                if (typeof value === 'string' && value.includes(query)) {
                    return true;
                }
                return false;
            });
        });
    
        if (results.length > 0) {
            renderExeats(results);
        } else {
            exeat_tab.innerHTML = '<li>No results found</li>';
        }
    }
    


    async function modify_exeat(event) {
        loading_gif.setAttribute("src", '/images/loading2.gif');

        const docId = event.target.getAttribute("data-id");

        fetch(`http://localhost:5000/owass-robotech/us-central1/app/modify`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ detail: docId, hasreturned: true })
        })
        .then(res => res.json())
        .then(data => {
            alert(data.message);
            loading_gif.setAttribute("src", '../images/done.svg');
        })
        .catch(err => {
            console.error("An error occurred:", err);
            loading_gif.setAttribute("src", '../images/error.png');
        });
    }

    // Render exeat data to the DOM
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



            // Creating the buttons
            view_more.setAttribute("id", "view_more_button");
            view_more.setAttribute("id", "vmb")
            view_more.textContent = "View more";
            modify_button.setAttribute("id", "modify_button");
            modify_button.textContent = 'Modify exeat';
            modify_button.setAttribute('data-id', exeat.id);  // Add the document ID here

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

            // Event listeners
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

    // Event listeners for filters
    checkboxOptions.forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });
    filters.schoolNumberPattern.forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });
    filters.active.addEventListener('change', applyFilters);
    filters.expired.addEventListener('change', applyFilters);
    filters.past.addEventListener('change', applyFilters);

    // dropdownToggle.addEventListener('click', function () {
    //     dropdownOptions.classList.toggle('show');
    // });
    searchButton.addEventListener("click", searchExeats)
    fetcher.addEventListener("click", get_exeats);
});
