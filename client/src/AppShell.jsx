import { Link, useLocation } from "react-router-dom";
import { GraduationCap, Home, Search, LayoutDashboard, UserRound, MoreHorizontal, Star, Download, Bell, Grid2X2, Bookmark, CreditCard, Sparkles, FileText, Calculator, CalendarDays, Award, CircleHelp, ChevronRight, Phone, Info } from "lucide-react";
import "./eduguru-parity.css";

const primary = [
  { label: "Home", to: "/home", Icon: Home },
  { label: "Browse", to: "/browse", Icon: Search },
  { label: "Dashboard", to: "/courses", Icon: LayoutDashboard },
  { label: "Profile", to: "/profile", Icon: UserRound },
  { label: "More", to: "/menu", Icon: MoreHorizontal },
];
const quick = [
  { label: "Home", to: "/home", Icon: Home, tone: "purple" },
  { label: "Categories", to: "/browse", Icon: Grid2X2, tone: "green" },
  { label: "My List", to: "/profile", Icon: Bookmark, tone: "blue" },
  { label: "Payment Portal", to: "/profile", Icon: CreditCard, tone: "orange" },
  { label: "EduGuru AI", to: "/menu", Icon: Sparkles, tone: "pink", tag: "SOON" },
  { label: "Announcements", to: "/menu", Icon: Bell, tone: "red" },
  { label: "My Notes", to: "/menu", Icon: FileText, tone: "teal" },
  { label: "Calculator", to: "/menu", Icon: Calculator, tone: "blue" },
  { label: "Calendar", to: "/menu", Icon: CalendarDays, tone: "cyan" },
  { label: "Certificates", to: "/profile", Icon: Award, tone: "cyan" },
  { label: "Resources", to: "/resources", Icon: Download, tone: "green" },
  { label: "Help & Support", to: "/help-support", Icon: CircleHelp, tone: "purple" },
];
function Logo() {
  return <Link className="parity-logo" to="/home" aria-label="EduGuru home"><span><GraduationCap size={25}/></span><b>EduGuru</b></Link>;
}
function LeftSidebar() {
  const location = useLocation();
  return <aside className="left-sidebar">
    <section className="sidebar-welcome"><span className="welcome-icon"><GraduationCap size={24}/></span><strong>Start Learning Today</strong><p>Join thousands of students &amp; teachers on EduGuru</p><div><Link to="/auth">Sign In</Link><Link to="/auth" className="signup-link">Sign Up</Link></div></section>
    <nav className="sidebar-nav" aria-label="Main navigation">{primary.map(({label,to,Icon}) => <Link key={label} to={to} className={location.pathname === to || (label === "Home" && location.pathname === "/") || (label === "Browse" && (location.pathname.startsWith("/course/") || location.pathname === "/browse")) || (label === "Dashboard" && ["/courses", "/profile"].includes(location.pathname)) ? "sidebar-nav-item active" : "sidebar-nav-item"} aria-current={(location.pathname === to || (label === "Home" && location.pathname === "/")) ? "page" : undefined}><span className={"side-icon side-" + label.toLowerCase()}><Icon size={19}/></span>{label}</Link>)}</nav>
    <section className="sidebar-more"><div className="sidebar-brand"><Logo/></div><Link to="/menu"><span className="side-icon side-promote"><Star size={17}/></span>Promote<ChevronRight size={14}/></Link><Link to="/download-app"><span className="side-icon side-download"><Download size={17}/></span>Download App<ChevronRight size={14}/></Link></section>
  </aside>;
}
function RightSidebar() {
  return <aside className="right-sidebar">
    <Link to="/profile" className="wallet-card"><span className="wallet-emoji">🎒</span><span><small>EDUGURU</small><b>My Wallet</b></span><ChevronRight size={16}/></Link>
    <section className="quick-access"><div className="right-section-label">QUICK ACCESS</div><div className="quick-grid">{quick.map(({label,to,Icon,tone,tag}) => <Link key={label} to={to} className={"quick-tile tone-" + tone}><span className="quick-icon"><Icon size={23}/></span>{tag && <small className="soon-tag">{tag}</small>}<b>{label}</b></Link>)}</div></section>
    <section className="right-more"><div className="right-section-label">MORE</div><div className="more-grid"><Link to="/browse"><span className="more-icon tone-purple"><Search size={20}/></span><b>Browse</b><small>All courses</small></Link><Link to="/help-support"><span className="more-icon tone-cyan"><CircleHelp size={20}/></span><b>Help</b><small>Get answers</small></Link><Link to="/contact"><span className="more-icon tone-green"><Phone size={20}/></span><b>Contact</b><small>Talk to us</small></Link><Link to="/about"><span className="more-icon tone-orange"><Info size={20}/></span><b>About</b><small>Our platform</small></Link></div></section><section className="right-policy-links"><Link to="/terms"><span className="policy-symbol terms"><FileText size={16}/></span>Terms &amp; Conditions<ChevronRight size={14}/></Link><Link to="/privacy"><span className="policy-symbol privacy"><Info size={16}/></span>Privacy Policy<ChevronRight size={14}/></Link></section>
  </aside>;
}
function MobileBottomNav() {
  const location = useLocation();
  const items = [
    { id: "nav-home", label: "Home", to: "/home", Icon: Home },
    { id: "nav-menu", label: "Menu", to: "/menu", Icon: MoreHorizontal },
    { id: "nav-courses", label: "Courses", to: "/browse", Icon: Grid2X2 },
    { id: "nav-profile", label: "Profile", to: "/profile", Icon: UserRound },
  ];
  return <nav className="mobile-bottom-nav" aria-label="Mobile navigation">{items.map(({id,label,to,Icon}) => <Link key={id} id={id} to={to} aria-current={(location.pathname === to || (label === "Home" && location.pathname === "/") || (label === "Courses" && location.pathname.startsWith("/course/"))) ? "page" : undefined} className={(location.pathname === to || (label === "Home" && location.pathname === "/") || (label === "Courses" && location.pathname.startsWith("/course/"))) ? "mobile-bottom-item selected" : "mobile-bottom-item"}><Icon size={19}/><span>{label}</span></Link>)}</nav>;
}
export default function AppShell({ children }) {
  return <div className="app-shell"><LeftSidebar/><div className="main-column">{children}</div><RightSidebar/><MobileBottomNav/></div>;
}