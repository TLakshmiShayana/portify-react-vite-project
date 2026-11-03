import React, { useEffect, useMemo, useState } from "react";
import { Routes, Route, Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Sparkles, LayoutTemplate, ShieldCheck, UserRound, LogOut, Menu, X, Code2, Palette, Zap, CheckCircle2, Plus, Trash2, Eye, Pencil, Users, Layers, Mail, Github, Linkedin, MapPin } from "lucide-react";
import { starterTemplates, demoPortfolio } from "./data";

const read = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
};
const save = (key, value) => localStorage.setItem(key, JSON.stringify(value));

function App() {
  const [user, setUser] = useState(() => read("portify_session", null));
  const [templates, setTemplates] = useState(() => read("portify_templates", starterTemplates));
  const [portfolio, setPortfolio] = useState(() => read("portify_portfolio", demoPortfolio));
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => save("portify_templates", templates), [templates]);
  useEffect(() => save("portify_portfolio", portfolio), [portfolio]);
  useEffect(() => save("portify_session", user), [user]);

  function logout() { setUser(null); navigate("/"); }
  function login(email, password) {
    if (email === "admin@portify.com" && password === "admin123") {
      const admin = { name: "Admin", email, role: "admin" }; setUser(admin); save("portify_session", admin); navigate("/admin"); return { ok: true };
    }
    const users = read("portify_users", []);
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!found) return { ok: false, message: "Account not found or password is incorrect. Please sign up first." };
    const session = { name: found.name, email: found.email, role: "user" };
    setUser(session); save("portify_session", session); navigate("/dashboard"); return { ok: true };
  }
  function signup(name, email, password) {
    const users = read("portify_users", []);
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) return { ok: false, message: "An account with this email already exists." };
    const next = [...users, { name, email, password, createdAt: new Date().toISOString() }];
    save("portify_users", next);
    const session = { name, email, role: "user" }; setUser(session); save("portify_session", session);
    navigate("/dashboard"); return { ok: true };
  }
  const updateTemplates = fn => setTemplates(current => fn(current));
  const protectedProps = { user, templates, portfolio, setPortfolio, updateTemplates, logout, login, signup };
  return <>
    <Navbar user={user} logout={logout} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen}/>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/templates" element={<Templates templates={templates} user={user}/>}/>
      <Route path="/login" element={<Auth mode="login" login={login}/>}/>
      <Route path="/signup" element={<Auth mode="signup" signup={signup}/>}/>
      <Route path="/dashboard" element={<Guard user={user}><Dashboard {...protectedProps}/></Guard>}/>
      <Route path="/builder" element={<Guard user={user}><Builder {...protectedProps}/></Guard>}/>
      <Route path="/preview" element={<Guard user={user}><Preview portfolio={portfolio} template={portfolio.template || "modern"}/></Guard>}/>
      <Route path="/admin" element={<Guard user={user} admin><Admin {...protectedProps}/></Guard>}/>
      <Route path="*" element={<NotFound/>}/>
    </Routes>
    {location.pathname !== "/login" && location.pathname !== "/signup" && <Footer/>}
  </>;
}

function Navbar({ user, logout, mobileOpen, setMobileOpen }) {
  return <header className="nav-wrap"><nav className="nav container">
    <Link to="/" className="brand"><span className="brand-mark"><Sparkles size={18}/></span> portify<span className="brand-dot">.</span></Link>
    <div className={`nav-links ${mobileOpen ? "open" : ""}`}>
      <NavLink to="/templates" onClick={()=>setMobileOpen(false)}>Templates</NavLink>
      {user && user.role === "user" && <NavLink to="/dashboard" onClick={()=>setMobileOpen(false)}>Dashboard</NavLink>}
      {user?.role === "admin" && <NavLink to="/admin" onClick={()=>setMobileOpen(false)}>Admin</NavLink>}
      {user ? <button className="btn btn-small btn-outline" onClick={logout}><LogOut size={15}/> Logout</button> :
        <><NavLink to="/login" onClick={()=>setMobileOpen(false)}>Log in</NavLink><Link className="btn btn-small btn-primary" to="/signup" onClick={()=>setMobileOpen(false)}>Get started <ArrowUpRight size={15}/></Link></>}
    </div>
    <button className="mobile-toggle" onClick={()=>setMobileOpen(!mobileOpen)} aria-label="Toggle menu">{mobileOpen?<X/>:<Menu/>}</button>
  </nav></header>;
}

