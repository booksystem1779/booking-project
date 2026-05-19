import { useState, useEffect, useCallback } from "react";

const API = "https://booking-server-976t.onrender.com/api";

async function api(path, opts = {}) {
  const token = localStorage.getItem("token");
  const res = await fetch(API + path, {
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    ...opts,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  if (!res.ok) { const e = await res.json().catch(()=>({})); throw new Error(e.error || res.statusText); }
  return res.json();
}

// ── THEMES ────────────────────────────────────────────────────
const THEMES = {
  dark: {
    bg:        "linear-gradient(160deg,#0A0A14 0%,#12122A 50%,#0E1A30 100%)",
    shell:     "rgba(10,10,22,0.97)",
    surface:   "rgba(255,255,255,0.04)",
    surface2:  "rgba(255,255,255,0.08)",
    border:    "rgba(255,255,255,0.08)",
    border2:   "rgba(255,255,255,0.13)",
    text:      "#FFFFFF",
    textSub:   "rgba(255,255,255,0.5)",
    textMuted: "rgba(255,255,255,0.3)",
    navBg:     "rgba(10,10,22,0.98)",
    navBorder: "rgba(255,255,255,0.07)",
    inputBg:   "rgba(255,255,255,0.07)",
    inputBorder:"rgba(255,255,255,0.1)",
    inputText: "#fff",
    cardBg:    "rgba(255,255,255,0.04)",
    accent:    "#7C3AED",
    accentBg:  "rgba(124,58,237,0.2)",
    accentText:"#A78BFA",
    slotBg:    "rgba(255,255,255,0.05)",
    slotBorder:"rgba(255,255,255,0.09)",
    slotText:  "rgba(255,255,255,0.8)",
    logoutBg:  "rgba(239,68,68,0.08)",
    logoutBorder:"rgba(239,68,68,0.3)",
    orb1: "rgba(124,58,237,0.18)", orb2: "rgba(8,145,178,0.13)",
    shadow: "0 0 80px rgba(124,58,237,0.18)",
    heroGrad: "linear-gradient(135deg,#7C3AED 0%,#2563EB 60%,#0891B2 100%)",
    confirmBadgeBg: { confirmed:"#D1FAE5", pending:"#FEF3C7", cancelled:"#FEE2E2" },
    confirmBadgeC:  { confirmed:"#065F46", pending:"#92400E", cancelled:"#991B1B" },
    toggleIcon: "🌙",
  },
  light: {
    bg:        "linear-gradient(160deg,#EEF2FF 0%,#F5F3FF 50%,#EFF6FF 100%)",
    shell:     "rgba(255,255,255,0.97)",
    surface:   "rgba(0,0,0,0.03)",
    surface2:  "rgba(0,0,0,0.06)",
    border:    "rgba(0,0,0,0.08)",
    border2:   "rgba(0,0,0,0.12)",
    text:      "#111827",
    textSub:   "rgba(17,24,39,0.55)",
    textMuted: "rgba(17,24,39,0.35)",
    navBg:     "rgba(255,255,255,0.98)",
    navBorder: "rgba(0,0,0,0.08)",
    inputBg:   "rgba(0,0,0,0.04)",
    inputBorder:"rgba(0,0,0,0.15)",
    inputText: "#111827",
    cardBg:    "rgba(0,0,0,0.03)",
    accent:    "#7C3AED",
    accentBg:  "rgba(124,58,237,0.1)",
    accentText:"#6D28D9",
    slotBg:    "rgba(0,0,0,0.03)",
    slotBorder:"rgba(0,0,0,0.1)",
    slotText:  "#374151",
    logoutBg:  "rgba(239,68,68,0.06)",
    logoutBorder:"rgba(239,68,68,0.25)",
    orb1: "rgba(124,58,237,0.1)", orb2: "rgba(8,145,178,0.08)",
    shadow: "0 0 80px rgba(124,58,237,0.1)",
    heroGrad: "linear-gradient(135deg,#7C3AED 0%,#2563EB 60%,#0891B2 100%)",
    confirmBadgeBg: { confirmed:"#D1FAE5", pending:"#FEF3C7", cancelled:"#FEE2E2" },
    confirmBadgeC:  { confirmed:"#065F46", pending:"#92400E", cancelled:"#991B1B" },
    toggleIcon: "☀️",
  },
};

// ── TRANSLATIONS ──────────────────────────────────────────────
const T = {
  ar: {
    dir:"rtl", font:"'Cairo', sans-serif",
    appName:"مواعيد", tagline:"احجز موعدك في ثوانٍ",
    login:"تسجيل الدخول", register:"إنشاء حساب",
    email:"البريد الإلكتروني", password:"كلمة المرور",
    name:"الاسم الكامل", phone:"رقم الهاتف",
    haveAccount:"لديك حساب؟", noAccount:"ليس لديك حساب؟",
    welcomeBack:"أهلاً بعودتك", createAccount:"إنشاء حساب جديد",
    bookNow:"احجز الآن", myAppointments:"مواعيدي", profile:"الحساب",
    chooseService:"اختر الخدمة", chooseStaff:"اختر المختص",
    chooseTime:"اختر الوقت", confirmBooking:"تأكيد الحجز",
    services:"الخدمات", confirm:"تأكيد", cancel:"إلغاء",
    back:"رجوع", next:"التالي", mins:"دقيقة",
    bookingConfirmed:"تم تأكيد حجزك!", bookingRef:"رقم الحجز",
    upcomingAppts:"المواعيد القادمة",
    today:"اليوم", tomorrow:"غداً",
    status_confirmed:"مؤكد", status_pending:"معلق", status_cancelled:"ملغي",
    any:"أي موظف", with:"مع", at:"في", ILS:"₪",
    home:"الرئيسية", quickBook:"حجز سريع",
    allServices:"جميع الخدمات", price:"السعر",
    logout:"تسجيل الخروج", errorLogin:"خطأ في البريد أو كلمة المرور",
    noAppts:"لا توجد مواعيد بعد", goBook:"احجز موعدك الأول",
  },
  he: {
    dir:"rtl", font:"'Rubik', sans-serif",
    appName:"תורים", tagline:"קבע תור תוך שניות",
    login:"כניסה", register:"הרשמה",
    email:"אימייל", password:"סיסמה",
    name:"שם מלא", phone:"טלפון",
    haveAccount:"יש לך חשבון?", noAccount:"אין לך חשבון?",
    welcomeBack:"ברוך שובך", createAccount:"יצירת חשבון חדש",
    bookNow:"הזמן עכשיו", myAppointments:"התורים שלי", profile:"פרופיל",
    chooseService:"בחר שירות", chooseStaff:"בחר איש מקצוע",
    chooseTime:"בחר זמן", confirmBooking:"אישור הזמנה",
    services:"שירותים", confirm:"אישור", cancel:"ביטול",
    back:"חזור", next:"הבא", mins:"דק׳",
    bookingConfirmed:"התור אושר!", bookingRef:"מספר הזמנה",
    upcomingAppts:"תורים קרובים",
    today:"היום", tomorrow:"מחר",
    status_confirmed:"מאושר", status_pending:"ממתין", status_cancelled:"בוטל",
    any:"כל איש מקצוע", with:"עם", at:"בשעה", ILS:"₪",
    home:"בית", quickBook:"הזמנה מהירה",
    allServices:"כל השירותים", price:"מחיר",
    logout:"התנתק", errorLogin:"שגיאה באימייל או סיסמה",
    noAppts:"אין תורים עדיין", goBook:"קבע את התור הראשון שלך",
  },
};

const DAYS_AR = ["اليوم","غداً","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"];
const DAYS_HE = ["היום","מחר","שלישי","רביעי","חמישי","שישי","שבת"];

function getDateForOffset(n) {
  const d = new Date(); d.setDate(d.getDate()+n); return d.toISOString().slice(0,10);
}

// ── COMPONENTS ────────────────────────────────────────────────
function Spinner({ th }) {
  return <div style={{ width:22, height:22, border:`2px solid ${th.border2}`, borderTopColor:th.accent, borderRadius:"50%", animation:"spin 0.7s linear infinite", display:"inline-block" }}/>;
}

function Badge({ status, t }) {
  const cfg = {
    confirmed:{ bg:"#D1FAE5", c:"#065F46", label:t.status_confirmed },
    pending:  { bg:"#FEF3C7", c:"#92400E", label:t.status_pending },
    cancelled:{ bg:"#FEE2E2", c:"#991B1B", label:t.status_cancelled },
  }[status]||{};
  return <span style={{ background:cfg.bg, color:cfg.c, fontSize:10, fontWeight:700, padding:"3px 9px", borderRadius:20 }}>{cfg.label}</span>;
}

function PrimaryBtn({ label, onClick, loading, font, th }) {
  return (
    <button onClick={onClick} disabled={loading} style={{
      width:"100%", padding:"13px", borderRadius:14, border:"none",
      background:"linear-gradient(135deg,#7C3AED,#6D28D9)",
      color:"#fff", fontFamily:font, fontSize:15, fontWeight:700,
      cursor:loading?"default":"pointer", opacity:loading?0.75:1,
      boxShadow:"0 4px 20px rgba(124,58,237,0.35)",
      display:"flex", alignItems:"center", justifyContent:"center", gap:8,
    }}>
      {loading && <Spinner th={th}/>}{label}
    </button>
  );
}

function Field({ label, type="text", value, onChange, font, dir, th }) {
  return (
    <div style={{ marginBottom:14 }}>
      <label style={{ color:th.textSub, fontSize:12, fontFamily:font, display:"block", marginBottom:5 }}>{label}</label>
      <input type={type} value={value} onChange={e=>onChange(e.target.value)} style={{
        width:"100%", padding:"12px 14px", borderRadius:12,
        background:th.inputBg, border:`1.5px solid ${th.inputBorder}`,
        color:th.inputText, fontFamily:font, fontSize:14, outline:"none",
        boxSizing:"border-box", direction:dir,
      }}/>
    </div>
  );
}

function BCard({ b, t, lang, onCancel, th }) {
  return (
    <div style={{ background:th.cardBg, border:`1px solid ${th.border}`, borderRadius:14, padding:"12px 14px", marginBottom:10, display:"flex", alignItems:"center", gap:12 }}>
      <div style={{ width:44, height:44, borderRadius:12, background:th.accentBg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>
        {b.service?.icon||"📅"}
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ color:th.text, fontFamily:t.font, fontWeight:600, fontSize:13 }}>
          {lang==="ar"?b.service?.nameAr:b.service?.nameHe}
        </div>
        <div style={{ color:th.textMuted, fontFamily:t.font, fontSize:11, marginTop:2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
          {b.date} · {b.time}{b.staff?.nameHe?` · ${lang==="ar"?b.staff.nameAr:b.staff.nameHe}`:""}
        </div>
      </div>
      <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:5 }}>
        <Badge status={b.status} t={t}/>
        {b.status!=="cancelled"&&onCancel&&(
          <button onClick={()=>onCancel(b.id)} style={{ background:"rgba(239,68,68,0.1)", border:"none", color:"#EF4444", borderRadius:6, padding:"2px 8px", fontSize:10, fontFamily:t.font, cursor:"pointer" }}>{t.cancel}</button>
        )}
      </div>
    </div>
  );
}

function BottomNav({ t, active, onChange, th }) {
  const tabs=[{key:"home",icon:"🏠",label:t.home},{key:"appts",icon:"📅",label:t.myAppointments},{key:"prof",icon:"👤",label:t.profile}];
  return (
    <div style={{ position:"sticky", bottom:0, background:th.navBg, borderTop:`1px solid ${th.navBorder}`, display:"flex", justifyContent:"space-around", padding:"10px 0 14px", zIndex:50, backdropFilter:"blur(20px)" }}>
      {tabs.map(tab=>(
        <button key={tab.key} onClick={()=>onChange(tab.key)} style={{ background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:3, padding:"0 14px" }}>
          <span style={{ fontSize:22 }}>{tab.icon}</span>
          <span style={{ fontFamily:t.font, fontSize:10, fontWeight:600, color:active===tab.key?th.accentText:th.textMuted }}>{tab.label}</span>
          {active===tab.key && <div style={{ width:4, height:4, borderRadius:"50%", background:th.accent }}/>}
        </button>
      ))}
    </div>
  );
}

// ── TOP BAR ───────────────────────────────────────────────────
function TopBar({ lang, setLang, themeMode, toggleTheme, t, th }) {
  return (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 16px 4px" }}>
      <div style={{ display:"flex", gap:5 }}>
        {["ar","he"].map(l=>(
          <button key={l} onClick={()=>setLang(l)} style={{
            padding:"4px 12px", borderRadius:20, border:`1px solid ${lang===l?th.accent:th.border2}`,
            background:lang===l?th.accentBg:"transparent",
            color:lang===l?th.accentText:th.textMuted,
            fontSize:12, fontFamily:t.font, cursor:"pointer", fontWeight:lang===l?700:400,
          }}>{l==="ar"?"عربي":"עברית"}</button>
        ))}
      </div>
      <button onClick={toggleTheme} style={{ background:th.surface2, border:`1px solid ${th.border}`, borderRadius:20, padding:"4px 12px", cursor:"pointer", fontSize:14, display:"flex", alignItems:"center", gap:5 }}>
        <span>{th.toggleIcon}</span>
        <span style={{ color:th.textSub, fontSize:11, fontFamily:t.font }}>{themeMode==="dark"?"Dark":"Light"}</span>
      </button>
    </div>
  );
}

// ── LOGIN ─────────────────────────────────────────────────────
function LoginScreen({ t, th, onLogin, onRegister }) {
  const [email,setEmail]=useState(""); const [pass,setPass]=useState("");
  const [error,setError]=useState(""); const [load,setLoad]=useState(false);
  const submit = async()=>{
    if(!email||!pass) return;
    setError(""); setLoad(true);
    try {
      const data=await api("/auth/login",{method:"POST",body:{email,password:pass}});
      localStorage.setItem("token",data.token); onLogin(data.user);
    } catch(e){ setError(t.errorLogin); }
    setLoad(false);
  };
  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", justifyContent:"center", padding:"32px 28px" }}>
      <div style={{ textAlign:"center", marginBottom:40 }}>
        <div style={{ fontSize:52, marginBottom:8 }}>💈</div>
        <h1 style={{ fontFamily:t.font, color:th.text, fontSize:38, fontWeight:900, margin:0, letterSpacing:-1 }}>{t.appName}</h1>
        <p style={{ color:th.textSub, fontSize:14, marginTop:8, fontFamily:t.font }}>{t.tagline}</p>
      </div>
      <h2 style={{ fontFamily:t.font, color:th.text, fontSize:22, fontWeight:700, margin:"0 0 20px" }}>{t.welcomeBack}</h2>
      <Field label={t.email}    type="email"    value={email} onChange={setEmail} font={t.font} dir={t.dir} th={th}/>
      <Field label={t.password} type="password" value={pass}  onChange={setPass}  font={t.font} dir={t.dir} th={th}/>
      {error && <div style={{ color:"#EF4444", fontSize:13, marginBottom:10, background:"rgba(239,68,68,0.1)", padding:"8px 12px", borderRadius:8, fontFamily:t.font }}>{error}</div>}
      <div style={{ height:4 }}/>
      <PrimaryBtn label={t.login} onClick={submit} loading={load} font={t.font} th={th}/>
      <p style={{ textAlign:"center", color:th.textMuted, fontSize:13, fontFamily:t.font, marginTop:20 }}>
        {t.noAccount}{" "}<span onClick={onRegister} style={{ color:th.accentText, cursor:"pointer", fontWeight:600 }}>{t.register}</span>
      </p>
    </div>
  );
}

// ── REGISTER ──────────────────────────────────────────────────
function RegisterScreen({ t, th, onDone, onBack }) {
  const [form,setForm]=useState({name:"",phone:"",email:"",password:""});
  const [error,setError]=useState(""); const [load,setLoad]=useState(false);
  const submit=async()=>{
    if(!form.name||!form.email||!form.password) return;
    setError(""); setLoad(true);
    try {
      const data=await api("/auth/register",{method:"POST",body:form});
      localStorage.setItem("token",data.token); onDone(data.user);
    } catch(e){ setError(e.message); }
    setLoad(false);
  };
  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", justifyContent:"center", padding:"28px 28px" }}>
      <button onClick={onBack} style={{ background:"none", border:"none", color:th.textMuted, cursor:"pointer", fontFamily:t.font, fontSize:14, marginBottom:18, padding:0, textAlign:"start" }}>← {t.back}</button>
      <h2 style={{ fontFamily:t.font, color:th.text, fontSize:24, fontWeight:800, margin:"0 0 22px" }}>{t.createAccount}</h2>
      <Field label={t.name}     value={form.name}     onChange={v=>setForm(p=>({...p,name:v}))}     font={t.font} dir={t.dir} th={th}/>
      <Field label={t.phone}    type="tel" value={form.phone}    onChange={v=>setForm(p=>({...p,phone:v}))}    font={t.font} dir={t.dir} th={th}/>
      <Field label={t.email}    type="email" value={form.email}  onChange={v=>setForm(p=>({...p,email:v}))}    font={t.font} dir={t.dir} th={th}/>
      <Field label={t.password} type="password" value={form.password} onChange={v=>setForm(p=>({...p,password:v}))} font={t.font} dir={t.dir} th={th}/>
      {error&&<div style={{ color:"#EF4444", fontSize:13, marginBottom:10, background:"rgba(239,68,68,0.1)", padding:"8px 12px", borderRadius:8, fontFamily:t.font }}>{error}</div>}
      <PrimaryBtn label={t.register} onClick={submit} loading={load} font={t.font} th={th}/>
      <p style={{ textAlign:"center", color:th.textMuted, fontSize:13, fontFamily:t.font, marginTop:18 }}>
        {t.haveAccount}{" "}<span onClick={onBack} style={{ color:th.accentText, cursor:"pointer", fontWeight:600 }}>{t.login}</span>
      </p>
    </div>
  );
}

