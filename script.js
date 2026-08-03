const board =
    document.getElementById("board");


const playerCount =
    document.getElementById("playerCount");





// 座席配置

const seatLayouts = {


    2:[
        "top",
        "bottom"
    ],


    3:[
        "top",
        "right",
        "left"
    ],


    4:[
        "top",
        "right",
        "bottom",
        "left"
    ],


    5:[
        "top",
        "topRight",
        "bottomRight",
        "bottomLeft",
        "left"
    ],


    6:[
        "top",
        "topRight",
        "right",
        "bottomRight",
        "bottomLeft",
        "left"
    ],


    7:[
        "top",
        "topRight",
        "right",
        "bottomRight",
        "bottom",
        "bottomLeft",
        "left"
    ],


    8:[
        "top",
        "topRight",
        "right",
        "bottomRight",
        "bottom",
        "bottomLeft",
        "left",
        "topLeft"
    ]

};





// 回転

const rotations = {


    top:180,


    topRight:-135,


    right:-90,


    bottomRight:-45,


    bottom:0,


    bottomLeft:45,


    left:90,


    topLeft:135


};






function createSeats(count){


    board.innerHTML="";



    let seats =
        seatLayouts[count];



    seats.forEach(
        (seat,index)=>{


            let div =
            document.createElement("div");



            div.className =
                "seat seat-"+seat;



            div.style.transform =
                `
                rotate(${rotations[seat]}deg)
                `;



            div.innerHTML = `


                <div class="name">

                    Player${index+1}

                </div>


                <div class="time">

                    30.000

                </div>


                <button>

                    終了

                </button>


            `;



            board.appendChild(div);


        }

    );


}





playerCount.onchange=()=>{


    createSeats(
        Number(playerCount.value)
    );


};





// 初期表示

createSeats(4);
