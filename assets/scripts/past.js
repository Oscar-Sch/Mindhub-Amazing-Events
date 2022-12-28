//creo una funcion asincrona que se auto-instancia al comienzo de la ejecucion del script
//para que traiga los datos desde el .json y mandarlos a la funcion RenderCards
const LoadData=(async()=>{
    const cardsContainer= document.querySelector(".cards-container");
    let data;
    await fetch("./assets/data/data.json", {method:"GET"})
        .then(res=>res.json())
        .then(res=>{
            data=res;
        });
    RenderCards(cardsContainer,data)
})();


//recibe un container padre y los datos de un evento para insertar un 
//template dinamico en el interior del contenedor
function LoadCard(container,event){
    container.innerHTML+=
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
    </article>`
    ;
}
//recibe un contenedor padre y el objeto extraido del .json,
//y por cada evento pasado manda a cargar una carta
function RenderCards(container,data){
    data.events.forEach(event => {
        if (event.date<data.currentDate){
            LoadCard(container,event);
        }
    });
}