function Home() {
  return <main>
    <section className="hero container">
      <div className="hero-copy">
        <div className="eyebrow"><span className="pulse"></span> YOUR STORY, BEAUTIFULLY BUILT</div>
        <h1>Make your work<br/> <span className="gradient-text">impossible to ignore.</span></h1>
        <p className="hero-desc">Create a personal portfolio that feels like you. Pick a template, add your story, and share your next big thing with the world.</p>
        <div className="hero-actions"><Link to="/templates" className="btn btn-primary">Explore templates <ArrowRight size={17}/></Link><Link to="/signup" className="btn btn-ghost">Create your portfolio</Link></div>
        <div className="hero-proof"><div className="avatar-stack"><i>A</i><i>M</i><i>J</i><i>+</i></div><span>Made for your next opportunity</span></div>
      </div>
      <div className="hero-art">
        <div className="art-glow"></div>
        <div className="browser-card">
          <div className="browser-top"><div className="window-dots"><i/><i/><i/></div><span>alexmorgan.dev</span><span className="browser-menu">•••</span></div>
          <div className="mock-profile">
            <div className="mock-kicker">AVAILABLE FOR OPPORTUNITIES <span></span></div>
            <div className="mock-heading">Hey, I'm Alex.<br/><em>I build for the web.</em></div>
            <p>Frontend developer crafting digital experiences with purpose.</p>
            <div className="mock-tags"><b>React</b><b>UI Design</b><b>Creative code</b></div>
            <div className="mock-projects"><div><small>FEATURED PROJECT</small><strong>Orbit — Design system</strong></div><div className="project-symbol"><Code2/></div></div>
          </div>
        </div>
        <div className="floating-note note-one"><Sparkles size={15}/> Thoughtful design</div>
        <div className="floating-note note-two"><CheckCircle2 size={15}/> Ready to share</div>
      </div>
    </section>
    <section className="stats container"><div><strong>03</strong><span>Curated templates</span></div><div><strong>02</strong><span>Dedicated modules</span></div><div><strong>100%</strong><span>Responsive layout</span></div><div><strong>∞</strong><span>Room to grow</span></div></section>
    <section className="section container">
      <div className="section-heading"><div><div className="eyebrow">FIND YOUR LOOK</div><h2>Templates with <span className="gradient-text">personality.</span></h2></div><Link to="/templates" className="text-link">View all templates <ArrowUpRight size={16}/></Link></div>
      <TemplateGrid templates={starterTemplates.slice(0,3)} />
    </section>
    <section className="feature-band"><div className="container feature-grid"><div><div className="eyebrow">MADE TO BE SIMPLE</div><h2>From blank page<br/>to <span className="gradient-text">your next chapter.</span></h2><p>Everything you need to present your skills, projects, and personality in one place.</p><Link to="/signup" className="btn btn-primary">Start building <ArrowRight size={16}/></Link></div><div className="feature-list"><Feature icon={<LayoutTemplate/>} title="Choose a template" text="Start with a design that matches your style."/><Feature icon={<Pencil/>} title="Make it yours" text="Add your bio, skills, education, and projects."/><Feature icon={<Zap/>} title="Preview & share" text="Review your portfolio before presenting it."/></div></div></section>
    <section className="cta container"><div><div className="eyebrow">YOUR NEXT STEP STARTS HERE</div><h2>Good work deserves<br/>a great <span className="gradient-text">first impression.</span></h2><Link to="/signup" className="btn btn-primary">Create your free portfolio <ArrowRight size={17}/></Link></div><div className="cta-orbit"><div className="orbit o1"></div><div className="orbit o2"></div><Sparkles size={45}/></div></section>
  </main>;
}

function Feature({icon,title,text}) { return <div className="feature-item"><div className="feature-icon">{icon}</div><div><h3>{title}</h3><p>{text}</p></div></div>; }

