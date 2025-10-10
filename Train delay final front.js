/* Canvas: neon particles + rain + parallax */
const c = document.getElementById('bg');
const ctx = c.getContext('2d');
let W, H, DPR = Math.max(1, window.devicePixelRatio || 1);
function resize(){ W = c.width = window.innerWidth * DPR; H = c.height = window.innerHeight * DPR; c.style.width = window.innerWidth + 'px'; c.style.height = window.innerHeight + 'px'; ctx.scale(DPR,DPR); }
resize(); window.addEventListener('resize', ()=>{ ctx.setTransform(1,0,0,1,0,0); resize(); });

/* particles for neon city glow */
const NP = 60;
let particles = [];
for(let i=0;i<NP;i++){
    particles.push({
        x: Math.random()*window.innerWidth,
        y: Math.random()*window.innerHeight,
        r: Math.random()*2.5+0.6,
        sx: (Math.random()-0.5)*0.2,
        sy: (Math.random()*0.6+0.2),
        color: Math.random()>0.5? 'rgba(111,241,255,'+(0.06+Math.random()*0.35)+')' : 'rgba(160,75,255,'+(0.06+Math.random()*0.35)+')'
    });
}

/* rain drops */
const DROPS = 260;
let drops = [];
for(let i=0;i<DROPS;i++){
    drops.push({
        x: Math.random()*window.innerWidth,
        y: Math.random()*window.innerHeight,
        len: Math.random()*20+8,
        speed: Math.random()*5+6,
        alpha: 0.06 + Math.random()*0.12,
        wob: Math.random()*0.6
    });
}

/* mouse parallax */
let mx=0,my=0;
window.addEventListener('mousemove', e=>{ mx = (e.clientX - window.innerWidth/2)/window.innerWidth; my = (e.clientY - window.innerHeight/2)/window.innerHeight; });

function draw(){
    ctx.clearRect(0,0,window.innerWidth,window.innerHeight);

    // subtle vignette
    let g = ctx.createLinearGradient(0,0,0,window.innerHeight);
    g.addColorStop(0,'rgba(6,6,10,0.0)');
    g.addColorStop(1,'rgba(0,0,0,0.45)');
    ctx.fillStyle = g; ctx.fillRect(0,0,window.innerWidth,window.innerHeight);

    // city neon glow blobs (big soft circles)
    for(let i=0;i<8;i++){
        ctx.beginPath();
        let gx = (i%2===0? window.innerWidth*0.14: window.innerWidth*0.86) + Math.sin(Date.now()/4000 + i)*60* (i%2? -1:1);
        let gy = window.innerHeight* (0.18 + (i*0.07));
        let rad = 260 + i*60;
        let col = (i%3===0)? 'rgba(111,241,255,0.06)': (i%3===1)? 'rgba(160,75,255,0.06)': 'rgba(255,139,75,0.05)';
        ctx.fillStyle = col;
        ctx.filter = 'blur(40px)';
        ctx.arc(gx,gy,rad,0,Math.PI*2);
        ctx.fill();
        ctx.beginPath(); ctx.filter='none';
    }

    // neon particles
    for(let p of particles){
        p.x += p.sx + mx*8;
        p.y += p.sy + my*6;
        if(p.x< -50) p.x = window.innerWidth+50;
        if(p.x>window.innerWidth+50) p.x = -50;
        if(p.y>window.innerHeight+50) p.y = -50;
        ctx.beginPath();
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 18;
        ctx.shadowColor = p.color;
        ctx.globalAlpha = 1;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
        ctx.fill();
        ctx.shadowBlur = 0;
    }

    // rain
    ctx.lineWidth = 1;
    for(let d of drops){
        d.x += Math.sin(Date.now()/600 + d.wob) * 0.6;
        d.y += d.speed;
        if(d.y > window.innerHeight + 20){ d.y = -30; d.x = Math.random()*window.innerWidth; }
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(200,220,255,'+d.alpha+')';
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - d.len*0.5, d.y + d.len);
        ctx.stroke();

        // ripple hit near bottom (soft)
        let hitY = window.innerHeight - 40;
        if(d.y > hitY){
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(200,220,255,'+ (0.01 + Math.random()*0.02) +')';
            ctx.arc(d.x, hitY+6, (d.y-hitY)/6, 0, Math.PI*2);
            ctx.stroke();
        }
    }

    requestAnimationFrame(draw);
}
draw();