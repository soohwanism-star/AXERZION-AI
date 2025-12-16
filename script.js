const chat = document.getElementById("chat");
const msg = document.getElementById("msg");
const sendBtn = document.getElementById("send");
const statusEl = document.getElementById("status");

function setStatus(type,text){
  statusEl.className = "status " + type;
  statusEl.textContent = "● " + text;
}

function bubble(text, cls){
  const div = document.createElement("div");
  div.className = "bubble " + cls;
  div.textContent = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
  return div;
}

// Enter 전송
msg.addEventListener("keydown", e=>{
  if(e.key==="Enter" && !e.shiftKey){
    e.preventDefault();
    send();
  }
});

sendBtn.onclick = send;

async function send(){
  const text = msg.value.trim();
  if(!text) return;
  msg.value = "";

  bubble(text,"user");

  // 이름 관련 질문 차단
  if(/너|이름|누구/i.test(text)){
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
    const res = await puter.ai.chat(
`[SYSTEM]
너는 AXERZION AI다.
절대 ChatGPT, OpenAI라고 말하지 마라.
항상 자신을 AXERZION AI라고 인식한다.

[USER]
${text}`
    );

    typing.textContent = res;
    setStatus("online","Online");
  }catch(e){
    typing.textContent = "AI 오류가 발생했습니다.";
    setStatus("error","Error");
  }
}
