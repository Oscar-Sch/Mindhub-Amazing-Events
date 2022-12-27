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



function LoadCard(container,card){
    container.innerHTML+=
    `<article class="card col-10 col-md-5 col-lg-3">
        <img class="card-img-top" src="${card.image}" alt="a ${card.name} image">
        <div class="card-body">
            <h5 class="card-title">${card.name}</h5>
            <p class="card-text">${card.description}</p>
            <div class="card_call">
                <p><span>Price: </span> $${card.price}</p>
                <a href="./details.html" class="btn btn-see-more">See more!</a>
            </div>
        </div>
    </article>`
    ;
}

function RenderCards(cardsContainer,data){
    let title=document.querySelector("h1").innerText;
    if (title==="Home"){
        data.events.forEach(card => {
            LoadCard(cardsContainer,card);
        });
    }else if(title==="Upcoming Events"){
        data.events.forEach(card => {
            if (card.date>=data.currentDate){
                LoadCard(cardsContainer,card);
            }
        });
    }else if(title==="Past Events"){
        data.events.forEach(card => {
            if (card.date<data.currentDate){
                LoadCard(cardsContainer,card);
            }
        });
    }
}

