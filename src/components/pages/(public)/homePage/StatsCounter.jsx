import Counter from "./Counter";

const stats = [
  { value: 500, suffix: "+", label: "Schools onboarded" },
  { display: "2M+", label: "Students managed" },
  { value: 99, suffix: ".9%", label: "Platform uptime" },
  { value: 4, suffix: ".9/5", label: "Average rating" },
];

export default function StatsCounter() {
  return (
    <section className="py-18 bg-white text-white">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
        {stats.map((s, i) => (
          <div key={i}>
            <p className="text-3xl md:text-4xl text-gold">
              {s.display ? s.display : <Counter value={s.value} suffix={s.suffix} />}
            </p>
            <p className="text-xs uppercase tracking-widest text-sidebar-text mt-2">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}