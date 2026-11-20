const AddCard = document.querySelectorAll(".AddCard")
const sliderParent = document.querySelector(".sliderColWrapper")
const cardForm = document.querySelector(".cardForm")
const sectionColors = document.querySelector(".sectionColors")
const columnName = document.getElementById("columnName")
const sliderCols = document.getElementById("sliderCols")
const formTitle = document.getElementById("formTitle")
fetched = JSON.parse(localStorage.getItem("allData")) || []
let columnID = "";

function makeColumn(colName) {
    let dataArr = JSON.parse(localStorage.getItem("allData")) || [];
    dataArr.push({
        name: colName,
        id: crypto.randomUUID(),
        cards : []
    })
    localStorage.setItem("allData", JSON.stringify(dataArr))
    sliderParent.innerHTML = ``
    renderColumn()
}

function renderColumn() {
    sliderParent.innerHTML = "";
    let dataSet = JSON.parse(localStorage.getItem("allData")) || []
    let name = ""
    dataSet.forEach(element => {
        let HTMLCode = ``

        if (element.cards.length == "") {

            HTMLCode = `<div class="emptyTask">
                                <p>No Card</p>
                            </div>`
        }else{

            element.cards.forEach(a => {

                HTMLCode += `
                <div class="sliderTasks ${a.cardID}">
                    <div class="sliderTasksLeft" style="border-color: ${a.carColor};"></div>
                    <div class="sliderTasksRight">
                        <div class="sliderTasksRightTop"><p>${a.carTitle}</p></div>
                        <div class="sliderTasksRightBottom">
                            <div class="sliderTasksRightBottomTop"><p>${a.carDesc}</p></div>
                            <div class="sliderTasksRightBottomBottom">Due Date: ${a.carDate}</div>
                        </div>
                    </div>
                    <i style="color: #FF9184;" class="fa-duotone fa-regular fa-trash-can cardDel" style="--fa-primary-color: rgb(255, 145, 132); --fa-secondary-color: rgb(255, 145, 132);"></i>
                </div>`

                
            });

            
        }

        plength = element.cards.length;

        name = element.name;

        sliderParent.insertAdjacentHTML('beforeend', `
                <div class="sliderCols ${element.id}">
                    <div>
                    <div class="sliderColsTop">
                        <p style="color: rgb(164, 164, 164); "><i class="fa-solid fa-square " style="color: rgb(240, 179, 87);"></i>${name}</p>
                        <div class="sliderRight">
                            <p>${plength}</p>
                                <div><i style="color: #FF9184;" class="fa-duotone fa-regular fa-trash-can deleter" style="--fa-primary-color: rgb(255, 145, 132); --fa-secondary-color: rgb(255, 145, 132);"></i></div>
                        </div>
                    </div>
                    ${HTMLCode}
                    </div>
                    <div class="AddCard">
                        <p>+ Add card</p>
                    </div>
                </div>
            `)


    });
}

document.addEventListener('DOMContentLoaded', ()=>{
    renderColumn()
})

document.addEventListener('click', (e)=>{
    if (e.target.closest(".cardDel")) {
        let dataArr = JSON.parse(localStorage.getItem("allData"))
        let iid = e.target.closest(".sliderCols").classList[1]
        const index = dataArr.findIndex(user => user.id == iid);
        let ind = dataArr[index].cards.findIndex(user => user.cardID == e.target.closest(".cardDel").parentElement.classList[1]);
        dataArr[index].cards.splice(ind,1)
        localStorage.setItem("allData", JSON.stringify(dataArr))    
        e.target.closest(".cardDel").parentElement.remove()

        renderColumn()
    }
})


let isDragging = false;
let offsetX = 0;
let offsetY = 0;
let floater;
let draggedCardID;
let fromMoved;
let originalLeft;
let originalTop;
let originalPosition;
document.addEventListener('pointerdown', (e)=>{
    
    dataArr = JSON.parse(localStorage.getItem("allData"))
    


    let selected = e.target.closest(".sliderTasks")
    
    if (selected) {
        draggedCardID = selected.classList[1]
        fromMoved = e.target.closest(".sliderCols").classList[1]
        if (e.target.closest(".cardDel")) return;
        let rect = selected.getBoundingClientRect();

        originalLeft = rect.left;
        originalTop = rect.top;
        originalPosition = selected.style.position;
        offsetX = e.clientX - selected.getBoundingClientRect().left;
        offsetY = e.clientY - selected.getBoundingClientRect().top;
        isDragging = true;
        floater = selected;
        floater.style.position = "fixed"
        floater.style.pointerEvents = "none";
        floater.style.zIndex = "1000";
        
    }
})

document.addEventListener("pointermove", (e) => {
    if (!isDragging) return;

    floater.style.left = `${e.clientX - offsetX}px`;
    floater.style.top = `${e.clientY - offsetY}px`;
});

