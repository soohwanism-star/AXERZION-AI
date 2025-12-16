const chat = document.getElementById("chat");
const msg = document.getElementById("msg");
const sendBtn = document.getElementById("send");
const statusEl = document.getElementById("status");
const toggle = document.getElementById("themeToggle");

/* ---------- Status ---------- */
function setStatus(type,text){
  statusEl.className = "status " + type;
  statusEl.textContent = "● " + text;
}

/* ---------- Chat ---------- */
function bubble(text, cls){
  const div = document.createElement("div");
  div.className = "bubble " + cls;
  div.textContent = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
  saveChat();
  return div;
}

/* ---------- Save ---------- */
function saveChat(){
  localStorage.setItem("axerzion_chat", chat.innerHTML);
}
function loadChat(){
  const saved = localStorage.getItem("axerzion_chat");
  if(saved) chat.innerHTML = saved;
}
loadChat();

/* ---------- Input ---------- */
msg.addEventListener("keydown", e=>{
  if(e.key==="Enter" && !e.shiftKey){
    e.preventDefault();
    send();
  }
});
sendBtn.onclick = send;

/* ---------- Theme ---------- */
toggle.onclick = ()=>{
  document.body.classList.toggle("light");
  toggle.textContent =
    document.body.classList.contains("light") ? "☀️" : "🌙";
};

/* ---------- Send ---------- */
async function send(){
  const text = msg.value.trim();
  if(!text) return;
  msg.value = "";

  bubble(text,"user");

  if(/이름|누구|너는/i.test(text)){
    bubble("나는 AXERZION AI야.","ai");
    return;
  }

  if(!window.puter || !puter.ai){
    bubble("AI 연결 실패","ai");
    setStatus("error","Error");
    return;
  }

  setStatus("thinking","Thinking");
  const typing = bubble("…","ai");

  try{
    const res = await Promise.race([
      puter.ai.chat(
`[SYSTEM]
너는 AXERZION AI다.
절대 ChatGPT, OpenAI라고 말하지 마라.

[USER]
${text}`
      ),
      new Promise((_, reject)=>
        setTimeout(()=>reject("timeout"),10000)
      )
    ]);

    typing.textContent = res;
    setStatus("online","Online");

  }catch(e){
    typing.textContent = "⚠️ AI 응답 실패 (Puter 제한)";
    setStatus("error","Error");
  }
}
