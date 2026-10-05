import { GraduationCap } from "lucide-react";

const columns = [
  { title: "Product", links: ["Academics", "Attendance", "Fees", "Communication"] },
  { title: "Company", links: ["About", "Careers", "Blog", "Contact"] },
  { title: "Resources", links: ["Help center", "Guides", "API docs", "Status"] },
];

export default function Footer() {
  return (
    <footer className="bg-sidebar-bg text-sidebar-text pt-8 pb-8">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2 font-display font-semibold text-lg text-white mb-3">
            <div className="h-8 w-8 rounded-full stamp-badge text-gold"><GraduationCap size={16} /></div>
            EduSphere
          </div>
          <p className="text-sm max-w-xs">Modern campus management for schools that want to spend less time on paperwork.</p>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <p className="text-white text-sm font-semibold mb-4">{col.title}</p>
            <ul className="space-y-2.5 text-sm">
              {col.links.map((l) => (
                <li key={l}><a href="#" className="hover:text-white transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="max-w-6xl mx-auto px-6 mt-10 pt-6 border-t border-white/10 text-xs flex flex-col sm:flex-row justify-between gap-3">
        <span>© 2026 EduSphere. All rights reserved.</span>
        <span>Made for schools that move fast.</span>
      </div>
    </footer>
  );
}