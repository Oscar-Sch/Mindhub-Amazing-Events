const parameterSearch= new URLSearchParams(location.search);
console.log(location.search, parameterSearch)
const id=parameterSearch.get("id");
const container=document.querySelector(".details-container");

const LoadData=(async(container,id)=>{ 
    let data;
    await fetch("./assets/data/data.json", {method:"GET"})
        .then(res=>res.json())
        .then(res=>{
            data=res.events;
        });
        RenderDetails(container,data,id);
})(container,id);

function LoadTemplate(event){
    return `
    <img class="details-img" src="${event.image}" alt="card img">
    <div class="details-info">
        <h1>${event.name}</h1>
        <p>${event.description}</p>
        <div class="details-info_subsection">
            <div class="details-info_capsule">
                <span>Date: </span>
                <p>${event.date}</p>
            </div>
            <div class="details-info_capsule">
                <span>Place: </span>
                <p>${event.place}</p>
            </div>
        </div>
        <div class="details-info_subsection">
            <div class="details-info_capsule">
                <span>Capacity: </span>
                <p>${event.capacity}</p>
            </div>
            <div class="details-info_capsule">
                <span>${event.assistance?"Assistance:":"Estimate:"}</span>
                <p>${event.assistance?event.assistance:event.estimate}</p>
            </div>
        </div>
        <div class="details-info_subsection">
            <div class="details-info_capsule">
                <span>Category: </span>
                <p>${event.category}</p>
            </div>
            <div class="details-info_capsule">
                <span>Price: </span>
                <p>$${event.price}</p>
            </div>
        </div>
    </div>
    `;
}

function RenderDetails(container,data,id){
    container.innerHTML="";
    let event= data.find(e=>e._id===id);
    container.innerHTML= LoadTemplate(event);
}