// ── HOME ──────────────────────────────────────────────────────
function HomeScreen({ t, th, user, onBook, navTab, setNavTab }) {
  const lang=t===T.ar?"ar":"he";
  const [services,setServices]=useState([]); const [bookings,setBookings]=useState([]); const [load,setLoad]=useState(true);
  useEffect(()=>{ Promise.all([api("/services"),api("/bookings")]).then(([s,b])=>{ setServices(s); setBookings(b.slice(0,2)); }).finally(()=>setLoad(false)); },[]);
  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column" }}>
      <div style={{ flex:1, overflowY:"auto", padding:"16px 18px 0" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
          <div>
            <p style={{ color:th.textMuted, fontSize:12, margin:0, fontFamily:t.font }}>{t.today}</p>
            <h2 style={{ color:th.text, fontSize:22, fontWeight:800, margin:"3px 0 0", fontFamily:t.font }}>
              {lang==="ar"?"أهلاً 👋":"שלום 👋"} {user?.name?.split(" ")[0]}
            </h2>
          </div>
          <div style={{ width:44, height:44, borderRadius:14, background:"linear-gradient(135deg,#7C3AED,#0891B2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>👤</div>
        </div>

        {/* Hero */}
        <div onClick={onBook} style={{ borderRadius:22, padding:"22px 20px", marginBottom:20, cursor:"pointer", overflow:"hidden", position:"relative", background:th.heroGrad, boxShadow:"0 8px 32px rgba(124,58,237,0.35)" }}>
          <div style={{ position:"absolute", top:-30, right:t.dir==="rtl"?"auto":"-30px", left:t.dir==="rtl"?"-30px":"auto", width:120, height:120, borderRadius:"50%", background:"rgba(255,255,255,0.07)" }}/>
          <p style={{ color:"rgba(255,255,255,0.75)", fontSize:12, margin:"0 0 5px", fontFamily:t.font, position:"relative" }}>{t.quickBook}</p>
          <h3 style={{ color:"#fff", fontSize:20, fontWeight:800, margin:0, fontFamily:t.font, position:"relative" }}>{t.bookNow} →</h3>
          <div style={{ marginTop:12, display:"flex", gap:6, flexWrap:"wrap", position:"relative" }}>
            {services.slice(0,4).map(s=>(
              <span key={s.id} style={{ background:"rgba(255,255,255,0.15)", color:"#fff", borderRadius:20, padding:"3px 11px", fontSize:11, fontFamily:t.font }}>{s.icon} {lang==="ar"?s.nameAr:s.nameHe}</span>
            ))}
          </div>
        </div>

        {/* Services */}
        <h3 style={{ color:th.text, fontFamily:t.font, fontSize:15, fontWeight:700, margin:"0 0 12px" }}>{t.allServices}</h3>
        {load ? <div style={{ display:"flex", justifyContent:"center", padding:20 }}><Spinner th={th}/></div> : (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:9, marginBottom:20 }}>
            {services.map(s=>(
              <div key={s.id} onClick={onBook} style={{ background:th.cardBg, borderRadius:14, padding:"14px 10px", textAlign:"center", cursor:"pointer", border:`1px solid ${th.border}` }}>
                <div style={{ fontSize:24, marginBottom:6 }}>{s.icon}</div>
                <div style={{ color:th.text, fontSize:11, fontFamily:t.font, fontWeight:600, lineHeight:1.3 }}>{lang==="ar"?s.nameAr:s.nameHe}</div>
                <div style={{ color:th.accentText, fontSize:11, fontFamily:t.font, marginTop:3 }}>{t.ILS}{s.price}</div>
              </div>
            ))}
          </div>
        )}

        <h3 style={{ color:th.text, fontFamily:t.font, fontSize:15, fontWeight:700, margin:"0 0 12px" }}>{t.upcomingAppts}</h3>
        {bookings.map(b=><BCard key={b.id} b={b} t={t} lang={lang} th={th}/>)}
        <div style={{ height:16 }}/>
      </div>
      <BottomNav t={t} active={navTab} onChange={setNavTab} th={th}/>
    </div>
  );
}

// ── BOOK ──────────────────────────────────────────────────────
function BookScreen({ t, th, onBack }) {
  const lang=t===T.ar?"ar":"he";
  const [step,setStep]=useState(0);
  const [sel,setSel]=useState({service:null,staff:null,dayIdx:0,time:null});
  const [services,setServices]=useState([]); const [staff,setStaff]=useState([]);
  const [slots,setSlots]=useState([]);
  const [load,setLoad]=useState(false); const [saving,setSave]=useState(false);
  const [done,setDone]=useState(null); const [error,setError]=useState("");
  const steps=[t.chooseService,t.chooseStaff,t.chooseTime,t.confirmBooking];

  useEffect(()=>{ setLoad(true); Promise.all([api("/services"),api("/staff")]).then(([s,st])=>{ setServices(s); setStaff(st); }).finally(()=>setLoad(false)); },[]);

  const loadSlots=useCallback(async(dayIdx,staffId)=>{
    const date=getDateForOffset(dayIdx);
    const params=new URLSearchParams({date,...(staffId?{staffId}:{})});
    setSlots(await api("/slots?"+params));
  },[]);

  useEffect(()=>{ if(step===2) loadSlots(sel.dayIdx,sel.staff?.id); },[step,sel.dayIdx,sel.staff?.id,loadSlots]);

  const confirm=async()=>{
    setSave(true); setError("");
    try {
      const data=await api("/bookings",{method:"POST",body:{ serviceId:sel.service._id, staffId:sel.staff?._id||null, date:getDateForOffset(sel.dayIdx), time:sel.time }});
      setDone(data.id);
    } catch(e){ setError(e.message); }
    setSave(false);
  };

  if(done) return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:32, textAlign:"center" }}>
      <div style={{ width:80, height:80, borderRadius:"50%", background:"linear-gradient(135deg,#10B981,#059669)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:38, marginBottom:24, boxShadow:"0 0 40px rgba(16,185,129,0.3)" }}>✓</div>
      <h2 style={{ color:th.text, fontFamily:t.font, fontSize:24, fontWeight:800, margin:"0 0 8px" }}>{t.bookingConfirmed}</h2>
      <p style={{ color:th.textSub, fontFamily:t.font, fontSize:14, margin:"0 0 22px" }}>{t.bookingRef}: <strong style={{ color:th.accentText }}>{done}</strong></p>
      <div style={{ background:th.cardBg, border:`1px solid ${th.border}`, borderRadius:18, padding:20, width:"100%", marginBottom:26 }}>
        <div style={{ fontSize:40, marginBottom:8 }}>{sel.service?.icon}</div>
        <div style={{ color:th.text, fontFamily:t.font, fontWeight:700, fontSize:16 }}>{lang==="ar"?sel.service?.nameAr:sel.service?.nameHe}</div>
        <div style={{ color:th.textSub, fontFamily:t.font, fontSize:13, marginTop:4 }}>{lang==="ar"?DAYS_AR[sel.dayIdx]:DAYS_HE[sel.dayIdx]} · {sel.time}</div>
      </div>
      <PrimaryBtn label={lang==="ar"?"العودة للرئيسية":"חזרה לדף הבית"} font={t.font} th={th} onClick={onBack}/>
    </div>
  );

  if(load) return <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center" }}><Spinner th={th}/></div>;

  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column" }}>
      <div style={{ padding:"14px 18px 0", display:"flex", alignItems:"center", gap:12 }}>
        <button onClick={()=>step===0?onBack():setStep(step-1)} style={{ background:th.surface2, border:"none", borderRadius:10, width:38, height:38, cursor:"pointer", color:th.text, fontSize:18, display:"flex", alignItems:"center", justifyContent:"center" }}>
          {t.dir==="rtl"?"›":"‹"}
        </button>
        <div style={{ flex:1 }}>
          <p style={{ color:th.textMuted, fontSize:11, margin:0, fontFamily:t.font }}>{step+1} / {steps.length}</p>
          <h3 style={{ color:th.text, fontSize:16, fontWeight:700, margin:"2px 0 0", fontFamily:t.font }}>{steps[step]}</h3>
        </div>
      </div>
      <div style={{ padding:"10px 18px 12px", display:"flex", gap:5 }}>
        {steps.map((_,i)=>(
          <div key={i} style={{ flex:1, height:3, borderRadius:3, background:i<=step?th.accent:th.border, transition:"background 0.3s" }}/>
        ))}
      </div>

      <div style={{ flex:1, overflowY:"auto", padding:"0 18px" }}>
        {/* Step 0 - services */}
        {step===0 && services.map(s=>(
          <div key={s.id} onClick={()=>{ setSel({...sel,service:s}); setStep(1); }} style={{
            background:sel.service?._id===s._id?"rgba(124,58,237,0.15)":th.cardBg,
            border:`1.5px solid ${sel.service?._id===s._id?th.accent:th.border}`,
            borderRadius:16, padding:"13px 15px", cursor:"pointer", display:"flex", alignItems:"center", gap:14, marginBottom:9,
          }}>
            <div style={{ width:48, height:48, borderRadius:12, background:th.accentBg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, flexShrink:0 }}>{s.icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ color:th.text, fontFamily:t.font, fontWeight:600, fontSize:15 }}>{lang==="ar"?s.nameAr:s.nameHe}</div>
              <div style={{ color:th.textMuted, fontFamily:t.font, fontSize:12, marginTop:2 }}>{s.duration} {t.mins} · {t.ILS}{s.price}</div>
            </div>
            {sel.service?._id===s._id && <span style={{ color:th.accentText, fontSize:22 }}>✓</span>}
          </div>
        ))}

        {/* Step 1 - staff */}
        {step===1 && <>
          <div onClick={()=>{ setSel({...sel,staff:null}); setStep(2); }} style={{ background:th.cardBg, border:`1.5px solid ${th.border}`, borderRadius:16, padding:"13px 15px", cursor:"pointer", display:"flex", alignItems:"center", gap:14, marginBottom:9 }}>
            <div style={{ width:48, height:48, borderRadius:12, background:th.surface2, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>👥</div>
            <div style={{ color:th.text, fontFamily:t.font, fontWeight:600 }}>{t.any}</div>
          </div>
          {staff.map(s=>(
            <div key={s.id} onClick={()=>{ setSel({...sel,staff:s}); setStep(2); }} style={{
              background:sel.staff?._id===s._id?"rgba(124,58,237,0.15)":th.cardBg,
              border:`1.5px solid ${sel.staff?._id===s._id?th.accent:th.border}`,
              borderRadius:16, padding:"13px 15px", cursor:"pointer", display:"flex", alignItems:"center", gap:14, marginBottom:9,
            }}>
              <div style={{ width:48, height:48, borderRadius:12, background:th.accentBg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, flexShrink:0 }}>{s.avatar}</div>
              <div style={{ flex:1 }}>
                <div style={{ color:th.text, fontFamily:t.font, fontWeight:600 }}>{lang==="ar"?s.nameAr:s.nameHe}</div>
                <div style={{ color:th.textMuted, fontFamily:t.font, fontSize:12, marginTop:2 }}>⭐ {s.rating}</div>
              </div>
              {sel.staff?._id===s._id && <span style={{ color:th.accentText, fontSize:22 }}>✓</span>}
            </div>
          ))}
        </>}

        {/* Step 2 - time */}
        {step===2 && <>
          <div style={{ display:"flex", gap:8, marginBottom:16, overflowX:"auto", paddingBottom:4 }}>
            {[0,1,2,3,4,5,6].map(i=>(
              <div key={i} onClick={()=>setSel({...sel,dayIdx:i,time:null})} style={{
                minWidth:60, padding:"9px 6px", borderRadius:12, textAlign:"center", cursor:"pointer",
                background:sel.dayIdx===i?th.accent:th.cardBg,
                border:`1.5px solid ${sel.dayIdx===i?th.accent:th.border}`,
              }}>
                <div style={{ color:sel.dayIdx===i?"#fff":th.textSub, fontSize:11, fontFamily:t.font, fontWeight:sel.dayIdx===i?700:400 }}>
                  {lang==="ar"?DAYS_AR[i]:DAYS_HE[i]}
                </div>
                <div style={{ color:sel.dayIdx===i?"rgba(255,255,255,0.7)":th.textMuted, fontSize:10, fontFamily:t.font, marginTop:2 }}>
                  {getDateForOffset(i).slice(5)}
                </div>
              </div>
            ))}
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8, marginBottom:16 }}>
            {slots.map(sl=>{
              const picked=sel.time===sl.time;
              return (
                <div key={sl.time} onClick={()=>sl.available&&setSel({...sel,time:sl.time})} style={{
                  padding:"10px 4px", borderRadius:10, textAlign:"center", cursor:sl.available?"pointer":"default",
                  background:picked?th.accent:!sl.available?th.surface:th.slotBg,
                  border:`1.5px solid ${picked?th.accent:!sl.available?th.border:th.slotBorder}`,
                  opacity:sl.available?1:0.35,
                }}>
                  <div style={{ color:picked?"#fff":th.slotText, fontSize:12, fontFamily:t.font, fontWeight:500 }}>{sl.time}</div>
                </div>
              );
            })}
          </div>
          {sel.time && <PrimaryBtn label={t.next} onClick={()=>setStep(3)} font={t.font} th={th}/>}
        </>}

        {/* Step 3 - confirm */}
        {step===3 && <>
          <div style={{ background:th.cardBg, borderRadius:20, padding:20, marginBottom:16, border:`1px solid ${th.border}` }}>
            <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:16, paddingBottom:16, borderBottom:`1px solid ${th.border}` }}>
              <div style={{ width:52, height:52, borderRadius:14, background:th.accentBg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:28 }}>{sel.service?.icon}</div>
              <div>
                <div style={{ color:th.text, fontFamily:t.font, fontWeight:700, fontSize:16 }}>{lang==="ar"?sel.service?.nameAr:sel.service?.nameHe}</div>
                <div style={{ color:th.textMuted, fontFamily:t.font, fontSize:12, marginTop:2 }}>{sel.service?.duration} {t.mins}</div>
              </div>
            </div>
            {[[t.with, sel.staff?(lang==="ar"?sel.staff.nameAr:sel.staff.nameHe):t.any],[t.at,`${lang==="ar"?DAYS_AR[sel.dayIdx]:DAYS_HE[sel.dayIdx]} · ${sel.time}`],[t.price,`${t.ILS}${sel.service?.price}`]].map(([lbl,val])=>(
              <div key={lbl} style={{ display:"flex", justifyContent:"space-between", padding:"9px 0", borderBottom:`1px solid ${th.border}` }}>
                <span style={{ color:th.textMuted, fontFamily:t.font, fontSize:13 }}>{lbl}</span>
                <span style={{ color:th.text, fontFamily:t.font, fontSize:13, fontWeight:600 }}>{val}</span>
              </div>
            ))}
          </div>
          {error&&<div style={{ color:"#EF4444", fontSize:13, marginBottom:12, background:"rgba(239,68,68,0.1)", padding:"8px 12px", borderRadius:8, fontFamily:t.font }}>{error}</div>}
          <PrimaryBtn label={t.confirm} font={t.font} th={th} loading={saving} onClick={confirm}/>
        </>}
        <div style={{ height:20 }}/>
      </div>
    </div>
  );
}

