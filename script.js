const chat = document.getElementById("chat");
const msg = document.getElementById("msg");
const sendBtn = document.getElementById("send");
const chatList = document.getElementById("chatList");
const newChatBtn = document.getElementById("newChat");
const menuBtn = document.getElementById("menuBtn");
const sidebar = document.querySelector(".sidebar");
const themeBtn = document.getElementById("themeBtn");

let chats = [];
let current = null;

/* UI */
menuBtn.onclick = ()=> sidebar.classList.toggle("open");
themeBtn.onclick = ()=>{
  document.body.classList.toggle("light");
};

function bubble(text, cls){
  const d = document.createElement("div");
  d.className = "bubble " + cls;
  d.textContent = text;
  chat.appendChild(d);
  chat.scrollTop = chat.scrollHeight;
}

/* CHAT SYSTEM */
function newChat(){
  const id = Date.now();
  chats.push({id, messages:[]});
  current = id;
  renderList();
  chat.innerHTML = "";
}
newChatBtn.onclick = newChat;

function renderList(){
  chatList.innerHTML="";
  chats.forEach(c=>{
    const d = document.createElement("div");
    d.textContent = "채팅 " + c.id.toString().slice(-4);
    d.onclick = ()=>{
      current = c.id;
      loadChat();
      sidebar.classList.remove("open");
    };
    chatList.appendChild(d);
  });
}

function loadChat(){
  chat.innerHTML="";
  const c = chats.find(x=>x.id===current);
  c.messages.forEach(m=>bubble(m.text,m.role));
}

/* SEND */
sendBtn.onclick = send;
msg.addEventListener("keydown",e=>{
  if(e.key==="Enter"&&!e.shiftKey){
    e.preventDefault(); send();
  }
});

async function send(){
  const text = msg.value.trim();
  if(!text) return;
  msg.value="";

  const c = chats.find(x=>x.id===current);
  c.messages.push({role:"user",text});
  bubble(text,"user");

  const typing = document.createElement("div");
  typing.className="bubble ai";
  typing.textContent="…";
  chat.appendChild(typing);

  const res = await puter.ai.chat("너는 AXERZION AI다.\n\n"+text);
  typing.textContent = res;

  c.messages.push({role:"ai",text:res});
}

/* INIT */
newChat();