function TemplateGrid({ templates, onSelect, selected }) {
  return <div className="template-grid">{templates.map((t,i)=><article className={`template-card ${selected===t.id?"selected":""}`} key={t.id}>
    <div className={`template-thumb thumb-${t.style}`}>
      <div className="thumb-browser"><span>● ● ●</span><span>portfolio.site</span></div>
      <div className="thumb-content"><div className="thumb-side"><span>PORTFOLIO / 2026</span><b>{t.id==="modern"?"Build boldly.":t.id==="minimal"?"Hello, I'm Alex.":"Ideas into impact."}</b><small>{t.id==="modern"?"Developer & creator":t.id==="minimal"?"Product designer":"Creative developer"}</small><i></i><i></i></div><div className="thumb-shape">{t.id==="modern"?"✳":t.id==="minimal"?"A":"✦"}</div></div>
      <span className="template-number">0{i+1}</span>
    </div>
    <div className="template-info"><div><span className="category">{t.category}</span><h3>{t.name}</h3><p>{t.description}</p></div><button className="icon-button" onClick={()=>onSelect?onSelect(t.id):null} aria-label={`Select ${t.name}`}><ArrowUpRight size={19}/></button></div>
    <div className="template-foot"><span className="template-tag">{t.tag}</span><span className="template-type">{t.style} theme</span></div>
  </article>)}</div>;
}

function Templates({templates,user}) {
  const [filter,setFilter]=useState("All");
  const navigate=useNavigate();
  const categories=["All","Developer","Professional","Creative"];
  const filtered=templates.filter(t=>filter==="All"||t.category===filter);
  return <main className="page container"><div className="page-intro"><div className="eyebrow">THE TEMPLATE LIBRARY</div><h1>Find a look that feels <span className="gradient-text">like you.</span></h1><p>Choose a starting point. You can personalize the content in your portfolio builder.</p></div>
    <div className="filter-row">{categories.map(c=><button key={c} onClick={()=>setFilter(c)} className={`filter-chip ${filter===c?"active":""}`}>{c}</button>)}</div>
    <TemplateGrid templates={filtered} onSelect={id=>navigate(user?`/builder?template=${id}`:"/signup")}/>
    {!user&&<p className="center-note">Create an account to select a template and start building.</p>}
  </main>;
}

function Auth({mode,login,signup}) {
  const isLogin=mode==="login"; const [name,setName]=useState(""); const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [error,setError]=useState("");
  function submit(e){e.preventDefault();setError("");const result=isLogin?login(email,password):signup(name,email,password);if(!result.ok)setError(result.message);}
  return <main className="auth-page"><div className="auth-decoration"></div><div className="auth-card"><Link to="/" className="brand"><span className="brand-mark"><Sparkles size={18}/></span> portify<span className="brand-dot">.</span></Link><div className="eyebrow">{isLogin?"WELCOME BACK":"YOUR PORTFOLIO STARTS HERE"}</div><h1>{isLogin?"Good to see you.":"Create your account."}</h1><p>{isLogin?"Log in to continue building your story.":"Join Portify and make your work stand out."}</p>
    <form onSubmit={submit} className="form-stack">{!isLogin&&<label>Full name<input required value={name} onChange={e=>setName(e.target.value)} placeholder="Your name"/></label>}<label>Email address<input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/></label><label>Password<input type="password" minLength="6" required value={password} onChange={e=>setPassword(e.target.value)} placeholder="At least 6 characters"/></label>{error&&<div className="error-message">{error}</div>}<button className="btn btn-primary btn-full" type="submit">{isLogin?"Log in":"Create account"} <ArrowRight size={17}/></button></form>
    <div className="auth-switch">{isLogin?"New to Portify?":"Already have an account?"} <Link to={isLogin?"/signup":"/login"}>{isLogin?"Create an account":"Log in"}</Link></div>
    {isLogin&&<div className="demo-hint"><ShieldCheck size={15}/> Admin demo: admin@portify.com / admin123</div>}
    <div className="privacy-note">Demo authentication uses browser Local Storage. Do not use real or sensitive passwords.</div>
  </div></main>;
}

function Guard({user,admin=false,children}) { const location=useLocation(); if(!user)return <div className="access-message"><ShieldCheck size={28}/><h2>Log in to continue</h2><p>This area is available to registered users.</p><Link className="btn btn-primary" to="/login" state={{from:location.pathname}}>Go to login <ArrowRight size={16}/></Link></div>; if(admin&&user.role!=="admin")return <div className="access-message"><ShieldCheck size={28}/><h2>Admin access only</h2><p>Your account does not have permission to view this page.</p><Link className="btn btn-primary" to="/dashboard">Go to dashboard</Link></div>; return children; }

