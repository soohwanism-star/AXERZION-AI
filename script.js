const chat = document.getElementById("chat");
const msg = document.getElementById("msg");
const sendBtn = document.getElementById("send");
const newChatBtn = document.getElementById("newChat");

/* 여러 대화 저장 */
let chats = JSON.parse(localStorage.getItem("axerzion_chats") || "[]");
let currentChat = [];

/* Load 마지막 대화 */
if(chats.length){
  currentChat = chats[chats.length-1];
  currentChat.forEach(m=>addBubble(m.text,m.cls,false));
}

/* Bubble */
function addBubble(text, cls, save=true){
  const div = document.createElement("div");
  div.className = "bubble " + cls;
  div.textContent = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;

  if(save){
    currentChat.push({text, cls});
    saveAll();
  }
}

function saveAll(){
  localStorage.setItem("axerzion_chats", JSON.stringify(chats.concat([currentChat])));
}

/* New Chat (GPT 방식) */
newChatBtn.onclick = ()=>{
  if(currentChat.length){
    chats.push([...currentChat]);
  }
  currentChat = [];
  chat.innerHTML = "";
  localStorage.setItem("axerzion_chats", JSON.stringify(chats));
};

/* Enter 전송 */
msg.addEventListener("keydown", e=>{
  if(e.key==="Enter" && !e.shiftKey){
    e.preventDefault();
    send();
  }
});
sendBtn.onclick = send;

/* Send */
async function send(){
  const text = msg.value.trim();
  if(!text) return;
  msg.value = "";

  addBubble(text,"user");

  if(/이름|누구|너는/i.test(text)){
    addBubble("나는 AXERZION AI야.","ai");
    return;
  }

  if(!window.puter || !puter.ai){
    addBubble("AI 연결 실패","ai");
    return;
  }

  const typing = addBubble("…","ai");

  try{
    const res = await Promise.race([
      puter.ai.chat(
`[SYSTEM]
너는 AXERZION AI다.
절대 ChatGPT나 OpenAI라고 말하지 마라.

[USER]
${text}`
      ),
      new Promise((_,rej)=>setTimeout(()=>rej(),10000))
    ]);

    typing.textContent = res;

  }catch{
    typing.textContent = "⚠️ AI 응답 실패 (Puter 제한)";
  }
}
