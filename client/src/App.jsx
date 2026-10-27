import { useEffect, useMemo, useState } from "react";
import { Link, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import { BookOpen, Search, SlidersHorizontal, GraduationCap, ArrowRight, Menu, X, UserRound, PlayCircle, Home as HomeIcon, CircleHelp, Mail, Download, FileText, ShieldCheck, Info, LogOut, RefreshCw, Folder, Bell, LayoutGrid, Bookmark, CreditCard, Sparkles, Calculator, CalendarDays, Award, Phone, ChevronRight, Star } from "lucide-react";
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
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [free, setFree] = useState(false);
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [remoteCourses, setRemoteCourses] = useState(null);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(false);
  useEffect(() => {
    let active = true; setLoading(true); setApiError(false);
    api.get("/courses", { params: { search: query, free: free ? "true" : "", category, page, limit: 9 } })
      .then(r => { if (!active) return; setRemoteCourses(Array.isArray(r.data.courses) ? r.data.courses : []); setCategories(Array.isArray(r.data.categories) ? r.data.categories : []); setPagination(r.data.pagination || { page: 1, pages: 1, total: (r.data.courses || []).length }); })
      .catch(() => { if (active) { setRemoteCourses(null); setApiError(true); } })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [query, free, category, page]);
  const courses = useMemo(() => (remoteCourses !== null ? remoteCourses : fallbackCourses).filter(c => (!query || [c.title, c.description, c.instructor, c.category].join(" ").toLowerCase().includes(query.toLowerCase()))).filter(c => (!category || c.category === category)).filter(c => (!free || Number(c.price) === 0)), [remoteCourses, query, free, category]);
  function resetFilters() { setSearch(""); setQuery(""); setFree(false); setCategory(""); setPage(1); }
  return <main className="browse-page"><div className="browse-intro"><div className="eyebrow">FIND YOUR NEXT COURSE</div><h1>Explore the world of learning.</h1><p>Search courses, discover new interests, and take your next step.</p></div>
    <form className="search-bar" onSubmit={e => { e.preventDefault(); setQuery(search.trim()); setPage(1); }}><Search aria-hidden="true"/><input aria-label="Search courses, people" placeholder="Search courses, people..." value={search} onChange={e => setSearch(e.target.value)}/><button className="button button-primary" type="submit">Search</button></form>
    <div className="filter-row"><span><SlidersHorizontal size={17}/> Refine your search</span><button className="button button-quiet filter-button" type="button" aria-expanded={filterOpen} onClick={() => setFilterOpen(v => !v)}>Filters</button>{filterOpen && <div className="course-filters"><label>Category<select aria-label="Filter by category" value={category} onChange={e => { setCategory(e.target.value); setPage(1); }}><option value="">All categories</option>{(categories.length ? categories : [...new Set(fallbackCourses.map(c => c.category))]).map(item => <option key={item} value={item}>{item}</option>)}</select></label><label className="free-toggle"><input type="checkbox" checked={free} onChange={e => { setFree(e.target.checked); setPage(1); }}/> Free only</label></div>}<span className="result-count">{remoteCourses !== null ? pagination.total : courses.length} courses</span></div>
    {query && <p className="query-label">Results for "{query}"</p>}{apiError && <p className="form-error" role="status">Live course data is temporarily unavailable. Showing the available demo catalogue.</p>}
    {loading ? <div className="course-grid" aria-label="Loading courses" role="status">{[1,2,3,4,5,6].map(n => <div className="course-card course-skeleton" key={n}><div className="skeleton-art"/><div className="course-content"><div className="skeleton-line"/><div className="skeleton-line short"/><div className="skeleton-line"/></div></div>)}</div> : courses.length ? <div className="course-grid">{courses.map(c => <CourseCard key={c.slug || c._id || c.title} course={c}/>)}</div> : <div className="empty-state"><BookOpen size={35}/><h2>No Courses Found</h2><p>Try another search or turn off a filter.</p><button className="button button-quiet" onClick={resetFilters}>Clear filters</button></div>}
    {!loading && remoteCourses !== null && pagination.pages > 1 && <nav className="pagination" aria-label="Course pages"><button className="button button-quiet" disabled={page <= 1} onClick={() => setPage(value => Math.max(1, value - 1))}>Previous</button><span>Page {pagination.page} of {pagination.pages}</span><button className="button button-quiet" disabled={page >= pagination.pages} onClick={() => setPage(value => Math.min(pagination.pages, value + 1))}>Next</button></nav>}
  </main>;
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
  const [mode, setMode] = useState("login"), [name, setName] = useState(""), [email, setEmail] = useState(""), [password, setPassword] = useState(""), [age, setAge] = useState(""), [gender, setGender] = useState(""), [step, setStep] = useState(0), [error, setError] = useState(""), [busy, setBusy] = useState(false); const navigate = useNavigate();
  async function submit(e) { e.preventDefault(); setError(""); if (mode === "register" && step === 0) { const problems = []; if (!name.trim()) problems.push("Enter your full name"); if (!age || Number(age) < 1 || Number(age) > 120) problems.push("Enter a valid age"); if (!gender) problems.push("Select your gender"); if (problems.length) { setError(problems.join(" · ")); return; } setStep(1); return; } setBusy(true); try { const { data } = await api.post(`/auth/${mode === "login" ? "login" : "register"}`, mode === "login" ? { email, password } : { name, email, password, age: Number(age), gender, role: "student" }); if (data.token) localStorage.setItem("eduguru-token", data.token); if (data.user) localStorage.setItem("eduguru-user", JSON.stringify(data.user)); navigate("/profile"); } catch (err) { setError(err.response?.data?.message || "Could not connect to the API. Please try again."); } finally { setBusy(false); } }
  function startStudent() { setMode("register"); setStep(0); setError(""); }
  return <main className="auth-wrap"><section className="auth-card"><div className="auth-icon"><GraduationCap size={28}/></div><div className="eyebrow">WELCOME TO EDUGURU</div><h1>{mode === "login" ? "Welcome back." : step === 0 ? "Start your journey." : "Create your account."}</h1><p>{mode === "login" ? "Sign in to continue learning." : "Create a student account and start exploring."}</p><div className="auth-tabs"><button type="button" className={mode === "login" ? "active" : ""} onClick={() => { setMode("login"); setStep(0); setError(""); }}>Sign in</button><button type="button" className={mode === "register" ? "active" : ""} onClick={startStudent}>Create account</button></div><button type="button" data-wizard-role="student" className="button button-quiet full-button" onClick={startStudent}>Continue as a student</button><form onSubmit={submit}>{mode === "register" && <>{step === 0 ? <><label>Full name<input autoComplete="name" value={name} onChange={e => setName(e.target.value)} placeholder="Your full name"/></label><label>Age<input type="number" min="1" max="120" value={age} onChange={e => setAge(e.target.value)} placeholder="Your age"/></label><label>Gender<select aria-label="Gender" value={gender} onChange={e => setGender(e.target.value)}><option value="">Select gender</option><option value="female">Female</option><option value="male">Male</option><option value="other">Other</option><option value="prefer-not-to-say">Prefer not to say</option></select></label></> : <label>Full name<input required autoComplete="name" value={name} onChange={e => setName(e.target.value)} placeholder="Your full name"/></label>}</>}{(mode === "login" || step > 0) && <><label>{mode === "login" ? "Email or Phone Number" : "Email address"}<input required type="text" autoComplete="username" aria-label={mode === "login" ? "Email or Phone Number" : "Email address"} value={email} onChange={e => setEmail(e.target.value)} placeholder={mode === "login" ? "email@example.com or phone number" : "email@example.com"}/></label><label>Password<input required minLength="8" type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} aria-label="Password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Your password"/></label></>}{error && <p className="form-error" role="alert">{error}</p>}{mode === "register" && step === 0 ? <button type="submit" className="button button-primary full-button">Next <ArrowRight size={17}/></button> : <button type="submit" className="button button-primary full-button" disabled={busy}>{busy ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"} <ArrowRight size={17}/></button>}</form><p className="auth-switch">{mode === "login" ? "New to EduGuru?" : "Already have an account?"} <button type="button" onClick={() => { setMode(mode === "login" ? "register" : "login"); setStep(0); setError(""); }}>{mode === "login" ? "Create an account" : "Sign in"}</button></p></section></main>;
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
function MenuPage() { return <main className="browse-page"><div className="browse-intro"><div className="eyebrow">EDUGURU</div><h1>Explore EduGuru</h1><p>Everything you need to continue your learning journey.</p></div><div className="course-grid menu-grid">{[[HomeIcon,"Home","/home","https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=85"],[BookOpen,"Browse courses","/browse","https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=85"],[Info,"About EduGuru","/about","https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&q=85"],[CircleHelp,"Help & Support","/help-support","https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=85"],[Mail,"Contact","/contact","https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&q=85"],[Download,"Download app","/download-app","https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=900&q=85"]].map(([Icon,label,to,image])=><Link className="course-card menu-card" to={to} key={to}><div className="menu-art"><img src={image} alt="" loading="lazy"/><span className="menu-art-icon"><Icon size={24}/></span></div><div className="course-content"><span className="note-icon"><Icon/></span><h3>{label}</h3><p>Explore {label.toLowerCase()} on EduGuru.</p><span className="text-link">Open page <ArrowRight size={16}/></span></div></Link>)}</div></main>; }
function InfoPage({ path }) { const info = pageInfo[path] || pageInfo["/about"]; const Icon = info.icon; const [sent, setSent] = useState(false); const [sending, setSending] = useState(false); const [contactError, setContactError] = useState(""); async function submitContact(e) { e.preventDefault(); setSending(true); setContactError(""); setSent(false); const form = e.currentTarget; const fields = new FormData(form); try { await api.post("/contact", { name: fields.get("name"), email: fields.get("email"), message: fields.get("message") }); setSent(true); form.reset(); } catch (err) { setContactError(err.response?.data?.message || "We could not send your message. Please try again later."); } finally { setSending(false); } } return <main className="browse-page info-page"><div className="info-cover"><img src={path === "/about" ? "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=85" : path === "/contact" || path === "/help-support" ? "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=85" : "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=85"} alt={info.title} loading="lazy"/><div className="info-cover-caption"><span>{info.intro}</span><strong>{info.title}</strong></div></div><div className="auth-card info-card"><div className="auth-icon"><Icon size={28}/></div><div className="eyebrow">{info.intro}</div><h1>{info.title}</h1><p>{info.body}</p>{path === "/contact" && <form onSubmit={submitContact}><label>Your name<input name="name" required minLength="2" aria-label="Your name" placeholder="Your name"/></label><label>Email address<input name="email" required type="email" aria-label="Email address" placeholder="you@example.com"/></label><label>Message<textarea name="message" required minLength="10" maxLength="5000" aria-label="Message" placeholder="How can we help?"/></label>{contactError && <p className="form-error" role="alert">{contactError}</p>}<button className="button button-primary full-button" type="submit" disabled={sending}>{sending ? "Sending…" : "Send message"} <ArrowRight size={16}/></button>{sent && <p role="status">Thanks — your message was sent to EduGuru support.</p>}</form>}{path === "/help-support" && <div className="support-links"><Link to="/contact">Contact support <ArrowRight size={16}/></Link><Link to="/browse">Browse courses <ArrowRight size={16}/></Link></div>}{path === "/resources" && <Link className="button button-primary" to="/browse">Explore courses <ArrowRight size={16}/></Link>}{path === "/download-app" && <Link className="button button-primary" to="/browse">Continue on the web <ArrowRight size={16}/></Link>}</div></main>; }


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
