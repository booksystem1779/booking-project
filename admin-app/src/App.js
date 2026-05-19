import { useState, useEffect, useCallback } from "react";

const API = "https://booking-server-976t.onrender.com/api";

async function api(path, opts = {}) {
  const token = localStorage.getItem("admin_token");
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
    bg:        "#0A0A14",
    sidebar:   "#111122",
    surface:   "#111122",
    surface2:  "#161628",
    card:      "#161628",
    border:    "rgba(255,255,255,0.07)",
    border2:   "rgba(255,255,255,0.12)",
    text:      "#F1F1F5",
    textSub:   "rgba(255,255,255,0.55)",
    muted:     "rgba(255,255,255,0.35)",
    inputBg:   "rgba(255,255,255,0.06)",
    accent:    "#7C3AED",
    accentHov: "#6D28D9",
    accentBg:  "rgba(124,58,237,0.15)",
    accentText:"#A78BFA",
    green:     "#10B981", greenBg:"rgba(16,185,129,0.12)",
    amber:     "#F59E0B", amberBg:"rgba(245,158,11,0.12)",
    red:       "#EF4444", redBg:  "rgba(239,68,68,0.12)",
    blue:      "#3B82F6",
    rowHover:  "rgba(255,255,255,0.02)",
    toggleIcon:"🌙", toggleLabel:"Dark",
  },
  light: {
    bg:        "#F1F5F9",
    sidebar:   "#FFFFFF",
    surface:   "#FFFFFF",
    surface2:  "#F8FAFC",
    card:      "#F8FAFC",
    border:    "rgba(0,0,0,0.08)",
    border2:   "rgba(0,0,0,0.13)",
    text:      "#0F172A",
    textSub:   "rgba(15,23,42,0.6)",
    muted:     "rgba(15,23,42,0.4)",
    inputBg:   "rgba(0,0,0,0.04)",
    accent:    "#7C3AED",
    accentHov: "#6D28D9",
    accentBg:  "rgba(124,58,237,0.08)",
    accentText:"#6D28D9",
    green:     "#059669", greenBg:"rgba(5,150,105,0.1)",
    amber:     "#D97706", amberBg:"rgba(217,119,6,0.1)",
    red:       "#DC2626", redBg:  "rgba(220,38,38,0.08)",
    blue:      "#2563EB",
    rowHover:  "rgba(0,0,0,0.02)",
    toggleIcon:"☀️", toggleLabel:"Light",
  },
};

// ── TRANSLATIONS ──────────────────────────────────────────────
const T = {
  en: {
    dir:"ltr", font:"'Rubik', sans-serif",
    appName:"Admin Panel", subtitle:"Booking System",
    login:"Sign In", email:"Email", password:"Password", demoHint:"admin@demo.com · admin123",
    adminOnly:"Admin access required",
    dashboard:"Dashboard", bookings:"Bookings", services:"Services", staff:"Staff", users:"Users",
    logout:"Logout",
    totalBookings:"Total Bookings", todayBookings:"Today", revenue:"Revenue", clients:"Clients",
    recentBookings:"Recent Bookings",
    confirmed:"Confirmed", pending:"Pending", cancelled:"Cancelled", all:"All",
    search:"Search...", refresh:"Refresh",
    id:"ID", client:"Client", service:"Service", staffCol:"Staff", date:"Date", time:"Time", status:"Status", actions:"Actions",
    edit:"Edit", delete:"Delete", save:"Save", cancel:"Cancel",
    editBooking:"Edit Booking", deleteBooking:"Delete Booking?",
    deleteConfirm:"This cannot be undone.", notes:"Notes", noBookings:"No bookings found",
    addService:"+ Add Service", editService:"Edit Service", addServiceTitle:"Add Service",
    icon:"Icon", nameHe:"Name (Hebrew)", nameAr:"Name (Arabic)", duration:"Duration (min)", price:"Price (₪)",
    addStaff:"+ Add Staff", editStaff:"Edit Staff Member", addStaffTitle:"Add Staff Member",
    avatar:"Avatar", active:"Active", rating:"Rating",
    searchUsers:"Search users...",
    name:"Name", phone:"Phone", role:"Role", joined:"Joined",
    bookingUpdated:"Booking updated", bookingDeleted:"Booking deleted",
    saved:"Saved ✓", deleted:"Deleted", removed:"Removed",
    statusConfirmed:"Confirmed", statusPending:"Pending", statusCancelled:"Cancelled",
    badgeConfirmed:"Confirmed", badgePending:"Pending", badgeCancelled:"Cancelled",
  },
  he: {
    dir:"rtl", font:"'Rubik', sans-serif",
    appName:"לוחת ניהול", subtitle:"מערכת הזמנות",
    login:"כניסה", email:"אימייל", password:"סיסמה", demoHint:"admin@demo.com · admin123",
    adminOnly:"נדרשת גישת מנהל",
    dashboard:"דשבורד", bookings:"הזמנות", services:"שירותים", staff:"צוות", users:"משתמשים",
    logout:"התנתק",
    totalBookings:"סה״כ הזמנות", todayBookings:"היום", revenue:"הכנסה", clients:"לקוחות",
    recentBookings:"הזמנות אחרונות",
    confirmed:"מאושר", pending:"ממתין", cancelled:"בוטל", all:"הכל",
    search:"חיפוש...", refresh:"רענן",
    id:"מזהה", client:"לקוח", service:"שירות", staffCol:"איש צוות", date:"תאריך", time:"שעה", status:"סטטוס", actions:"פעולות",
    edit:"עריכה", delete:"מחק", save:"שמור", cancel:"ביטול",
    editBooking:"עריכת הזמנה", deleteBooking:"מחיקת הזמנה?",
    deleteConfirm:"לא ניתן לבטל פעולה זו.", notes:"הערות", noBookings:"לא נמצאו הזמנות",
    addService:"+ הוסף שירות", editService:"עריכת שירות", addServiceTitle:"הוספת שירות",
    icon:"אייקון", nameHe:"שם (עברית)", nameAr:"שם (ערבית)", duration:"משך (דקות)", price:"מחיר (₪)",
    addStaff:"+ הוסף עובד", editStaff:"עריכת עובד", addStaffTitle:"הוספת עובד",
    avatar:"אווטאר", active:"פעיל", rating:"דירוג",
    searchUsers:"חיפוש משתמשים...",
    name:"שם", phone:"טלפון", role:"תפקיד", joined:"הצטרף",
    bookingUpdated:"ההזמנה עודכנה", bookingDeleted:"ההזמנה נמחקה",
    saved:"נשמר ✓", deleted:"נמחק", removed:"הוסר",
    statusConfirmed:"מאושר", statusPending:"ממתין", statusCancelled:"בוטל",
    badgeConfirmed:"מאושר", badgePending:"ממתין", badgeCancelled:"בוטל",
  },
  ar: {
    dir:"rtl", font:"'Cairo', sans-serif",
    appName:"لوحة الإدارة", subtitle:"نظام الحجوزات",
    login:"تسجيل الدخول", email:"البريد الإلكتروني", password:"كلمة المرور", demoHint:"admin@demo.com · admin123",
    adminOnly:"مطلوب صلاحية المدير",
    dashboard:"الرئيسية", bookings:"الحجوزات", services:"الخدمات", staff:"الموظفين", users:"المستخدمين",
    logout:"تسجيل الخروج",
    totalBookings:"إجمالي الحجوزات", todayBookings:"اليوم", revenue:"الإيراد", clients:"العملاء",
    recentBookings:"آخر الحجوزات",
    confirmed:"مؤكد", pending:"معلق", cancelled:"ملغي", all:"الكل",
    search:"بحث...", refresh:"تحديث",
    id:"الرقم", client:"العميل", service:"الخدمة", staffCol:"الموظف", date:"التاريخ", time:"الوقت", status:"الحالة", actions:"إجراءات",
    edit:"تعديل", delete:"حذف", save:"حفظ", cancel:"إلغاء",
    editBooking:"تعديل الحجز", deleteBooking:"حذف الحجز؟",
    deleteConfirm:"لا يمكن التراجع عن هذا الإجراء.", notes:"ملاحظات", noBookings:"لا توجد حجوزات",
    addService:"+ إضافة خدمة", editService:"تعديل الخدمة", addServiceTitle:"إضافة خدمة",
    icon:"أيقونة", nameHe:"الاسم (عبري)", nameAr:"الاسم (عربي)", duration:"المدة (دقيقة)", price:"السعر (₪)",
    addStaff:"+ إضافة موظف", editStaff:"تعديل موظف", addStaffTitle:"إضافة موظف",
    avatar:"الصورة", active:"نشط", rating:"التقييم",
    searchUsers:"بحث عن مستخدمين...",
    name:"الاسم", phone:"الهاتف", role:"الدور", joined:"تاريخ الانضمام",
    bookingUpdated:"تم تحديث الحجز", bookingDeleted:"تم حذف الحجز",
    saved:"تم الحفظ ✓", deleted:"تم الحذف", removed:"تمت الإزالة",
    statusConfirmed:"مؤكد", statusPending:"معلق", statusCancelled:"ملغي",
    badgeConfirmed:"مؤكد", badgePending:"معلق", badgeCancelled:"ملغي",
  },
};

