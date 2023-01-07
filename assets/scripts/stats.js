const eventsTable=document.querySelector(".events-statictics-body");
const pastEventsTable=document.querySelector(".past-events-statictics-body");
const upEventsTable=document.querySelector(".up-events-statictics-body");
const tableContainer= document.querySelector(".table-container")

const LoadData=(async(eventContainer,pastContainer,upContainer,tableContainer)=>{ 
    let data,dataPast=[],dataUp=[];
    await fetch("https://mindhub-xj03.onrender.com/api/amazing", {method:"GET"})
        .then(res=>res.json())
        .then(res=>{
            data=res.events;
            data.forEach(event => {
                if (event.date>res.currentDate){
                    dataUp.push(event);
                }else{
                    dataPast.push(event);
                }
            });
            RenderTable(eventContainer,data,CalculateEventStats);
            RenderTable(pastContainer,dataPast,CalculateCatStats);
            RenderTable(upContainer,dataUp,CalculateCatStats);
        })
        .catch(err=>{
            RenderError(tableContainer);
        })
})(eventsTable,pastEventsTable,upEventsTable,tableContainer);

function RenderError(container){
    let errorMsg=`<div class="not-found-container"><h2 class="not-found">Can't load the data!</h2><h3 class="not-found">Please try again later <3</h3>
    </div>`;
    container.innerHTML=errorMsg;
}


function GetMax(data){
    let maxEvent=data.sort((a,b)=>{
        let fst=a.assistance?a.assistance*100/a.capacity:0;
        let scd=b.assistance?b.assistance*100/b.capacity:0;
        return scd-fst;
    });
    return `<span>${maxEvent[0].name} :</span> %${(maxEvent[0].assistance*100/data[0].capacity).toFixed(2)}`;
}
function GetMin(data){
    let minEvent=data.sort((a,b)=>{
        let fst=a.assistance?a.assistance*100/a.capacity:Infinity;
        let scd=b.assistance?b.assistance*100/b.capacity:Infinity;
        return fst-scd;
    });
    return `<span>${minEvent[0].name} :</span> %${(minEvent[0].assistance*100/data[0].capacity).toFixed(2)}`;
}
function GetMaxCap(data){
    let maxCapEv=data.sort((a,b)=> b.capacity-a.capacity);
    return `<span>${maxCapEv[0].name} :</span> ${maxCapEv[0].capacity}`;
}
function CalculateEventStats(data){
    return [[GetMax(data),GetMin(data),GetMaxCap(data)]]
}
function CalculateCatStats(data){
    return (data.map(elem=>{
        return [
            elem.category,
            `$${elem.assistance?
                elem.assistance*elem.price:
                elem.estimate*elem.price}`,
            `%${(elem.assistance?
                elem.assistance*100/elem.capacity:
                elem.estimate*100/elem.capacity).toFixed(2)}`
        ]
    }));
}
function LoadTable(stats){
    return stats.map(stat=>{
        console.log(stat)
        return(
        `<tr>
            ${stat.map(elem=>{
            return `
                <td>
                    ${elem}
                </td>`;
            }).join(" ")}
        </tr>`)
    }).join(" ");
}

function RenderTable(container, data, calcFunction){
    let stats= calcFunction(data);
    container.innerHTML=LoadTable(stats);
}
