import { useEffect, useMemo, useState } from "react";
import { Link, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import { BookOpen, Search, SlidersHorizontal, GraduationCap, ArrowRight, Menu, X, UserRound, PlayCircle, Home as HomeIcon, CircleHelp, Mail, Download, FileText, ShieldCheck, Info, LogOut, RefreshCw, Folder, Bell, LayoutGrid, Bookmark, CreditCard, Sparkles, Calculator, CalendarDays, Award, Phone, ChevronRight, Star, Eye, EyeOff } from "lucide-react";
import axios from "axios";

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || (import.meta.env.PROD ? "https://eduguru-mern-api.vercel.app/api" : "http://localhost:5000/api") });
api.interceptors.request.use(config => {
  const token = localStorage.getItem("eduguru-token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
const fallbackCourses = [
  { title: "Complete Quran Learning Course", slug: "complete-quran-learning-course", description: "A structured learning path with guided lessons and practice.", instructor: "EduGuru Learning Team", category: "Religious Studies", level: "Beginner", price: 0, lessonsCount: 24 },
  { title: "Foundations of Web Development", slug: "foundations-of-web-development", description: "Learn the core concepts behind modern websites and web applications.", instructor: "EduGuru Learning Team", category: "Technology", level: "Beginner", price: 0, lessonsCount: 18 },
  { title: "JavaScript for Practical Projects", slug: "javascript-for-practical-projects", description: "Build confidence with JavaScript through practical examples.", instructor: "EduGuru Learning Team", category: "Technology", level: "Intermediate", price: 2500, lessonsCount: 30 },
  { title: "Study Skills and Exam Preparation", slug: "study-skills-exam-preparation", description: "Build better learning habits, revision routines, and exam strategies.", instructor: "EduGuru Learning Team", category: "Personal Development", level: "Beginner", price: 0, lessonsCount: 12, image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1000&q=85" },
  { title: "UI Design Fundamentals", slug: "ui-design-fundamentals", description: "Learn layout, color, typography, and practical design principles for digital products.", instructor: "EduGuru Learning Team", category: "Design", level: "Beginner", price: 1800, lessonsCount: 16, image: "https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=1000&q=85" },
  { title: "Python for Everyday Automation", slug: "python-everyday-automation", description: "Use Python to simplify repetitive tasks and build useful small tools.", instructor: "EduGuru Learning Team", category: "Technology", level: "Beginner", price: 2200, lessonsCount: 22, image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1000&q=85" },
  { title: "English Communication Skills", slug: "english-communication-skills", description: "Practice clear speaking, listening, and confident communication in everyday situations.", instructor: "EduGuru Learning Team", category: "Languages", level: "All levels", price: 0, lessonsCount: 20, image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1000&q=85" }
];
const pageInfo = {
  "/about": { title: "About EduGuru", intro: "Learn · Grow · Succeed", body: "EduGuru helps learners discover courses, build knowledge, and take the next step in their learning journey.", icon: Info },
  "/terms": { title: "Terms and Conditions", intro: "Using EduGuru", body: "Please use EduGuru respectfully and provide accurate information when creating an account. Course access and availability may vary.", icon: FileText },
  "/privacy": { title: "Privacy Policy", intro: "Your information matters", body: "EduGuru uses account information to provide learning services. Keep your sign-in details secure and contact support with privacy questions.", icon: ShieldCheck },
  "/contact": { title: "Contact Us", intro: "We’re here to help", body: "Have a question about learning on EduGuru? Send a message to our support team using the contact form below.", icon: Mail },
  "/help-support": { title: "Help & Support", intro: "How can we help?", body: "Find help with your account, course access, and getting started with EduGuru.", icon: CircleHelp },
  "/resources": { title: "Learning Resources", intro: "Keep discovering", body: "Explore courses and learning materials designed to help you grow your knowledge and skills.", icon: BookOpen },
  "/download-app": { title: "Learn on the go", intro: "EduGuru wherever you are", body: "Keep this page bookmarked and check back for updates about the EduGuru mobile learning experience.", icon: Download }
};
function Header() {
  return <header className="header reference-header"><Link to="/" className="brand" aria-label="EduGuru home"><span className="brand-mark"><GraduationCap size={24}/></span><span>EduGuru</span></Link><div className="reference-header-actions"><button aria-label="Refresh page" onClick={() => window.location.reload()}><RefreshCw size={17}/></button><Link to="/menu" aria-label="Open menu"><Folder size={18}/></Link><Link to="/profile" aria-label="Notifications"><Bell size={18}/></Link></div></header>;
}
const categoryImages = {
  "religious studies": "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=1000&q=85",
  technology: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1000&q=85",
  "personal development": "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1000&q=85",
  design: "https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=1000&q=85",
  languages: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1000&q=85"
};
function courseImage(course) {
  const key = String(course.category || "").toLowerCase();
  return course.image || course.imageUrl || categoryImages[key] || categoryImages.technology;
}
function CourseCard({ course, referenceMode = false, index = 0 }) {
  const slug = course.slug || String(course.title || "course").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return <Link className={referenceMode ? "course-card reference-course-card" : "course-card"} to={`/course/${slug}`} aria-label={`Open course: ${course.title}`}><div className={`course-art art-${String(course.category || "learning").toLowerCase().replace(/[^a-z]/g, "")}`}><img className="course-image" src={courseImage(course)} alt={`${course.title} course`} loading="lazy" onError={e => { e.currentTarget.style.display = "none"; }}/>{referenceMode && <span className={`discount-tag discount-${index%4}`}>{Number(course.price)===0?"Free":`-${[46,30,33,56][index%4]}%`}</span>}{!referenceMode && <span className="level-tag">{course.level || "All levels"}</span>}</div><div className="course-content">{referenceMode ? <><h3>{course.title}</h3><span className="instructor-pill">{course.instructor || "EDUGURU"}</span><div className="rating-pill"><span>★ 0.0</span><span>♙ {index%3}</span></div><div className="course-meta"><strong>{Number(course.price)===0?"FREE":`LKR ${Number(course.price).toLocaleString()}`}</strong></div></> : <><div className="course-category">{course.category || "Learning"}</div><h3>{course.title}</h3><p>{course.description}</p><div className="course-meta"><span><PlayCircle size={15}/> {course.lessonsCount || 0} lessons</span><strong>{Number(course.price) === 0 ? "FREE" : `LKR ${Number(course.price).toLocaleString()}`}</strong></div></>}</div></Link>;
}
function useCourses() {
  const [courses, setCourses] = useState(fallbackCourses);
  useEffect(() => { let active = true; api.get("/courses").then(r => { if (active && Array.isArray(r.data.courses) && r.data.courses.length) setCourses(r.data.courses); }).catch(() => {}); return () => { active = false; }; }, []);
  return courses;
}
function Home() {
  const courses = useCourses();
  const [search,setSearch] = useState("");
  const [tab,setTab] = useState("Popular");
  return <main className="reference-home"><section className="reference-home-hero"><div className="reference-hero-orb"/><div className="reference-hero-title">What will you<br/>learn today?</div><form className="reference-home-search" onSubmit={e=>{e.preventDefault();window.location.href="/browse?search="+encodeURIComponent(search)}}><Search size={17}/><input placeholder="Search courses, teachers..." value={search} onChange={e=>setSearch(e.target.value)}/><button type="submit"><Search size={15}/> Search</button></form></section><div className="reference-home-tabs">{["For You","Popular","🔥 Fire","♜ Institute","▦"].map(label=><button className={tab===label?"selected":""} onClick={()=>setTab(label)} key={label}>{label}</button>)}</div><section className="reference-feature-row"><Link to="/browse" className="reference-featured-course"><img src="https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&w=900&q=85" alt="Graphic design course"/><span>GRAPHIC DESIGN<br/><b>COURSE</b></span><strong>LIMITED SEATS LEFT</strong></Link><div className="reference-feature-stacks"><Link to="/browse" className="reference-feature-stack guru"><span><BookOpen size={29}/></span><div><strong>Guru Tests</strong><small>Mock exams &amp; practice tests</small></div><ChevronRight size={16}/></Link><Link to="/browse" className="reference-feature-stack school"><span><GraduationCap size={30}/></span><div><strong>My School</strong><small>Classes &amp; schedules</small></div><ChevronRight size={16}/></Link></div></section><section className="reference-popular"><div className="reference-popular-heading"><h2>{tab==="Popular"?"Popular Courses":tab}</h2><Link to="/browse">See all</Link></div><div className="reference-course-grid">{courses.slice(0,12).map((course,index)=><CourseCard key={course.slug||course._id||course.title} course={course} referenceMode index={index}/>)}</div></section></main>;
}
function Browse() {
  const params = new URLSearchParams(window.location.search);
  const [search,setSearch]=useState(params.get("search")||"");
  const [query,setQuery]=useState(params.get("search")||"");
  const [free,setFree]=useState(false);
  const [paidOnly,setPaidOnly]=useState(false);
  const [sortBy,setSortBy]=useState("popular");
  const [dateAdded,setDateAdded]=useState("all");
  const [category,setCategory]=useState("");
  const [page,setPage]=useState(1);
  const [filterOpen,setFilterOpen]=useState(false);
  const [filterMenuOpen,setFilterMenuOpen]=useState(false);
  const [usersTab,setUsersTab]=useState(false);
  const [courses,setCourses]=useState([]);
  const [categories,setCategories]=useState([]);
  const [pagination,setPagination]=useState({page:1,pages:1,total:0});
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState("");
  useEffect(()=>{
    let active=true;setLoading(true);setError("");
    api.get("/courses",{params:{search:query,free:free?"true":"",category,page,limit:12}})
      .then(({data})=>{if(!active)return;setCourses(Array.isArray(data.courses)?data.courses:[]);setCategories(Array.isArray(data.categories)?data.categories:[]);setPagination(data.pagination||{page:1,pages:1,total:(data.courses||[]).length});})
      .catch(()=>{if(!active)return;const local=fallbackCourses.filter(c=>(!query||[c.title,c.description,c.instructor,c.category].join(" ").toLowerCase().includes(query.toLowerCase()))&&(!category||c.category===category)&&(!free||Number(c.price)===0));setCourses(local);setPagination({page:1,pages:1,total:local.length});setError("Showing available courses while the live catalogue reconnects.");})
      .finally(()=>{if(active)setLoading(false);});
    return ()=>{active=false;};
  },[query,free,category,page]);
  const visibleCourses=useMemo(()=>{
    let list=[...courses];
    if(paidOnly) list=list.filter(course=>Number(course.price)>0);
    if(dateAdded!=="all"){const days=dateAdded==="month"?30:90;const cutoff=Date.now()-days*86400000;list=list.filter(course=>{const stamp=course.createdAt||course.created_at||course.updatedAt;return stamp?new Date(stamp).getTime()>=cutoff:true;});}
    if(sortBy==="newest") list.sort((a,b)=>new Date(b.createdAt||b.created_at||0)-new Date(a.createdAt||a.created_at||0));
    return list;
  },[courses,paidOnly,dateAdded,sortBy]);
  function reset(){setSearch("");setQuery("");setFree(false);setPaidOnly(false);setSortBy("popular");setDateAdded("all");setCategory("");setPage(1);}
  return <main className="reference-browse"><section className="reference-browse-hero"><div className="browse-eyebrow">EDUGURU</div><h1>Discover &amp; Learn<br/>Something New</h1><form className="reference-home-search" onSubmit={e=>{e.preventDefault();setQuery(search.trim());setPage(1);}}><Search size={17}/><input placeholder="Search courses, people..." value={search} onChange={e=>setSearch(e.target.value)}/><button type="submit"><Search size={15}/> Search</button></form></section>
    <div className="reference-browse-tabs"><button className={!usersTab?"selected":""} onClick={()=>setUsersTab(false)}><BookOpen size={16}/> Courses</button><button className={usersTab?"selected":""} onClick={()=>setUsersTab(true)}><UserRound size={16}/> Users</button></div>
    {usersTab?<div className="reference-users-empty"><UserRound size={30}/><h2>Discover EduGuru learners</h2><p>Teacher and learner discovery will appear here.</p><button className="button button-primary" onClick={()=>setUsersTab(false)}>Browse courses</button></div>:<>
      <div className="reference-browse-filters"><button className={!category?"selected":""} onClick={()=>{setCategory("");setPage(1);}}><HomeIcon size={13}/> All</button><div className="filter-wrap"><button onClick={()=>setFilterOpen(v=>!v)} aria-expanded={filterOpen}><LayoutGrid size={13}/> Categories <span>⌄</span></button>{filterOpen&&<div className="filter-popover browse-category-popover"><button onClick={()=>{setCategory("");setPage(1);setFilterOpen(false);}}>All categories</button>{(categories.length?categories:[...new Set(fallbackCourses.map(c=>c.category))]).map(item=><button key={item} onClick={()=>{setCategory(item);setPage(1);setFilterOpen(false);}}>{item}</button>)}</div>}</div><div className="filter-wrap"><button className={filterMenuOpen||free||paidOnly||sortBy!=="popular"||dateAdded!=="all"?"selected":""} onClick={()=>{setFilterMenuOpen(v=>!v);setFilterOpen(false);}} aria-expanded={filterMenuOpen}><SlidersHorizontal size={13}/> Filter <span>⌄</span></button>{filterMenuOpen&&<div className="filter-popover browse-filter-popover"><div className="filter-group-title">SORT BY</div>{[["popular","Popular"],["newest","Newest"]].map(([value,label])=><button key={value} className={sortBy===value?"filter-choice-active":""} onClick={()=>setSortBy(value)}><span>{label}</span>{sortBy===value&&<span>✓</span>}</button>)}<div className="filter-group-title">PRICE</div>{[["all","All prices"],["free","Free only"],["paid","Paid only"]].map(([value,label])=><button key={value} className={(value==="free"&&free||value==="paid"&&paidOnly||value==="all"&&!free&&!paidOnly)?"filter-choice-active":""} onClick={()=>{setFree(value==="free");setPaidOnly(value==="paid");setPage(1);}}><span>{label}</span>{(value==="free"&&free||value==="paid"&&paidOnly||value==="all"&&!free&&!paidOnly)&&<span>✓</span>}</button>)}<div className="filter-group-title">DATE ADDED</div>{[["all","All time"],["month","This month"],["quarter","Last 3 months"]].map(([value,label])=><button key={value} className={dateAdded===value?"filter-choice-active":""} onClick={()=>setDateAdded(value)}><span>{label}</span>{dateAdded===value&&<span>✓</span>}</button>)}<div className="filter-popover-actions"><button onClick={()=>{setFree(false);setPaidOnly(false);setSortBy("popular");setDateAdded("all");setPage(1);}}>Reset</button><button onClick={()=>setFilterMenuOpen(false)}>Done</button></div></div>}</div><span className="reference-course-count">{pagination.total||courses.length}+ courses</span></div>
      {error&&<p className="reference-browse-error" role="status">{error}</p>}<section className="reference-browse-results"><div className="reference-browse-heading"><h2>{query?("Results for “"+query+"”"):"All Courses"}</h2><span>{visibleCourses.length} courses</span></div>{loading?<div className="reference-course-grid">{[1,2,3,4,5,6,7,8].map(n=><div className="reference-card-skeleton" key={n}/>)}</div>:visibleCourses.length?<div className="reference-course-grid">{visibleCourses.map((course,index)=><CourseCard key={course.slug||course._id||course.title} course={course} referenceMode index={index}/>)}</div>:<div className="reference-users-empty"><BookOpen size={30}/><h2>No courses found</h2><p>Try another search or clear your filters.</p><button className="button button-primary" onClick={reset}>Clear filters</button></div>}{pagination.pages>1&&<div className="pagination"><button className="button button-quiet" disabled={page<=1} onClick={()=>setPage(v=>Math.max(1,v-1))}>Previous</button><span>Page {pagination.page} of {pagination.pages}</span><button className="button button-quiet" disabled={page>=pagination.pages} onClick={()=>setPage(v=>Math.min(pagination.pages,v+1))}>Next</button></div>}</section>
    </>}</main>;
}
function CourseDetail() {
  const { slug } = useParams();
  const [course, setCourse] = useState(fallbackCourses.find(c => c.slug === slug));
  const [lessons, setLessons] = useState([]);
  const [error, setError] = useState("");
  const [enrolling, setEnrolling] = useState(false);
  const [enrollMessage, setEnrollMessage] = useState("");
  const navigate = useNavigate();
  useEffect(() => { let active = true; api.get(`/courses/${slug}`).then(r => { if (active) { setCourse(r.data.course); setLessons(Array.isArray(r.data.lessons) ? r.data.lessons : []); } }).catch(() => { if (active && !fallbackCourses.some(c => c.slug === slug)) setError("This course could not be found."); }); return () => { active = false; }; }, [slug]);
  async function enroll() {
    const token = localStorage.getItem("eduguru-token");
    if (!token) { navigate("/auth"); return; }
    if (!course?._id) { setEnrollMessage("This demo course is not available for enrollment yet."); return; }
    setEnrolling(true); setEnrollMessage("");
    try { await api.post("/enrollments", { courseId: course._id }); setEnrollMessage("You're enrolled! Your course is now available in My courses."); }
    catch (err) { setEnrollMessage(err.response?.data?.message || "Enrollment failed. Please try again."); }
    finally { setEnrolling(false); }
  }
  if (error) return <main className="empty-state"><h2>{error}</h2><Link className="button button-primary" to="/browse">Browse courses</Link></main>;
  if (!course) return <main className="empty-state">Loading course…</main>;
  return <main className="detail-page"><Link className="text-link" to="/browse">← Back to courses</Link><div className="detail-layout"><div><div className="course-art detail-art"><img className="course-image" src={courseImage(course)} alt={`${course.title} learning cover`} onError={e => { e.currentTarget.style.display = "none"; }}/><span className="detail-image-label"><GraduationCap size={22}/> EduGuru learning path</span></div><div className="eyebrow">{course.category}</div><h1>{course.title}</h1><p>{course.description}</p><h2>About this course</h2><p>Learn with a structured, self-paced learning experience. Follow the lessons at a pace that works for you and return whenever you need to review.</p><section className="section lesson-outline"><h2>Course lessons</h2>{lessons.length ? <ol>{lessons.map(lesson => <li key={lesson._id}><Link to={localStorage.getItem("eduguru-token") ? `/lesson/${lesson._id}` : "/auth"}><span>{lesson.order}. {lesson.title}</span><span>{lesson.durationMinutes ? lesson.durationMinutes + " min" : "Lesson"} <ArrowRight size={15}/></span></Link>{lesson.description && <p>{lesson.description}</p>}</li>)}</ol> : <p>Lessons will appear here when the course content is published.</p>}</section></div><aside className="enroll-card"><span className="course-category">COURSE ACCESS</span><h2>{Number(course.price) === 0 ? "Free" : `LKR ${Number(course.price).toLocaleString()}`}</h2><p><PlayCircle size={17}/> {course.lessonsCount || 0} lessons</p><p><UserRound size={17}/> {course.instructor || "EduGuru Learning Team"}</p><button className="button button-primary full-button" type="button" onClick={enroll} disabled={enrolling}>{enrolling ? "Enrolling…" : "Enroll in this course"} <ArrowRight size={17}/></button>{enrollMessage && <p role="status" className="enrollment-message">{enrollMessage}</p>}</aside></div></main>;
}
function Auth() {
  const [mode, setMode] = useState("login"), [name, setName] = useState(""), [email, setEmail] = useState(""), [password, setPassword] = useState(""), [age, setAge] = useState(""), [gender, setGender] = useState(""), [step, setStep] = useState(0), [error, setError] = useState(""), [busy, setBusy] = useState(false), [remember, setRemember] = useState(true), [showPassword, setShowPassword] = useState(false); const navigate = useNavigate();
  async function submit(e) { e.preventDefault(); setError(""); if (mode === "register" && step === 0) { const problems = []; if (!name.trim()) problems.push("Enter your full name"); if (!age || Number(age) < 1 || Number(age) > 120) problems.push("Enter a valid age"); if (!gender) problems.push("Select your gender"); if (problems.length) { setError(problems.join(" · ")); return; } setStep(1); return; } setBusy(true); try { const { data } = await api.post(`/auth/${mode === "login" ? "login" : "register"}`, mode === "login" ? { email, password, remember } : { name, email, password, age: Number(age), gender, role: "student" }); if (data.token) localStorage.setItem("eduguru-token", data.token); if (data.user) localStorage.setItem("eduguru-user", JSON.stringify(data.user)); navigate("/profile"); } catch (err) { setError(err.response?.data?.message || "Could not connect to the API. Please try again."); } finally { setBusy(false); } }
  function startRegister() { setMode("register"); setStep(-1); setError(""); }
  function startStudent() { setMode("register"); setStep(0); setError(""); }
  function startLogin() { setMode("login"); setStep(0); setError(""); }
  return <main className="auth-wrap reference-auth-wrap">
    <section className="auth-brand-hero"><div className="auth-brand-orb"/><div className="auth-brand-logo"><GraduationCap size={31}/></div><h1>EduGuru</h1><p>Learn from the best teachers</p></section>
    <section className="auth-card reference-auth-card">
      {mode === "login" ? <><div className="auth-panel-title">Welcome back</div><p className="auth-panel-subtitle">Sign in to continue your learning journey.</p><form onSubmit={submit}>
        <label>Email or Phone Number<input required type="text" autoComplete="username" aria-label="Email or Phone Number" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@example.com or phone number"/></label>
        <label>Password<span className="auth-password-wrap"><input required minLength="8" type={showPassword ? "text" : "password"} autoComplete="current-password" aria-label="Password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Your password"/><button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword(v => !v)}>{showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}</button></span></label>
        <div className="auth-form-options"><label className="auth-remember"><input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)}/> Remember me</label><button type="button" className="auth-text-action" onClick={() => setError("For password help, please contact EduGuru support.")}>Forgot password?</button></div>
        {error && <p className="form-error" role="alert">{error}</p>}<button type="submit" className="button button-primary full-button" disabled={busy}>{busy ? "Please wait…" : <><ArrowRight size={17}/> Sign In</>}</button>
      </form><p className="auth-switch">New to EduGuru? <button type="button" onClick={startRegister}>Create an account</button></p></> : <>
        <div className="auth-panel-title">{step === -1 ? "Create Account" : step === 0 ? "Personal Info" : "Finish your account"}</div>
        {step === -1 ? <><p className="auth-panel-subtitle">Choose how you want to use EduGuru.</p><div className="auth-role-grid"><button type="button" className="auth-role-card" onClick={startStudent}><span className="auth-role-icon student"><GraduationCap size={24}/></span><b>I'm a Student</b><small>Learn from the best educators</small></button><button type="button" className="auth-role-card" onClick={() => setError("Educator registration is not available yet. Please sign up as a student for now.")}><span className="auth-role-icon educator"><LayoutGrid size={24}/></span><b>I'm an Educator</b><small>Share your knowledge &amp; earn</small></button></div>{error && <p className="form-error" role="alert">{error}</p>}<p className="auth-switch">Already have an account? <button type="button" onClick={startLogin}>Sign in</button></p></> : <><div className="auth-step-caption">STEP {step + 1} OF 2 <span>{step === 0 ? "Personal information" : "Account details"}</span></div><p className="auth-panel-subtitle">{step === 0 ? "Let's get to know you" : "Set up your sign-in details"}</p><form onSubmit={submit}>
          {step === 0 && <><label>Full Name *<input required autoComplete="name" value={name} onChange={e => setName(e.target.value)} placeholder="Your full name"/></label><div className="auth-form-two-col"><label>Age *<input required type="number" min="1" max="120" value={age} onChange={e => setAge(e.target.value)} placeholder="e.g. 18"/></label><label>Gender *<select required aria-label="Gender" value={gender} onChange={e => setGender(e.target.value)}><option value="">Select</option><option value="female">Female</option><option value="male">Male</option><option value="other">Other</option><option value="prefer-not-to-say">Prefer not to say</option></select></label></div></>}
          {step === 1 && <><label>Full Name<input required autoComplete="name" value={name} onChange={e => setName(e.target.value)} placeholder="Your full name"/></label><label>Email address<input required type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@example.com"/></label><label>Password<input required minLength="8" type="password" autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 8 characters"/></label></>}
          {error && <p className="form-error" role="alert">{error}</p>}<div className="auth-wizard-actions"><button type="button" className="auth-back-button" onClick={() => { setError(""); setStep(step === 0 ? -1 : 0); }}>‹ Back</button><button type="submit" className="button button-primary full-button" disabled={busy}>{busy ? "Please wait…" : step === 0 ? "Next ›" : "Create Account ›"}</button></div>
        </form><p className="auth-switch">Already have an account? <button type="button" onClick={startLogin}>Sign in</button></p></>}
      </>}
    </section>
  </main>;
}
function Profile() {
  const [user, setUser] = useState(() => { try { return JSON.parse(localStorage.getItem("eduguru-user")); } catch { return null; } });
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(Boolean(localStorage.getItem("eduguru-token")));
  const [error, setError] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    let active = true;
    const token = localStorage.getItem("eduguru-token");
    if (!token) { navigate("/auth", { replace: true }); return () => { active = false; }; }
    Promise.all([api.get("/auth/me"), api.get("/enrollments")]).then(([me, enrolled]) => {
      if (!active) return;
      setUser(me.data.user);
      localStorage.setItem("eduguru-user", JSON.stringify(me.data.user));
      setEnrollments(Array.isArray(enrolled.data.enrollments) ? enrolled.data.enrollments : []);
    }).catch(err => {
      if (!active) return;
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem("eduguru-token"); localStorage.removeItem("eduguru-user");
        navigate("/auth", { replace: true });
      } else setError("Your account details could not be loaded. Please try again.");
    }).finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [navigate]);
  function signOut() {
    localStorage.removeItem("eduguru-token"); localStorage.removeItem("eduguru-user");
    setUser(null); setEnrollments([]); navigate("/auth", { replace: true });
  }
  if (loading) return <main className="empty-state" role="status">Loading your learning space…</main>;
  if (!user) return <main className="empty-state">Redirecting to sign in…</main>;
  return <main className="profile-page"><div className="eyebrow">YOUR LEARNING SPACE</div><h1>Welcome, {user.name || "learner"}.</h1><p>Manage your account and pick up where you left off.</p>{error && <p className="form-error" role="alert">{error}</p>}<div className="profile-actions"><Link className="button button-primary" to="/browse">Browse courses</Link><button className="button button-quiet" onClick={signOut}><LogOut size={16}/> Sign out</button></div><section className="section"><div className="section-heading"><div><div className="eyebrow">YOUR PROGRESS</div><h2>My courses</h2></div><span>{enrollments.length} enrolled</span></div>{enrollments.length ? <div className="course-grid">{enrollments.map(enrollment => { const course = enrollment.course || {}; return <article className="course-card enrolled-course" key={enrollment._id}><div className="course-content"><div className="course-category">{enrollment.status || "active"}</div><h3>{course.title || "Course"}</h3><p>{course.description || "Continue your learning journey."}</p><div className="course-meta"><span>{Number(enrollment.progress || 0)}% complete</span><strong>{enrollment.status === "completed" ? "Completed" : "In progress"}</strong></div></div></article>; })}</div> : <div className="empty-state"><BookOpen size={30}/><h3>You haven't enrolled in a course yet</h3><p>Explore available courses and enroll to track your learning progress here.</p><Link className="button button-primary" to="/browse">Explore courses</Link></div>}</section></main>;
}
function MenuPage() {
  const quickItems = [[HomeIcon,"Home","/home","purple"],[LayoutGrid,"Categories","/browse","green"],[Bookmark,"My List","/profile","blue"],[CreditCard,"Payment Portal","/profile","orange"],[Sparkles,"EduGuru AI","/menu","pink"],[Bell,"Announcements","/menu","red"],[FileText,"My Notes","/resources","teal"],[Calculator,"Calculator","/menu","blue"],[CalendarDays,"Calendar","/menu","cyan"],[Award,"Certificates","/profile","cyan"],[Folder,"Resources","/resources","green"],[CircleHelp,"Help & Support","/help-support","purple"]];
  const moreItems = [[BookOpen,"Browse All Courses","Explore the full course catalogue","/browse"],[CircleHelp,"Help & Support","Get answers and guidance","/help-support"],[Mail,"Contact","Reach the EduGuru team","/contact"],[Info,"About EduGuru","Our story and mission","/about"],[FileText,"Terms & Conditions","Read the platform terms","/terms"],[ShieldCheck,"Privacy Policy","How we handle your information","/privacy"],[Download,"Download App","Learn on the go","/download-app"]];
  return <main className="menu-page">
    <section className="menu-welcome"><div className="menu-welcome-orb"/><span className="menu-eyebrow">YOUR LEARNING SPACE</span><h1>Welcome to <em>EduGuru</em></h1><p>Everything you need to learn, grow, and reach your goals — all in one place.</p><div className="menu-welcome-actions"><Link to="/browse" className="menu-primary-action">Explore courses <ArrowRight size={16}/></Link><Link to="/profile" className="menu-secondary-action"><UserRound size={16}/> My account</Link></div></section>
    <section className="menu-section"><div className="menu-section-heading"><div><span className="menu-eyebrow">YOUR SHORTCUTS</span><h2>Quick access</h2></div><span className="menu-section-count">12 tools</span></div><div className="menu-quick-grid">{quickItems.map(([Icon,label,to,tone])=><Link to={to} key={label} className={'menu-quick-tile menu-tone-'+tone}><span><Icon size={21}/></span><b>{label}</b>{label==='EduGuru AI'&&<small>SOON</small>}</Link>)}</div></section>
    <section className="menu-promo"><div className="menu-promo-icon"><Star size={24}/></div><div><span className="menu-eyebrow">GROW WITH EDUGURU</span><h2>Are you an institute or educator?</h2><p>Reach more learners and share your knowledge with our community.</p></div><Link to="/contact" aria-label="Contact EduGuru about promotion"><ArrowRight size={19}/></Link></section>
    <section className="menu-section menu-links-section"><div className="menu-section-heading"><div><span className="menu-eyebrow">DISCOVER MORE</span><h2>Explore EduGuru</h2></div></div><div className="menu-links-list">{moreItems.map(([Icon,label,description,to])=><Link to={to} key={label} className="menu-link-row"><span className="menu-link-icon"><Icon size={19}/></span><span className="menu-link-copy"><b>{label}</b><small>{description}</small></span><ChevronRight size={17}/></Link>)}</div></section>
    <div className="menu-copyright"><span className="menu-footer-mark"><GraduationCap size={19}/></span><div><b>EduGuru</b><small>Version 1.0 · © {new Date().getFullYear()} EduGuru</small></div><span>Global Education Marketplace</span></div>
  </main>;
}
const policySections = {
  "/terms": [
    ["1. About EduGuru", "EduGuru is an online learning platform from Sri Lanka. Teachers create courses and Guru Tests, and students learn from them. We connect both sides — we don't teach the content ourselves."],
    ["2. Your Account", "You must be 13 or older. Under 18s need a parent's permission. Give accurate details when you sign up. Keep your account secure. One account per person."],
    ["3. Students & Teachers", "Students enrol in courses or buy Guru Tests and learn. Teachers create courses and tests, and are responsible for their own content. Teachers earn 75% of the price; EduGuru keeps 25%."],
    ["4. Payments & Coins", "Prices are in Sri Lankan Rupees (LKR). 1 coin = 1 LKR. Coins are used to buy Guru Tests; teacher earnings can be withdrawn to a bank. Payments are checked and approved manually. Payments are generally non-refundable. A refund is only given if there's a genuine mistake (such as a duplicate or wrong charge), reviewed case by case by EduGuru."],
    ["5. Content Rules", "Course and test content is for enrolled users only. Don't share, copy, or resell any content or links. Teachers must own or have rights to what they upload."],
    ["6. What You Must Not Do", "Post false, harmful, or abusive content. Harass or threaten other users. Try to break, hack, or misuse the platform. Fake reviews or ask students to pay outside EduGuru. Breaking these rules can lead to your account being suspended or removed."],
    ["7. Ownership", "The EduGuru name, logo, and design belong to EduGuru. Course content belongs to the teacher who made it. By uploading, teachers allow EduGuru to show it to their enrolled students."],
    ["8. Liability", "EduGuru is a platform, not the teacher. We're not responsible for the quality of a teacher's content, disputes between users, or short service interruptions for maintenance."],
    ["9. Changes & Law", "We may update these terms occasionally — continuing to use EduGuru means you accept them. These terms follow the laws of Sri Lanka."],
    ["10. Contact", "Questions? Reach us: Email: eduguru.app@gmail.com · WhatsApp: +94787929233 · Platform: Contact Page."]
  ],
  "/privacy": [
    ["1. What We Collect", "Your name, email, and phone number. Country, profile picture, and role — optional. What you learn: courses and tests you enrol in or complete. Payment screenshots you upload for verification. We do not store your card or bank account numbers."],
    ["2. How We Use It", "To run your account and process enrolments and payments. To send you important updates about your courses. To keep the platform safe and help with support. We never sell your personal data to anyone."],
    ["3. Keeping Your Data Safe", "Your information is stored securely and sent over encrypted (HTTPS) connections. Passwords are protected and never visible to us. Course materials are only accessible to enrolled students."],
    ["4. On Your Device", "We use your browser's storage to keep you logged in and remember your recent searches. We don't use advertising or tracking cookies."],
    ["5. Who Can See Your Info", "Teachers see your name and enrolment status for courses you join. Admins can view data for moderation and support. We share data only if legally required in Sri Lanka."],
    ["6. Your Rights", "You can ask us to view, correct, or delete your data, and you can update your profile anytime. You can also ask us to de-activate notifications. To request anything, email eduguru.app@gmail.com."],
    ["7. Children", "EduGuru is for users aged 13 and above. Users under 18 should have a parent's permission."],
    ["8. Changes & Contact", "We may update this policy occasionally. Questions? Email eduguru.app@gmail.com."]
  ]
};
const aboutSections = [
  { eyebrow: "OUR STORY", title: "A conversation that became a platform", body: "On 5 November 2025, a 17-year-old photographer named Ishaq stepped onto the stage at NAAS Campus, Kattankudy, Batticaloa, to speak about photography, video editing, content creation, and digital marketing. In the audience sat the event's chief guest, Dr. Ilm Rifaz — MBBS, MSc, MD, Regional Director of Health Services, Ampara District. After Ishaq finished speaking, Dr. Rifaz called him over. They talked for nearly three hours after the event ended. Dr. Rifaz shared a ten-year-old dream: a platform connecting teachers and students. “I couldn't do it back then — but I believe you can.” Ishaq's friend Gareeb, sitting beside them that day, gave the dream its name: EduGuru. The vision came from Dr. Rifaz; the name came from Gareeb; Ishaq imagined and built the platform, teaching himself piece by piece. On 3 May 2026, EduGuru was officially launched at Hizbullah Hall, Kattankudy." },
  { eyebrow: "THE VISIONARY", title: "Dr. Ilm Rifaz", body: "MBBS, MSc, MD · Regional Director of Health Services — Ampara. Ten years before EduGuru existed, Dr. Rifaz dreamed of a platform connecting teachers and students. He could not build it then, so he passed the dream to someone who could." },
  { eyebrow: "FOUNDER & CREATOR", title: "Ishaq Mohamed", body: "Founder · Creator · Developer of EduGuru. A self-taught creator who turned a single conversation into a platform — designing and building every part of EduGuru from the ground up, so students and teachers could both grow." },
  { eyebrow: "THE HEARTS BEHIND EDUGURU", title: "A vision, a name, and a builder", body: "Dr. Ilm Rifaz planted the ten-year-old concept of connecting teachers and students. Gareeb, a friend sitting beside them that day, gave it the name EduGuru. Ishaq Mohamed designed and built every feature, from A to Z." },
  { eyebrow: "THE JOURNEY", title: "From one conversation to launch", body: "5 Nov 2025 — The Spark: Ishaq speaks at the NAAS Campus seminar in Kattankudy and meets Dr. Rifaz. That evening — A 3-Hour Conversation: a dream is shared, a name is found, and a mission is born. The months after — Learning & Building: Ishaq teaches himself everything and builds EduGuru, piece by piece. 3 May 2026 — Official Launch: EduGuru goes live at Hizbullah Hall, Kattankudy." },
  { eyebrow: "OUR VISION", title: "Make education easy and accessible", body: "To make education as easy and accessible as it can possibly be — and to give learners the resources they need, for free. We believe knowledge should never be blocked by distance, cost, or circumstance. When a student learns and a teacher teaches, both should grow together." },
  { eyebrow: "WHY CHOOSE EDUGURU", title: "Everything learners need in one place", body: "Learn Anything — courses and Guru Tests across every subject and level. Free Resources — helpful learning materials, free for every student. Teachers Earn — educators are rewarded fairly for sharing knowledge. Simple & Mobile — a clean, fast experience built for your phone." }
];

function InfoPage({ path }) {
  const info = pageInfo[path] || pageInfo["/about"];
  const Icon = info.icon;
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [contactError, setContactError] = useState("");
  async function submitContact(e) {
    e.preventDefault(); setSending(true); setContactError(""); setSent(false);
    const form = e.currentTarget;
    const fields = new FormData(form);
    try {
      await api.post("/contact", { name: fields.get("name"), email: fields.get("email"), message: fields.get("message") });
      setSent(true); form.reset();
    } catch (err) {
      setContactError(err.response?.data?.message || "We could not send your message. Please try again later.");
    } finally { setSending(false); }
  }
  const image = path === "/about"
    ? "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1400&q=85"
    : path === "/contact" || path === "/help-support"
      ? "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1400&q=85"
      : "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=85";
  return <main className={`module-page module-page-${path.slice(1)}`}>
    {path === "/about" ? <section className="about-brand-banner"><div className="about-brand-icon"><GraduationCap size={31}/></div><h1>EduGuru</h1><p>Every great thing begins with a single conversation — this is the story of how a dream became a platform for learners everywhere.</p></section> : (path === "/terms" || path === "/privacy") ? <section className="module-hero policy-reference-hero"><div className="module-hero-overlay"/><div className="module-hero-copy"><Link to="/menu" className="policy-back-link"><ArrowRight size={13}/> Back</Link><div className="policy-hero-icon">{path === "/terms" ? <FileText size={19}/> : <ShieldCheck size={19}/>}</div><h1>{path === "/terms" ? "Terms & Conditions" : "Privacy Policy"}</h1><p>Last updated: June 2026</p></div></section> : <section className="module-hero" style={{ "--module-hero-image": `url("${image}")` }}><div className="module-hero-overlay"/><div className="module-hero-copy"><span className="module-eyebrow">{info.intro}</span><h1>{info.title}</h1><p>{info.body}</p></div></section>}
    {path === "/about" && <><section className="module-intro-panel"><span className="module-icon"><Icon size={24}/></span><div><span className="module-eyebrow">ABOUT EDUGURU</span><h2>Learning opens doors.</h2><p>EduGuru is a learning platform created to connect curious minds with courses, educators, and resources that support lifelong learning.</p></div></section><div className="story-grid">{aboutSections.map((section, index) => <article className={`story-card story-card-${index+1}`} key={section.title}><span className="story-number">{String(index+1).padStart(2,"0")}</span><span className="module-eyebrow">{section.eyebrow}</span><h2>{section.title}</h2><p>{section.body}</p></article>)}</div><section className="module-cta"><div><span className="module-eyebrow">YOUR NEXT CHAPTER STARTS HERE</span><h2>Explore courses. Connect with us.</h2><p>Find a course that matches your curiosity and take your next step.</p></div><div className="module-cta-actions"><Link className="button button-primary" to="/browse">Explore courses <ArrowRight size={16}/></Link><Link className="button button-quiet" to="/contact">Connect with us <ArrowRight size={16}/></Link></div></section><p className="module-origin">EduGuru · Born in Kattankudy, Sri Lanka · Built with care for every learner.</p></>}
    {(path === "/terms" || path === "/privacy") && <section className="policy-layout"><aside className="policy-summary"><span className="module-icon"><Icon size={24}/></span><span className="module-eyebrow">EDUGURU POLICY</span><h2>{path === "/terms" ? "Terms & Conditions" : "Privacy Policy"}</h2><p>{path === "/terms" ? "Please read these guidelines before using EduGuru." : "We aim to handle your information responsibly and transparently."}</p><Link to="/contact">Questions? Contact us <ArrowRight size={15}/></Link></aside><div className="policy-sections">{policySections[path].map((section, index) => <article className="policy-section" key={section[0]}><span className="policy-index">{String(index+1).padStart(2,"0")}</span><div><h2>{section[0]}</h2><p>{section[1]}</p></div></article>)}</div></section>}
    {path === "/contact" && <section className="contact-layout"><div className="contact-copy"><span className="module-eyebrow">CONNECT WITH US</span><h2>We'd love to hear from you.</h2><p>Questions about a course, your account, or learning on EduGuru? Send us a message or use one of the contact options.</p><div className="contact-detail"><span className="contact-detail-icon"><Phone size={19}/></span><div><small>PHONE / WHATSAPP</small><a href="https://wa.me/94787929233" target="_blank" rel="noreferrer">+94 78 792 9233</a><small>Call or message us</small></div></div><div className="contact-detail"><span className="contact-detail-icon"><Mail size={19}/></span><div><small>EMAIL</small><a href="mailto:eduguru.app@gmail.com">eduguru.app@gmail.com</a><small>We welcome your questions</small></div></div><div className="contact-detail"><span className="contact-detail-icon"><Phone size={19}/></span><div><small>OPERATING HOURS</small><strong>Monday – Saturday · 9:00 AM – 9:00 PM</strong><small>Sunday · 10:00 AM – 6:00 PM · Sri Lanka Time (IST +05:30)</small></div></div><div className="social-links"><span className="module-eyebrow">FOLLOW US</span><div className="social-reference-list">{[["Facebook","Like our page","f"],["Instagram","Follow our page","◎"],["YouTube","Subscribe to our channel","▶"],["TikTok","Watch our content","♪"]].map(([name,description,mark])=><div className="social-reference-row" key={name}><span>{mark}</span><div><strong>{name}</strong><small>{description}</small></div><ChevronRight size={15}/></div>)}</div></div></div><section className="contact-form-card"><span className="module-eyebrow">SEND A MESSAGE</span><h2>How can we help?</h2><form onSubmit={submitContact}><label>Your name<input name="name" required minLength="2" aria-label="Your name" placeholder="Your name"/></label><label>Email address<input name="email" required type="email" aria-label="Email address" placeholder="you@example.com"/></label><label>Message<textarea name="message" required minLength="10" maxLength="5000" aria-label="Message" placeholder="Tell us a little about what you need..." rows="5"/></label>{contactError && <p className="form-error" role="alert">{contactError}</p>}<button className="button button-primary full-button" type="submit" disabled={sending}>{sending ? "Sending…" : "Send message"} <ArrowRight size={16}/></button>{sent && <p role="status" className="module-success">Thanks — your message was sent to EduGuru support.</p>}</form></section></section>}
    {path === "/help-support" && <section className="resource-content help-reference-content"><div className="resource-heading"><span className="module-eyebrow">EDUGURU SUPPORT</span><h2>What do you need help with?</h2><p>Choose a topic to find your way around EduGuru.</p></div><div className="help-card-grid help-reference-grid">{[["Getting Started","Set up your account and begin learning",GraduationCap],["Courses & Learning","Find courses and continue lessons",BookOpen],["Guru Tests","Practice and prepare for exams",Calculator],["Coins & Wallet","Understand payments and your wallet",CreditCard],["For Teachers","Create and share learning content",Award],["Schools & Institutes","Explore institute learning options",LayoutGrid],["Account & Profile","Manage your account and details",UserRound],["Menus & Tools","Find useful learning tools",Sparkles]].map(([title,description,HelpIcon])=><Link className="help-card" to={title==="Account & Profile"?"/profile":title==="Guru Tests"?"/browse":title==="Courses & Learning"?"/browse":"/contact"} key={title}><span className="module-icon"><HelpIcon size={23}/></span><h3>{title}</h3><p>{description}</p><span>Get help <ArrowRight size={15}/></span></Link>)}</div><div className="support-note"><CircleHelp size={22}/><div><strong>Still need a hand?</strong><p>Send the team a message and include enough detail for us to understand the issue.</p><Link to="/contact">Contact EduGuru support <ArrowRight size={15}/></Link></div></div></section>}
    {path === "/resources" && <section className="resource-content resource-reference-content"><div className="resource-heading"><span className="module-eyebrow">LEARNING RESOURCES</span><h2>Everything you need to study</h2><p>Choose a resource type to support your next study session.</p></div><div className="resource-card-grid resource-reference-grid">{[["Past Papers","Practice with past examination questions",FileText],["Model Papers","Prepare with exam-style questions",BookOpen],["Notes","Review key topics and concepts",Bookmark],["Textbooks","Explore subject reading material",BookOpen],["Workbooks","Build skills with guided exercises",FileText],["Video Lessons","Learn with visual explanations",PlayCircle],["Audio Lessons","Listen and revise on the go",Phone],["Quizzes","Check your understanding",Calculator],["Assignments","Practice what you have learned",Award],["Study Guides","Follow a structured revision plan",GraduationCap],["Flashcards","Remember facts and key terms",Sparkles],["Online Practice Tests","Test your knowledge",Calculator]].map(([title,description,ResourceIcon])=><Link to="/browse" className="resource-card" key={title}><span className="module-icon"><ResourceIcon size={23}/></span><h3>{title}</h3><p>{description}</p><span>Explore <ArrowRight size={15}/></span></Link>)}</div></section>}
    {path === "/download-app" && <section className="download-panel download-reference-panel"><div className="download-app-mark"><GraduationCap size={38}/></div><span className="module-eyebrow">EDUGURU MOBILE</span><h2>EduGuru for Android</h2><p>Keep learning with EduGuru on your phone. An official APK download will be enabled here when the verified app package is available.</p><div className="download-meta"><div><small>VERSION</small><strong>v1.0</strong></div><div><small>SIZE</small><strong>1.6 MB</strong></div><div><small>PLATFORM</small><strong>Android</strong></div></div><div className="download-reference-actions"><button className="button button-primary" type="button" disabled aria-disabled="true">Download APK · Coming soon</button><button className="button button-quiet" type="button" onClick={() => { if (navigator.share) navigator.share({ title: "EduGuru", text: "Explore courses on EduGuru", url: window.location.origin }); else if (navigator.clipboard) navigator.clipboard.writeText(window.location.origin); }}><ArrowRight size={16}/> Share App</button></div></section>}

  </main>;
}

function LessonPage() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => {
    let active = true;
    if (!localStorage.getItem("eduguru-token")) { navigate("/auth", { replace: true }); return () => { active = false; }; }
    Promise.all([api.get("/lessons/" + lessonId), api.get("/enrollments")]).then(([lessonResult, enrollmentResult]) => {
      if (!active) return;
      const foundLesson = lessonResult.data.lesson;
      setLesson(foundLesson);
      const foundEnrollment = (enrollmentResult.data.enrollments || []).find(item => String(item.course?._id || item.course) === String(foundLesson.course?._id || foundLesson.course));
      setEnrollment(foundEnrollment || null);
    }).catch(err => { if (active) setError(err.response?.data?.message || "Lesson could not be loaded."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [lessonId, navigate]);
  async function completeLesson() {
    if (!enrollment) return;
    setSaving(true); setMessage(""); setError("");
    try {
      const { data } = await api.post("/enrollments/" + enrollment._id + "/lessons/" + lessonId + "/complete");
      setEnrollment(current => ({ ...current, progress: data.enrollment.progress, status: data.enrollment.status }));
      setMessage("Lesson marked complete. Course progress: " + data.enrollment.progress + "%.");
    } catch (err) { setError(err.response?.data?.message || "Could not save lesson progress."); }
    finally { setSaving(false); }
  }
  if (loading) return <main className="empty-state" role="status">Loading lesson…</main>;
  if (error && !lesson) return <main className="empty-state"><h2>{error}</h2><Link className="button button-primary" to="/browse">Browse courses</Link></main>;
  if (!lesson) return null;
  return <main className="browse-page lesson-page"><Link className="text-link" to={"/course/" + (lesson.course?.slug || "")}>← Back to course</Link><div className="eyebrow">LESSON {lesson.order}</div><h1>{lesson.title}</h1>{lesson.description && <p>{lesson.description}</p>}{lesson.videoUrl && <p><a href={lesson.videoUrl} target="_blank" rel="noreferrer">Open lesson video <ArrowRight size={16}/></a></p>}<article className="auth-card lesson-content">{lesson.content ? <div style={{ whiteSpace: "pre-wrap" }}>{lesson.content}</div> : <p>The instructor has not added lesson notes yet.</p>}{!enrollment ? <p>Enroll in this course to save your lesson progress.</p> : <button className="button button-primary" onClick={completeLesson} disabled={saving}>{saving ? "Saving…" : "Mark lesson complete"}</button>}{message && <p role="status">{message}</p>}{error && <p className="form-error" role="alert">{error}</p>}</article></main>;
}

function AdminPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({ title: "", slug: "", description: "", category: "Technology", instructor: "", level: "Beginner", price: "0", imageUrl: "", published: true });
  const token = localStorage.getItem("eduguru-token");
  async function loadCourses() {
    setLoading(true); setError("");
    try { const { data } = await api.get("/admin/courses"); setCourses(data.courses || []); }
    catch (err) { setError(err.response?.data?.message || "Could not load admin courses."); }
    finally { setLoading(false); }
  }
  useEffect(() => { if (!token) { setError("Please sign in with an administrator account."); setLoading(false); return; } loadCourses(); }, []);
  function updateField(e) {
    const { name, value, type, checked } = e.target;
    setForm(current => ({ ...current, [name]: type === "checkbox" ? checked : value, ...(name === "title" ? { slug: value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") } : {}) }));
  }
  async function createCourse(e) {
    e.preventDefault(); setBusy(true); setError(""); setMessage("");
    try {
      await api.post("/admin/courses", { ...form, price: Number(form.price), published: Boolean(form.published) });
      setMessage("Course created successfully."); setForm({ title: "", slug: "", description: "", category: "Technology", instructor: "", level: "Beginner", price: "0", imageUrl: "", published: true }); await loadCourses();
    } catch (err) { setError(err.response?.data?.message || "Course could not be created."); }
    finally { setBusy(false); }
  }
  async function togglePublished(course) {
    setError(""); setMessage("");
    try { await api.patch("/admin/courses/" + course._id, { published: !course.published }); setMessage("Course visibility updated."); await loadCourses(); }
    catch (err) { setError(err.response?.data?.message || "Could not update course."); }
  }
  async function deleteCourse(course) {
    if (!window.confirm("Delete " + course.title + " and its enrollments and lessons?")) return;
    setError(""); setMessage("");
    try { await api.delete("/admin/courses/" + course._id); setMessage("Course deleted."); await loadCourses(); }
    catch (err) { setError(err.response?.data?.message || "Could not delete course."); }
  }
  return <main className="browse-page admin-page">
    <div className="browse-intro"><div className="eyebrow">EDUGURU ADMINISTRATION</div><h1>Course management</h1><p>Create courses, control publication, and maintain the learning catalogue.</p></div>
    {error && <p className="form-error" role="alert">{error}</p>}{message && <p role="status">{message}</p>}
    <section className="auth-card admin-form-card"><h2>Create a course</h2><form onSubmit={createCourse}>
      <label>Course title<input name="title" value={form.title} onChange={updateField} required minLength="3" maxLength="160" /></label>
      <label>URL slug<input name="slug" value={form.slug} onChange={updateField} required pattern="[a-z0-9]+(-[a-z0-9]+)*" /></label>
      <label>Description<textarea name="description" value={form.description} onChange={updateField} required minLength="10" /></label>
      <label>Category<input name="category" value={form.category} onChange={updateField} required /></label>
      <label>Instructor<input name="instructor" value={form.instructor} onChange={updateField} placeholder="EduGuru Instructor" /></label>
      <label>Level<select name="level" value={form.level} onChange={updateField}><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></label>
      <label>Price (LKR)<input name="price" type="number" min="0" step="1" value={form.price} onChange={updateField} required /></label>
      <label>Cover image URL<input name="imageUrl" type="url" value={form.imageUrl} onChange={updateField} placeholder="https://…" /></label>
      <label><input name="published" type="checkbox" checked={form.published} onChange={updateField} /> Publish immediately</label>
      <button className="button button-primary full-button" disabled={busy}>{busy ? "Creating…" : "Create course"} <ArrowRight size={17}/></button>
    </form></section>
    <section className="section"><div className="section-heading"><div><div className="eyebrow">CATALOGUE</div><h2>Existing courses</h2></div><button className="button button-quiet" onClick={loadCourses}>Refresh</button></div>
    {loading ? <p role="status">Loading courses…</p> : courses.length ? <div className="course-grid">{courses.map(course => <article className="course-card" key={course._id}><div className="course-content"><span className="course-category">{course.published ? "Published" : "Draft"} · {course.category}</span><h3>{course.title}</h3><p>{course.description}</p><div className="course-meta"><span>{course.lessonsCount || 0} lessons</span><strong>{Number(course.price) === 0 ? "FREE" : "LKR " + Number(course.price).toLocaleString()}</strong></div><div className="profile-actions"><button className="button button-quiet" onClick={() => togglePublished(course)}>{course.published ? "Unpublish" : "Publish"}</button><button className="button button-quiet" onClick={() => deleteCourse(course)}>Delete</button></div></div></article>)}</div> : <div className="empty-state">No courses found. Create your first course above.</div>}
    </section>
  </main>;
}

function Footer() { return <footer className="footer"><Link to="/" className="brand"><span className="brand-mark"><GraduationCap size={22}/></span><span>EduGuru<small>Learn · Grow · Succeed</small></span></Link><p>Learning opens doors. Take your next step with EduGuru.</p><div><Link to="/browse">Courses</Link><Link to="/about">About</Link><Link to="/contact">Contact</Link><Link to="/help-support">Help & Support</Link><Link to="/terms">Terms</Link><Link to="/privacy">Privacy</Link></div><small>© {new Date().getFullYear()} EduGuru. Built for curious minds.</small></footer>; }
export default function App() {
  const location = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [location.pathname]);
  return <><Header/><Routes><Route path="/" element={<Home/>}/><Route path="/home" element={<Home/>}/><Route path="/menu" element={<MenuPage/>}/><Route path="/browse" element={<Browse/>}/><Route path="/courses" element={<Auth/>}/><Route path="/course/:slug" element={<CourseDetail/>}/><Route path="/lesson/:lessonId" element={<LessonPage/>}/><Route path="/auth" element={<Auth/>}/><Route path="/profile" element={<Profile/>}/><Route path="/admin" element={<AdminPage/>}/><Route path="/about" element={<InfoPage path="/about"/>}/><Route path="/terms" element={<InfoPage path="/terms"/>}/><Route path="/privacy" element={<InfoPage path="/privacy"/>}/><Route path="/contact" element={<InfoPage path="/contact"/>}/><Route path="/help-support" element={<InfoPage path="/help-support"/>}/><Route path="/resources" element={<InfoPage path="/resources"/>}/><Route path="/download-app" element={<InfoPage path="/download-app"/>}/><Route path="*" element={<Home/>}/></Routes><Footer/></>;
}
