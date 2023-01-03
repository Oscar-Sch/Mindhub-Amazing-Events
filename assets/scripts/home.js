const data={};
const cardsContainer= document.querySelector(".cards-container");
const searchbar= document.querySelector(".filter-searchbar input");
const searchBtn= document.querySelector(".filter-searchbar button");
const checkBtns= document.querySelectorAll(".btn-check");
const checkGroup= document.querySelector(".btn-group");
//creo una funcion asincrona que se auto-instancia al comienzo de la ejecucion del script
//para que traiga los datos desde el .json y mandarlos a la funcion RenderCards
const LoadData=(async(data,container)=>{ 
    await fetch("./assets/data/data.json", {method:"GET"})
        .then(res=>res.json())
        .then(res=>{
            data.events=res.events;
            data.currentDate=res.currentDate;
        });
        RenderCards(container,data.events)
})(data,cardsContainer);



function ParseCategories(catStr){

    return catStr.toLowerCase().split(",").map(cat=>cat.trim());

}

function ApplyFilter(cats,container,data){
    let filtered=[];
    filtered=data.filter(e=>{
        for(let cat of cats){
            if (e.category.toLowerCase()===cat){
                return true;
            }
        }
    });
    if (filtered.length===0){
        if(cats.length>1 || cats[0]!==""){
            filtered=[]
        }else{
            filtered=data;
        }
    }
    RenderCards(container,filtered);
}

function FilterObserver(container,data){
    const searchbar= document.querySelector(".filter-searchbar input");
    const searchBtn= document.querySelector(".filter-searchbar button");
    const checkBtns= document.querySelectorAll(".btn-check");
    let searchCategories=[];
    searchBtn.addEventListener("click",()=>{
        searchCategories= ParseCategories(searchbar.value);
        ApplyFilter(searchCategories,container,data);
    });
    checkBtns.forEach(btn=>{
        btn.addEventListener("click",()=>{
            
        })
    })
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
                <a href="./details.html" class="btn btn-see-more">See more!</a>
            </div>
        </div>
    </article>`);
}

function RenderError(container){
    let errorMsg=`<h2 class="not-found">Unexistent categories</h2><h3 class="not-found">¡Remember to use commas to separate the categories!</h3>`;
    container.innerHTML=errorMsg;
}


//recibe un contenedor padre y el objeto extraido del .json,
//y por cada evento manda a cargar una carta
function RenderCards(container,data){
    let htmlStr=""; 
    data.forEach(event => {
        htmlStr+=LoadCard(event);
    });
    if(htmlStr){
        container.innerHTML=htmlStr;
    }else{
        RenderError(container);
    }
}

