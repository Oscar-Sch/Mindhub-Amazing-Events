const eventsTable=document.querySelector(".events-statictics-body");
const pastEventsTable=document.querySelector(".past-events-statictics-body");
const upEventsTable=document.querySelector(".up-events-statictics-body");
const tableContainer= document.querySelector(".table-container")

const LoadData=(async(eventContainer,pastContainer,upContainer,tableContainer)=>{ 
    let data,dataPast=[],dataUp=[];
    // RenderLoader(tableContainer)
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
            RenderLoadError(tableContainer);
        })
})(eventsTable,pastEventsTable,upEventsTable,tableContainer);

function RenderLoadError(container){
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

function ParseCategories(data){
    let categories= data.map(event=>event.category);
    return Array.from(new Set(categories));
}

function CalculateCatStats(data){
    let categories=ParseCategories(data);
    return categories.map(cat=>{
        let catInfo= data.filter(event=>event.category===cat);
        return catInfo.reduce((acu,elem,index)=>{
            if(!index){
                acu[0]=elem.category;
            }
            acu[1]+= (elem.assistance ?? elem.estimate)*elem.price;
            acu[2]+= (elem.assistance ?? elem.estimate)/elem.capacity*100;
            if (index===catInfo.length-1){
                acu[1]= "$"+acu[1];
                acu[2]= "%"+ (acu[2]/catInfo.length).toFixed(2);
            }
            return acu;
        },["category",0,0])
    });
}
function LoadTable(stats){
    return stats.map(stat=>{
        // console.log(stat)
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