document.addEventListener("pointerup", (e) => {
if (!isDragging) return;

    let dropTarget = document.elementFromPoint(e.clientX, e.clientY);
    let dropColumn = dropTarget?.closest(".sliderCols");

    if (!dropColumn) {
        floater.style.position = originalPosition;
        floater.style.left = "";
        floater.style.top = "";
        floater.style.pointerEvents = "";
        floater.style.zIndex = "";

        isDragging = false;
        return;
    }

    let dataArr = JSON.parse(localStorage.getItem("allData")) || [];
    const inx = dataArr.findIndex(user => user.id == fromMoved);
    const inv = dataArr[inx].cards.findIndex(user => user.cardID == draggedCardID);
    const inc = dataArr.findIndex(user => user.id == dropColumn.classList[1]);
    let movingObj = dataArr[inx].cards[inv]
    dataArr[inc].cards.push(movingObj)
    dataArr[inx].cards.splice(inv,1)

    localStorage.setItem("allData", JSON.stringify(dataArr))

    renderColumn()

});


function addCardFunc(workID) {
    let title = document.getElementById("titleInput").value.trim()
    let descriptionInput = document.getElementById("descriptionInput").value.trim()
    let colorIput = document.getElementById("colorIput").value.trim()
    let dateInput = document.getElementById("dateInput").value.trim()
    
    if (title != "" && descriptionInput != "" && colorIput != "" && dateInput != "") {
        let dataArr = JSON.parse(localStorage.getItem("allData")) || [];
        const index = dataArr.findIndex(user => user.id == workID);

        let objCard = {
            carTitle: title,
            carDesc:descriptionInput,
            carColor:colorIput,
            carDate:dateInput,
            cardID:crypto.randomUUID()
        }

        dataArr[index].cards.push(objCard)
        localStorage.setItem("allData", JSON.stringify(dataArr))
    }

    document.getElementById("titleInput").value = ""
    document.getElementById("descriptionInput").value = ""
    document.getElementById("colorIput").value = ""
    document.getElementById("dateInput").value = ""

    renderColumn()

}


sectionColors.addEventListener('click', (e)=>{
    if (e.target.closest(".red")) {
        document.getElementById("colorIput").value = "rgb(223, 86, 86)"
    }else if (e.target.closest(".orange")) {
        document.getElementById("colorIput").value = "rgb(255, 108, 34)"
    }else if (e.target.closest(".yellow")) {
        document.getElementById("colorIput").value = "rgb(255, 199, 0)"
    }else if (e.target.closest(".green")) {
        document.getElementById("colorIput").value = "rgb(60, 242, 114)"
    }else if (e.target.closest(".blue")) {
        document.getElementById("colorIput").value = "rgb(61, 170, 255)"
    }else if (e.target.closest(".indigo")) {
        document.getElementById("colorIput").value = "rgb(138, 97, 255)"
    }else if (e.target.closest(".blank")) {
        document.getElementById("colorIput").value = "default"
    }
})




function eventListerAdder(event, selector, toBeToggeled, background, signal) {
    document.addEventListener(event, (e)=>{
        if (e.target.closest(selector) && signal == "false") {
            toBeToggeled.classList.toggle("hidden")
            background.classList.toggle("lowBrightness")
        }else if (e.target.closest(selector) && signal == "save") {
            columnName.focus()

            let colName = columnName.value.trim()
            if (colName != "") {
                makeColumn(colName)
            }
            toBeToggeled.classList.toggle("hidden")
            background.classList.toggle("lowBrightness")
            columnName.value = ""
        } else if(e.target.closest(selector) && signal == "saveTheCard"){
            background.classList.toggle("lowBrightness")
            toBeToggeled.classList.toggle("hidden")
            addCardFunc(columnID)

        }else if(e.target.closest(selector) && signal == "popTheForm"){
            background.classList.toggle("lowBrightness")
            toBeToggeled.classList.toggle("hidden")
            columnID = e.target.closest(selector).parentElement.classList[1];
            let dataArr = JSON.parse(localStorage.getItem("allData")) || [];
            const index = dataArr.findIndex(user => user.id == columnID);
            formTitle.innerHTML = dataArr[index].name;

        }
    })
}

function deleteEventAdder(selector) {
    sliderParent.addEventListener('click', (e)=>{
        if(e.target.closest(selector)){
            let dataArr = JSON.parse(localStorage.getItem("allData"))
            let iid = e.target.closest(".sliderCols").classList[1]
            const index = dataArr.findIndex(user => user.id == iid);
            dataArr.splice(index,1)
            localStorage.setItem("allData", JSON.stringify(dataArr))
            e.target.closest(".sliderCols").remove()
        }
    })
}

eventListerAdder("click", ".AddCard", document.querySelector(".cardForm"), document.querySelector("main"), "popTheForm")
eventListerAdder("click", ".cardClose", document.querySelector(".cardForm"), document.querySelector("main"), "false")
eventListerAdder("click", ".formCan1", document.querySelector(".cardForm"), document.querySelector("main"), "false")
eventListerAdder("click", ".saveCard", document.querySelector(".cardForm"), document.querySelector("main"), "saveTheCard")
eventListerAdder("click", ".sliderColsStyle", document.querySelector(".columnForm"), document.querySelector("main"), "false")
eventListerAdder("click", ".closeColumn", document.querySelector(".columnForm"), document.querySelector("main"), "false")
eventListerAdder("click", ".colCan", document.querySelector(".columnForm"), document.querySelector("main"), "false")
eventListerAdder("click", ".colAdd", document.querySelector(".columnForm"), document.querySelector("main"), "save")
deleteEventAdder(".deleter")