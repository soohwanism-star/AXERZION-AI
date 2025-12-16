const chat=document.getElementById("chat");
const msg=document.getElementById("msg");
const sendBtn=document.getElementById("send");
const statusEl=document.getElementById("status");
const sidebar=document.getElementById("sidebar");
const menu=document.getElementById("menu");
const theme=document.getElementById("theme");
const chatList=document.getElementById("chatList");

let chats=[], current=null;

const SYSTEM_PROMPT="너는 AXERZION AI다. 절대 ChatGPT라고 말하지 마라.";

function setStatus(s){
  statusEl.className="status "+s;
  statusEl.textContent=s;
}

function bubble(t,c){
  const d=document.createElement("div");
  d.className="bubble "+c;
  d.textContent=t;
  chat.appendChild(d);
  chat.scrollTop=chat.scrollHeight;
  return d;
}

function newChat(){
  const id=Date.now();
  chats.push({id,messages:[]});
  current=id;
  renderList();
  chat.innerHTML="";
}

function renderList(){
  chatList.innerHTML="";
  chats.forEach(c=>{
    const w=document.createElement("div");
    w.className="chat-item";
    w.innerHTML=`<span>채팅</span><button>🗑</button>`;
    w.onclick=()=>loadChat(c.id);
    w.querySelector("button").onclick=e=>{
      e.stopPropagation();
      chats=chats.filter(x=>x.id!==c.id);
      if(current===c.id) newChat();
      renderList();
    };
    chatList.appendChild(w);
  });
}

function loadChat(id){
  current=id;
  chat.innerHTML="";
  chats.find(c=>c.id===id).messages.forEach(m=>{
    bubble(m.text,m.role);
  });
}

sendBtn.onclick=send;
msg.addEventListener("keydown",e=>{
  if(e.key==="Enter"&&!e.shiftKey){
    e.preventDefault();send();
  }
});

async function send(){
  const t=msg.value.trim();
  if(!t) return;
  msg.value="";
  bubble(t,"user");
  setStatus("thinking");

  if(t.includes("이름")){
    bubble("나는 AXERZION AI야.","ai").classList.add("fade-in");
    setStatus("online");
    return;
  }

  const typing=bubble("…","ai");
  try{
    const r=await puter.ai.chat(SYSTEM_PROMPT+"\n"+t);
    typing.textContent=r;
    typing.classList.add("fade-in");
    setStatus("online");
  }catch{
    typing.textContent="AI 오류가 발생했습니다.";
    setStatus("error");
  }
}

menu.onclick=()=>sidebar.classList.toggle("open");
theme.onclick=()=>{
  document.body.classList.toggle("light");
  theme.textContent=document.body.classList.contains("light")?"🌞":"🌙";
};

newChat();
