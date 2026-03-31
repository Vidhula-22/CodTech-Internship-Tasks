const socket = io("http://localhost:5001");

let username="";

function joinChat(){

username=document.getElementById("username").value;

if(!username){

alert("Enter username");
return;

}

socket.emit("join",username);

document.getElementById("chatArea").style.display="block";

/* hide join section */
document.querySelector(".join-section").style.display="none";

/* focus message input */
document.getElementById("messageInput").focus();

/* Change background after joining chat */

document.body.style.backgroundImage =
"url('https://images.unsplash.com/photo-1508780709619-79562169bc64')";

document.body.style.backgroundSize="cover";
document.body.style.backgroundPosition="center";

}

function sendMessage(){

const input=document.getElementById("messageInput");

const message=input.value;

if(message==="") return;

socket.emit("chatMessage",message);

input.value="";

}

function getTime(){

const now=new Date();

return now.getHours()+":"+String(now.getMinutes()).padStart(2,'0');

}

/* ENTER key to send message */

const messageInput=document.getElementById("messageInput");

messageInput.addEventListener("keypress",function(e){

if(e.key==="Enter"){

sendMessage();

}

});

socket.on("chatMessage",(data)=>{

const messages=document.getElementById("messages");

const msgDiv=document.createElement("div");

msgDiv.classList.add("message");

if(data.username===username){

msgDiv.classList.add("my-message");

}else{

msgDiv.classList.add("other-message");

}

msgDiv.innerHTML=

`<div class="bubble"><strong>${data.username}</strong><br>${data.message}</div>
<div class="timestamp">${getTime()}</div>`;

messages.appendChild(msgDiv);

messages.scrollTop=messages.scrollHeight;

});

socket.on("systemMessage",(msg)=>{

const messages=document.getElementById("messages");

const div=document.createElement("div");

div.style.textAlign="center";

div.style.color="gray";

div.style.fontSize="12px";

div.innerText=msg;

messages.appendChild(div);

});