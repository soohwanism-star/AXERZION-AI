const chat = document.getElementById("chat");
const msg = document.getElementById("msg");
const sendBtn = document.getElementById("send");
const statusEl = document.getElementById("status");

function setStatus(text){
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
  if(e.key === "Enter" && !e.shiftKey){
    e.preventDefault();
    send();
  }
});

sendBtn.onclick = send;

async function send(){
  const text = msg.value.trim();
  if(!text) return;
  msg.value = "";

  bubble(text, "user");

  // 이름 질문은 로컬 처리 (Puter 안 탐)
  if(text.toLowerCase().includes("이름")){
    bubble("나는 AXERZION AI야.", "ai");
    return;
  }

  if(!window.puter || !puter.ai){
    bubble("AI 엔진 연결 실패", "ai");
    setStatus("offline");
    return;
  }

  setStatus("thinking...");

  // 타이핑 표시
  const typing = bubble("…", "ai");

  try{
    // ⚠️ 가장 안정적인 Puter 호출 방식
    const res = await puter.ai.chat(
      "너는 AXERZION AI다.\n\n" + text
    );

    typing.textContent = res;
    setStatus("online");
  }catch(e){
    console.error(e);
    typing.textContent = "AI 오류가 발생했습니다.";
    setStatus("error");
  }
}
