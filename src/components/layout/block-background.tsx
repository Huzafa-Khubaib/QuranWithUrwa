/** Soft pastel clay blocks behind the whole site. */
export function BlockBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute inset-0 bg-cream" />

      {/* Soft wash */}
      <div className="absolute -top-24 -left-16 size-[28rem] rounded-[3rem] bg-peach/35 blur-2xl" />
      <div className="absolute top-32 -right-20 size-[26rem] rounded-[3rem] bg-mint/40 blur-2xl" />
      <div className="absolute bottom-10 left-1/3 size-[22rem] rounded-[3rem] bg-sky/35 blur-2xl" />

      {/* Block mosaic grid */}
      <div
        className="absolute inset-0 opacity-[0.55]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(61,44,41,0.035) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(61,44,41,0.035) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />

      {/* Floating clay blocks */}
      <span className="clay absolute top-[8%] left-[6%] size-14 rounded-2xl bg-peach/70 sm:size-16" />
      <span className="clay absolute top-[18%] right-[10%] size-12 rounded-2xl bg-mint/70 sm:size-14" />
      <span className="clay absolute top-[42%] left-[3%] hidden size-10 rounded-2xl bg-soft-yellow/80 sm:block" />
      <span className="clay absolute top-[55%] right-[5%] size-16 rounded-[1.25rem] bg-sky/70" />
      <span className="clay absolute bottom-[22%] left-[12%] size-12 rounded-2xl bg-mint/60" />
      <span className="clay absolute right-[18%] bottom-[28%] size-10 rounded-2xl bg-peach/65" />
      <span className="clay absolute bottom-[12%] left-[40%] size-14 rounded-2xl bg-soft-yellow/70" />
      <span className="clay absolute top-[70%] right-[28%] hidden size-11 rounded-2xl bg-peach/55 md:block" />
      <span className="clay absolute top-[28%] left-[22%] hidden size-9 rounded-xl bg-sky/55 lg:block" />
      <span className="clay absolute top-[12%] left-[48%] hidden size-8 rounded-xl bg-mint/50 lg:block" />
    </div>
  );
}
