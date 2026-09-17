<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Halaxis • Build real companies from your phone</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Marcellus:wght@400&amp;family=Manrope:wght@400;500;600;700&amp;display=swap">
  <style>
    body { font-family: 'Manrope', system-ui, sans-serif; }
    .heading { font-family: 'Marcellus', Georgia, serif; font-weight: 400; }
    .eyebrow { font-size: 12px; letter-spacing: 0.22em; text-transform: uppercase; color: #7c3aed; position: relative; display: inline-block; padding-left: 34px; }
    .eyebrow::before { content: ''; position: absolute; left: 0; top: 50%; transform: translateY(-50%); width: 26px; height: 1px; background-color: #7c3aed; }
    .star { stroke: #7c3aed; stroke-width: 1.8; fill: none; }
    .rub-el-hizb { stroke: #7c3aed; stroke-width: 2; fill: none; }
    .section { opacity: 0; transform: translateY(18px); transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1); }
    .section.visible { opacity: 1; transform: translateY(0); }
    .industry-card { transition: all 0.2s cubic-bezier(0.23, 1, 0.32, 1); }
    .industry-card:hover { transform: translateY(-4px); box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.05); }
    .most-chosen { position: absolute; top: -13px; left: 50%; transform: translateX(-50%); background: #7c3aed; color: white; font-size: 11px; padding: 2px 16px; border-radius: 9999px; }
    .agent-card { transition: all 0.2s ease; }
    .agent-card:hover { border-color: #7c3aed; transform: translateY(-3px); }
    .ticker { white-space: nowrap; animation: ticker 30s linear infinite; }
    .star-rotate { animation: rotate-star 90s linear infinite; }
    @keyframes rotate-star { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    .nav-link:hover { color: #059669; }
    @media (max-width: 960px) { .desktop-nav { display: none; } }
  </style>
</head>
<body class="bg-white text-slate-900">

  <!-- Nav -->
  <nav class="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
    <div class="max-w-7xl mx-auto px-6 flex items-center justify-between h-20">
      <div class="flex items-center gap-3">
        <svg width="26" height="26" viewBox="0 0 100 100" class="star"><g transform="translate(50,50)"><rect x="-35" y="-35" width="70" height="70" transform="rotate(45)"/><rect x="-25" y="-25" width="50" height="50"/></g></svg>
        <div class="font-semibold tracking-[2.5px] text-xl">HALAXIS</div>
      </div>
      <div class="desktop-nav flex items-center gap-9 text-sm font-medium">
        <a href="#industries" class="nav-link">Industries</a>
        <a href="#how" class="nav-link">How it works</a>
        <a href="#membership" class="nav-link">Membership</a>
        <a href="#amanah" class="nav-link">Amanah</a>
      </div>
      <a href="#waitlist" class="px-6 py-2.5 rounded-full bg-[#7c3aed] text-white text-sm font-semibold hover:bg-[#6d28d9]">Join the waitlist</a>
    </div>
  </nav>

  <!-- Hero -->
  <section class="max-w-7xl mx-auto px-6 pt-20 pb-24">
    <div class="grid md:grid-cols-2 gap-16 items-center">
      <div>
        <div class="eyebrow mb-5">INVITE-ONLY PLATFORM</div>
        <h1 class="heading text-7xl leading-[1.02] tracking-[-2.5px] mb-6">Build real companies<br>from your <span class="text-[#059669]">phone</span>.</h1>
        <p class="max-w-lg text-xl text-slate-600 mb-10">A private platform for launching and scaling high-value halal businesses across eight strategic industries.</p>
        <div class="flex flex-wrap gap-4">
          <a href="#waitlist" class="px-9 py-4 rounded-full bg-[#7c3aed] text-white font-semibold text-sm tracking-wide hover:bg-[#6d28d9]">Request an invitation</a>
          <a href="#how" class="px-9 py-4 rounded-full border border-slate-300 hover:bg-slate-50 text-sm font-medium">See how it works</a>
        </div>
        <div class="mt-6 text-xs tracking-[1.5px] text-slate-500">INVITE-ONLY LAUNCH · TRUST FIRST, SCALE SECOND</div>
      </div>
      <div class="hidden md:flex justify-center">
        <div class="relative w-[380px] h-[380px]">
          <svg width="380" height="380" viewBox="0 0 380 380" class="star-rotate"><g transform="translate(190,190)"><g class="rub-el-hizb"><rect x="-95" y="-95" width="190" height="190" transform="rotate(45)"/><rect x="-68" y="-68" width="136" height="136"/></g><g class="rub-el-hizb" style="stroke-width:1.6"><rect x="-72" y="-72" width="144" height="144" transform="rotate(45)"/><rect x="-52" y="-52" width="104" height="104"/></g><g class="rub-el-hizb" style="stroke-width:1.2"><rect x="-48" y="-48" width="96" height="96" transform="rotate(45)"/><rect x="-34" y="-34" width="68" height="68"/></g></g></svg>
          <div class="absolute inset-0 flex items-center justify-center"><div class="text-center"><div class="text-6xl font-light tracking-[5px] text-[#7c3aed]">8</div><div class="text-xs tracking-[3px] mt-1 text-[#7c3aed]/70">INDUSTRIES</div><div class="text-[10px] tracking-[2px] text-[#7c3aed]/50 mt-px">ONE PLATFORM</div></div></div>
        </div>
      </div>
    </div>
  </section>

  <!-- Ticker -->
  <div class="border-y border-slate-200 py-4 overflow-hidden bg-slate-50">
    <div class="flex items-center gap-9 text-xs tracking-[3.5px] text-[#7c3aed] ticker">
      <span>OIL &amp; ENERGY</span><span class="text-[#7c3aed]/30">◆</span><span>COMMODITIES</span><span class="text-[#7c3aed]/30">◆</span><span>LOGISTICS</span><span class="text-[#7c3aed]/30">◆</span><span>AVIATION</span><span class="text-[#7c3aed]/30">◆</span><span>HALAL FINANCE</span><span class="text-[#7c3aed]/30">◆</span><span>REAL ESTATE</span><span class="text-[#7c3aed]/30">◆</span><span>TRADE</span><span class="text-[#7c3aed]/30">◆</span><span>LUXURY ASSETS</span>
    </div>
  </div>

  <!-- Industries -->
  <section id="industries" class="max-w-7xl mx-auto px-6 py-20 section">
    <div class="eyebrow mb-8">EIGHT STRATEGIC VERTICALS</div>
    <h2 class="heading text-6xl tracking-[-1.5px] mb-12">Industries that matter.</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="industry-card border border-slate-200 bg-white p-7 rounded-3xl"><svg width="22" height="22" viewBox="0 0 100 100" class="star mb-6"><g transform="translate(50,50)"><rect x="-28" y="-28" width="56" height="56" transform="rotate(45)"/><rect x="-20" y="-20" width="40" height="40"/></g></svg><div class="font-semibold text-xl">Oil &amp; Energy</div></div>
      <div class="industry-card border border-slate-200 bg-white p-7 rounded-3xl"><svg width="22" height="22" viewBox="0 0 100 100" class="star mb-6"><g transform="translate(50,50)"><rect x="-28" y="-28" width="56" height="56" transform="rotate(45)"/><rect x="-20" y="-20" width="40" height="40"/></g></svg><div class="font-semibold text-xl">Commodities</div></div>
      <div class="industry-card border border-slate-200 bg-white p-7 rounded-3xl"><svg width="22" height="22" viewBox="0 0 100 100" class="star mb-6"><g transform="translate(50,50)"><rect x="-28" y="-28" width="56" height="56" transform="rotate(45)"/><rect x="-20" y="-20" width="40" height="40"/></g></svg><div class="font-semibold text-xl">Logistics</div></div>
      <div class="industry-card border border-slate-200 bg-white p-7 rounded-3xl"><svg width="22" height="22" viewBox="0 0 100 100" class="star mb-6"><g transform="translate(50,50)"><rect x="-28" y="-28" width="56" height="56" transform="rotate(45)"/><rect x="-20" y="-20" width="40" height="40"/></g></svg><div class="font-semibold text-xl">Aviation</div></div>
      <div class="industry-card border border-slate-200 bg-white p-7 rounded-3xl"><svg width="22" height="22" viewBox="0 0 100 100" class="star mb-6"><g transform="translate(50,50)"><rect x="-28" y="-28" width="56" height="56" transform="rotate(45)"/><rect x="-20" y="-20" width="40" height="40"/></g></svg><div class="font-semibold text-xl">Halal Finance</div></div>
      <div class="industry-card border border-slate-200 bg-white p-7 rounded-3xl"><svg width="22" height="22" viewBox="0 0 100 100" class="star mb-6"><g transform="translate(50,50)"><rect x="-28" y="-28" width="56" height="56" transform="rotate(45)"/><rect x="-20" y="-20" width="40" height="40"/></g></svg><div class="font-semibold text-xl">Real Estate</div></div>
      <div class="industry-card border border-slate-200 bg-white p-7 rounded-3xl"><svg width="22" height="22" viewBox="0 0 100 100" class="star mb-6"><g transform="translate(50,50)"><rect x="-28" y="-28" width="56" height="56" transform="rotate(45)"/><rect x="-20" y="-20" width="40" height="40"/></g></svg><div class="font-semibold text-xl">Trade</div></div>
      <div class="industry-card border border-slate-200 bg-white p-7 rounded-3xl"><svg width="22" height="22" viewBox="0 0 100 100" class="star mb-6"><g transform="translate(50,50)"><rect x="-28" y="-28" width="56" height="56" transform="rotate(45)"/><rect x="-20" y="-20" width="40" height="40"/></g></svg><div class="font-semibold text-xl">Luxury Assets</div></div>
    </div>
  </section>

  <!-- How it works -->
  <section id="how" class="max-w-3xl mx-auto px-6 py-20 border-t section">
    <div class="eyebrow mb-8">SIMPLE. RIGOROUS. INVITE-ONLY.</div>
    <h2 class="heading text-6xl tracking-[-1.5px] mb-12">How it works.</h2>
    <div class="divide-y">
      <div class="flex gap-8 py-8"><div class="step-number flex-shrink-0"><svg width="60" height="60" viewBox="0 0 100 100"><g transform="translate(50,50)"><g class="rub-el-hizb"><rect x="-22" y="-22" width="44" height="44" transform="rotate(45)"/><rect x="-16" y="-16" width="32" height="32"/></g></g><text x="50" y="56" text-anchor="middle" fill="#7c3aed" font-size="21" font-weight="600">01</text></svg></div><div class="pt-1"><div class="font-semibold text-xl">Apply</div><div class="text-slate-600 mt-1.5">Submit your background and intended vertical through the private portal.</div></div></div>
      <div class="flex gap-8 py-8"><div class="step-number flex-shrink-0"><svg width="60" height="60" viewBox="0 0 100 100"><g transform="translate(50,50)"><g class="rub-el-hizb"><rect x="-22" y="-22" width="44" height="44" transform="rotate(45)"/><rect x="-16" y="-16" width="32" height="32"/></g></g><text x="50" y="56" text-anchor="middle" fill="#7c3aed" font-size="21" font-weight="600">02</text></svg></div><div class="pt-1"><div class="font-semibold text-xl">Review</div><div class="text-slate-600 mt-1.5">Our team conducts diligence focused on character, track record, and alignment.</div></div></div>
      <div class="flex gap-8 py-8"><div class="step-number flex-shrink-0"><svg width="60" height="60" viewBox="0 0 100 100"><g transform="translate(50,50)"><g class="rub-el-hizb"><rect x="-22" y="-22" width="44" height="44" transform="rotate(45)"/><rect x="-16" y="-16" width="32" height="32"/></g></g><text x="50" y="56" text-anchor="middle" fill="#7c3aed" font-size="21" font-weight="600">03</text></svg></div><div class="pt-1"><div class="font-semibold text-xl">Activate</div><div class="text-slate-600 mt-1.5">Receive your membership and private workspace with AI agents.</div></div></div>
      <div class="flex gap-8 py-8"><div class="step-number flex-shrink-0"><svg width="60" height="60" viewBox="0 0 100 100"><g transform="translate(50,50)"><g class="rub-el-hizb"><rect x="-22" y="-22" width="44" height="44" transform="rotate(45)"/><rect x="-16" y="-16" width="32" height="32"/></g></g><text x="50" y="56" text-anchor="middle" fill="#7c3aed" font-size="21" font-weight="600">04</text></svg></div><div class="pt-1"><div class="font-semibold text-xl">Launch</div><div class="text-slate-600 mt-1.5">Incorporate, structure, and begin operations with full tooling.</div></div></div>
      <div class="flex gap-8 py-8"><div class="step-number flex-shrink-0"><svg width="60" height="60" viewBox="0 0 100 100"><g transform="translate(50,50)"><g class="rub-el-hizb"><rect x="-22" y="-22" width="44" height="44" transform="rotate(45)"/><rect x="-16" y="-16" width="32" height="32"/></g></g><text x="50" y="56" text-anchor="middle" fill="#7c3aed" font-size="21" font-weight="600">05</text></svg></div><div class="pt-1"><div class="font-semibold text-xl">Scale</div><div class="text-slate-600 mt-1.5">Access capital partners, strategic introductions, and governance support.</div></div></div>
    </div>
  </section>

  <!-- Membership -->
  <section id="membership" class="max-w-6xl mx-auto px-6 py-20 border-t section">
    <div class="text-center mb-12">
      <div class="eyebrow mb-4">MEMBERSHIP</div>
      <h2 class="heading text-6xl tracking-[-1.5px]">Choose your level of access.</h2>
    </div>
    <div class="grid md:grid-cols-3 gap-6">
      <div class="border border-slate-200 bg-white rounded-3xl p-8 relative">
        <div class="font-semibold text-2xl">Founder</div><div class="mt-1 text-5xl tracking-tighter">AED 85k</div><div class="text-xs tracking-widest text-slate-500 mt-1">ANNUAL</div>
        <ul class="mt-8 space-y-3.5 text-[15px]"><li>Access to 2 verticals</li><li>Core AI agents</li><li>Legal &amp; structuring support</li><li>Quarterly governance reviews</li></ul>
        <a href="#waitlist" class="mt-9 block text-center py-3.5 border border-slate-300 rounded-full text-sm font-semibold hover:bg-slate-50">Apply</a>
      </div>
      <div class="border-2 border-[#7c3aed] bg-white rounded-3xl p-8 relative">
        <div class="most-chosen">MOST CHOSEN</div>
        <div class="font-semibold text-2xl">Principal</div><div class="mt-1 text-5xl tracking-tighter">AED 195k</div><div class="text-xs tracking-widest text-slate-500 mt-1">ANNUAL</div>
        <ul class="mt-8 space-y-3.5 text-[15px]"><li>Full access to all 8 verticals</li><li>Full AI Venture Board</li><li>Dedicated deal team</li><li>Priority capital introductions</li><li>Amanah project allocation</li></ul>
        <a href="#waitlist" class="mt-9 block text-center py-3.5 bg-[#7c3aed] text-white rounded-full text-sm font-semibold hover:bg-[#6d28d9]">Apply as Principal</a>
      </div>
      <div class="border border-slate-200 bg-white rounded-3xl p-8 relative">
        <div class="font-semibold text-2xl">Institution</div><div class="mt-1 text-5xl tracking-tighter">AED 420k</div><div class="text-xs tracking-widest text-slate-500 mt-1">ANNUAL</div>
        <ul class="mt-8 space-y-3.5 text-[15px]"><li>All Principal benefits</li><li>Custom agent development</li><li>Board-level reporting</li><li>Co-investment rights</li><li>Private Amanah fund</li></ul>
        <a href="#waitlist" class="mt-9 block text-center py-3.5 border border-slate-300 rounded-full text-sm font-semibold hover:bg-slate-50">Contact us</a>
      </div>
    </div>
  </section>

  <!-- AI Venture Board -->
  <section class="max-w-7xl mx-auto px-6 py-20 border-t section">
    <div class="max-w-2xl mb-12"><div class="eyebrow mb-4">AI VENTURE BOARD</div><h2 class="heading text-6xl tracking-[-1.5px]">Your executive team, always on.</h2></div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div class="agent-card border border-slate-200 bg-white p-7 rounded-3xl"><div class="text-[#7c3aed] text-sm tracking-widest font-medium">CEO AGENT</div><div class="font-semibold mt-3 text-lg">Strategic planning, capital allocation, governance.</div></div>
      <div class="agent-card border border-slate-200 bg-white p-7 rounded-3xl"><div class="text-[#7c3aed] text-sm tracking-widest font-medium">CFO AGENT</div><div class="font-semibold mt-3 text-lg">Financial modeling, treasury, Shariah purification.</div></div>
      <div class="agent-card border border-slate-200 bg-white p-7 rounded-3xl"><div class="text-[#7c3aed] text-sm tracking-widest font-medium">TRADE AGENT</div><div class="font-semibold mt-3 text-lg">Counterparty screening, contract structuring.</div></div>
      <div class="agent-card border border-slate-200 bg-white p-7 rounded-3xl"><div class="text-[#7c3aed] text-sm tracking-widest font-medium">AVIATION AGENT</div><div class="font-semibold mt-3 text-lg">Fleet analysis, regulatory navigation.</div></div>
      <div class="agent-card border border-slate-200 bg-white p-7 rounded-3xl"><div class="text-[#7c3aed] text-sm tracking-widest font-medium">ENERGY AGENT</div><div class="font-semibold mt-3 text-lg">Asset evaluation, offtake agreements.</div></div>
      <div class="agent-card border border-slate-200 bg-white p-7 rounded-3xl"><div class="text-[#7c3aed] text-sm tracking-widest font-medium">LEGAL AGENT</div><div class="font-semibold mt-3 text-lg">Entity formation, compliance, Shariah liaison.</div></div>
    </div>
  </section>

  <!-- Trust -->
  <section class="max-w-7xl mx-auto px-6 py-20 border-t section">
    <div class="border border-slate-200 rounded-3xl p-10">
      <div class="eyebrow mb-8">TRUST FIRST</div>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-6 text-sm">
        <div><span class="font-semibold">Stage 01</span><div class="text-slate-600 mt-1">Character &amp; background verification</div></div>
        <div><span class="font-semibold">Stage 02</span><div class="text-slate-600 mt-1">Shariah alignment review</div></div>
        <div><span class="font-semibold">Stage 03</span><div class="text-slate-600 mt-1">Operational readiness audit</div></div>
        <div><span class="font-semibold">Stage 04</span><div class="text-slate-600 mt-1">Ongoing governance &amp; reporting</div></div>
      </div>
    </div>
  </section>

  <!-- Amanah -->
  <section id="amanah" class="max-w-7xl mx-auto px-6 py-20 border-t section">
    <div class="flex items-center gap-3 mb-6"><span class="px-5 py-1 text-xs tracking-[1.5px] border border-[#7c3aed] text-[#7c3aed] rounded-full font-medium">AMANAH</span></div>
    <h2 class="heading text-6xl tracking-[-1.5px] max-w-3xl">Organize community impact with the same discipline as your ventures.</h2>
    <div class="mt-8 flex flex-wrap gap-2">
      <div class="px-4 py-1.5 text-sm border border-slate-200 rounded-full">Clean water access</div><div class="px-4 py-1.5 text-sm border border-slate-200 rounded-full">Education infrastructure</div><div class="px-4 py-1.5 text-sm border border-slate-200 rounded-full">Healthcare clinics</div><div class="px-4 py-1.5 text-sm border border-slate-200 rounded-full">Skills training</div><div class="px-4 py-1.5 text-sm border border-slate-200 rounded-full">Orphan care</div><div class="px-4 py-1.5 text-sm border border-slate-200 rounded-full">Sustainable agriculture</div><div class="px-4 py-1.5 text-sm border border-slate-200 rounded-full">Micro-enterprise support</div>
    </div>
    <div class="grid md:grid-cols-2 gap-6 mt-10">
      <div class="border border-slate-200 bg-white p-8 rounded-3xl"><div class="font-semibold">Project planning tools</div><div class="text-slate-600 mt-2 text-sm">Structured planning, milestone tracking, and transparent reporting.</div></div>
      <div class="border border-slate-200 bg-white p-8 rounded-3xl"><div class="font-semibold">Impact verification</div><div class="text-slate-600 mt-2 text-sm">Independent verification and quarterly impact statements.</div></div>
    </div>
  </section>

  <!-- Waitlist -->
  <section id="waitlist" class="max-w-xl mx-auto px-6 py-20 text-center section">
    <div class="border border-[#7c3aed]/20 bg-white rounded-3xl p-12 shadow-sm">
      <div class="eyebrow mb-6 justify-center">INVITE-ONLY ACCESS</div>
      <h2 class="heading text-5xl tracking-[-1px]">Ready to build?</h2>
      <p class="mt-3 text-slate-600">Applications are reviewed on a rolling basis.</p>
      <form class="mt-8 flex gap-3" onsubmit="event.preventDefault(); alert('Thank you. Your application has been received.');">
        <input type="email" placeholder="Your work email" class="flex-1 border border-slate-300 rounded-full px-6 py-3.5 text-sm focus:outline-none focus:border-[#7c3aed]">
        <button type="submit" class="px-8 py-3.5 rounded-full bg-[#7c3aed] text-white font-semibold text-sm hover:bg-[#6d28d9]">Request access</button>
      </form>
    </div>
  </section>

  <footer class="border-t border-slate-200 bg-slate-50">
    <div class="max-w-7xl mx-auto px-6 py-12 text-xs text-slate-500 flex flex-col md:flex-row md:items-center gap-y-4 justify-between">
      <div>© Halaxis. All rights reserved.</div>
      <div class="flex gap-x-6"><a href="#" class="hover:text-slate-700">Privacy</a><a href="#" class="hover:text-slate-700">Terms</a><a href="#" class="hover:text-slate-700">Compliance</a></div>
    </div>
    <div class="border-t border-slate-200 py-6 text-[10px] text-center text-slate-400 max-w-4xl mx-auto px-6">Halaxis is a private platform for planning and operating halal businesses. It does not offer securities, accept investment funds, or act as a charitable organization.</div>
  </footer>

  <script>
    function initScrollAnimations() {
      const sections = document.querySelectorAll('.section');
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } });
      }, { threshold: 0.12 });
      sections.forEach(section => observer.observe(section));
    }
    function respectReducedMotion() {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.querySelectorAll('.star-rotate').forEach(el => el.style.animation = 'none');
      }
    }
    window.onload = function() { initScrollAnimations(); respectReducedMotion(); };
  </script>
</body>
</html>