// ── SMALL COMPONENTS ──────────────────────────────────────────
function Spinner({ size=20, th }) {
  return <div style={{ width:size, height:size, border:`2px solid ${th.border2}`, borderTopColor:th.accent, borderRadius:"50%", animation:"spin 0.7s linear infinite", flexShrink:0 }}/>;
}

function Badge({ status, t, th }) {
  const cfg={
    confirmed:{ bg:th.greenBg, c:th.green, label:t.badgeConfirmed },
    pending:  { bg:th.amberBg, c:th.amber, label:t.badgePending },
    cancelled:{ bg:th.redBg,   c:th.red,   label:t.badgeCancelled },
  }[status]||{};
  return <span style={{ background:cfg.bg, color:cfg.c, fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:20, whiteSpace:"nowrap" }}>{cfg.label}</span>;
}

function Toast({ msg, type, th, onClose }) {
  useEffect(()=>{ const tm=setTimeout(onClose,3500); return()=>clearTimeout(tm); },[onClose]);
  const color=type==="error"?th.red:th.green;
  return <div style={{ position:"fixed", bottom:24, left:"50%", transform:"translateX(-50%)", background:type==="error"?th.redBg:th.greenBg, border:`1px solid ${color}44`, color, borderRadius:12, padding:"12px 22px", fontSize:14, fontWeight:600, zIndex:2000, whiteSpace:"nowrap", boxShadow:"0 8px 32px rgba(0,0,0,0.25)" }}>{type==="error"?"❌":"✅"} {msg}</div>;
}

function Modal({ title, children, onClose, th }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div style={{ background:th.surface2, borderRadius:20, padding:28, width:"100%", maxWidth:500, border:`1px solid ${th.border2}`, boxShadow:"0 20px 60px rgba(0,0,0,0.3)", maxHeight:"90vh", overflowY:"auto" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:22 }}>
          <h3 style={{ color:th.text, fontSize:18, fontWeight:700, margin:0 }}>{title}</h3>
          <button onClick={onClose} style={{ background:th.border, border:"none", borderRadius:8, width:32, height:32, cursor:"pointer", color:th.muted, fontSize:20, display:"flex", alignItems:"center", justifyContent:"center" }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type="text", placeholder, disabled, dir, th }) {
  return (
    <div style={{ marginBottom:14 }}>
      <label style={{ color:th.muted, fontSize:12, display:"block", marginBottom:5 }}>{label}</label>
      <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} disabled={disabled} dir={dir||"auto"}
        style={{ width:"100%", padding:"10px 12px", borderRadius:10, background:th.inputBg, border:`1px solid ${th.border2}`, color:th.text, fontSize:14, outline:"none", boxSizing:"border-box", opacity:disabled?0.5:1 }}/>
    </div>
  );
}

