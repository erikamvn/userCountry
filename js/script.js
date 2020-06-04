let globalUsers = null;
let globalCountries = null;
let globalUsersAndCoutries = null;

async function start(){
//    await fetchUsers();
//    await fetchCoutries();

    const p1 = promiseUsers();
    const p2 = promiseCountries();

    await Promise.all([p1, p2]);

    hideSpinner();
    mergeUserAndCountries();
    render();
}

function promiseUsers(){
    return new Promise(async (resolve, reject) =>{
        await fetchUsers();
        resolve();
    });
}

function promiseCountries(){
    return new Promise(async (resolve, reject) =>{
        await fetchCoutries();
        resolve();
    });
}

function hideSpinner(){
    const spinner = document.querySelector('#spinner');
    spinner.classList.add('hide');
}

async function fetchUsers(){
    const res = await fetch('https://randomuser.me/api/?results=100&seed=promise&nat=us,fr,au,br');

    const json = await res.json();

    globalUsers = json.results.map( ({ name, picture, nat }) => {
        return {
            userName : name.first,
            userPicture : picture.large,
            userCountry : nat,
        }
    });
}

async function fetchCoutries(){
    const res = await fetch('https://restcountries.eu/rest/v2/all');

    const json = await res.json();

    globalCountries = json.map( ({ name, alpha2Code, flag }) => {
        return {
            countryName : name,
            countryCode : alpha2Code,
            countryFlag : flag,
        }
    });
}

function mergeUserAndCountries(){
    globalUsersAndCoutries = [];

    globalUsers.forEach(user => {
        const userCountry = globalCountries.find(country =>{
            return country.countryCode === user.userCountry;
        });
        globalUsersAndCoutries.push({ ...user, ...userCountry });
    });
}

function render(){
    const divUsers = document.querySelector('#divUsers');

    divUsers.innerHTML =
    `
        <div class='row'>
            ${globalUsersAndCoutries.map(item =>{
                return `
                    <div class='col s6 m4 l3'>
                        <div class='flex-row bordered'>
                            <img class='avatar' src='${item.userPicture}' />
                            <div class='flex-column'>
                                <span>${item.userName}</span>
                                <img class='flag' src='${item.countryFlag}' />
                            </div>
                        </div>
                    </div>
                `
            })
            .join('')}
        </div>
    `;
}

start();