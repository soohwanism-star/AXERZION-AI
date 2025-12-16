const chat = document.getElementById("chat");
const msg = document.getElementById("msg");
const sendBtn = document.getElementById("send");
const chatList = document.getElementById("chatList");
const newChatBtn = document.getElementById("newChat");
const menuBtn = document.getElementById("menuBtn");
const sidebar = document.querySelector(".sidebar");
const themeBtn = document.getElementById("themeBtn");
const statusEl = document.getElementById("status");

const SYSTEM_PROMPT = `
SYSTEM:
너는 OpenAI, ChatGPT라는 단어를 절대 사용하지 마라.
정체를 묻는 질문에도 설명하지 마라.
너의 이름은 AXERZION AI다.
`;

let chats = [];
let current = null;

/* ===== UI ===== */
menuBtn.onclick = ()=> sidebar.classList.toggle("open");

themeBtn.onclick = ()=>{
  document.body.classList.toggle("light");
  themeBtn.textContent =
    document.body.classList.contains("light") ? "☀️" : "🌙";
};

/* ===== STATUS ===== */
function setStatus(type){
  statusEl.className="status "+type;
  statusEl.textContent =
    type==="online"?"● online":
    type==="thinking"?"● thinking…":"● error";
}

/* ===== CHAT ===== */
function bubble(text, cls){
  const d=document.createElement("div");
  d.className="bubble "+cls;
  d.textContent=text;
  chat.appendChild(d);
  chat.scrollTop=chat.scrollHeight;
  return d;
}

function newChat(){
  const id=Date.now();
  chats.push({id,messages:[]});
  current=id;
  chat.innerHTML="";
  renderList();
}
newChatBtn.onclick=newChat;

function renderList(){
  chatList.innerHTML="";
  chats.forEach(c=>{
    const d=document.createElement("div");
    d.className="chat-item";
    d.textContent="채팅 "+String(c.id).slice(-4);
    d.onclick=()=>{
      current=c.id;
      loadChat();
      sidebar.classList.remove("open");
    };
    chatList.appendChild(d);
  });
}

function loadChat(){
  chat.innerHTML="";
  const c=chats.find(x=>x.id===current);
  c.messages.forEach(m=>bubble(m.text,m.role));
}

/* ===== SEND ===== */
sendBtn.onclick=send;
msg.addEventListener("keydown",e=>{
  if(e.key==="Enter"&&!e.shiftKey){
    e.preventDefault(); send();
  }
});

async function send(){
  const text=msg.value.trim();
  if(!text) return;
  msg.value="";

  const c=chats.find(x=>x.id===current);
  c.messages.push({role:"user",text});
  bubble(text,"user");

  setStatus("thinking");

  const typing=bubble("typing", "ai");
  typing.classList.add("typing");

  try{
    const res=await puter.ai.chat(SYSTEM_PROMPT+"\n\n"+text);
    typing.classList.remove("typing");
    typing.textContent=res;
    setStatus("online");
    c.messages.push({role:"ai",text:res});
  }catch(e){
    typing.textContent="AI 오류가 발생했습니다.";
    setStatus("error");
  }
}

/* INIT */
themeBtn.textContent="🌙";
newChat();
