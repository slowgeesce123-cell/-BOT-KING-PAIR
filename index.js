const express = require('express');
const { default: makeWASocket, useMultiFileAuthState, delay, makeCacheableSignalKeyStore } = require('@whiskeysockets/baileys');
const pino = require('pino');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
<title>BOT KING - Pair Site 👑</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
body{background:#000;color:#fff;font-family:Arial;text-align:center;padding:20px}
h1{color:gold;font-size:35px}
input{padding:15px;width:80%;max-width:300px;border-radius:10px;border:none;margin:10px;font-size:18px}
button{padding:15px 30px;background:gold;color:#000;border:none;border-radius:10px;font-weight:bold;font-size:18px;cursor:pointer}
.box{border:2px solid gold;padding:20px;border-radius:20px;max-width:400px;margin:20px auto;background:#111}
code{font-size:25px;color:gold;letter-spacing:5px;background:#222;padding:10px;border-radius:10px;display:block;margin:15px 0}
</style>
</head>
<body>
<h1>👑 BOT KING 👑</h1>
<h3>SLOW-GEE-SCE GHOST BOT KING</h3>
<div class="box">
<p>Weka Namba Yako Ya WhatsApp</p>
<p style="font-size:12px;color:#888">Mfano: 254791536079</p>
<input type="text" id="num" placeholder="2547xxxxxxxx">
<br>
<button onclick="pair()">PATA CODE YA BOT KING</button>
<div id="result"></div>
</div>
<p style="margin-top:30px;color:gold">Plugins: 744 | Version 1.8.9</p>
<p style="font-size:11px;color:#555">BOT KING - King of all bots</p>
<script>
async function pair(){
  const n=document.getElementById('num').value;
  if(!n){alert('Weka namba!');return;}
  document.getElementById('result').innerHTML='<p style="color:gold">Tafadhali subiri... Inatengeneza code...</p>';
  const res=await fetch('/code?number='+n);
  const data=await res.json();
  if(data.code){
    document.getElementById('result').innerHTML='<p>CODE YAKO YA BOT KING:</p><code>'+data.code+'</code><p style="font-size:12px">Nenda WhatsApp > Linked Devices > Link with phone number > Weka hii code</p><p style="font-size:11px;color:gold">Code ita-expire in 60 seconds!</p>';
  }else{
    document.getElementById('result').innerHTML='<p style="color:red">'+(data.error||'Error')+'</p>';
  }
}
</script>
</body>
</html>
  `);
});

app.get('/code', async (req, res) => {
  let num = req.query.number?.replace(/[^0-9]/g,'');
  if(!num) return res.json({error:'Weka namba'});
  
  const dir = './auth_'+num;
  if(fs.existsSync(dir)) fs.rmSync(dir,{recursive:true,force:true});
  fs.mkdirSync(dir);
  
  try{
    const { state, saveCreds } = await useMultiFileAuthState(dir);
    const sock = makeWASocket({
      auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({level:'silent'})) },
      printQRInTerminal: false,
      logger: pino({level:'silent'}),
      browser: ['BOT KING','Chrome','1.8.9']
    });
    sock.ev.on('creds.update', saveCreds);
    
    if(!sock.authState.creds.registered){
      await delay(1500);
      let code = await sock.requestPairingCode(num);
      code = code?.match(/.{1,4}/g)?.join('-') || code;
      res.json({code: code});
      await delay(60000);
      try{ fs.rmSync(dir,{recursive:true,force:true}); }catch{}
    }else{
      res.json({error:'Namba imeshalink'});
    }
  }catch(e){
    res.json({error:e.message});
    try{ fs.rmSync(dir,{recursive:true,force:true}); }catch{}
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>console.log('BOT KING PAIR SITE LIVE ON '+PORT));