// ── APPOINTMENTS ──────────────────────────────────────────────
function ApptsScreen({ t, th, navTab, setNavTab }) {
  const lang=t===T.ar?"ar":"he";
  const [bookings,setBookings]=useState([]); const [load,setLoad]=useState(true);
  const load_=useCallback(async()=>{ setLoad(true); try{ setBookings(await api("/bookings")); }finally{ setLoad(false); } },[]);
  useEffect(()=>{ load_(); },[load_]);
  const cancel=async(id)=>{ try{ await api(`/bookings/${id}/cancel`,{method:"PUT"}); load_(); }catch(_){} };
  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column" }}>
      <div style={{ flex:1, overflowY:"auto", padding:"20px 18px 0" }}>
        <h2 style={{ color:th.text, fontFamily:t.font, fontSize:22, fontWeight:800, margin:"0 0 16px" }}>{t.myAppointments}</h2>
        {load ? <div style={{ display:"flex", justifyContent:"center", padding:40 }}><Spinner th={th}/></div>
          : bookings.length===0
            ? <div style={{ textAlign:"center", padding:"40px 20px" }}>
                <div style={{ fontSize:48, marginBottom:12 }}>📅</div>
                <p style={{ color:th.textMuted, fontFamily:t.font, fontSize:14 }}>{t.noAppts}</p>
              </div>
            : bookings.map(b=><BCard key={b.id} b={b} t={t} lang={lang} onCancel={cancel} th={th}/>)
        }
        <div style={{ height:16 }}/>
      </div>
      <BottomNav t={t} active={navTab} onChange={setNavTab} th={th}/>
    </div>
  );
}

