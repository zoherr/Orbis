export function OrbisFooter() {
  return (
    <footer className="border-t border-[#dfe7f3] bg-white/80">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 text-sm text-[#46536a] sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">
        <div className="font-medium text-[#084ba7]">Orbis</div>
        <div>Build your orbit. Find your people.</div>
        <div className="flex items-center gap-4">
          <a href="#" className="transition hover:text-[#084ba7]">About</a>
          <a href="#" className="transition hover:text-[#084ba7]">Spaces</a>
          <a href="#" className="transition hover:text-[#084ba7]">Community</a>
        </div>
      </div>
    </footer>
  );
}