function Dashboard({user,portfolio,setPortfolio,templates}) {
  const navigate=useNavigate(); const [users]=useState(()=>read("portify_users",[]));
  return <main className="page container"><div className="dashboard-top"><div><div className="eyebrow">YOUR WORKSPACE</div><h1>Welcome back, <span className="gradient-text">{user.name.split(" ")[0]}.</span></h1><p>Your next opportunity is one great portfolio away.</p></div><Link to="/builder" className="btn btn-primary"><Plus size={17}/> Edit portfolio</Link></div>
    <div className="dashboard-stats"><div className="dash-stat"><span>PORTFOLIO STATUS</span><strong><i className="status-dot"></i> In progress</strong></div><div className="dash-stat"><span>AVAILABLE TEMPLATES</span><strong>{templates.length}</strong></div><div className="dash-stat"><span>ACCOUNT</span><strong className="small-stat">{user.email}</strong></div></div>
    <div className="dashboard-layout"><section className="panel portfolio-panel"><div className="panel-heading"><div><span className="eyebrow">YOUR PORTFOLIO</span><h2>{portfolio.name || "Untitled portfolio"}</h2></div><button className="btn btn-outline btn-small" onClick={()=>navigate("/preview")}><Eye size={15}/> Preview</button></div><div className={`portfolio-preview preview-${portfolio.template||"modern"}`}><div className="preview-label">LIVE PREVIEW</div><div className="preview-name">{portfolio.name||"Your Name"}<br/><span>{portfolio.role||"Your role goes here."}</span></div><div className="preview-line"></div><p>{portfolio.bio||"Your introduction will appear here."}</p><span className="preview-pill">SELECTED DESIGN · {(portfolio.template||"modern").toUpperCase()}</span></div><div className="panel-bottom"><span>Last saved automatically in this browser</span><Link to="/builder" className="text-link">Customize <ArrowUpRight size={15}/></Link></div></section>
    <section className="panel quick-panel"><span className="eyebrow">QUICK ACTIONS</span><h2>Keep creating.</h2><button className="quick-action" onClick={()=>navigate("/builder")}><span><Pencil/></span><div><b>Edit your details</b><small>Update your bio, skills, and projects</small></div><ArrowUpRight/></button><button className="quick-action" onClick={()=>navigate("/templates")}><span><LayoutTemplate/></span><div><b>Explore templates</b><small>Try a different portfolio style</small></div><ArrowUpRight/></button><button className="quick-action" onClick={()=>navigate("/preview")}><span><Eye/></span><div><b>Preview portfolio</b><small>See how your portfolio looks</small></div><ArrowUpRight/></button></section></div>
  </main>;
}