// ── PROFILE ───────────────────────────────────────────────────
function ProfScreen({ t, th, user, onLogout, navTab, setNavTab }) {
  const lang=t===T.ar?"ar":"he";
  const [stats,setStats]=useState({count:0,spent:0});
  useEffect(()=>{ api("/bookings").then(bs=>{ const conf=bs.filter(b=>b.status==="confirmed"); setStats({count:bs.length,spent:conf.reduce((s,b)=>s+(b.service?.price||0),0)}); }); },[]);
  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column" }}>
      <div style={{ flex:1, overflowY:"auto", padding:"20px 18px 0" }}>
        <div style={{ textAlign:"center", marginBottom:26 }}>
          <div style={{ width:80, height:80, borderRadius:"50%", background:"linear-gradient(135deg,#7C3AED,#0891B2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:36, margin:"0 auto 12px" }}>👤</div>
          <h2 style={{ color:th.text, fontFamily:t.font, fontSize:20, fontWeight:800, margin:0 }}>{user?.name}</h2>
          <p style={{ color:th.textSub, fontFamily:t.font, fontSize:13, margin:"4px 0 0" }}>{user?.email}</p>
        </div>
        {[["📅",lang==="ar"?"مواعيدي":"התורים שלי",stats.count],["💰",lang==="ar"?"إجمالي الإنفاق":"סך הוצאות",`₪${stats.spent}`]].map(([icon,lbl,val])=>(
          <div key={lbl} style={{ background:th.cardBg, border:`1px solid ${th.border}`, borderRadius:14, padding:"13px 15px", marginBottom:9, display:"flex", alignItems:"center", gap:12 }}>
            <span style={{ fontSize:22 }}>{icon}</span>
            <span style={{ flex:1, color:th.textSub, fontFamily:t.font, fontSize:14 }}>{lbl}</span>
            <span style={{ color:th.accentText, fontFamily:t.font, fontWeight:700, fontSize:15 }}>{val}</span>
          </div>
        ))}
        <button onClick={onLogout} style={{ width:"100%", marginTop:8, padding:"13px", borderRadius:14, border:`1px solid ${th.logoutBorder}`, background:th.logoutBg, color:"#EF4444", fontFamily:t.font, fontSize:14, fontWeight:600, cursor:"pointer" }}>
          🚪 {t.logout}
        </button>
      </div>
      <BottomNav t={t} active={navTab} onChange={setNavTab} th={th}/>
    </div>
  );
}

// ── ROOT ──────────────────────────────────────────────────────
export default function App() {
  const [lang,    setLang]    = useState(()=>localStorage.getItem("cust_lang")||"he");
  const [mode,    setMode]    = useState(()=>localStorage.getItem("cust_theme")||"dark");
  const [screen,  setScreen]  = useState("login");
  const [user,    setUser]    = useState(null);
  const [navTab,  setNavTab]  = useState("home");
  const [checking,setCheck]   = useState(true);

  const t  = T[lang];
  const th = THEMES[mode];

  useEffect(()=>{ localStorage.setItem("cust_lang",lang); },[lang]);
  useEffect(()=>{ localStorage.setItem("cust_theme",mode); },[mode]);

  useEffect(()=>{
    const token=localStorage.getItem("token");
    if(!token){ setCheck(false); return; }
    api("/auth/me").then(u=>{ setUser(u); setScreen("home"); }).catch(()=>localStorage.removeItem("token")).finally(()=>setCheck(false));
  },[]);

  const handleNav=(tab)=>{ setNavTab(tab); setScreen(tab==="appts"?"appts":tab==="prof"?"prof":"home"); };
  const logout=async()=>{ try{ await api("/auth/logout",{method:"POST"}); }catch(_){} localStorage.removeItem("token"); setUser(null); setScreen("login"); };
  const toggleTheme=()=>setMode(m=>m==="dark"?"light":"dark");

  if(checking) return <div style={{ minHeight:"100vh", background:th.shell, display:"flex", alignItems:"center", justifyContent:"center" }}><Spinner th={th}/></div>;

  return (
    <div style={{ fontFamily:t.font, direction:t.dir, minHeight:"100vh", background:th.bg, display:"flex", flexDirection:"column", alignItems:"center", transition:"background 0.3s" }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} *{box-sizing:border-box;margin:0;padding:0} input,button,select,textarea{font-family:inherit}`}</style>
      {/* Ambient orbs */}
      <div style={{ position:"fixed", inset:0, pointerEvents:"none", overflow:"hidden", zIndex:0 }}>
        <div style={{ position:"absolute", top:"-15%", left:"-15%", width:450, height:450, borderRadius:"50%", background:`radial-gradient(circle,${th.orb1} 0%,transparent 70%)` }}/>
        <div style={{ position:"absolute", bottom:"-10%", right:"-10%", width:380, height:380, borderRadius:"50%", background:`radial-gradient(circle,${th.orb2} 0%,transparent 70%)` }}/>
      </div>

      <div style={{ width:"100%", maxWidth:420, minHeight:"100vh", display:"flex", flexDirection:"column", position:"relative", zIndex:1, background:th.shell, boxShadow:th.shadow, transition:"background 0.3s" }}>
        <TopBar lang={lang} setLang={setLang} themeMode={mode} toggleTheme={toggleTheme} t={t} th={th}/>
        <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
          {screen==="login"    && <LoginScreen    t={t} th={th} onLogin={(u)=>{ setUser(u); setScreen("home"); }} onRegister={()=>setScreen("register")}/>}
          {screen==="register" && <RegisterScreen t={t} th={th} onDone={(u)=>{ setUser(u); setScreen("home"); }} onBack={()=>setScreen("login")}/>}
          {screen==="home"     && <HomeScreen     t={t} th={th} user={user} onBook={()=>setScreen("book")} navTab={navTab} setNavTab={handleNav}/>}
          {screen==="book"     && <BookScreen     t={t} th={th} onBack={()=>{ setScreen("home"); setNavTab("home"); }}/>}
          {screen==="appts"    && <ApptsScreen    t={t} th={th} navTab={navTab} setNavTab={handleNav}/>}
          {screen==="prof"     && <ProfScreen     t={t} th={th} user={user} onLogout={logout} navTab={navTab} setNavTab={handleNav}/>}
        </div>
      </div>
    </div>
  );
}
