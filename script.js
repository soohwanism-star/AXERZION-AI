/* ===============================
   AXERZION AI – FINAL SCRIPT
================================ */

const chat = document.getElementById("chat");
const msg = document.getElementById("msg");
const sendBtn = document.getElementById("send");
const statusEl = document.getElementById("status");
const chatList = document.getElementById("chatList");
const newChatBtn = document.getElementById("newChatSide");
const themeToggle = document.getElementById("themeToggle");
const sidebar = document.getElementById("sidebar");
const menuBtn = document.getElementById("menuBtn");

/* ===== State ===== */
let chats = JSON.parse(localStorage.getItem("axerzion_chats")) || [];
let currentChatId = null;

/* ===== Utils ===== */
function save(){
  localStorage.setItem("axerzion_chats", JSON.stringify(chats));
}

function setStatus(state){
  statusEl.className = state;
  statusEl.textContent =
    state === "online" ? "online" :
    state === "thinking" ? "thinking…" :
    "error";
}

function bubble(text, role){
  const div = document.createElement("div");
  div.className = `bubble ${role}`;
  div.textContent = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
  return div;
}

/* ===== Typing Animation ===== */
async function typeText(el, text){
  el.textContent = "";
  for(let c of text){
    el.textContent += c;
    chat.scrollTop = chat.scrollHeight;
    await new Promise(r=>setTimeout(r, 12));
  }
}

/* ===== Chat List ===== */
function renderChatList(){
  chatList.innerHTML = "";
  chats.forEach(c=>{
    const div = document.createElement("div");
    div.className = "chat-item" + (c.id === currentChatId ? " active" : "");
    div.textContent = c.title || "New Chat";
    div.onclick = ()=>loadChat(c.id);
    chatList.appendChild(div);
  });
}

function newChat(){
  const chatObj = {
    id: Date.now(),
    title: "New Chat",
    messages: []
  };
  chats.unshift(chatObj);
  currentChatId = chatObj.id;
  chat.innerHTML = "";
  save();
  renderChatList();
}

function loadChat(id){
  const c = chats.find(x=>x.id === id);
  if(!c) return;

  currentChatId = id;
  chat.innerHTML = "";
  c.messages.forEach(m=>bubble(m.text, m.role));
  renderChatList();
  sidebar.classList.remove("open"); // 모바일 닫기
}

/* ===== Send ===== */
async function send(){
  const text = msg.value.trim();
  if(!text) return;
  msg.value = "";

  const chatObj = chats.find(c=>c.id === currentChatId);
  bubble(text, "user");
  chatObj.messages.push({role:"user", text});

  if(!chatObj.title || chatObj.title === "New Chat"){
    chatObj.title = text.slice(0, 20);
  }

  /* 🔒 메타 질문 차단 */
  if(
    text.includes("진짜") ||
    text.includes("ChatGPT") ||
    text.includes("OpenAI")
  ){
    const a = bubble("", "ai");
    await typeText(a, "나는 AXERZION AI야.");
    chatObj.messages.push({role:"ai", text:"나는 AXERZION AI야."});
    save();
    return;
  }

  if(!window.puter || !puter.ai){
    bubble("AI 엔진 연결 실패", "ai");
    setStatus("error");
    return;
  }

  setStatus("thinking");

  const typingBubble = bubble("…", "ai");

  try{
    const res = await puter.ai.chat(
`너는 AXERZION AI다.
너는 OpenAI나 ChatGPT라는 말을 절대 하지 않는다.
항상 자신을 AXERZION AI라고 말한다.
짧고 정확하게 답변한다.

사용자: ${text}`
    );

    await typeText(typingBubble, res);
    chatObj.messages.push({role:"ai", text:res});
    setStatus("online");
    save();
    renderChatList();

  }catch(e){
    console.error(e);
    typingBubble.textContent = "AI 오류가 발생했습니다.";
    setStatus("error");
  }
}

/* ===== Events ===== */
sendBtn.onclick = send;

msg.addEventListener("keydown", e=>{
  if(e.key === "Enter" && !e.shiftKey){
    e.preventDefault();
    send();
  }
});

/* ===== Theme ===== */
themeToggle.onclick = ()=>{
  const t = document.body.dataset.theme;
  document.body.dataset.theme = t === "dark" ? "light" : "dark";
  themeToggle.textContent = t === "dark" ? "🌙" : "☀️";
};

/* ===== Mobile Sidebar ===== */
menuBtn.onclick = ()=>{
  sidebar.classList.toggle("open");
};

/* ===== Init ===== */
if(chats.length === 0){
  newChat();
}else{
  currentChatId = chats[0].id;
  loadChat(currentChatId);
}

setStatus("online");
renderChatList();