function Builder({portfolio,setPortfolio,templates}) {
  const navigate=useNavigate(); const params=new URLSearchParams(window.location.search); const [form,setForm]=useState({...portfolio,template:params.get("template")||portfolio.template||"modern"}); const [saved,setSaved]=useState(false);
  function change(e){setForm({...form,[e.target.name]:e.target.value});setSaved(false);}
  function submit(e){e.preventDefault();setPortfolio(form);setSaved(true);}
  return <main className="page container"><div className="builder-header"><div><div className="eyebrow">PORTFOLIO EDITOR</div><h1>Make it <span className="gradient-text">yours.</span></h1><p>Add your details and choose the design you want to show the world.</p></div><button className="btn btn-outline" onClick={()=>navigate("/preview")}><Eye size={16}/> Preview</button></div>
    <form className="builder-layout" onSubmit={submit}><section className="panel editor-panel"><div className="editor-section"><div className="editor-title"><span>01</span><div><h2>Personal details</h2><p>Introduce yourself to the world.</p></div></div><div className="field-grid"><label>Full name<input name="name" value={form.name||""} onChange={change} placeholder="Your full name" required/></label><label>Professional title<input name="role" value={form.role||""} onChange={change} placeholder="e.g. Frontend Developer"/></label><label>Email<input name="email" type="email" value={form.email||""} onChange={change} placeholder="you@example.com"/></label><label>Location<input name="location" value={form.location||""} onChange={change} placeholder="City, Country"/></label><label className="field-wide">About you<textarea name="bio" rows="4" value={form.bio||""} onChange={change} placeholder="Write a short introduction..."/></label></div></div>
    <div className="editor-section"><div className="editor-title"><span>02</span><div><h2>Skills & education</h2><p>Highlight what you know and what you've learned.</p></div></div><div className="field-grid"><label className="field-wide">Skills (separate with commas)<input name="skills" value={form.skills||""} onChange={change} placeholder="React, JavaScript, CSS..."/></label><label className="field-wide">Education<input name="education" value={form.education||""} onChange={change} placeholder="Degree, institution, year"/></label></div></div>
    <div className="editor-section"><div className="editor-title"><span>03</span><div><h2>Projects & links</h2><p>One project per line. Use Project title|Description.</p></div></div><div className="field-grid"><label className="field-wide">Projects<textarea name="projects" rows="5" value={form.projects||""} onChange={change} placeholder={"Project title|What you built and why it matters."}/></label><label>GitHub URL<input name="github" value={form.github||""} onChange={change} placeholder="https://github.com/..."/></label><label>LinkedIn URL<input name="linkedin" value={form.linkedin||""} onChange={change} placeholder="https://linkedin.com/in/..."/></label></div></div>
    <div className="editor-section"><div className="editor-title"><span>04</span><div><h2>Choose your template</h2><p>You can change your design anytime.</p></div></div><div className="template-choice">{templates.map(t=><button type="button" key={t.id} className={`choice-card ${form.template===t.id?"choice-active":""}`} onClick={()=>setForm({...form,template:t.id})}><div className={`choice-thumb thumb-${t.style}`}><span>{t.id==="modern"?"✳":t.id==="minimal"?"A":"✦"}</span></div><b>{t.name}</b><small>{form.template===t.id?"Selected":"Select template"}</small></button>)}</div></div>
    <div className="save-row">{saved&&<span className="saved-message"><CheckCircle2 size={16}/> Portfolio saved!</span>}<button className="btn btn-primary" type="submit">Save changes <CheckCircle2 size={16}/></button></div></section>
    <aside className="builder-aside"><div className="panel tip-panel"><Sparkles size={21}/><h3>A little tip</h3><p>Keep your introduction short, use action words, and add projects that show what you can actually build.</p></div><div className="panel progress-panel"><span className="eyebrow">PROFILE CHECKLIST</span>{["Personal details","Professional title","About section","Skills","Education","Projects"].map((x,i)=><div className="check-row" key={x}><CheckCircle2 size={16}/>{x}</div>)}</div></aside></form>
  </main>;
}

function Preview({portfolio:p,template}) {
  const projects=(p.projects||"").split("\n").filter(Boolean).map(line=>{const [title,...desc]=line.split("|");return {title,desc:desc.join("|")};});
  return <main className={`public-preview public-${template}`}><div className="public-nav"><Link to="/" className="brand">portify<span className="brand-dot">.</span></Link><div><a href="#work">Work</a><a href="#about">About</a><a href={`mailto:${p.email}`}>Contact</a></div><Link to="/builder" className="btn btn-small btn-outline">Edit portfolio <Pencil size={14}/></Link></div>
    <section className="public-hero"><div className="eyebrow"><span className="pulse"></span> PORTFOLIO / 2026</div><h1>{p.name||"Your Name"}<br/><em>{p.role||"Your professional title"}</em></h1><p>{p.bio||"A short introduction about you will appear here."}</p><div className="public-actions"><a className="btn btn-primary" href={`mailto:${p.email}`}>Get in touch <ArrowUpRight size={16}/></a><a className="btn btn-ghost" href={p.github||"#"} target="_blank" rel="noreferrer">View GitHub <Github size={16}/></a></div></section>
    <section id="about" className="public-section"><div className="public-section-head"><span>01 / ABOUT</span><h2>A little about me.</h2></div><div className="public-about"><p>{p.bio}</p><div className="public-meta"><span><MapPin size={15}/>{p.location}</span><span><Mail size={15}/>{p.email}</span></div></div></section>
    <section className="public-section"><div className="public-section-head"><span>02 / EXPERTISE</span><h2>Things I work with.</h2></div><div className="skill-pills">{(p.skills||"").split(",").filter(Boolean).map(s=><span key={s}>{s.trim()}</span>)}</div></section>
    <section id="work" className="public-section"><div className="public-section-head"><span>03 / SELECTED WORK</span><h2>Projects & experiments.</h2></div><div className="public-projects">{projects.map((project,i)=><article className="public-project" key={i}><span>0{i+1}</span><div><h3>{project.title}</h3><p>{project.desc||"A project built with curiosity and care."}</p></div><ArrowUpRight/></article>)}</div></section>
    <section className="public-section education"><div className="public-section-head"><span>04 / EDUCATION</span><h2>Learning never stops.</h2></div><p>{p.education}</p></section>
    <footer className="public-footer"><h2>Have a good project in mind?</h2><a href={`mailto:${p.email}`}>{p.email} <ArrowUpRight/></a><small>Designed with Portify · Personal portfolio preview</small></footer>
  </main>;
}

