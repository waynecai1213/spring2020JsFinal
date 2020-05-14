"use strict";

let usernameInput = document.getElementById("usernameInput")
let peerIdInput = document.getElementById("peerIdInput");
let connectBtn = document.getElementById("connectBtn");
let chat = document.getElementById("chat");
let sendBtn = document.getElementById("sendBtn");
let stateText = document.getElementById("stateText");
let mySendMsg = {
  Name: "AGoodPeer",
  Msg: "",
  Gif:""
};
let msgInput = document.getElementById("messageInput");
let loginPage = document.getElementsByClassName("login page");
let chatPage = document.getElementsByClassName("chat page");
let compliments;
let myName;
//create peer object
let peer = new Peer({ key: "lwjd5qra8257b9" });
let conn = null;
let autoScroll;
var audioApplause1 = new Audio('./assets/applause.m4a');
var audioApplause2 = new Audio('./assets/awesome.mp3');

let searchKeyword="applause";
let giphyKey="lr9zYfx8CnhyAPIlGP3qp1g36zo1MI4p";
let giphyAPI="https://api.giphy.com/v1/gifs/search?api_key="+giphyKey+"&q="+ searchKeyword+"&limit=50&offset=0&rating=G&lang=en";
let gifs;
// let gifDiv = document.getElementById("gif");
let gifImg = document.getElementById("gifImg");

fetch("./compliment.json")
  .then(resp => resp.json())
  .then(function (data) {
    compliments = data;
    console.log("data: " + data);
    console.log(compliments.text[Math.floor(Math.random() * compliments.length)])
  })



// pass connection ID into peer object
// connects to the broker server
peer.on('open', function (id) {
  console.log('My peer ID is: ' + id);
  document.getElementById("peerId").innerHTML = id;
});


// someone connects to you
peer.on('connection', function (c) {
  console.log("usernameInput:" + usernameInput.value);
  console.log("receiving connection");
  conn = c;
  connect2();
  changePage();
})

// connect to someone else
connectBtn.addEventListener("click", connect1);


function connect1() {
  console.log(myName);
  if (conn) {
    conn.close();
  }
  //create a connection using the entered ID
  conn = peer.connect(peerIdInput.value, {
    reliable: true
  });

  console.log("ConnectBtn Clicked");
  connect2();
}

function connect2() {
  mySendMsg.Name = usernameInput.value;
  if (!mySendMsg.Name) {
    mySendMsg.Name = "AGoodPeer";
  }

  conn.on('open', function () {
    chat.innerHTML = "connected to: " + conn.peer + "<br/>";
    console.log("connected to: " + conn.peer);
    changePage();
  })
  conn.on('data', function (data) {
    stateText.innerHTML = "Receiving connection From " + data.Name;
    console.log("received: " + data.Msg);
    //Receive Message
    chat.innerHTML += "<b>" + data.Name + "   </b>" + data.Msg;
    showGif(data.Gif);
    audioApplause2.play();
  })

}

//send message
// sendBtn.addEventListener("click", sendMsg);
window.addEventListener("keypress", keyFunction, false);

function keyFunction(event) {
  var x = event.keyCode;
  if (x == 13) {
    sendMsg();
  }
}

function getGif(){
  fetch(giphyAPI)
  .then(resp => resp.json())
  .then(function (giphyData) {
    console.log(giphyData);
    gifs= giphyData.data[Math.floor(Math.random() * 50)].images.fixed_height.url;
    mySendMsg.Gif=gifs;
    showGif(gifs);
  
    conn.send(mySendMsg);
  })
}

function showGif(gifs){
  gifImg.src =gifs;
  gifImg.style.display="initial";
  setTimeout(()=> gifImg.style.display="none", 
  3000);
}

function sendMsg() {
  //checking the connection is established and ready to transmit message
  if (conn && conn.open) {
      mySendMsg.Msg = msgInput.value + ". And " +
      compliments.text[Math.floor(Math.random() * compliments.text.length)] + ". " + compliments.emoji[Math.floor(Math.random() * compliments.emoji.length)] + "<br />";
      chat.innerHTML += "<b>" + mySendMsg.Name + "   </b>" + mySendMsg.Msg ;
      // +"<img src="+gifs+">" +"<br />"
      // const x = (x, y) => { return x * y };
      //Get gif and Send the message with gif
      getGif();
    
    
   
    audioApplause1.play();

    console.log("msg sent!");
    msgInput.value = ""; //empty input
  } else {
    console.log("not connected");
  }

  autoScroll = document.getElementById('chat');
  autoScroll.scrollTop = autoScroll.scrollHeight;
}

function changePage() {
  loginPage[0].style.display = "none";
  chatPage[0].style.display = "initial";
}
