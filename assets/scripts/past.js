const data={};
const cardsContainer= document.querySelector(".cards-container");
const searchbar= document.querySelector(".filter-searchbar input");
const checkGroup= document.querySelector(".btn-group");
//creo una funcion asincrona que se auto-instancia al comienzo de la ejecucion del script
//para que traiga los datos desde el .json y mandarlos a la funcion RenderCards
const LoadData=(async(data,container)=>{ 
    RenderLoader(container);
    await fetch("https://mindhub-xj03.onrender.com/api/amazing", {method:"GET"})
        .then(res=>res.json())
        .then(res=>{
            data.events=res.events.filter(event=>event.date<res.currentDate);
            data.currentDate=res.currentDate;
            RenderCards(container,data.events);
            RenderCheckboxes(ParseCategories(data.events),checkGroup);
            EventsObserver();
        })
        .catch(err=>{
            RenderLoadError(container);
        })
})(data,cardsContainer);

function RenderLoader(container){
    let loader=`
    <div class="loader-container">
        <img class="loader-img"src="./assets/img/logo.svg" alt="loader"/>
        <img class="loader"src="./assets/img/loader.gif" alt="loader"/>    
    </div>`;
    container.innerHTML=loader;
}
function RenderLoadError(container){
    let errorMsg=`<div class="not-found-container"><h2 class="not-found">Can't load the data!</h2><h3 class="not-found">Please try again later <3</h3>
    </div>`;
    container.innerHTML=errorMsg;
}


function ParseCategories(data){
    let categories= data.map(event=>event.category);
    return Array.from(new Set(categories));
}
function RenderCheckboxes(categories,container){
    let template="";
    categories.forEach((cat,index)=>{
        template+=`
        <input type="checkbox" class="btn-check" id="btncheck${index}" name="${cat}">
        <label class="btn btn-outline-danger checkboxSize" for="btncheck${index}">${cat}</label>
        `;
    });
    container.innerHTML=template;
}

//Encargada de cargar los event listeners
function EventsObserver(){
    searchbar.addEventListener("input",CrossFilter);
    checkGroup.addEventListener("change", CrossFilter);
}

//Aplica los datos de ambos filtros para mostrar las tarjetas
//correspondientes
function CrossFilter(){
    const checkBtns= document.querySelectorAll(".btn-check");
    let firstFilter=SearchBarFilter(data.events,searchbar);
    let secondFilter=CheckFilter(firstFilter,checkBtns);
    
    RenderCards(cardsContainer,secondFilter);
}

//Usa los datos ingresados en la barra de busqueda para filtrar
//por nombre
function SearchBarFilter(data, input){
    let filtered=data.filter(event=>event.name.toLowerCase().startsWith(input.value.toLowerCase()));
    return filtered;
}
//Usa los nombres de los checkboxes para filtrar por categoria
function CheckFilter(data,inputGroup){
    let activeInputs=[];
    let filtered;
    inputGroup.forEach(input=>{
        if(input.checked){
            activeInputs.push(input.name.toLowerCase())
        }
    })
    if(activeInputs.length!==0){
        filtered=data.filter(event=>activeInputs.includes(event.category.toLowerCase()));
    }else{
        filtered=data;
    }
    return filtered;
}

//recibe un container padre y los datos de un evento para insertar un 
//template dinamico en el interior del contenedor
function LoadCard(event){
    return(
    `<article class="card col-10 col-md-5 col-lg-3">
        <img class="card-img-top" src="${event.image}" alt="a ${event.name} image">
        <div class="card-body">
            <h5 class="card-title">${event.name}</h5>
            <p class="card-text">${event.description}</p>
            <div class="card_call">
                <p><span>Price: </span> $${event.price}</p>
                <a class="btn btn-see-more" href="./details.html?id=${event._id}">See more!</a>
            </div>
        </div>
    </article>`);
}
//Muestra un mensaje cuando no hay coincidencias
function RenderError(container){
    let errorMsg=`<div class="not-found-container"><h2 class="not-found">Unexistent event!</h2><h3 class="not-found">Try again with another name or category!</h3>
    </div>`;
    container.innerHTML=errorMsg;
}


//recibe un contenedor padre y el objeto extraido del .json,
//y por cada evento manda a cargar una carta
function RenderCards(container,data){
    let htmlStr=""; 
    data.forEach(event=> {
        htmlStr+=LoadCard(event);
    });
    if(htmlStr){
        container.innerHTML=htmlStr;
    }else{
        RenderError(container);
    }
}