function SelectField({ label, value, onChange, options, th }) {
  return (
    <div style={{ marginBottom:14 }}>
      <label style={{ color:th.muted, fontSize:12, display:"block", marginBottom:5 }}>{label}</label>
      <select value={value} onChange={e=>onChange(e.target.value)}
        style={{ width:"100%", padding:"10px 12px", borderRadius:10, background:th.surface2, border:`1px solid ${th.border2}`, color:th.text, fontSize:14, outline:"none" }}>
        {options.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function Btn({ label, onClick, loading, danger, secondary, small, full, th }) {
  return (
    <button onClick={onClick} disabled={loading} style={{
      padding:small?"7px 14px":"11px 20px", width:full?"100%":"auto",
      borderRadius:10, border:secondary?`1px solid ${th.border2}`:"none",
      background:danger?th.red:secondary?"transparent":`linear-gradient(135deg,${th.accent},${th.accentHov})`,
      color:secondary?th.textSub:"#fff", fontSize:small?12:14, fontWeight:600,
      cursor:loading?"default":"pointer", opacity:loading?0.7:1,
      display:"flex", alignItems:"center", gap:6, whiteSpace:"nowrap",
      boxShadow:(!secondary&&!danger)?"0 2px 8px rgba(124,58,237,0.3)":"none",
    }}>
      {loading&&<Spinner size={14} th={th}/>}{label}
    </button>
  );
}

function StatCard({ icon, label, value, color, th }) {
  return (
    <div style={{ background:th.surface, border:`1px solid ${th.border}`, borderRadius:16, padding:"18px 20px", flex:1, minWidth:130, boxShadow:"0 1px 4px rgba(0,0,0,0.06)" }}>
      <div style={{ fontSize:26, marginBottom:10 }}>{icon}</div>
      <div style={{ color:color||th.text, fontWeight:800, fontSize:26 }}>{value}</div>
      <div style={{ color:th.muted, fontSize:12, marginTop:4 }}>{label}</div>
    </div>
  );
}

function LangSwitcher({ lang, setLang, th }) {
  return (
    <div style={{ display:"flex", gap:5 }}>
      {[["en","EN"],["he","עב"],["ar","ع"]].map(([l,lbl])=>(
        <button key={l} onClick={()=>setLang(l)} style={{
          padding:"4px 12px", borderRadius:20, border:`1px solid ${lang===l?th.accent:th.border2}`,
          background:lang===l?th.accentBg:"transparent",
          color:lang===l?th.accentText:th.muted,
          fontSize:12, cursor:"pointer", fontWeight:lang===l?700:400,
        }}>{lbl}</button>
      ))}
    </div>
  );
}

function ThemeToggle({ mode, toggle, th, t }) {
  return (
    <button onClick={toggle} style={{ display:"flex", alignItems:"center", gap:6, padding:"6px 12px", borderRadius:20, border:`1px solid ${th.border2}`, background:th.inputBg, cursor:"pointer", color:th.textSub, fontSize:12, fontWeight:600 }}>
      <span style={{ fontSize:14 }}>{th.toggleIcon}</span>
      <span>{th.toggleLabel}</span>
    </button>
  );
}

// ── LOGIN ─────────────────────────────────────────────────────
function LoginPage({ onLogin, lang, setLang, mode, toggleTheme, th }) {
  const t=T[lang];
  const [email,setEmail]=useState("admin@demo.com"); const [pass,setPass]=useState("admin123");
  const [error,setError]=useState(""); const [load,setLoad]=useState(false);
  const submit=async()=>{
    setError(""); setLoad(true);
    try {
      const data=await api("/auth/login",{method:"POST",body:{email,password:pass}});
      if(data.user.role!=="admin"){ setError(t.adminOnly); setLoad(false); return; }
      localStorage.setItem("admin_token",data.token); onLogin(data.user);
    } catch(e){ setError(e.message); }
    setLoad(false);
  };
  return (
    <div style={{ minHeight:"100vh", background:mode==="dark"?"linear-gradient(160deg,#0A0A14,#12122A,#0E1A30)":th.bg, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:t.font, padding:20, direction:t.dir, transition:"background 0.3s" }}>
      <div style={{ background:th.surface, borderRadius:24, padding:"40px 36px", width:"100%", maxWidth:420, border:`1px solid ${th.border2}`, boxShadow:"0 24px 64px rgba(0,0,0,0.2)", position:"relative" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <LangSwitcher lang={lang} setLang={setLang} th={th}/>
          <ThemeToggle mode={mode} toggle={toggleTheme} th={th} t={t}/>
        </div>
        <div style={{ textAlign:"center", marginBottom:30 }}>
          <div style={{ fontSize:48, marginBottom:10 }}>🔐</div>
          <h1 style={{ color:th.text, fontSize:26, fontWeight:900, margin:0 }}>{t.appName}</h1>
          <p style={{ color:th.muted, fontSize:13, marginTop:6 }}>{t.subtitle}</p>
        </div>
        <Field label={t.email}    type="email"    value={email} onChange={setEmail} dir={t.dir} th={th}/>
        <Field label={t.password} type="password" value={pass}  onChange={setPass}  dir={t.dir} th={th}/>
        {error&&<div style={{ color:th.red, fontSize:13, marginBottom:12, background:th.redBg, padding:"8px 12px", borderRadius:8 }}>{error}</div>}
        <div style={{ marginTop:4 }}><Btn label={t.login+" →"} onClick={submit} loading={load} full th={th}/></div>
        <p style={{ color:th.muted, fontSize:12, textAlign:"center", marginTop:20 }}>{t.demoHint}</p>
      </div>
    </div>
  );
}

// ── DASHBOARD ─────────────────────────────────────────────────
function DashboardPage({ toast, t, th }) {
  const [stats,setStats]=useState(null); const [bookings,setBookings]=useState([]); const [load,setLoad]=useState(true);
  useEffect(()=>{
    Promise.all([api("/admin/stats"),api("/admin/bookings")])
      .then(([s,b])=>{ setStats(s); setBookings(b.slice(0,6)); })
      .catch(e=>toast(e.message,"error")).finally(()=>setLoad(false));
  },[]);
  if(load) return <div style={{ display:"flex", justifyContent:"center", alignItems:"center", height:400 }}><Spinner size={40} th={th}/></div>;
  return (
    <div>
      <h2 style={{ color:th.text, fontSize:22, fontWeight:800, margin:"0 0 24px" }}>{t.dashboard}</h2>
      <div style={{ display:"flex", flexWrap:"wrap", gap:12, marginBottom:24 }}>
        <StatCard icon="📅" label={t.totalBookings} value={stats?.totalBookings}  color={th.accent} th={th}/>
        <StatCard icon="⏰" label={t.todayBookings} value={stats?.todayBookings}  color={th.blue}   th={th}/>
        <StatCard icon="💰" label={t.revenue}       value={`₪${stats?.revenue}`} color={th.green}  th={th}/>
        <StatCard icon="👥" label={t.clients}       value={stats?.totalClients}   color={th.amber}  th={th}/>
      </div>
      <div style={{ display:"flex", gap:10, marginBottom:24, flexWrap:"wrap" }}>
        {[[th.green,th.greenBg,`✓ ${t.confirmed}: ${stats?.confirmedBookings}`],[th.amber,th.amberBg,`⏳ ${t.pending}: ${stats?.pendingBookings}`],[th.red,th.redBg,`✕ ${t.cancelled}: ${stats?.cancelledBookings}`]].map(([color,bg,label])=>(
          <div key={label} style={{ background:bg, border:`1px solid ${color}33`, borderRadius:12, padding:"10px 16px" }}>
            <span style={{ color, fontSize:13, fontWeight:700 }}>{label}</span>
          </div>
        ))}
      </div>
      <h3 style={{ color:th.text, fontSize:16, fontWeight:700, margin:"0 0 14px" }}>{t.recentBookings}</h3>
      <BookingsTable bookings={bookings} onRefresh={()=>{}} toast={toast} compact t={t} th={th}/>
    </div>
  );
}

// ── BOOKINGS TABLE ────────────────────────────────────────────
function BookingsTable({ bookings, onRefresh, toast, compact, t, th }) {
  const [editModal,setEdit]=useState(null); const [delModal,setDel]=useState(null);
  const [editStatus,setEditStatus]=useState("confirmed"); const [editNotes,setEditNotes]=useState("");
  const [saving,setSave]=useState(false);

  const update=async()=>{
    setSave(true);
    try { await api(`/admin/bookings/${editModal._id}`,{method:"PUT",body:{status:editStatus,notes:editNotes}}); toast(t.bookingUpdated,"success"); setEdit(null); onRefresh(); }
    catch(e){ toast(e.message,"error"); }
    setSave(false);
  };
  const del=async()=>{
    setSave(true);
    try { await api(`/admin/bookings/${delModal._id}`,{method:"DELETE"}); toast(t.bookingDeleted,"success"); setDel(null); onRefresh(); }
    catch(e){ toast(e.message,"error"); }
    setSave(false);
  };

  return (
    <>
      <div style={{ overflowX:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ borderBottom:`1px solid ${th.border2}` }}>
              {(compact?[t.id,t.client,t.service,`${t.date} & ${t.time}`,t.status,""]:[t.id,t.client,t.service,t.staffCol,t.date,t.time,t.status,t.actions]).map((h,i)=>(
                <th key={i} style={{ color:th.muted, fontSize:11, fontWeight:600, padding:"9px 12px", textAlign:"start", whiteSpace:"nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bookings.map(b=>(
              <tr key={b.id} style={{ borderBottom:`1px solid ${th.border}` }}
                onMouseEnter={e=>e.currentTarget.style.background=th.rowHover}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <td style={{ padding:"10px 12px", color:th.accentText, fontSize:12, fontWeight:700 }}>{b.id}</td>
                <td style={{ padding:"10px 12px" }}>
                  <div style={{ color:th.text, fontSize:13, fontWeight:600 }}>{b.user?.name}</div>
                  <div style={{ color:th.muted, fontSize:11 }}>{b.user?.phone}</div>
                </td>
                <td style={{ padding:"10px 12px" }}>
                  <span style={{ fontSize:16 }}>{b.service?.icon} </span>
                  <span style={{ color:th.text, fontSize:12 }}>{b.service?.nameHe}</span>
                </td>
                {!compact&&<td style={{ padding:"10px 12px", color:th.text, fontSize:12 }}>{b.staff?.nameHe||"—"}</td>}
                {!compact&&<td style={{ padding:"10px 12px", color:th.text, fontSize:12, whiteSpace:"nowrap" }}>{b.date}</td>}
                {!compact&&<td style={{ padding:"10px 12px", color:th.text, fontSize:12 }}>{b.time}</td>}
                {compact&&<td style={{ padding:"10px 12px", color:th.muted, fontSize:12 }}>{b.date} {b.time}</td>}
                <td style={{ padding:"10px 12px" }}><Badge status={b.status} t={t} th={th}/></td>
                <td style={{ padding:"10px 12px" }}>
                  <div style={{ display:"flex", gap:6 }}>
                    <Btn small label={t.edit} onClick={()=>{ setEdit(b); setEditStatus(b.status); setEditNotes(b.notes||""); }} th={th}/>
                    {!compact&&<Btn small danger label={t.delete} onClick={()=>setDel(b)} th={th}/>}
                  </div>
                </td>
              </tr>
            ))}
            {bookings.length===0&&<tr><td colSpan={8} style={{ padding:40, textAlign:"center", color:th.muted }}>{t.noBookings}</td></tr>}
          </tbody>
        </table>
      </div>

      {editModal&&(
        <Modal title={`${t.editBooking} — ${editModal.id}`} onClose={()=>setEdit(null)} th={th}>
          <div style={{ background:th.surface, borderRadius:12, padding:14, marginBottom:16, border:`1px solid ${th.border}` }}>
            <div style={{ color:th.text, fontSize:14, fontWeight:600 }}>{editModal.user?.name}</div>
            <div style={{ color:th.muted, fontSize:12, marginTop:2 }}>{editModal.service?.nameHe} · {editModal.date} {editModal.time}</div>
          </div>
          <SelectField label={t.status} value={editStatus} onChange={setEditStatus} th={th} options={[
            {value:"pending",label:`⏳ ${t.statusPending}`},
            {value:"confirmed",label:`✓ ${t.statusConfirmed}`},
            {value:"cancelled",label:`✕ ${t.statusCancelled}`},
          ]}/>
          <div style={{ marginBottom:16 }}>
            <label style={{ color:th.muted, fontSize:12, display:"block", marginBottom:5 }}>{t.notes}</label>
            <textarea value={editNotes} onChange={e=>setEditNotes(e.target.value)} style={{ width:"100%", padding:"10px 12px", borderRadius:10, background:th.inputBg, border:`1px solid ${th.border2}`, color:th.text, fontSize:14, outline:"none", boxSizing:"border-box", minHeight:70, resize:"vertical" }}/>
          </div>
          <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
            <Btn label={t.cancel} secondary onClick={()=>setEdit(null)} th={th}/>
            <Btn label={t.save}   onClick={update} loading={saving} th={th}/>
          </div>
        </Modal>
      )}
      {delModal&&(
        <Modal title={t.deleteBooking} onClose={()=>setDel(null)} th={th}>
          <p style={{ color:th.muted, fontSize:14, marginBottom:20 }}>{t.deleteConfirm} <strong style={{ color:th.text }}>{delModal.id}</strong></p>
          <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
            <Btn label={t.cancel} secondary onClick={()=>setDel(null)} th={th}/>
            <Btn label={t.delete} danger onClick={del} loading={saving} th={th}/>
          </div>
        </Modal>
      )}
    </>
  );
}

// ── BOOKINGS PAGE ─────────────────────────────────────────────
function BookingsPage({ toast, t, th }) {
  const [bookings,setBookings]=useState([]); const [load,setLoad]=useState(true);
  const [filter,setFilter]=useState("all"); const [search,setSearch]=useState("");
  const load_=useCallback(async()=>{
    setLoad(true);
    try{ setBookings(await api("/admin/bookings"+(filter!=="all"?`?status=${filter}`:""))); }
    catch(e){ toast(e.message,"error"); }
    setLoad(false);
  },[filter]);
  useEffect(()=>{ load_(); },[load_]);
  const filtered=bookings.filter(b=>!search||b.id.toLowerCase().includes(search.toLowerCase())||(b.user?.name||"").toLowerCase().includes(search.toLowerCase())||(b.service?.nameHe||"").includes(search)||(b.service?.nameAr||"").includes(search));
  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12, marginBottom:20 }}>
        <h2 style={{ color:th.text, fontSize:22, fontWeight:800, margin:0 }}>{t.bookings} <span style={{ color:th.muted, fontSize:16, fontWeight:400 }}>({filtered.length})</span></h2>
        <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={`🔍 ${t.search}`}
            style={{ padding:"8px 14px", borderRadius:10, background:th.inputBg, border:`1px solid ${th.border2}`, color:th.text, fontSize:13, outline:"none", width:180 }}/>
          {["all","confirmed","pending","cancelled"].map(f=>(
            <button key={f} onClick={()=>setFilter(f)} style={{ padding:"7px 14px", borderRadius:20, border:`1px solid ${filter===f?th.accent:th.border2}`, cursor:"pointer", fontSize:12, fontWeight:600, background:filter===f?th.accent:th.inputBg, color:filter===f?"#fff":th.muted }}>{t[f]}</button>
          ))}
          <Btn small label={`↻ ${t.refresh}`} onClick={load_} th={th}/>
        </div>
      </div>
      {load ? <div style={{ display:"flex", justifyContent:"center", padding:60 }}><Spinner size={40} th={th}/></div>
        : <div style={{ background:th.surface, borderRadius:16, border:`1px solid ${th.border}`, overflow:"hidden", boxShadow:"0 1px 4px rgba(0,0,0,0.06)" }}>
            <BookingsTable bookings={filtered} onRefresh={load_} toast={toast} t={t} th={th}/>
          </div>
      }
    </div>
  );
}

// ── SERVICES PAGE ─────────────────────────────────────────────
function ServicesPage({ toast, t, th }) {
  const [services,setServices]=useState([]); const [load,setLoad]=useState(true);
  const [modal,setModal]=useState(null); const [form,setForm]=useState({nameHe:"",nameAr:"",icon:"✂️",duration:30,price:100});
  const [saving,setSave]=useState(false);
  const load_=async()=>{ setLoad(true); try{ setServices(await api("/services")); }catch(e){ toast(e.message,"error"); } setLoad(false); };
  useEffect(()=>{ load_(); },[]);
  const save=async()=>{
    if(!form.nameHe||!form.nameAr) return;
    setSave(true);
    try {
      if(modal==="add") await api("/services",{method:"POST",body:form});
      else await api(`/services/${modal._id}`,{method:"PUT",body:form});
      toast(t.saved,"success"); setModal(null); load_();
    } catch(e){ toast(e.message,"error"); }
    setSave(false);
  };
  const del=async(id)=>{ if(!window.confirm(`${t.delete}?`)) return; try{ await api(`/services/${id}`,{method:"DELETE"}); toast(t.deleted,"success"); load_(); }catch(e){ toast(e.message,"error"); } };
  const ICONS=["✂️","🪒","💈","💅","🧖","💇","💆","🧴","🩺","💊","🦷","👁️","💪","🧘","🫀"];
  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <h2 style={{ color:th.text, fontSize:22, fontWeight:800, margin:0 }}>{t.services}</h2>
        <Btn label={t.addService} onClick={()=>{ setForm({nameHe:"",nameAr:"",icon:"✂️",duration:30,price:100}); setModal("add"); }} th={th}/>
      </div>
      {load ? <div style={{ display:"flex", justifyContent:"center", padding:60 }}><Spinner size={40} th={th}/></div>
        : <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:14 }}>
            {services.map(s=>(
              <div key={s.id} style={{ background:th.surface, border:`1px solid ${th.border}`, borderRadius:16, padding:18, boxShadow:"0 1px 4px rgba(0,0,0,0.05)" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
                  <div style={{ width:54, height:54, borderRadius:14, background:th.accentBg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:28 }}>{s.icon}</div>
                  <div style={{ display:"flex", gap:6 }}>
                    <Btn small label={t.edit} onClick={()=>{ setForm({nameHe:s.nameHe,nameAr:s.nameAr,icon:s.icon,duration:s.duration,price:s.price}); setModal(s); }} th={th}/>
                    <Btn small danger label={t.delete} onClick={()=>del(s.id)} th={th}/>
                  </div>
                </div>
                <div style={{ color:th.text, fontWeight:700, fontSize:15, marginBottom:3 }}>{s.nameHe}</div>
                <div style={{ color:th.muted, fontSize:12, marginBottom:12 }}>{s.nameAr}</div>
                <div style={{ display:"flex", gap:8 }}>
                  <span style={{ background:th.accentBg, color:th.accentText, borderRadius:8, padding:"4px 12px", fontSize:12, fontWeight:600 }}>₪{s.price}</span>
                  <span style={{ background:th.inputBg, color:th.muted, borderRadius:8, padding:"4px 12px", fontSize:12 }}>⏱ {s.duration} min</span>
                </div>
              </div>
            ))}
          </div>
      }
      {modal&&(
        <Modal title={modal==="add"?t.addServiceTitle:t.editService} onClose={()=>setModal(null)} th={th}>
          <div style={{ marginBottom:16 }}>
            <label style={{ color:th.muted, fontSize:12, display:"block", marginBottom:8 }}>{t.icon}</label>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {ICONS.map(ic=><button key={ic} onClick={()=>setForm({...form,icon:ic})} style={{ width:42, height:42, borderRadius:10, border:`2px solid ${form.icon===ic?th.accent:th.border2}`, background:form.icon===ic?th.accentBg:th.inputBg, fontSize:22, cursor:"pointer" }}>{ic}</button>)}
            </div>
          </div>
          <Field label={t.nameHe} value={form.nameHe} onChange={v=>setForm({...form,nameHe:v})} dir="rtl" th={th}/>
          <Field label={t.nameAr} value={form.nameAr} onChange={v=>setForm({...form,nameAr:v})} dir="rtl" th={th}/>
          <div style={{ display:"flex", gap:12 }}>
            <div style={{ flex:1 }}><Field label={t.duration} type="number" value={form.duration} onChange={v=>setForm({...form,duration:+v})} th={th}/></div>
            <div style={{ flex:1 }}><Field label={t.price}    type="number" value={form.price}    onChange={v=>setForm({...form,price:+v})}    th={th}/></div>
          </div>
          <div style={{ display:"flex", gap:10, justifyContent:"flex-end", marginTop:8 }}>
            <Btn label={t.cancel} secondary onClick={()=>setModal(null)} th={th}/>
            <Btn label={t.save}   onClick={save} loading={saving} th={th}/>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── STAFF PAGE ────────────────────────────────────────────────
function StaffPage({ toast, t, th }) {
  const [staff,setStaff]=useState([]); const [load,setLoad]=useState(true);
  const [modal,setModal]=useState(null); const [form,setForm]=useState({nameHe:"",nameAr:"",avatar:"👤"});
  const [saving,setSave]=useState(false);
  const load_=async()=>{ setLoad(true); try{ setStaff(await api("/staff")); }catch(e){ toast(e.message,"error"); } setLoad(false); };
  useEffect(()=>{ load_(); },[]);
  const save=async()=>{
    if(!form.nameHe||!form.nameAr) return;
    setSave(true);
    try {
      if(modal==="add") await api("/staff",{method:"POST",body:form});
      else await api(`/staff/${modal._id}`,{method:"PUT",body:form});
      toast(t.saved,"success"); setModal(null); load_();
    } catch(e){ toast(e.message,"error"); }
    setSave(false);
  };
  const del=async(id)=>{ if(!window.confirm(`${t.delete}?`)) return; try{ await api(`/staff/${id}`,{method:"DELETE"}); toast(t.removed,"success"); load_(); }catch(e){ toast(e.message,"error"); } };
  const AVATARS=["👨‍🦱","👩‍🦰","👨‍🦳","👩‍🦳","🧑‍⚕️","👩‍⚕️","💇","💆","👤","🧑","👦","👧"];
  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <h2 style={{ color:th.text, fontSize:22, fontWeight:800, margin:0 }}>{t.staff}</h2>
        <Btn label={t.addStaff} onClick={()=>{ setForm({nameHe:"",nameAr:"",avatar:"👤"}); setModal("add"); }} th={th}/>
      </div>
      {load ? <div style={{ display:"flex", justifyContent:"center", padding:60 }}><Spinner size={40} th={th}/></div>
        : <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))", gap:14 }}>
            {staff.map(s=>(
              <div key={s.id} style={{ background:th.surface, border:`1px solid ${th.border}`, borderRadius:16, padding:18, boxShadow:"0 1px 4px rgba(0,0,0,0.05)" }}>
                <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:14 }}>
                  <div style={{ width:56, height:56, borderRadius:14, background:th.accentBg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:30, flexShrink:0 }}>{s.avatar}</div>
                  <div>
                    <div style={{ color:th.text, fontWeight:700, fontSize:15 }}>{s.nameHe}</div>
                    <div style={{ color:th.muted, fontSize:12, marginTop:2 }}>{s.nameAr}</div>
                  </div>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div style={{ display:"flex", gap:6 }}>
                    <span style={{ background:th.greenBg, color:th.green, borderRadius:8, padding:"3px 10px", fontSize:12, fontWeight:600 }}>⭐ {s.rating}</span>
                    <span style={{ background:th.greenBg, color:th.green, borderRadius:8, padding:"3px 10px", fontSize:12, fontWeight:600 }}>{t.active}</span>
                  </div>
                  <div style={{ display:"flex", gap:6 }}>
                    <Btn small label={t.edit} onClick={()=>{ setForm({nameHe:s.nameHe,nameAr:s.nameAr,avatar:s.avatar}); setModal(s); }} th={th}/>
                    <Btn small danger label={t.delete} onClick={()=>del(s.id)} th={th}/>
                  </div>
                </div>
              </div>
            ))}
          </div>
      }
      {modal&&(
        <Modal title={modal==="add"?t.addStaffTitle:t.editStaff} onClose={()=>setModal(null)} th={th}>
          <div style={{ marginBottom:16 }}>
            <label style={{ color:th.muted, fontSize:12, display:"block", marginBottom:8 }}>{t.avatar}</label>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {AVATARS.map(av=><button key={av} onClick={()=>setForm({...form,avatar:av})} style={{ width:42, height:42, borderRadius:10, border:`2px solid ${form.avatar===av?th.accent:th.border2}`, background:form.avatar===av?th.accentBg:th.inputBg, fontSize:24, cursor:"pointer" }}>{av}</button>)}
            </div>
          </div>
          <Field label={t.nameHe} value={form.nameHe} onChange={v=>setForm({...form,nameHe:v})} dir="rtl" th={th}/>
          <Field label={t.nameAr} value={form.nameAr} onChange={v=>setForm({...form,nameAr:v})} dir="rtl" th={th}/>
          <div style={{ display:"flex", gap:10, justifyContent:"flex-end", marginTop:8 }}>
            <Btn label={t.cancel} secondary onClick={()=>setModal(null)} th={th}/>
            <Btn label={t.save}   onClick={save} loading={saving} th={th}/>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── USERS PAGE ────────────────────────────────────────────────
function UsersPage({ toast, t, th }) {
  const [users,setUsers]=useState([]); const [load,setLoad]=useState(true); const [search,setSearch]=useState("");
  const load_=async()=>{ setLoad(true); try{ setUsers(await api("/admin/users")); }catch(e){ toast(e.message,"error"); } setLoad(false); };
  useEffect(()=>{ load_(); },[]);
  const del=async(id)=>{ if(!window.confirm(`${t.delete}?`)) return; try{ await api(`/admin/users/${id}`,{method:"DELETE"}); toast(t.deleted,"success"); load_(); }catch(e){ toast(e.message,"error"); } };
  const filtered=users.filter(u=>!search||(u.name||"").toLowerCase().includes(search.toLowerCase())||(u.email||"").toLowerCase().includes(search.toLowerCase()));
  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12, marginBottom:20 }}>
        <h2 style={{ color:th.text, fontSize:22, fontWeight:800, margin:0 }}>{t.users} <span style={{ color:th.muted, fontSize:16, fontWeight:400 }}>({filtered.length})</span></h2>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={`🔍 ${t.searchUsers}`}
          style={{ padding:"8px 14px", borderRadius:10, background:th.inputBg, border:`1px solid ${th.border2}`, color:th.text, fontSize:13, outline:"none", width:220 }}/>
      </div>
      {load ? <div style={{ display:"flex", justifyContent:"center", padding:60 }}><Spinner size={40} th={th}/></div>
        : <div style={{ background:th.surface, borderRadius:16, border:`1px solid ${th.border}`, overflow:"hidden", boxShadow:"0 1px 4px rgba(0,0,0,0.06)" }}>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead>
                <tr style={{ borderBottom:`1px solid ${th.border2}` }}>
                  {[t.name,t.email,t.phone,t.role,t.joined,t.actions].map((h,i)=>(
                    <th key={i} style={{ color:th.muted, fontSize:11, fontWeight:600, padding:"10px 14px", textAlign:"start" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(u=>(
                  <tr key={u.id} style={{ borderBottom:`1px solid ${th.border}` }}
                    onMouseEnter={e=>e.currentTarget.style.background=th.rowHover}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <td style={{ padding:"11px 14px", color:th.text, fontSize:13, fontWeight:600 }}>{u.name}</td>
                    <td style={{ padding:"11px 14px", color:th.muted, fontSize:13 }}>{u.email}</td>
                    <td style={{ padding:"11px 14px", color:th.muted, fontSize:13 }}>{u.phone||"—"}</td>
                    <td style={{ padding:"11px 14px" }}>
                      <span style={{ background:u.role==="admin"?th.accentBg:th.greenBg, color:u.role==="admin"?th.accentText:th.green, borderRadius:8, padding:"3px 10px", fontSize:11, fontWeight:700 }}>{u.role}</span>
                    </td>
                    <td style={{ padding:"11px 14px", color:th.muted, fontSize:12 }}>{u.createdAt?.slice(0,10)}</td>
                    <td style={{ padding:"11px 14px" }}>{u.role!=="admin"&&<Btn small danger label={t.delete} onClick={()=>del(u.id)} th={th}/>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      }
    </div>
  );
}

// ── ROOT ──────────────────────────────────────────────────────
export default function App() {
  const [lang,     setLang]    = useState(()=>localStorage.getItem("admin_lang")||"he");
  const [mode,     setMode]    = useState(()=>localStorage.getItem("admin_theme")||"dark");
  const [user,     setUser]    = useState(null);
  const [page,     setPage]    = useState("dashboard");
  const [toast,    setToast]   = useState(null);
  const [checking, setCheck]   = useState(true);

  const t  = T[lang];
  const th = THEMES[mode];

  useEffect(()=>{ localStorage.setItem("admin_lang",lang); },[lang]);
  useEffect(()=>{ localStorage.setItem("admin_theme",mode); document.body.style.background=th.bg; document.body.style.fontFamily=t.font; document.body.style.direction=t.dir; },[mode,lang,t,th]);

  useEffect(()=>{
    const token=localStorage.getItem("admin_token");
    if(!token){ setCheck(false); return; }
    api("/auth/me").then(u=>{ setUser(u); setCheck(false); }).catch(()=>{ localStorage.removeItem("admin_token"); setCheck(false); });
  },[]);

  const showToast=(msg,type="success")=>setToast({msg,type});
  const logout=async()=>{ try{ await api("/auth/logout",{method:"POST"}); }catch(_){} localStorage.removeItem("admin_token"); setUser(null); };
  const toggleTheme=()=>setMode(m=>m==="dark"?"light":"dark");

  if(checking) return <div style={{ minHeight:"100vh", background:th.bg, display:"flex", alignItems:"center", justifyContent:"center" }}><Spinner size={40} th={th}/></div>;
  if(!user)    return <LoginPage onLogin={u=>setUser(u)} lang={lang} setLang={setLang} mode={mode} toggleTheme={toggleTheme} th={th}/>;

  const NAV=[
    {key:"dashboard",icon:"📊",label:t.dashboard},
    {key:"bookings", icon:"📅",label:t.bookings},
    {key:"services", icon:"✂️", label:t.services},
    {key:"staff",    icon:"👥",label:t.staff},
    {key:"users",    icon:"👤",label:t.users},
  ];

  return (
    <div style={{ minHeight:"100vh", background:th.bg, fontFamily:t.font, direction:t.dir, display:"flex", transition:"background 0.3s" }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} *{box-sizing:border-box;margin:0;padding:0} input,button,select,textarea{font-family:inherit} body{transition:background 0.3s}`}</style>

      {/* Sidebar */}
      <div style={{ width:230, background:th.sidebar, display:"flex", flexDirection:"column", flexShrink:0, position:"sticky", top:0, height:"100vh", overflowY:"auto", borderInlineEnd:`1px solid ${th.border}`, boxShadow:`1px 0 8px rgba(0,0,0,0.04)`, transition:"background 0.3s" }}>
        <div style={{ padding:"22px 20px 16px", borderBottom:`1px solid ${th.border}` }}>
          <div style={{ fontSize:28, marginBottom:6 }}>💈</div>
          <div style={{ color:th.text, fontWeight:800, fontSize:17 }}>{t.appName}</div>
          <div style={{ color:th.muted, fontSize:11, marginTop:2 }}>{t.subtitle}</div>
        </div>

        {/* Lang + Theme toggles */}
        <div style={{ padding:"12px 14px 8px", borderBottom:`1px solid ${th.border}`, display:"flex", flexDirection:"column", gap:8 }}>
          <LangSwitcher lang={lang} setLang={setLang} th={th}/>
          <ThemeToggle mode={mode} toggle={toggleTheme} th={th} t={t}/>
        </div>

        <nav style={{ flex:1, padding:"10px 10px" }}>
          {NAV.map(n=>(
            <button key={n.key} onClick={()=>setPage(n.key)} style={{
              width:"100%", padding:"10px 14px", borderRadius:10, border:"none", cursor:"pointer",
              background:page===n.key?th.accentBg:"transparent",
              color:page===n.key?th.accentText:th.muted,
              display:"flex", alignItems:"center", gap:10, fontFamily:t.font, fontSize:14,
              fontWeight:page===n.key?700:400, marginBottom:2,
              textAlign:t.dir==="rtl"?"right":"left",
              borderInlineStart:page===n.key?`3px solid ${th.accent}`:"3px solid transparent",
              transition:"all 0.15s",
            }}>
              <span style={{ fontSize:18 }}>{n.icon}</span>{n.label}
            </button>
          ))}
        </nav>

        <div style={{ padding:"14px 10px", borderTop:`1px solid ${th.border}` }}>
          <div style={{ padding:"8px 14px", marginBottom:8 }}>
            <div style={{ color:th.text, fontSize:13, fontWeight:600 }}>{user.name}</div>
            <div style={{ color:th.muted, fontSize:11 }}>{user.email}</div>
          </div>
          <button onClick={logout} style={{ width:"100%", padding:"9px 14px", borderRadius:10, border:`1px solid ${th.border2}`, background:"transparent", color:th.muted, fontFamily:t.font, fontSize:13, cursor:"pointer", display:"flex", alignItems:"center", gap:8 }}>
            🚪 {t.logout}
          </button>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex:1, padding:"36px 36px", overflowY:"auto", minHeight:"100vh", transition:"background 0.3s" }}>
        {page==="dashboard" && <DashboardPage toast={showToast} t={t} th={th}/>}
        {page==="bookings"  && <BookingsPage  toast={showToast} t={t} th={th}/>}
        {page==="services"  && <ServicesPage  toast={showToast} t={t} th={th}/>}
        {page==="staff"     && <StaffPage     toast={showToast} t={t} th={th}/>}
        {page==="users"     && <UsersPage     toast={showToast} t={t} th={th}/>}
      </div>

      {toast && <Toast msg={toast.msg} type={toast.type} th={th} onClose={()=>setToast(null)}/>}
    </div>
  );
}