function Admin({user,templates,updateTemplates}) {
  const users=read("portify_users",[]);
  const [name,setName]=useState("");const [category,setCategory]=useState("Developer");const [description,setDescription]=useState("");const [notice,setNotice]=useState("");
  function add(e){e.preventDefault();const id=name.toLowerCase().replace(/[^a-z0-9]+/g,"-")+"-"+Date.now();updateTemplates(t=>[...t,{id,name,category,description,style:category==="Professional"?"light":category==="Creative"?"colorful":"dark",tag:"Admin added",color:"violet"}]);setName("");setDescription("");setNotice("Template added successfully.");}
  function remove(id){updateTemplates(t=>t.filter(x=>x.id!==id));setNotice("Template deleted.");}
  return <main className="page container"><div className="dashboard-top"><div><div className="eyebrow">ADMIN CONTROL CENTER</div><h1>Manage <span className="gradient-text">Portify.</span></h1><p>Manage registered accounts and the template library.</p></div><span className="admin-pill"><ShieldCheck size={16}/> Administrator</span></div>
    <div className="dashboard-stats"><div className="dash-stat"><span>REGISTERED USERS</span><strong>{users.length}</strong></div><div className="dash-stat"><span>ACTIVE TEMPLATES</span><strong>{templates.length}</strong></div><div className="dash-stat"><span>ADMIN ACCOUNT</span><strong className="small-stat">{user.email}</strong></div></div>
    <div className="admin-layout"><section className="panel"><div className="panel-heading"><div><span className="eyebrow">TEMPLATE LIBRARY</span><h2>Manage templates</h2></div><span className="count-pill"><Layers size={14}/>{templates.length} total</span></div>{notice&&<div className="success-message">{notice}</div>}<div className="admin-template-list">{templates.map(t=><div className="admin-template" key={t.id}><div className={`admin-template-icon thumb-${t.style}`}>{t.id==="modern"?"✳":t.id==="minimal"?"A":"✦"}</div><div><b>{t.name}</b><small>{t.category} · {t.style} theme</small></div><button className="delete-button" onClick={()=>remove(t.id)} title="Delete template"><Trash2 size={17}/></button></div>)}</div></section>
    <section className="panel"><span className="eyebrow">ADD NEW DESIGN</span><h2>Create a template</h2><form className="form-stack admin-form" onSubmit={add}><label>Template name<input value={name} onChange={e=>setName(e.target.value)} required placeholder="e.g. Elegant Resume"/></label><label>Category<select value={category} onChange={e=>setCategory(e.target.value)}><option>Developer</option><option>Professional</option><option>Creative</option></select></label><label>Description<textarea rows="3" value={description} onChange={e=>setDescription(e.target.value)} required placeholder="Describe this template"/></label><button className="btn btn-primary btn-full">Add template <Plus size={16}/></button></form></section></div>
    <section className="panel users-panel"><div className="panel-heading"><div><span className="eyebrow">USER ACCOUNTS</span><h2>Registered users</h2></div><span className="count-pill"><Users size={14}/>{users.length} users</span></div>{users.length===0?<p className="empty-state">No registered users yet. New signups will appear here.</p>:<div className="user-table"><div className="user-row user-head"><span>Name</span><span>Email</span><span>Joined</span></div>{users.map(u=><div className="user-row" key={u.email}><span>{u.name}</span><span>{u.email}</span><span>{new Date(u.createdAt).toLocaleDateString()}</span></div>)}</div>}</section>
  </main>;
}

function NotFound(){return <div className="access-message"><h2>Page not found</h2><Link to="/" className="btn btn-primary">Back home</Link></div>}
function Footer(){return <footer className="site-footer"><div className="container footer-inner"><Link to="/" className="brand">portify<span className="brand-dot">.</span></Link><span>Make your work impossible to ignore.</span><span>© 2026 Portify</span></div></footer>}
export default App;