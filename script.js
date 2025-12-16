const chat = document.getElementById("chat");
const msg = document.getElementById("msg");
const sendBtn = document.getElementById("send");
const statusEl = document.getElementById("status");
const themeBtn = document.getElementById("themeToggle");
const newChatBtn = document.getElementById("newChat");

let identityLocked = false;

/* Status */
function setStatus(text, cls){
  statusEl.textContent = text;
  statusEl.className = cls;
}

/* Bubble */
function bubble(text, cls){
  const div = document.createElement("div");
  div.className = "bubble " + cls;
  div.textContent = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
  return div;
}

/* Typing */
function typingBubble(){
  const div = document.createElement("div");
  div.className = "bubble ai";
  div.innerHTML = `
    <div class="typing">
      <span></span><span></span><span></span>
    </div>
  `;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
  return div;
}

/* Auto resize */
msg.addEventListener("input", ()=>{
  msg.style.height="auto";
  msg.style.height=msg.scrollHeight+"px";
});

/* Enter send */
msg.addEventListener("keydown", e=>{
  if(e.key==="Enter" && !e.shiftKey){
    e.preventDefault();
    send();
  }
});

sendBtn.onclick = send;

/* Theme toggle */
themeBtn.onclick = ()=>{
  const theme = document.body.dataset.theme;
  document.body.dataset.theme = theme==="dark" ? "light" : "dark";
  themeBtn.textContent = theme==="dark" ? "🌙" : "☀️";
};

/* New chat */
function resetChat(){
  chat.innerHTML = "";
  identityLocked = false;
  setStatus("online","online");
  bubble("새 대화를 시작했어.","ai");
}
newChatBtn.onclick = resetChat;

/* Send */
async function send(){
  const text = msg.value.trim();
  if(!text) return;

  msg.value="";
  msg.style.height="auto";

  bubble(text,"user");

  const q = text.toLowerCase();

  if(q.includes("이름") || q.includes("누구")){
    bubble("나는 AXERZION AI야.","ai");
    identityLocked = true;
    return;
  }

  if(identityLocked && (q==="진짜?" || q==="맞아?")){
    bubble("응. 나는 AXERZION AI야.","ai");
    return;
  }

  if(!window.puter){
    bubble("AI 연결 실패","ai");
    setStatus("error","error");
    return;
  }

  setStatus("thinking","thinking");
  const typing = typingBubble();

  try{
    const res = await puter.ai.chat(
      "너는 AXERZION AI다.\n\n" + text
    );
    typing.textContent = res;
    setStatus("online","online");
  }catch{
    typing.textContent = "오류가 발생했습니다.";
    setStatus("error","error");
  }
}
