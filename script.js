:root{
  --bg:#0d0d0d;
  --panel:#1a1a1a;
  --border:#2a2a2a;
  --user:#2b2b2b;
  --ai:#171717;
  --text:#eaeaea;
}

.light{
  --bg:#f7f7f7;
  --panel:#ffffff;
  --border:#ddd;
  --user:#e5e5e5;
  --ai:#f1f1f1;
  --text:#111;
}

*{
  box-sizing:border-box;
  font-family:system-ui, sans-serif;
}

body{
  margin:0;
  background:var(--bg);
  color:var(--text);
  height:100dvh;
  display:flex;
}

/* SIDEBAR */
.sidebar{
  width:260px;
  background:var(--panel);
  border-right:1px solid var(--border);
  padding:12px;
}

.side-top button{
  width:100%;
  padding:10px;
  border-radius:10px;
  border:1px solid var(--border);
  background:none;
  color:var(--text);
  cursor:pointer;
}

#chatList div{
  margin-top:10px;
  padding:10px;
  border-radius:10px;
  cursor:pointer;
  background:var(--bg);
}

/* MAIN */
.main{
  flex:1;
  display:flex;
  flex-direction:column;
}

.top{
  height:56px;
  display:flex;
  align-items:center;
  gap:10px;
  padding:0 12px;
  border-bottom:1px solid var(--border);
}

.menu-btn,.theme-btn{
  background:none;
  border:none;
  color:var(--text);
  font-size:20px;
  cursor:pointer;
}

.logo{
  display:flex;
  align-items:center;
  gap:8px;
  font-weight:600;
}

.logo img{
  width:24px;
  filter:invert(1);
}

.light .logo img{
  filter:invert(0);
}

#chat{
  flex:1;
  padding:20px;
  overflow-y:auto;
  display:flex;
  flex-direction:column;
  gap:12px;
}

.bubble{
  max-width:75%;
  padding:12px 16px;
  border-radius:18px;
  animation:fade .2s ease;
}

.user{
  align-self:flex-end;
  background:var(--user);
}

.ai{
  align-self:flex-start;
  background:var(--ai);
  border:1px solid var(--border);
}

@keyframes fade{
  from{opacity:0;transform:translateY(4px)}
  to{opacity:1}
}

/* INPUT */
.input-wrap{
  display:flex;
  gap:10px;
  padding:12px;
  border-top:1px solid var(--border);
  background:var(--panel);
}

textarea{
  flex:1;
  resize:none;
  border:none;
  outline:none;
  padding:12px 14px;
  border-radius:20px;
  background:var(--bg);
  color:var(--text);
}

button#send{
  width:42px;
  height:42px;
  border-radius:50%;
  border:none;
  background:var(--text);
  color:var(--bg);
  cursor:pointer;
}

/* MOBILE */
@media(max-width:900px){
  .sidebar{
    position:fixed;
    left:0;
    top:0;
    height:100%;
    transform:translateX(-100%);
    transition:.25s;
    z-index:10;
  }
  .sidebar.open{transform:translateX(0);}
}
