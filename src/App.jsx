import { useState, useRef, useEffect } from "react";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500&display=swap');

  :root {
    --black:       #080808;
    --surface:     #111111;
    --surface-2:   #181818;
    --surface-3:   #202020;
    --border:      rgba(255,255,255,0.07);
    --border-mid:  rgba(255,255,255,0.11);
    --text:        #ede9e0;
    --text-muted:  #6e6a63;
    --text-dim:    #3a3835;
    --amber:       #c8922a;
    --amber-dim:   rgba(200,146,42,0.1);
    --red:         #c0392b;
    --red-dim:     rgba(192,57,43,0.1);
    --green:       #4a9268;
    --green-dim:   rgba(74,146,104,0.1);
    --yellow:      #c49a3c;
    --yellow-dim:  rgba(196,154,60,0.1);
    --font-display:'Instrument Serif', Georgia, serif;
    --font-body:   'DM Sans', sans-serif;
    --font-mono:   'DM Mono', monospace;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
  html { font-size: 16px; }
  body {
    background: var(--black);
    color: var(--text);
    font-family: var(--font-body);
    font-size: 14px;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }

  .app { max-width: 430px; margin: 0 auto; min-height: 100dvh; display: flex; flex-direction: column; }

  .topbar {
    padding: 16px 20px 12px;
    display: flex; align-items: center; justify-content: space-between;
    border-bottom: 1px solid var(--border);
    position: sticky; top: 0; z-index: 30; background: var(--black);
  }
  .topbar-logo {
    font-family: var(--font-mono); font-size: 11px;
    letter-spacing: 0.28em; text-transform: uppercase; color: var(--text);
    display: flex; align-items: center; gap: 8px;
  }
  .logo-mark {
    width: 18px; height: 18px; border: 1px solid var(--amber);
    border-radius: 3px; display: flex; align-items: center; justify-content: center;
  }
  .logo-mark-inner { width: 6px; height: 6px; border-radius: 50%; background: var(--amber); }
  .icon-btn {
    width: 34px; height: 34px; background: var(--surface-2);
    border: 1px solid var(--border); border-radius: 6px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: var(--text-muted); transition: all 0.15s;
  }
  .icon-btn:hover { border-color: var(--border-mid); color: var(--text); }
  .contact-topbar-btn {
    height: 34px; padding: 0 12px;
    background: var(--surface-2); border: 1px solid var(--border);
    border-radius: 6px; cursor: pointer;
    font-family: var(--font-mono); font-size: 9px;
    letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--text-muted); transition: all 0.15s;
  }
  .contact-topbar-btn:hover { border-color: var(--amber); color: var(--amber); }

  .bottom-nav {
    display: flex; border-top: 1px solid var(--border);
    background: var(--black); position: sticky; bottom: 0; z-index: 30;
  }
  .nav-tab {
    flex: 1; padding: 11px 2px 14px;
    display: flex; flex-direction: column; align-items: center; gap: 4px;
    cursor: pointer; color: var(--text-dim);
    font-family: var(--font-mono); font-size: 7px; letter-spacing: 0.08em; text-transform: uppercase;
    transition: color 0.15s; border: none; background: none;
  }
  .nav-tab.active { color: var(--amber); }
  .nav-tab svg { width: 18px; height: 18px; stroke-width: 1.5; }

  .screen { flex: 1; overflow-y: auto; }
  .screen::-webkit-scrollbar { display: none; }

  .home-hero { padding: 28px 20px 24px; border-bottom: 1px solid var(--border); }
  .home-tagline {
    font-family: var(--font-display); font-size: 30px; font-weight: 400;
    line-height: 1.2; color: var(--text); margin-bottom: 8px;
  }
  .home-tagline em { font-style: italic; color: var(--amber); }
  .home-sub { font-size: 13px; color: var(--text-muted); font-weight: 300; line-height: 1.5; }
  .scan-hero-btn {
    margin: 18px 20px 0; width: calc(100% - 40px);
    background: var(--amber); color: var(--black);
    border: none; border-radius: 8px; padding: 15px;
    font-family: var(--font-mono); font-size: 11px; font-weight: 500;
    letter-spacing: 0.12em; text-transform: uppercase;
    cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px;
    transition: opacity 0.15s;
  }
  .scan-hero-btn:hover { opacity: 0.88; }

  .section-head {
    padding: 18px 20px 10px;
    display: flex; align-items: baseline; justify-content: space-between;
  }
  .section-label {
    font-family: var(--font-mono); font-size: 9px;
    letter-spacing: 0.18em; text-transform: uppercase; color: var(--text-dim);
  }

  .recent-row {
    display: flex; align-items: center; gap: 12px;
    padding: 11px 20px; border-bottom: 1px solid var(--border);
    cursor: pointer; transition: background 0.1s;
  }
  .recent-row:hover { background: var(--surface); }
  .recent-icon {
    width: 34px; height: 34px; border-radius: 6px; background: var(--surface-2);
    display: flex; align-items: center; justify-content: center; font-size: 15px; flex-shrink: 0;
  }
  .recent-info { flex: 1; min-width: 0; }
  .recent-brand { font-size: 13px; font-weight: 500; color: var(--text); }
  .recent-parent { font-family: var(--font-mono); font-size: 10px; color: var(--text-dim); margin-top: 1px; }
  .recent-dots { display: flex; gap: 4px; flex-shrink: 0; }
  .dot { width: 7px; height: 7px; border-radius: 50%; }
  .dot-red { background: var(--red); }
  .dot-yellow { background: var(--yellow); }
  .dot-green { background: var(--green); }
  .dot-gray { background: var(--text-dim); }

  /* ── TRENDING ── */
  .trending-section { padding: 0 20px 24px; }
  .trending-grid { display: flex; flex-direction: column; gap: 8px; }
  .trending-card {
    display: flex; align-items: stretch;
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 6px; overflow: hidden;
    cursor: pointer; transition: border-color 0.15s;
  }
  .trending-card:hover { border-color: var(--border-mid); }
  .trending-rank {
    width: 36px; flex-shrink: 0;
    background: var(--surface-2);
    border-right: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    font-family: var(--font-mono); font-size: 10px; color: var(--text-dim);
  }
  .trending-body { flex: 1; padding: 11px 13px; min-width: 0; }
  .trending-brand-row { display: flex; align-items: center; gap: 8px; margin-bottom: 3px; }
  .trending-brand-name { font-size: 14px; font-weight: 500; color: var(--text); }
  .trending-parent {
    font-family: var(--font-mono); font-size: 10px; color: var(--text-dim);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .trending-flags-row { display: flex; gap: 5px; margin-top: 6px; flex-wrap: wrap; }
  .trending-flag {
    font-family: var(--font-mono); font-size: 9px; letter-spacing: 0.03em;
    padding: 2px 7px; border-radius: 3px;
  }
  .trending-flag-red { background: var(--red-dim); color: var(--red); border: 1px solid rgba(192,57,43,0.15); }
  .trending-flag-yellow { background: var(--yellow-dim); color: var(--yellow); border: 1px solid rgba(196,154,60,0.12); }
  .trending-flag-green { background: var(--green-dim); color: var(--green); border: 1px solid rgba(74,146,104,0.15); }
  .trending-right {
    padding: 0 14px; flex-shrink: 0;
    display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px;
  }
  .trending-verdict-dot { width: 10px; height: 10px; border-radius: 50%; }
  .trending-arrow { font-family: var(--font-mono); font-size: 10px; color: var(--text-dim); }

  .health-aisle {
    margin: 0 20px 20px;
    border: 1px solid rgba(74,146,104,0.18); border-radius: 8px; overflow: hidden;
    background: linear-gradient(135deg, rgba(74,146,104,0.03) 0%, transparent 70%);
  }
  .health-aisle-top {
    padding: 12px 16px 10px; border-bottom: 1px solid rgba(74,146,104,0.12);
    display: flex; align-items: center; justify-content: space-between;
  }
  .health-aisle-label {
    font-family: var(--font-mono); font-size: 9px; letter-spacing: 0.18em;
    text-transform: uppercase; color: var(--green);
    display: flex; align-items: center; gap: 7px;
  }
  .health-aisle-label::before { content: '✦'; font-size: 7px; }
  .health-new {
    font-family: var(--font-mono); font-size: 8px; letter-spacing: 0.1em;
    color: var(--green); border: 1px solid rgba(74,146,104,0.3); padding: 2px 6px; border-radius: 3px;
  }
  .health-aisle-body { padding: 12px 16px 14px; }
  .health-pills { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 12px; }
  .health-pill {
    padding: 5px 11px; border-radius: 5px;
    border: 1px solid rgba(74,146,104,0.2); background: rgba(74,146,104,0.06);
    font-family: var(--font-mono); font-size: 10px; color: var(--green);
    cursor: pointer; white-space: nowrap; transition: all 0.15s;
  }
  .health-pill:hover, .health-pill.active { background: rgba(74,146,104,0.16); border-color: var(--green); }
  .brand-chips { display: flex; flex-wrap: wrap; gap: 6px; }
  .brand-chip {
    padding: 6px 11px; border-radius: 5px; border: 1px solid var(--border);
    background: var(--surface); font-size: 12px; color: var(--text-muted);
    cursor: pointer; display: flex; align-items: center; gap: 6px; transition: all 0.15s;
  }
  .brand-chip:hover { border-color: var(--border-mid); color: var(--text); }

  .aisle-block { padding: 0 20px 22px; }
  .aisle-head {
    font-family: var(--font-mono); font-size: 9px; letter-spacing: 0.16em;
    text-transform: uppercase; color: var(--text-dim);
    padding-bottom: 10px; border-bottom: 1px solid var(--border); margin-bottom: 10px;
  }

  .viewfinder {
    background: #050505; min-height: 220px;
    position: relative; display: flex; align-items: center; justify-content: center;
  }
  .vf-corner {
    position: absolute; width: 24px; height: 24px;
    border-color: var(--amber); border-style: solid; border-width: 0;
  }
  .vf-corner.tl { top: 28px; left: 28px; border-top-width: 2px; border-left-width: 2px; }
  .vf-corner.tr { top: 28px; right: 28px; border-top-width: 2px; border-right-width: 2px; }
  .vf-corner.bl { bottom: 28px; left: 28px; border-bottom-width: 2px; border-left-width: 2px; }
  .vf-corner.br { bottom: 28px; right: 28px; border-bottom-width: 2px; border-right-width: 2px; }
  .vf-hint {
    font-family: var(--font-mono); font-size: 10px;
    color: rgba(255,255,255,0.2); letter-spacing: 0.12em; text-transform: uppercase;
  }
  .vf-scan-line {
    position: absolute; left: 36px; right: 36px; height: 1px;
    background: linear-gradient(90deg, transparent, var(--amber), transparent);
    animation: scanLine 2.2s ease-in-out infinite; opacity: 0;
  }
  @keyframes scanLine {
    0%,100% { top: 32px; opacity: 0; }
    15% { opacity: 0.7; } 85% { opacity: 0.7; }
    50% { top: calc(100% - 32px); }
  }
  .vf-success {
    font-family: var(--font-mono); font-size: 10px;
    color: var(--green); letter-spacing: 0.12em; text-transform: uppercase;
  }

  /* ══ SCAN CARD ══ */
  .scan-card {
    background: var(--surface); border: 1px solid var(--border);
    margin: 14px 16px 20px; border-radius: 2px;
    animation: cardIn 0.28s ease-out; overflow: hidden;
  }
  @keyframes cardIn {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .card-verdict-strip { display: flex; align-items: stretch; border-bottom: 1px solid var(--border); }
  .card-verdict-icon {
    padding: 0 14px; display: flex; align-items: center; justify-content: center;
    border-right: 1px solid var(--border); flex-shrink: 0;
  }
  .card-verdict-icon span { font-size: 13px; }
  .card-verdict-content { padding: 10px 14px; flex: 1; }
  .card-verdict-label {
    font-family: var(--font-mono); font-size: 8px;
    letter-spacing: 0.18em; text-transform: uppercase; margin-bottom: 3px;
  }
  .card-verdict-body { font-family: var(--font-mono); font-size: 10px; color: var(--text-muted); line-height: 1.5; }
  .verdict-red .card-verdict-icon { background: var(--red-dim); }
  .verdict-red .card-verdict-label { color: var(--red); }
  .verdict-yellow .card-verdict-icon { background: var(--yellow-dim); }
  .verdict-yellow .card-verdict-label { color: var(--yellow); }
  .verdict-green .card-verdict-icon { background: var(--green-dim); }
  .verdict-green .card-verdict-label { color: var(--green); }

  .card-ticker { display: flex; border-bottom: 1px solid var(--border); background: #0d0d0d; }
  .ticker-item {
    flex: 1; padding: 8px 10px; border-right: 1px solid var(--border);
    display: flex; flex-direction: column; gap: 3px;
  }
  .ticker-item:last-child { border-right: none; }
  .ticker-label { font-family: var(--font-mono); font-size: 7px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--text-dim); }
  .ticker-val { font-family: var(--font-mono); font-size: 11px; color: var(--text-muted); }
  .ticker-val.flag-red { color: var(--red); }
  .ticker-val.flag-amber { color: var(--amber); }
  .ticker-val.flag-green { color: var(--green); }

  .card-brand-block { padding: 18px 18px 12px; border-bottom: 1px solid var(--border); }
  .card-brand-name {
    font-family: var(--font-display); font-size: 38px; font-weight: 400;
    line-height: 1.05; color: var(--text); margin-bottom: 6px; letter-spacing: -0.01em;
  }
  .card-brand-name em { font-style: italic; }
  .card-ownership-line { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
  .card-parent { font-family: var(--font-mono); font-size: 10px; color: var(--text-muted); }
  .ownership-badge {
    font-family: var(--font-mono); font-size: 8px; letter-spacing: 0.1em;
    text-transform: uppercase; padding: 3px 8px; border-radius: 3px; font-weight: 500;
  }
  .badge-acquired { background: var(--red-dim); color: var(--red); border: 1px solid rgba(192,57,43,0.2); }
  .badge-independent { background: var(--green-dim); color: var(--green); border: 1px solid rgba(74,146,104,0.2); }
  .badge-pe { background: var(--yellow-dim); color: var(--yellow); border: 1px solid rgba(196,154,60,0.2); }
  .badge-public { background: var(--surface-3); color: var(--text-muted); border: 1px solid var(--border); }

  .card-flags { padding: 12px 18px; border-bottom: 1px solid var(--border); display: flex; flex-wrap: wrap; gap: 6px; }
  .flag {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 4px 10px; border-radius: 4px;
    font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.02em;
  }
  .flag-red { background: var(--red-dim); color: var(--red); border: 1px solid rgba(192,57,43,0.18); }
  .flag-yellow { background: var(--yellow-dim); color: var(--yellow); border: 1px solid rgba(196,154,60,0.15); }
  .flag-green { background: var(--green-dim); color: var(--green); border: 1px solid rgba(74,146,104,0.18); }
  .flag-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }
  .flag-red .flag-dot { background: var(--red); }
  .flag-yellow .flag-dot { background: var(--yellow); }
  .flag-green .flag-dot { background: var(--green); }

  .card-finding {
    padding: 14px 18px; border-bottom: 1px solid var(--border);
    position: relative; overflow: hidden;
  }
  .card-finding::before {
    content: ''; position: absolute; top: 0; left: 0; width: 2px; height: 100%;
    background: var(--red); opacity: 0.5;
  }
  .card-finding.finding-yellow::before { background: var(--yellow); }
  .card-finding.finding-green::before { background: var(--green); }
  .finding-label {
    font-family: var(--font-mono); font-size: 8px; letter-spacing: 0.18em;
    text-transform: uppercase; color: var(--text-dim); margin-bottom: 7px;
  }
  .finding-text { font-size: 13px; font-weight: 300; color: var(--text); line-height: 1.6; }
  .finding-text strong { font-weight: 500; color: var(--amber); }

  .card-chain { padding: 12px 18px; border-bottom: 1px solid var(--border); }
  .chain-label {
    font-family: var(--font-mono); font-size: 8px; letter-spacing: 0.18em;
    text-transform: uppercase; color: var(--text-dim); margin-bottom: 9px;
  }
  .chain-nodes { display: flex; align-items: flex-start; flex-wrap: wrap; }
  .chain-node { display: flex; flex-direction: column; gap: 1px; }
  .chain-node-name { font-size: 11px; color: var(--text-muted); }
  .chain-node-name.current { color: var(--text); font-weight: 500; }
  .chain-node-year { font-family: var(--font-mono); font-size: 9px; color: var(--text-dim); }
  .chain-sep { font-family: var(--font-mono); font-size: 11px; color: var(--amber); padding: 0 8px; flex-shrink: 0; margin-top: 2px; }

  .card-actions { padding: 12px 18px; display: flex; gap: 7px; }
  .card-btn {
    flex: 1; padding: 10px 12px; border-radius: 5px;
    border: 1px solid var(--border); background: var(--surface-2);
    font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.07em; text-transform: uppercase;
    color: var(--text-muted); cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 6px; transition: all 0.15s;
  }
  .card-btn:hover { border-color: var(--border-mid); color: var(--text); }
  .card-btn.share-btn { background: var(--amber); border-color: var(--amber); color: var(--black); font-weight: 500; }
  .card-btn.share-btn:hover { opacity: 0.88; }

  .share-drawer { border-top: 1px solid var(--border); max-height: 0; overflow: hidden; transition: max-height 0.3s ease; }
  .share-drawer.open { max-height: 260px; }
  .share-drawer-inner { padding: 16px 18px 18px; }
  .snippet-quote {
    font-size: 13px; font-weight: 300; font-style: italic; line-height: 1.65;
    color: var(--text); margin-bottom: 12px;
    border-left: 2px solid var(--border-mid); padding-left: 12px;
  }
  .snippet-source {
    font-family: var(--font-mono); font-size: 9px; letter-spacing: 0.1em;
    text-transform: uppercase; color: var(--text-dim); margin-bottom: 12px;
  }
  .copy-btn {
    width: 100%; padding: 9px; border-radius: 4px;
    border: 1px solid var(--border); background: var(--surface-3);
    font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--text-muted); cursor: pointer; transition: all 0.15s;
  }
  .copy-btn:hover, .copy-btn.copied { border-color: var(--green); color: var(--green); }

  /* ── DEEP TRACE PROFILE ── */
  .profile-toggle {
    width: 100%; padding: 11px 18px; border: none; border-top: 1px solid var(--border);
    background: var(--surface); display: flex; align-items: center; justify-content: space-between;
    cursor: pointer; transition: background 0.15s;
  }
  .profile-toggle:hover { background: var(--surface-2); }
  .profile-toggle-left { display: flex; align-items: center; gap: 8px; }
  .profile-toggle-label {
    font-family: var(--font-mono); font-size: 9px; letter-spacing: 0.16em;
    text-transform: uppercase; color: var(--amber);
  }
  .profile-toggle-sub { font-size: 11px; color: var(--text-muted); }
  .profile-toggle-chevron {
    font-family: var(--font-mono); font-size: 10px; color: var(--text-dim);
    transition: transform 0.2s;
  }
  .profile-toggle-chevron.open { transform: rotate(180deg); }

  .profile-drawer { max-height: 0; overflow: hidden; transition: max-height 0.4s ease; border-top: 1px solid var(--border); }
  .profile-drawer.open { max-height: 2400px; }
  .profile-drawer-inner { padding: 0 0 8px; }

  .profile-score-bar {
    padding: 14px 18px 12px; border-bottom: 1px solid var(--border);
    display: flex; align-items: center; gap: 10px;
  }
  .profile-score-label { font-family: var(--font-mono); font-size: 9px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--text-muted); flex-shrink: 0; }
  .profile-score-dots { display: flex; gap: 4px; }
  .profile-score-dot { width: 8px; height: 8px; border-radius: 50%; }
  .profile-score-dot.red { background: var(--red); }
  .profile-score-dot.yellow { background: var(--yellow); }
  .profile-score-dot.green { background: var(--green); }
  .profile-score-dot.gray { background: var(--text-dim); }
  .profile-score-summary { font-family: var(--font-mono); font-size: 9px; color: var(--text-muted); margin-left: 4px; }

  .profile-section { padding: 14px 18px; border-bottom: 1px solid var(--border); }
  .profile-section:last-child { border-bottom: none; }
  .profile-section-label {
    font-family: var(--font-mono); font-size: 8px; letter-spacing: 0.18em;
    text-transform: uppercase; color: var(--text-dim); margin-bottom: 8px;
  }
  .profile-section-title { font-size: 13px; font-weight: 500; color: var(--text); margin-bottom: 6px; line-height: 1.4; }
  .profile-section-body { font-size: 12px; color: var(--text-muted); line-height: 1.65; font-weight: 300; }
  .profile-section-body strong { color: var(--text); font-weight: 500; }

  .profile-finding-row {
    display: flex; gap: 10px; padding: 10px 18px;
    border-bottom: 1px solid var(--border);
  }
  .profile-finding-row:last-child { border-bottom: none; }
  .profile-finding-num {
    font-family: var(--font-mono); font-size: 9px; color: var(--amber);
    flex-shrink: 0; padding-top: 1px; letter-spacing: 0.06em;
  }
  .profile-finding-level {
    font-family: var(--font-mono); font-size: 8px; letter-spacing: 0.1em;
    text-transform: uppercase; margin-top: 2px; margin-bottom: 5px;
  }
  .profile-finding-level.red { color: var(--red); }
  .profile-finding-level.yellow { color: var(--yellow); }
  .profile-finding-level.green { color: var(--green); }
  .profile-finding-text { font-size: 12px; color: var(--text-muted); line-height: 1.6; font-weight: 300; }
  .profile-finding-text strong { color: var(--text); font-weight: 500; }

  .profile-dim-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 1px;
    background: var(--border); margin: 0 18px 14px; border-radius: 4px; overflow: hidden;
  }
  .profile-dim-cell {
    background: var(--surface); padding: 8px 10px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .profile-dim-name { font-size: 10px; color: var(--text-muted); }
  .profile-dim-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
  .profile-dim-dot.red { background: var(--red); }
  .profile-dim-dot.yellow { background: var(--yellow); }
  .profile-dim-dot.green { background: var(--green); }

  .card-exit {
    margin: 0 18px 16px; border: 1px solid rgba(74,146,104,0.15); border-radius: 4px;
    padding: 12px 14px; display: flex; align-items: center; justify-content: space-between;
    cursor: pointer; transition: border-color 0.15s;
    background: linear-gradient(135deg, rgba(74,146,104,0.04) 0%, transparent 60%);
  }
  .card-exit:hover { border-color: rgba(74,146,104,0.3); }
  .exit-label { font-family: var(--font-mono); font-size: 8px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--green); margin-bottom: 3px; }
  .exit-title { font-size: 12px; font-weight: 500; color: var(--text-muted); }
  .exit-sub { font-family: var(--font-mono); font-size: 9px; color: var(--green); margin-top: 2px; opacity: 0.7; }
  .exit-arrow { color: rgba(74,146,104,0.4); }

  /* ── CONTACT MODAL ── */
  .modal-overlay {
    position: fixed; inset: 0; z-index: 50;
    background: rgba(0,0,0,0.75); backdrop-filter: blur(4px);
    display: flex; align-items: flex-end; justify-content: center;
    animation: fadeIn 0.15s ease;
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .modal-sheet {
    width: 100%; max-width: 430px;
    background: var(--surface); border: 1px solid var(--border-mid);
    border-bottom: none; border-radius: 12px 12px 0 0;
    animation: slideUp 0.22s ease-out;
    max-height: 92dvh; overflow-y: auto;
  }
  .modal-sheet::-webkit-scrollbar { display: none; }
  @keyframes slideUp { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  .modal-handle {
    width: 36px; height: 3px; background: var(--border-mid);
    border-radius: 2px; margin: 12px auto 0;
  }
  .modal-head {
    padding: 18px 20px 14px;
    border-bottom: 1px solid var(--border);
    display: flex; align-items: flex-start; justify-content: space-between;
  }
  .modal-title { font-family: var(--font-display); font-size: 22px; font-weight: 400; line-height: 1.2; }
  .modal-title em { font-style: italic; color: var(--amber); }
  .modal-sub { font-size: 12px; color: var(--text-muted); margin-top: 4px; font-weight: 300; line-height: 1.5; }
  .modal-close {
    background: var(--surface-2); border: 1px solid var(--border);
    border-radius: 6px; width: 32px; height: 32px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: var(--text-muted); flex-shrink: 0; margin-left: 12px;
  }
  .modal-close:hover { color: var(--text); }
  .modal-body { padding: 18px 20px 32px; display: flex; flex-direction: column; gap: 14px; }
  .contact-option {
    display: flex; align-items: center; gap: 14px;
    padding: 14px 16px; border-radius: 6px;
    border: 1px solid var(--border); background: var(--surface-2);
    cursor: pointer; transition: border-color 0.15s;
    text-align: left;
  }
  .contact-option:hover { border-color: var(--border-mid); }
  .contact-option-icon {
    width: 38px; height: 38px; border-radius: 8px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center; font-size: 16px;
  }
  .contact-option-icon.amber { background: var(--amber-dim); }
  .contact-option-icon.red   { background: var(--red-dim); }
  .contact-option-icon.green { background: var(--green-dim); }
  .contact-option-label { font-size: 13px; font-weight: 500; color: var(--text); margin-bottom: 2px; }
  .contact-option-desc { font-size: 11px; color: var(--text-muted); line-height: 1.45; font-weight: 300; }
  .contact-commitment {
    margin-top: 4px; padding: 14px 16px;
    border: 1px solid rgba(74,146,104,0.15); border-radius: 6px;
    background: linear-gradient(135deg, rgba(74,146,104,0.04) 0%, transparent 60%);
  }
  .contact-commitment-label {
    font-family: var(--font-mono); font-size: 8px; letter-spacing: 0.18em;
    text-transform: uppercase; color: var(--green); margin-bottom: 6px;
  }
  .contact-commitment-text { font-size: 12px; color: var(--text-muted); line-height: 1.6; font-weight: 300; }

  .research-card {
    margin: 0 20px 10px; padding: 15px 17px;
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 4px; cursor: pointer; transition: border-color 0.15s;
  }
  .research-card:hover { border-color: var(--border-mid); }
  .research-title { font-family: var(--font-display); font-size: 16px; font-weight: 400; margin-bottom: 5px; line-height: 1.3; }
  .research-meta { font-family: var(--font-mono); font-size: 10px; color: var(--text-dim); }

  .fab {
    position: fixed; bottom: 68px; left: 50%; transform: translateX(-50%);
    background: var(--amber); color: var(--black);
    border: none; border-radius: 24px; padding: 11px 26px;
    font-family: var(--font-mono); font-size: 10px; font-weight: 500;
    letter-spacing: 0.12em; text-transform: uppercase;
    cursor: pointer; display: flex; align-items: center; gap: 8px;
    box-shadow: 0 4px 20px rgba(200,146,42,0.3); z-index: 25; transition: opacity 0.15s;
  }
  .fab:hover { opacity: 0.88; }
`;

const BRANDS = {
  "Gerber": {
    emoji: "👶", parent: "Nestlé S.A.", ownershipType: "acquired",
    ticker: { OWNER: "NESTLÉ", ACQUIRED: "2007", DEAL: "$5.5B", STATUS: "⚑ FLAGGED" },
    tickerStatus: "flag-red",
    verdict: { level: "red", label: "FLAG · INGREDIENTS", body: "Arsenic, lead, cadmium & mercury confirmed by Congressional report" },
    chain: [{ name: "Founded", year: "1927" }, { name: "Nestlé acquires", year: "2007" }, { name: "Nestlé S.A.", current: true }],
    flags: [{ label: "Heavy Metals (2021)", color: "red" }, { label: "Nestlé Owned", color: "yellow" }, { label: "No Federal Limits Yet", color: "red" }],
    findingColor: "red",
    finding: "Gerber has been the <strong>trusted name in baby food since 1927</strong>. Nestlé bought it for $5.5B in 2007. A 2021 Congressional report found arsenic, lead, and mercury in the products. The brand that built its entire identity around infant trust is owned by the world's most scrutinized food company.",
    snippet: "Gerber has been the trusted name in baby food since 1927. In 2007, Nestlé bought it for $5.5B. A Congressional report found arsenic, lead, and mercury in the products. The brand that built its entire identity around infant trust is owned by the world's most controversial food company.",
    category: "baby",
  },
  "Reese's": {
    emoji: "🍫", parent: "The Hershey Company", ownershipType: "acquired",
    ticker: { OWNER: "HERSHEY", ACQUIRED: "1963", DEAL: "N/A", STATUS: "⚑ FLAGGED" },
    tickerStatus: "flag-red",
    verdict: { level: "red", label: "FLAG · REFORMULATION", body: "Inventor's grandson accused Hershey of replacing milk chocolate with compound coatings" },
    chain: [{ name: "H.B. Reese", year: "1928" }, { name: "Sold to Hershey", year: "1963" }, { name: "Hershey Co.", current: true }],
    flags: [{ label: "Compound Coatings", color: "red" }, { label: "Peanut Butter Crème", color: "red" }, { label: "Family Disputes Recipe", color: "yellow" }],
    findingColor: "red",
    finding: "Hershey has owned Reese's since 1963. This year, <strong>the inventor's own grandson went public</strong> accusing Hershey of quietly replacing milk chocolate with compound coatings and real peanut butter with peanut-butter-style crème across multiple products. Hershey acknowledged 'recipe adjustments.' The original family called it inedible.",
    snippet: "Hershey has owned Reese's since 1963. This year, the inventor's own grandson went public accusing Hershey of quietly replacing milk chocolate with compound coatings and real peanut butter with peanut-butter-style crème. Hershey acknowledged 'recipe adjustments.' The original family called it inedible.",
    category: "snacks",
    profile: {
      subtitle: "Reformulation · Ingredient Substitution",
      scores: ["yellow","red","red","red","red","red","yellow"],
      dimensions: [
        { label: "Ownership/Control", color: "yellow" },
        { label: "Ingredient Integrity", color: "red" },
        { label: "Label Accuracy", color: "red" },
        { label: "Additive Profile", color: "red" },
        { label: "Reformulation Transparency", color: "red" },
        { label: "Marketing vs. Formula", color: "red" },
        { label: "Historical Integrity", color: "yellow" },
      ],
      findings: [
        { level: "red", label: "Hershey CFO confirmed formula changes in Q4 2024 investor call", text: "CFO Steven Voskuil confirmed formula adjustments were made across some products citing cocoa price pressures, while maintaining 'no consumer impact.' He did not name which products. The Mini Hearts, Take5, Fast Break, and Reese's Thins products use 'chocolate candy' or 'compound coating' language on the label — not 'milk chocolate.'" },
        { level: "red", label: "PGPR replaced cocoa butter as early as 2006 — predates the cocoa crisis by 18 years", text: "ABC News reported in 2006 that Hershey reformulated multiple products to replace cocoa butter with PGPR (Polyglycerol Polyricinoleate) — made from castor oil fatty acids — cheaper and functions as a viscosity reducer, allowing less actual chocolate per product. PGPR and TBHQ both appear in the current Reese's Peanut Butter Cups label." },
        { level: "red", label: "Brad Reese (inventor's grandson) published open letter Feb 14, 2026", text: "Brad Reese, 70-year-old grandson of H.B. Reese, publicly accused Hershey of replacing milk chocolate with compound coatings and peanut butter with peanut-butter-style crème. Covered by AP, CBS News, NBC News, Fox Business. Hershey's response: the flagship Peanut Butter Cups 'are made the same way they always have been.'" },
      ],
      narrative: "H.B. Reese built the world's best-selling candy on two ingredients: milk chocolate and peanut butter. Under pressure from the worst cocoa price surge in a century, Hershey is quietly substituting compound coatings for milk chocolate and peanut-butter crème for peanut butter across multiple product lines — <strong>while labeling stays ambiguous</strong>.",
    },
  },
  "Annie's": {
    emoji: "🐰", parent: "General Mills", ownershipType: "acquired",
    ticker: { OWNER: "GEN. MILLS", ACQUIRED: "2014", DEAL: "$820M", STATUS: "⚑ FLAGGED" },
    tickerStatus: "flag-red",
    verdict: { level: "red", label: "FLAG · REFORMULATION", body: "Butter and milk removed, cornstarch added — labeled 'Now Cheesier'" },
    chain: [{ name: "Founded", year: "1989" }, { name: "General Mills", year: "2014" }, { name: "Gen. Mills", current: true }],
    flags: [{ label: "Skimpflation", color: "red" }, { label: "22% Less Protein", color: "red" }, { label: "Phthalates Lawsuit 2021", color: "yellow" }],
    findingColor: "red",
    finding: "Annie's built its brand on organic ingredients, a founder who <strong>put her phone number on every box</strong>, and a rabbit named Bernie. General Mills bought it for $820M in 2014. In 2024 they removed the butter and milk, added cornstarch, and labeled it 'Now Cheesier.' The protein dropped 22%. The packaging didn't mention that part.",
    snippet: "Annie's built its brand on organic ingredients, a founder who put her phone number on every box, and a rabbit named Bernie. General Mills bought it for $820M in 2014. In 2024 they removed the butter and milk, added cornstarch, and labeled it 'Now Cheesier.' The protein dropped 22%. The packaging didn't mention that part.",
    category: "snacks",
    profile: {
      subtitle: "Acquisition Degradation Study",
      scores: ["red","red","red","red","yellow","yellow","green"],
      dimensions: [
        { label: "Ownership Disclosure", color: "red" },
        { label: "Marketing Alignment", color: "red" },
        { label: "Ingredient Integrity", color: "red" },
        { label: "Safety Transparency", color: "red" },
        { label: "Label Claim Accuracy", color: "yellow" },
        { label: "Scientific Backing", color: "yellow" },
        { label: "Revenue Model", color: "green" },
      ],
      findings: [
        { level: "red", label: "Ownership concealed — General Mills not disclosed on packaging", text: "Annie's packaging still features 'Homegrown,' the bunny Bernie, and the founder's founding story. General Mills — maker of Cocoa Puffs, Lucky Charms, and Trix — has owned Annie's since 2014. The $820M acquisition is not disclosed on the product. Consumers who buy Annie's to avoid General Mills are still buying a General Mills product." },
        { level: "red", label: "September 2024 recipe reformulation — butter and milk removed", text: "General Mills reformulated the Mac & Cheese recipe in September 2024: removed butter and nonfat milk, added corn starch. The label called it 'Now Cheesier.' Protein content dropped 22% per serving. The change was not disclosed on the packaging; the 'Now Cheesier' claim appeared simultaneously." },
        { level: "red", label: "Active phthalates class action filed 2021", text: "A class action lawsuit filed in 2021 alleges Annie's products contained phthalates — industrial plasticizers linked to hormone disruption — at levels that made the 'organic' and 'natural' claims misleading. The case is pending. General Mills has not disclosed the testing methodology or results publicly." },
        { level: "yellow", label: "Organic certification maintained post-acquisition", text: "Annie's products maintain their USDA Organic certification under General Mills ownership. This is the one dimension where the acquisition has not visibly degraded the product claim. Organic certification is third-party verified." },
      ],
      narrative: "This is a case study in acquisition preservation followed by quiet degradation. Every change General Mills made was <strong>defensible in isolation</strong>. Together they document what happens when a mission brand is run by a conglomerate's margin optimization team.",
    },
  },
  "Chobani Flip": {
    emoji: "🥛", parent: "Chobani LLC (Independent)", ownershipType: "independent",
    ticker: { OWNER: "INDEPENDENT", ACQUIRED: "N/A", DEAL: "N/A", STATUS: "◑ WATCH" },
    tickerStatus: "flag-amber",
    verdict: { level: "yellow", label: "WATCH · BRAND EXTENSION", body: "Same logo — 24g sugar, candy mix-ins, different nutritional story" },
    chain: [{ name: "Founded", year: "2005" }, { name: "Chobani LLC", current: true }],
    flags: [{ label: "24g Sugar", color: "red" }, { label: "Candy Mix-Ins", color: "yellow" }, { label: "Still Independent", color: "green" }],
    findingColor: "yellow",
    finding: "Chobani is one of the few major yogurt brands that's <strong>still independently owned</strong> — and built that credibility on simple ingredients and no added sugar. Chobani Flip has 24g of sugar and cookie crumbles under the same logo. The independence is real. The health halo got extended further than the product deserved.",
    snippet: "Chobani is one of the only major yogurt brands still independently owned — no Nestlé, no Danone, no private equity. It built that reputation on yogurt with two ingredients and no added sugar. Chobani Flip has 24g of sugar, cookie pieces, and candy mix-ins under the exact same logo. The ownership is clean. The product extension isn't.",
    category: "dairy",
  },
  "AG1": {
    emoji: "🌿", parent: "AG1 Inc. (PE-backed)", ownershipType: "pe",
    ticker: { OWNER: "PE-BACKED", ACQUIRED: "PRIVATE", DEAL: "N/A", STATUS: "⚑ FLAGGED" },
    tickerStatus: "flag-red",
    verdict: { level: "red", label: "FLAG · PROPRIETARY BLEND", body: "75 ingredients — zero individual doses disclosed" },
    chain: [{ name: "Founded", year: "2010" }, { name: "PE Investment", year: "2020" }, { name: "AG1 Inc.", current: true }],
    flags: [{ label: "Proprietary Blend", color: "red" }, { label: "~50% Rev on Marketing", color: "yellow" }, { label: "No FDA Oversight", color: "yellow" }],
    findingColor: "red",
    finding: "AG1 is PE-backed and <strong>spends an estimated 50% of revenue on influencer marketing</strong>. It lists 75 ingredients as a single proprietary blend — no dose is disclosed, nothing can be verified. The 'science' is the marketing. A local farm CSA costs less per month and the ingredients are on the outside of the food.",
    snippet: "AG1 markets itself as the one daily supplement backed by science. It's PE-backed and spends an estimated 50% of revenue on influencer deals. It lists 75 ingredients as a single proprietary blend — so no individual dose is disclosed and nothing can be independently verified. The 'science' is the marketing. A monthly CSA share from a local farm costs about the same and the ingredients are on the outside of the food.",
    category: "health", subcategory: "greens",
    profile: {
      subtitle: "Investor-Endorser Conflict · Founder Fraud",
      scores: ["red","red","red","red","red","red","yellow"],
      dimensions: [
        { label: "Ownership/Control", color: "red" },
        { label: "Investor-Endorser", color: "red" },
        { label: "Ingredient Transparency", color: "red" },
        { label: "Scientific Backing", color: "red" },
        { label: "Label Claims", color: "red" },
        { label: "Founder Integrity", color: "red" },
        { label: "NSF Certification", color: "yellow" },
      ],
      findings: [
        { level: "red", label: "Structural Conflict — Investor-Endorser Model", text: "Peter Attia, Andrew Huberman, and Tim Ferriss held financial relationships with AG1 simultaneously with public endorsements to their combined 10M+ followers. None of these relationships were fully disclosed at point of endorsement. The product's market position is almost entirely a function of this trust channel — not the formula." },
        { level: "red", label: "49 of 75 ingredient doses hidden inside proprietary blends", text: "AG1 discloses 26 individual doses (vitamins, minerals). The remaining 49 ingredients — herbal extracts, adaptogens, probiotics, antioxidants — are grouped into proprietary blends with only a total blend weight disclosed. A physician cannot assess dosing adequacy. A researcher cannot replicate the formula." },
        { level: "red", label: "Founder convicted of 43 counts of criminal fraud — concealed for 14 years", text: "Chris Ashenden was convicted of 43 breaches of the NZ Fair Trading Act in 2011 for rent-to-buy property scams. He concealed this history while building AG1 into a $600M revenue company. He resigned as CEO in July 2024 after a New Zealand journalism investigation surfaced the convictions." },
        { level: "yellow", label: "NSF Certified for Sport — purity only, not efficacy", text: "AG1 holds NSF Certified for Sport status, which tests for banned substances and label accuracy on disclosed amounts. It does not verify that undisclosed proprietary blend doses are present in efficacious quantities. Zero independent clinical trials exist on the complete AG1 formula." },
      ],
      narrative: "AG1 is the supplement industry's most successful product and its most instructive case study in how trust is manufactured at scale. $600M in annual revenue. Zero independent clinical trials on the complete formula. The investor-endorser conflict is not peripheral to the AG1 model — <strong>it is the model</strong>.",
    },
  },
  "Vital Proteins": {
    emoji: "💪", parent: "Nestlé Health Science", ownershipType: "acquired",
    ticker: { OWNER: "NESTLÉ", ACQUIRED: "2021", DEAL: "N/A", STATUS: "◑ WATCH" },
    tickerStatus: "flag-amber",
    verdict: { level: "yellow", label: "WATCH · OWNERSHIP", body: "Founder-built wellness brand acquired by Nestlé in 2021" },
    chain: [{ name: "Founded", year: "2013" }, { name: "Nestlé acquires", year: "2021" }, { name: "Nestlé Health Sci.", current: true }],
    flags: [{ label: "Nestlé Owned", color: "yellow" }, { label: "Industry-Funded Studies", color: "yellow" }, { label: "Formula Unchanged", color: "green" }],
    findingColor: "yellow",
    finding: "Vital Proteins <strong>marketed itself as clean, minimal, and founder-built</strong>. Nestlé — the company behind KitKat, Hot Pockets, and Gerber — acquired it in 2021. The collagen branding stayed. The independence didn't. Your wellness routine is now a Nestlé product.",
    snippet: "Vital Proteins marketed itself as clean, minimal, and founder-built wellness. In 2021, Nestlé acquired it — the same company behind KitKat, Hot Pockets, Gerber baby food, and the $5.5B acquisition of Purina. The collagen branding stayed exactly as it was. The independence didn't. Your wellness routine is now a Nestlé SKU.",
    category: "health", subcategory: "protein",
  },
  "Celsius": {
    emoji: "⚡", parent: "Celsius Holdings (PepsiCo invested)", ownershipType: "pe",
    ticker: { OWNER: "PEPSI INVESTED", ACQUIRED: "2022", DEAL: "$550M", STATUS: "⚑ FLAGGED" },
    tickerStatus: "flag-red",
    verdict: { level: "red", label: "FLAG · MARKETING CLAIMS", body: "FTC flagged 'clinically proven' claims as unsubstantiated in 2023" },
    chain: [{ name: "Founded", year: "2004" }, { name: "PepsiCo $550M", year: "2022" }, { name: "Nasdaq: CELH", current: true }],
    flags: [{ label: "FTC Flagged (2023)", color: "red" }, { label: "FDA: Energy Drink", color: "red" }, { label: "PepsiCo Invested", color: "yellow" }],
    findingColor: "red",
    finding: "Celsius built its brand through <strong>fitness influencers and gym culture</strong>, positioning itself as a health drink for athletes. The FDA classifies it as an energy drink — same category as Red Bull. PepsiCo invested $550M in 2022. The health positioning is a marketing decision. The caffeine content is the same as a can of Monster.",
    snippet: "Celsius built its brand through fitness influencers and gym culture, positioning itself as a health drink for athletes. The FDA classifies it as an energy drink — same category as Red Bull. PepsiCo invested $550M in 2022. The health positioning is a marketing decision. The caffeine content is the same as a can of Monster.",
    category: "health", subcategory: "electrolytes",
  },
  "Quest Bars": {
    emoji: "🍫", parent: "Post Holdings", ownershipType: "acquired",
    ticker: { OWNER: "POST HOLDINGS", ACQUIRED: "2019", DEAL: "$1B", STATUS: "◑ WATCH" },
    tickerStatus: "flag-amber",
    verdict: { level: "yellow", label: "WATCH · OWNERSHIP", body: "Founder brand sold to PE, absorbed by cereal conglomerate" },
    chain: [{ name: "Founded", year: "2010" }, { name: "Simply Good $1B", year: "2019" }, { name: "Post Holdings", current: true }],
    flags: [{ label: "Conglomerate Owned", color: "yellow" }, { label: "Sucralose Sweetener", color: "yellow" }, { label: "Protein Claims Valid", color: "green" }],
    findingColor: "yellow",
    finding: "Quest positioned itself as <strong>the protein bar for people who actually read labels</strong>. Private equity bought it for $1B in 2019. Post Holdings — the company behind Honey Bunches of Oats and Fruity Pebbles — absorbed it. The 'clean label' brand is now a cereal conglomerate asset.",
    snippet: "Quest positioned itself as the protein bar for people who actually read nutrition labels — minimal ingredients, no added sugar, transparent about what's in it. Simply Good Foods bought it for $1B in 2019. Post Holdings — the company behind Honey Bunches of Oats, Fruity Pebbles, and Cocoa Pebbles — absorbed it in 2021. The founder left. The 'clean label' bar is now one of hundreds of SKUs inside a cereal company.",
    category: "health", subcategory: "protein_bars",
  },
  "Oatly": {
    emoji: "🌾", parent: "Oatly Group AB (Blackstone invested)", ownershipType: "pe",
    ticker: { OWNER: "BLACKSTONE", ACQUIRED: "2020", DEAL: "$200M", STATUS: "◑ WATCH" },
    tickerStatus: "flag-amber",
    verdict: { level: "yellow", label: "WATCH · PE INVESTMENT", body: "Anti-Big Food brand took $200M from Blackstone in 2020" },
    chain: [{ name: "Founded", year: "1994" }, { name: "Blackstone $200M", year: "2020" }, { name: "Nasdaq IPO", current: true }],
    flags: [{ label: "Blackstone Investment", color: "yellow" }, { label: "Blood Sugar Spike Risk", color: "yellow" }, { label: "Rapeseed Oil Added", color: "yellow" }],
    findingColor: "yellow",
    finding: "Oatly built its entire brand on being <strong>the anti-Big Food option</strong>. Then Blackstone — a PE firm linked to Amazon deforestation — invested $200M. The oat milk that told you to 'stop eating animals' is now partially owned by one of the world's largest asset managers.",
    snippet: "Oatly built its entire identity on being the anti-Big Food option — its packaging literally told you to 'stop eating animals.' In 2020, Blackstone invested $200M. Blackstone is a PE firm linked to Amazon deforestation and fossil fuel investments. Oatly went public in 2021 at a $10B valuation and has since lost more than 90% of that value. The oat milk that told you to opt out is now a publicly traded stock.",
    category: "health", subcategory: "protein",
    profile: {
      subtitle: "Mission Contradiction · Ownership Conflict",
      scores: ["red","red","yellow","yellow","yellow","yellow","yellow"],
      dimensions: [
        { label: "Ownership Structure", color: "red" },
        { label: "Marketing Alignment", color: "red" },
        { label: "Revenue Model", color: "yellow" },
        { label: "Ingredient Integrity", color: "yellow" },
        { label: "Scientific Backing", color: "yellow" },
        { label: "Label Claim Accuracy", color: "yellow" },
        { label: "Safety Transparency", color: "yellow" },
      ],
      findings: [
        { level: "red", label: "China Resources (~46%) is the largest shareholder — received far less scrutiny than Blackstone", text: "Oatly's investor table at IPO: China Resources (Chinese state-owned conglomerate) ~45.9%, Blackstone ~7%. The Blackstone investment generated enormous press coverage. China Resources — a Chinese state enterprise with a far larger stake — received minimal media scrutiny despite its dominant ownership position." },
        { level: "red", label: "Blackstone investment directly contradicts Oatly's climate positioning", text: "Blackstone's portfolio has included investments linked to Amazon deforestation. Its CEO donated to pro-Trump PACs. Oatly's defense was remarkable: they argued that converting a major PE firm to sustainability investing was itself a climate victory — the precise inverse of transparency." },
        { level: "yellow", label: "Product contains rapeseed oil and dipotassium phosphate", text: "Oatly adds rapeseed oil and dipotassium phosphate to achieve creaminess that oat water alone cannot deliver. These additions are largely absent from the brand's clean-and-natural positioning. The OTLY stock has lost ~97% of its peak value since the 2021 IPO." },
      ],
      narrative: "Oatly's entire consumer proposition was a values transaction: by choosing oat milk over dairy, you were making a meaningful environmental stand. That proposition drove a $10B IPO in 2021. Then the ownership structure came into view — a Chinese state enterprise as the <strong>largest single shareholder</strong>, and a PE firm linked to deforestation as a visible investor.",
    },
  },
  "siggi's": {
    emoji: "🥛", parent: "Lactalis Group", ownershipType: "acquired",
    ticker: { OWNER: "LACTALIS", ACQUIRED: "2018", DEAL: "N/A", STATUS: "◑ WATCH" },
    tickerStatus: "flag-amber",
    verdict: { level: "yellow", label: "WATCH · OWNERSHIP", body: "Founder still in marketing; $28B conglomerate owns the brand" },
    chain: [{ name: "Founded", year: "2004" }, { name: "Lactalis acquires", year: "2018" }, { name: "Lactalis Group", current: true }],
    flags: [{ label: "Lactalis Owned ($28B)", color: "yellow" }, { label: "Founder in Marketing", color: "yellow" }, { label: "Formula Unchanged", color: "green" }],
    findingColor: "yellow",
    finding: "siggi's <strong>sold the story of an Icelander who wanted simpler yogurt with less sugar</strong>. The yogurt is real. The indie brand story ended in 2018 when Lactalis — the world's largest dairy conglomerate — bought it. The founder still appears in the marketing. The company behind it has $28B in revenue.",
    snippet: "siggi's sold the story of an Icelander who wanted simpler yogurt with less sugar. The yogurt is real. The indie brand story ended in 2018 when Lactalis — the world's largest dairy conglomerate — bought it. The founder still appears in the marketing. The company behind it has $28B in revenue.",
    category: "dairy", subcategory: "yogurt",
  },
  "Herbalife": {
    emoji: "⚠️", parent: "Herbalife Ltd. (NYSE: HLF)", ownershipType: "public",
    ticker: { OWNER: "NYSE: HLF", ACQUIRED: "1980", DEAL: "PUBLIC", STATUS: "⚑ FLAGGED" },
    tickerStatus: "flag-red",
    verdict: { level: "red", label: "FLAG · FTC ACTION", body: "$200M FTC settlement in 2016 — model and products unchanged" },
    chain: [{ name: "Founded", year: "1980" }, { name: "NYSE: HLF", current: true }],
    flags: [{ label: "FTC Settlement $200M", color: "red" }, { label: "MLM Distribution", color: "red" }, { label: "Unsubstantiated Claims", color: "red" }],
    findingColor: "red",
    finding: "Herbalife <strong>markets itself as a wellness company</strong> helping people live healthier through independent distributors. It settled with the FTC for $200M in 2016 for deceptive health and income claims. The products and the model are unchanged.",
    snippet: "Herbalife markets itself as a wellness company helping people live healthier lives through independent distributors. In 2016, the FTC fined it $200M for deceptive health and income claims — finding that most distributors lost money. The company did not admit wrongdoing and changed nothing about the model. It's publicly traded on NYSE. The stock has lost over 80% of its value since 2014. The products and the pitch are unchanged.",
    category: "health", subcategory: "protein",
  },
  "Cheerios": {
    emoji: "🌾", parent: "General Mills", ownershipType: "public",
    ticker: { OWNER: "GEN. MILLS", ACQUIRED: "1941", DEAL: "LEGACY", STATUS: "◑ WATCH" },
    tickerStatus: "flag-amber",
    verdict: { level: "yellow", label: "WATCH · HEALTH CLAIMS", body: "'Heart healthy' claim requires 3g beta-glucan daily — one serving delivers 1g" },
    chain: [{ name: "Founded", year: "1941" }, { name: "General Mills", current: true }],
    flags: [{ label: "Health Claim Gap", color: "yellow" }, { label: "Conglomerate Owned", color: "yellow" }, { label: "Same Parent as Annie's", color: "yellow" }],
    findingColor: "yellow",
    finding: "Cheerios has <strong>marketed itself as heart healthy since 1999</strong>. The FDA allows that claim if a product delivers 3g of beta-glucan oat fiber per day. One serving of Cheerios delivers about 1g. You'd need to eat three bowls. General Mills owns Cheerios, Annie's, Pillsbury, Nature Valley, and Häagen-Dazs.",
    snippet: "Cheerios has marketed itself as heart healthy since 1999. The FDA allows the heart health claim for products delivering 3g of beta-glucan oat fiber daily. One serving of Cheerios delivers about 1g — you'd need three bowls to hit the threshold. The claim is technically legal. The impression it creates isn't technically accurate.",
    category: "breakfast",
  },
  "Jif": {
    emoji: "🥜", parent: "J.M. Smucker Co.", ownershipType: "acquired",
    ticker: { OWNER: "J.M. SMUCKER", ACQUIRED: "2002", DEAL: "LEGACY", STATUS: "⚑ FLAGGED" },
    tickerStatus: "flag-red",
    verdict: { level: "red", label: "FLAG · INGREDIENTS", body: "Banned at Whole Foods — contains fully hydrogenated oils and added sugar" },
    chain: [{ name: "P&G creates", year: "1958" }, { name: "J.M. Smucker", year: "2002" }, { name: "Smucker Co.", current: true }],
    flags: [{ label: "Hydrogenated Oils", color: "red" }, { label: "Added Sugar", color: "yellow" }, { label: "Banned at Whole Foods", color: "red" }],
    findingColor: "red",
    finding: "Jif was <strong>formulated by P&G in the 1950s using the same hydrogenation process used to make Crisco</strong> — replacing peanut oil with fully hydrogenated rapeseed and soybean oil for shelf stability. It's banned at Whole Foods on ingredient grounds. J.M. Smucker also owns the leading natural peanut butter brands Adams and Laura Scudder's — capturing consumers at both ends of the quality spectrum.",
    snippet: "Jif was formulated by P&G in the 1950s using hydrogenation — the same process used to make Crisco — replacing peanut oil with fully hydrogenated oils for shelf stability. It's banned at Whole Foods on ingredient grounds. J.M. Smucker, which owns Jif, also owns the leading natural peanut butter brands Adams and Laura Scudder's. Whether you trust the marketing or read the label, the same company gets your money.",
    category: "pantry",
    profile: {
      subtitle: "Ingredient Substitution · Dual-Market Capture",
      scores: ["red","yellow","green","red","yellow","yellow","red"],
      dimensions: [
        { label: "Ownership Structure", color: "red" },
        { label: "Marketing Alignment", color: "yellow" },
        { label: "Revenue Model", color: "green" },
        { label: "Ingredient Integrity", color: "red" },
        { label: "Scientific Backing", color: "yellow" },
        { label: "Label Claim Accuracy", color: "yellow" },
        { label: "Safety Transparency", color: "red" },
      ],
      findings: [
        { level: "red", label: "Formulated using industrial hydrogenation — same process as Crisco", text: "Jif was created in 1946, reformulated by Procter & Gamble in 1958 using P&G's industrial hydrogenation expertise from its soap and shortening businesses. Fully hydrogenated vegetable oil replaced peanut oil for shelf stability. Fully hydrogenated vegetable oil is banned from the shelves of Whole Foods Market as an unacceptable ingredient." },
        { level: "red", label: "J.M. Smucker owns both Jif and the leading natural alternatives — Adams and Laura Scudder's", text: "Smucker has engineered a position where it captures consumer spending across both ends of the peanut butter market. The health-conscious consumer who avoids Jif because of its additives and buys Adams or Laura Scudder's instead is still buying a Smucker product. The brand architecture is deliberately siloed — no cross-referencing between brands." },
        { level: "red", label: "2022 Salmonella recall — 21 people ill across 17 states", text: "J.M. Smucker recalled Jif from its Lexington, KY plant due to Salmonella contamination in 2022. 21 people were confirmed ill across 17 states. Estimated loss: $125M. A class action was filed." },
      ],
      narrative: "Real peanut butter has two ingredients: roasted peanuts and salt. Jif's 1950s industrial formulation replaced peanut oil with <strong>fully hydrogenated vegetable oils and added sugar</strong> for shelf stability and texture — a product that is banned at Whole Foods while being marketed as the caring, premium maternal choice.",
    },
  },
  "Tropicana": {
    emoji: "🍊", parent: "PAI Partners (PE)", ownershipType: "pe",
    ticker: { OWNER: "PAI PARTNERS", ACQUIRED: "2021", DEAL: "$3.3B", STATUS: "⚑ FLAGGED" },
    tickerStatus: "flag-red",
    verdict: { level: "red", label: "FLAG · MANUFACTURING DECEPTION", body: "'Fresh' OJ is deoxygenated, stored up to a year, then re-flavored with flavor packs" },
    chain: [{ name: "Founded", year: "1947" }, { name: "PepsiCo", year: "1998" }, { name: "PAI Partners PE", year: "2021", current: true }],
    flags: [{ label: "Flavor Packs Added", color: "red" }, { label: "Deoxygenated Storage", color: "red" }, { label: "PE Owned Since 2021", color: "yellow" }],
    findingColor: "red",
    finding: "Tropicana <strong>markets itself as fresh-squeezed orange juice</strong>. The reality: juice is squeezed, stripped of oxygen, stored in tanks for up to a year, then re-infused with proprietary flavor packs to restore taste lost during storage. PepsiCo sold it to PE firm PAI Partners for $3.3B in 2021. The 'not from concentrate' label is accurate. The 'fresh' impression is not.",
    snippet: "Tropicana markets itself as fresh squeezed orange juice. The reality: juice is squeezed, stripped of oxygen, stored in tanks for up to a year, then re-infused with proprietary flavor packs to restore the taste lost in storage. PepsiCo sold it to PE firm PAI Partners for $3.3B in 2021. The 'not from concentrate' label is technically accurate. The 'fresh' impression it creates isn't.",
    category: "juice",
    profile: {
      subtitle: "PE-Acquired Legacy Brand · Flavor Packs",
      scores: ["red","yellow","yellow","red","green","red","yellow"],
      dimensions: [
        { label: "Ownership Structure", color: "red" },
        { label: "Marketing Alignment", color: "yellow" },
        { label: "Revenue Model", color: "yellow" },
        { label: "Ingredient Integrity", color: "red" },
        { label: "Scientific Backing", color: "green" },
        { label: "Label Claim Accuracy", color: "red" },
        { label: "Safety Transparency", color: "yellow" },
      ],
      findings: [
        { level: "red", label: "Juice is de-oxygenated, stored up to a year, then re-flavored with proprietary packs", text: "After squeezing, Tropicana juice is de-oxygenated and stored in massive aseptic tanks for up to a year. This process strips all natural flavor. Flavor engineers add proprietary 'flavor packs' back before packaging — derived from orange essence and therefore legally exempt from ingredient disclosure. '100% pure squeezed, not from concentrate, no artificial flavors' remains technically defensible." },
        { level: "red", label: "PepsiCo sold because margins were 'below benchmark' — PAI Partners bought as extraction play", text: "PepsiCo sold a 61% controlling stake to PAI Partners in 2021 for $3.3B, retaining 39% and distribution rights. In February 2025, Tropicana warned creditors it may file for Chapter 11 bankruptcy protection, citing declining sales. PepsiCo wrote down its 39% stake by $135M in Q4 2024." },
      ],
      narrative: "The orange juice in a Tropicana carton started as orange juice. What happens between the grove and your glass is <strong>the story the label is designed to prevent you from asking about</strong>. The brand is now approaching potential bankruptcy under a French PE firm that acquired it precisely because PepsiCo couldn't generate adequate margin from it.",
    },
  },
  "siggi's": {
    emoji: "🥛", parent: "Lactalis Group", ownershipType: "acquired",
    ticker: { OWNER: "LACTALIS", ACQUIRED: "2018", DEAL: "N/A", STATUS: "◑ WATCH" },
    tickerStatus: "flag-amber",
    verdict: { level: "yellow", label: "WATCH · OWNERSHIP", body: "Founder still in marketing; $28B conglomerate owns the brand" },
    chain: [{ name: "Founded", year: "2004" }, { name: "Lactalis acquires", year: "2018" }, { name: "Lactalis Group", current: true }],
    flags: [{ label: "Lactalis Owned ($28B)", color: "yellow" }, { label: "Founder in Marketing", color: "yellow" }, { label: "Formula Unchanged", color: "green" }],
    findingColor: "yellow",
    finding: "siggi's <strong>sold the story of an Icelander who wanted simpler yogurt with less sugar</strong>. The yogurt is real. The indie brand story ended in 2018 when Lactalis — the world's largest dairy conglomerate — bought it. The founder still appears in the marketing. The company behind it has $28B in revenue.",
    snippet: "siggi's sold the story of an Icelander who wanted simpler yogurt with less sugar. The yogurt is real. The indie brand story ended in 2018 when Lactalis — the world's largest dairy conglomerate — bought it. The founder still appears in the marketing. The company behind it has $28B in revenue.",
    category: "dairy", subcategory: "yogurt",
  },
  "Herbalife": {
    emoji: "⚠️", parent: "Herbalife Ltd. (NYSE: HLF)", ownershipType: "public",
    ticker: { OWNER: "NYSE: HLF", ACQUIRED: "1980", DEAL: "PUBLIC", STATUS: "⚑ FLAGGED" },
    tickerStatus: "flag-red",
    verdict: { level: "red", label: "FLAG · FTC ACTION", body: "$200M FTC settlement in 2016 — model and products unchanged" },
    chain: [{ name: "Founded", year: "1980" }, { name: "NYSE: HLF", current: true }],
    flags: [{ label: "FTC Settlement $200M", color: "red" }, { label: "MLM Distribution", color: "red" }, { label: "Unsubstantiated Claims", color: "red" }],
    findingColor: "red",
    finding: "Herbalife <strong>markets itself as a wellness company</strong> helping people live healthier through independent distributors. It settled with the FTC for $200M in 2016 for deceptive health and income claims. The products and the model are unchanged.",
    snippet: "Herbalife markets itself as a wellness company helping people live healthier lives through independent distributors. In 2016, the FTC fined it $200M for deceptive health and income claims — finding that most distributors lost money. The company did not admit wrongdoing and changed nothing about the model. It's publicly traded on NYSE. The stock has lost over 80% of its value since 2014. The products and the pitch are unchanged.",
    category: "health", subcategory: "protein",
  },
  "Cheerios": {
    emoji: "🌾", parent: "General Mills", ownershipType: "public",
    ticker: { OWNER: "GEN. MILLS", ACQUIRED: "1941", DEAL: "LEGACY", STATUS: "◑ WATCH" },
    tickerStatus: "flag-amber",
    verdict: { level: "yellow", label: "WATCH · HEALTH CLAIMS", body: "'Heart healthy' claim requires 3g beta-glucan daily — one serving delivers 1g" },
    chain: [{ name: "Founded", year: "1941" }, { name: "General Mills", current: true }],
    flags: [{ label: "Health Claim Gap", color: "yellow" }, { label: "Conglomerate Owned", color: "yellow" }, { label: "Same Parent as Annie's", color: "yellow" }],
    findingColor: "yellow",
    finding: "Cheerios has <strong>marketed itself as heart healthy since 1999</strong>. The FDA allows that claim if a product delivers 3g of beta-glucan oat fiber per day. One serving of Cheerios delivers about 1g. You'd need to eat three bowls. General Mills owns Cheerios, Annie's, Pillsbury, Nature Valley, and Häagen-Dazs.",
    snippet: "Cheerios has marketed itself as heart healthy since 1999. The FDA allows the heart health claim for products delivering 3g of beta-glucan oat fiber daily. One serving of Cheerios delivers about 1g — you'd need three bowls to hit the threshold. The claim is technically legal. The impression it creates isn't technically accurate.",
    category: "breakfast",
  },
  "Fairlife": {
    emoji: "🥛", parent: "The Coca-Cola Company", ownershipType: "acquired",
    ticker: { OWNER: "COCA-COLA", ACQUIRED: "2020", DEAL: "$980M+", STATUS: "⚑ FLAGGED" },
    tickerStatus: "flag-red",
    verdict: { level: "red", label: "FLAG · ANIMAL WELFARE + FRAUD", body: "2019 abuse video at supplier farm; $21M class action settlement for welfare claims" },
    chain: [{ name: "Founded", year: "2012" }, { name: "Coca-Cola full acq.", year: "2020" }, { name: "Coca-Cola Co.", current: true }],
    flags: [{ label: "Animal Abuse (2019)", color: "red" }, { label: "$21M Settlement", color: "red" }, { label: "Coca-Cola Owned", color: "yellow" }],
    findingColor: "red",
    finding: "Fairlife <strong>built its brand on 'extraordinary animal care'</strong> and humane farming. In 2019, an undercover video revealed systematic abuse at its primary supplier farm Fair Oaks Farms — animals beaten, thrown, and branded. Coca-Cola completed its full acquisition in 2020. A $21M class action settlement followed. The humane marketing continues.",
    snippet: "Fairlife built its brand on 'extraordinary animal care' and humane farming. In 2019, an undercover video revealed systematic abuse at its primary supplier — animals beaten and thrown. Coca-Cola completed its full acquisition of Fairlife in 2020. A $21M class action settlement followed. The humane marketing continues.",
    category: "dairy",
  },
  "Clif Bar": {
    emoji: "🧗", parent: "Mondelēz International", ownershipType: "acquired",
    ticker: { OWNER: "MONDELĒZ", ACQUIRED: "2022", DEAL: "$2.9B", STATUS: "◑ WATCH" },
    tickerStatus: "flag-amber",
    verdict: { level: "yellow", label: "WATCH · OWNERSHIP + SUGAR", body: "Founder held out for 20 years then sold to Oreo's parent company for $2.9B" },
    chain: [{ name: "Founded", year: "1992" }, { name: "Mondelēz", year: "2022" }, { name: "Mondelēz Intl.", current: true }],
    flags: [{ label: "Mondelēz Owned", color: "yellow" }, { label: "11g Sugar Per Bar", color: "yellow" }, { label: "Founder Sold 2022", color: "yellow" }],
    findingColor: "yellow",
    finding: "Clif Bar's founder Gary Erickson <strong>famously turned down a $120M acquisition offer in 2000</strong>, calling it a defining moment for values over money. He held out for 22 years. In 2022 he sold to Mondelēz — the company behind Oreo, Cadbury, and Chips Ahoy — for $2.9B. The bar that symbolized independence is now owned by one of the world's largest snack conglomerates.",
    snippet: "Clif Bar's founder famously turned down a $120M acquisition offer in 2000, calling it a values decision. He held out for 22 years. In 2022 he sold to Mondelēz — the company behind Oreo, Cadbury, and Chips Ahoy — for $2.9B. The bar that symbolized independence from Big Food is now a Mondelēz SKU.",
    category: "health", subcategory: "protein_bars",
  },
  "Halo Top": {
    emoji: "🍦", parent: "Wells Enterprises (acquired)", ownershipType: "acquired",
    ticker: { OWNER: "WELLS ENTRP.", ACQUIRED: "2019", DEAL: "N/A", STATUS: "⚑ FLAGGED" },
    tickerStatus: "flag-red",
    verdict: { level: "red", label: "FLAG · SWEETENER RISK", body: "Erythritol — its primary sweetener — linked to cardiovascular risk in 2023 Cleveland Clinic study" },
    chain: [{ name: "Founded", year: "2012" }, { name: "Wells Enterprises", year: "2019" }, { name: "Wells Entrp.", current: true }],
    flags: [{ label: "Erythritol Risk (2023)", color: "red" }, { label: "Health Halo Marketing", color: "yellow" }, { label: "Ultra-Processed", color: "yellow" }],
    findingColor: "red",
    finding: "Halo Top <strong>markets itself as guilt-free ice cream</strong> you can eat the whole pint of. The low calorie count is achieved primarily through erythritol, a sugar alcohol. A 2023 Cleveland Clinic study found elevated erythritol levels associated with increased risk of heart attack and stroke. The study was observational, not causal — but the health halo marketing predates that research entirely.",
    snippet: "Halo Top markets itself as guilt-free ice cream — low calorie, high protein, eat the whole pint. The low calorie count is achieved primarily through erythritol. A 2023 Cleveland Clinic study found elevated erythritol levels associated with increased cardiovascular risk. The study was observational, not causal. But the health halo was never about science — it was about marketing permission to eat more.",
    category: "frozen",
  },
  "Beyond Meat": {
    emoji: "🌱", parent: "Beyond Meat Inc. (Nasdaq: BYND)", ownershipType: "public",
    ticker: { OWNER: "NASDAQ: BYND", ACQUIRED: "2019", DEAL: "IPO $3.8B", STATUS: "⚑ FLAGGED" },
    tickerStatus: "flag-red",
    verdict: { level: "red", label: "FLAG · ULTRA-PROCESSED + HYPE", body: "Stock down 97% from peak; product is highly processed despite 'plant-based' positioning" },
    chain: [{ name: "Founded", year: "2009" }, { name: "Nasdaq IPO", year: "2019" }, { name: "BYND Public", current: true }],
    flags: [{ label: "Ultra-Processed", color: "red" }, { label: "Stock -97% From Peak", color: "red" }, { label: "Methylcellulose Binder", color: "yellow" }],
    findingColor: "red",
    finding: "Beyond Meat <strong>went public in 2019 at a valuation of $3.8B</strong> on the promise that plant-based meat was the future of food. The stock peaked at $234. It now trades near $4. The product contains methylcellulose (a laxative binder), refined coconut oil, and 17+ ingredients. It is not whole food. It is ultra-processed food with excellent marketing.",
    snippet: "Beyond Meat went public in 2019 at $3.8B on the promise that plant-based meat was the future of food. The stock peaked at $234 and now trades near $4. The product contains methylcellulose — a laxative binder — refined coconut oil, and 17+ ingredients. It is not whole food. It is ultra-processed food with a sustainability story.",
    category: "frozen",
  },
  "Fairlife": {
    emoji: "🥛", parent: "The Coca-Cola Company", ownershipType: "acquired",
    ticker: { OWNER: "COCA-COLA", ACQUIRED: "2020", DEAL: "$980M+", STATUS: "⚑ FLAGGED" },
    tickerStatus: "flag-red",
    verdict: { level: "red", label: "FLAG · ANIMAL WELFARE + FRAUD", body: "2019 abuse video at supplier farm; $21M class action settlement for welfare claims" },
    chain: [{ name: "Founded", year: "2012" }, { name: "Coca-Cola full acq.", year: "2020" }, { name: "Coca-Cola Co.", current: true }],
    flags: [{ label: "Animal Abuse (2019)", color: "red" }, { label: "$21M Settlement", color: "red" }, { label: "Coca-Cola Owned", color: "yellow" }],
    findingColor: "red",
    finding: "Fairlife <strong>built its brand on 'extraordinary animal care'</strong> and humane farming. In 2019, an undercover video revealed systematic abuse at its primary supplier farm Fair Oaks Farms — animals beaten, thrown, and branded. Coca-Cola completed its full acquisition in 2020. A $21M class action settlement followed. The humane marketing continues.",
    snippet: "Fairlife built its brand on 'extraordinary animal care' and humane farming. In 2019, an undercover video revealed systematic abuse at its primary supplier — animals beaten and thrown. Coca-Cola completed its full acquisition of Fairlife in 2020. A $21M class action settlement followed. The humane marketing continues.",
    category: "dairy",
    profile: {
      subtitle: "Humane-Washing · Animal Welfare Fraud",
      scores: ["red","red","green","red","yellow","red","yellow"],
      dimensions: [
        { label: "Ownership Structure", color: "red" },
        { label: "Marketing Alignment", color: "red" },
        { label: "Revenue Model", color: "green" },
        { label: "Ingredient Integrity", color: "red" },
        { label: "Scientific Backing", color: "yellow" },
        { label: "Label Claim Accuracy", color: "red" },
        { label: "Safety Transparency", color: "yellow" },
      ],
      findings: [
        { level: "red", label: "2019 undercover video at Fair Oaks Farms showed systematic abuse", text: "An undercover investigation revealed calves being beaten with shovels, dragged by their legs, and left to die. The footage directly contradicted Fairlife's 'extraordinary animal care' marketing and its website claims about humane treatment. Fairlife terminated its relationship with Fair Oaks Farms following the footage." },
        { level: "red", label: "$21M class action settlement for deceptive welfare marketing claims", text: "Fairlife settled a class action lawsuit for $21M in 2020, with plaintiffs arguing its humane marketing claims were false and misleading given the documented supplier conditions. The marketing language about animal welfare was substantially unchanged following the settlement." },
        { level: "red", label: "Coca-Cola completed full acquisition the same year the abuse was documented — 2020", text: "Coca-Cola completed its full acquisition of Fairlife in 2020, the year following the abuse footage and during the settlement period. The largest non-alcoholic beverage company in the world now owns a dairy brand whose primary differentiator is humane treatment claims." },
      ],
      narrative: "Fairlife's positioning was built entirely on a single differentiator: its cows are treated better. The 2019 footage and the $21M settlement don't just undermine a marketing claim — <strong>they undermine the product's entire reason to exist at a premium price point</strong>.",
    },
  },
  "Clif Bar": {
    emoji: "🧗", parent: "Mondelēz International", ownershipType: "acquired",
    ticker: { OWNER: "MONDELĒZ", ACQUIRED: "2022", DEAL: "$2.9B", STATUS: "◑ WATCH" },
    tickerStatus: "flag-amber",
    verdict: { level: "yellow", label: "WATCH · OWNERSHIP + SUGAR", body: "Founder held out for 20 years then sold to Oreo's parent company for $2.9B" },
    chain: [{ name: "Founded", year: "1992" }, { name: "Mondelēz", year: "2022" }, { name: "Mondelēz Intl.", current: true }],
    flags: [{ label: "Mondelēz Owned", color: "yellow" }, { label: "11g Sugar Per Bar", color: "yellow" }, { label: "Founder Sold 2022", color: "yellow" }],
    findingColor: "yellow",
    finding: "Clif Bar's founder Gary Erickson <strong>famously turned down a $120M acquisition offer in 2000</strong>, calling it a defining moment for values over money. He held out for 22 years. In 2022 he sold to Mondelēz — the company behind Oreo, Cadbury, and Chips Ahoy — for $2.9B. The bar that symbolized independence is now owned by one of the world's largest snack conglomerates.",
    snippet: "Clif Bar's founder famously turned down a $120M acquisition offer in 2000, calling it a values decision. He held out for 22 years. In 2022 he sold to Mondelēz — the company behind Oreo, Cadbury, and Chips Ahoy — for $2.9B. The bar that symbolized independence from Big Food is now a Mondelēz SKU.",
    category: "health", subcategory: "protein_bars",
  },
  "Halo Top": {
    emoji: "🍦", parent: "Wells Enterprises (acquired)", ownershipType: "acquired",
    ticker: { OWNER: "WELLS ENTRP.", ACQUIRED: "2019", DEAL: "N/A", STATUS: "⚑ FLAGGED" },
    tickerStatus: "flag-red",
    verdict: { level: "red", label: "FLAG · SWEETENER RISK", body: "Erythritol — its primary sweetener — linked to cardiovascular risk in 2023 Nature Medicine study" },
    chain: [{ name: "Founded", year: "2012" }, { name: "Wells Enterprises", year: "2019" }, { name: "Wells Entrp.", current: true }],
    flags: [{ label: "Erythritol Risk (2023)", color: "red" }, { label: "Health Halo Marketing", color: "yellow" }, { label: "Ultra-Processed", color: "yellow" }],
    findingColor: "red",
    finding: "Halo Top <strong>markets itself as guilt-free ice cream</strong> you can eat the whole pint of. The low calorie count is achieved primarily through erythritol, a sugar alcohol. A 2023 study published in <em>Nature Medicine</em> found elevated erythritol levels associated with increased risk of heart attack and stroke. The study was observational, not causal — but the health halo marketing predates that research entirely.",
    snippet: "Halo Top markets itself as guilt-free ice cream — low calorie, high protein, eat the whole pint. The low calorie count is achieved primarily through erythritol. A 2023 Nature Medicine study found elevated erythritol levels associated with increased cardiovascular risk. The study was observational, not causal. But the health halo was never about science — it was about marketing permission to eat more.",
    category: "frozen",
    profile: {
      subtitle: "Diet Brand · Dose Deception · Sweetener Risk",
      scores: ["red","red","green","red","yellow","yellow","red"],
      dimensions: [
        { label: "Ownership Structure", color: "red" },
        { label: "Marketing Alignment", color: "red" },
        { label: "Revenue Model", color: "green" },
        { label: "Ingredient Integrity", color: "red" },
        { label: "Scientific Backing", color: "yellow" },
        { label: "Label Claim Accuracy", color: "yellow" },
        { label: "Safety Transparency", color: "red" },
      ],
      findings: [
        { level: "red", label: "'Eat the whole pint' tagline maximizes erythritol dose — the brand's core risk mechanism", text: "A single Halo Top serving contains ~7–9g erythritol. A full pint — the consumption pattern the brand actively encouraged — contains roughly 28–36g. The 2023 Nature Medicine study found that eating a small amount of erythritol caused blood levels to remain elevated for days. The consumers most likely to eat a full pint are also among those most likely to have elevated baseline cardiovascular risk." },
        { level: "red", label: "Halo Top has not updated marketing or labeling in response to the erythritol findings", text: "Following the February 2023 publication in Nature Medicine linking erythritol to platelet aggregation and increased cardiovascular event risk, Halo Top did not modify its marketing claims, labeling, or product formulation. Wells Enterprises acquired the brand in 2019 for an estimated $1B+." },
        { level: "yellow", label: "The erythritol study was observational — causation not established", text: "The Nature Medicine study was an observational study, not a randomized controlled trial. It showed correlation between elevated erythritol blood levels and cardiovascular events. It did not establish that dietary erythritol causes those events. The finding is concerning enough to warrant disclosure; it is not definitive enough to constitute proof of harm." },
      ],
      narrative: "Halo Top built a category around a single permission slip: low-calorie ice cream you could eat in quantity without guilt. The tagline said it directly — 'Go ahead, eat the whole pint.' That instruction is the product's entire value proposition, and it is also <strong>the mechanism by which its most significant risk is delivered</strong>.",
    },
  },
  "Beyond Meat": {
    emoji: "🌱", parent: "Beyond Meat Inc. (Nasdaq: BYND)", ownershipType: "public",
    ticker: { OWNER: "NASDAQ: BYND", ACQUIRED: "2019", DEAL: "IPO $3.8B", STATUS: "⚑ FLAGGED" },
    tickerStatus: "flag-red",
    verdict: { level: "red", label: "FLAG · ULTRA-PROCESSED + HYPE", body: "Stock down 97% from peak; product is highly processed despite 'plant-based' positioning" },
    chain: [{ name: "Founded", year: "2009" }, { name: "Nasdaq IPO", year: "2019" }, { name: "BYND Public", current: true }],
    flags: [{ label: "Ultra-Processed", color: "red" }, { label: "Stock -97% From Peak", color: "red" }, { label: "Methylcellulose Binder", color: "yellow" }],
    findingColor: "red",
    finding: "Beyond Meat <strong>went public in 2019 at a valuation of $3.8B</strong> on the promise that plant-based meat was the future of food. The stock peaked at $234. It now trades near $4. The product contains methylcellulose (a laxative binder), refined coconut oil, and 17+ ingredients. It is not whole food. It is ultra-processed food with excellent marketing.",
    snippet: "Beyond Meat went public in 2019 at $3.8B on the promise that plant-based meat was the future of food. The stock peaked at $234 and now trades near $4. The product contains methylcellulose — a laxative binder — refined coconut oil, and 17+ ingredients. It is not whole food. It is ultra-processed food with a sustainability story.",
    category: "frozen",
    profile: {
      subtitle: "Hype Cycle · IPO Collapse",
      scores: ["red","red","green","yellow","yellow","yellow","red"],
      dimensions: [
        { label: "Ownership Structure", color: "red" },
        { label: "Marketing Alignment", color: "red" },
        { label: "Revenue Model", color: "green" },
        { label: "Ingredient Integrity", color: "yellow" },
        { label: "Scientific Backing", color: "yellow" },
        { label: "Label Claim Accuracy", color: "yellow" },
        { label: "Safety Transparency", color: "red" },
      ],
      findings: [
        { level: "red", label: "Stock down ~97% from its May 2019 IPO peak — going-concern notice issued 2024", text: "BYND stock peaked at ~$234 in July 2019 and now trades near $4–7. Revenue has declined four consecutive years. The company has never reported annual net income. A going-concern notice was issued in 2024 — the accounting designation for a company whose ability to continue operating is uncertain." },
        { level: "yellow", label: "Product contains methylcellulose, modified food starch, more sodium than beef", text: "The Beyond Burger contains methylcellulose (a plant-based binder used as a laxative), modified food starch, and more sodium per serving than a comparable beef patty. It is genuinely interesting food technology — pea protein textured to approximate ground beef. But the marketing positioned it as nutritionally equivalent or superior to beef, which the ingredient list does not support." },
        { level: "red", label: "Celebrity investor structure was central to the brand's sustainability credibility", text: "Pre-IPO investors included Leonardo DiCaprio, Snoop Dogg, Bill Gates, and Tyson Foods (later divested). The celebrity investor roster served primarily as brand validation for the sustainability positioning — the implicit message being that choosing Beyond Meat was what environmentally serious people do." },
      ],
      narrative: "This is the complete hype cycle: real innovation, overclaimed benefits, celebrity-fueled IPO at irrational valuation, and a slow collapse back to product fundamentals. The product itself is genuinely interesting technology. <strong>The marketing positioned it as something it isn't</strong>.",
    },
  },
  "Chobani": {
    emoji: "🥛", parent: "Chobani LLC (Independent)", ownershipType: "independent",
    ticker: { OWNER: "INDEPENDENT", ACQUIRED: "N/A", DEAL: "N/A", STATUS: "✓ CLEAN" },
    tickerStatus: "flag-green",
    verdict: { level: "green", label: "INDEPENDENT · VERIFIED", body: "Still founder-owned — one of the only major yogurt brands not owned by Danone or Nestlé" },
    chain: [{ name: "Founded", year: "2005" }, { name: "Chobani LLC", current: true }],
    flags: [{ label: "Still Independent", color: "green" }, { label: "Probiotic Claims Valid", color: "green" }, { label: "Watch: IPO Pending", color: "yellow" }],
    findingColor: "green",
    finding: "Chobani is <strong>one of the only major yogurt brands in America not owned by Danone or Nestlé</strong>. Founder Hamdi Ulukaya has repeatedly declined acquisition offers and taken the company to a $10B+ valuation while staying private. The original plain Greek yogurt is what it claims to be. Watch: Oct 2025 $650M equity raise from an undisclosed investor, IPO proceedings active.",
    snippet: "Chobani is one of the only major yogurt brands in America not owned by Danone or Nestlé. Founder Hamdi Ulukaya has repeatedly declined acquisition offers and built it to a $10B+ valuation while staying private and independent. The original Greek yogurt is what it claims to be. The Flip line is a different story.",
    category: "dairy",
    profile: {
      subtitle: "Founder-Led · IPO-Pending · Transparency Gap",
      scores: ["yellow","green","green","green","yellow","yellow","green"],
      dimensions: [
        { label: "Ownership Structure", color: "yellow" },
        { label: "Marketing Alignment", color: "green" },
        { label: "Revenue Model", color: "green" },
        { label: "Ingredient Integrity", color: "green" },
        { label: "Scientific Backing", color: "yellow" },
        { label: "Label Claim Accuracy", color: "yellow" },
        { label: "Safety Transparency", color: "green" },
      ],
      findings: [
        { level: "yellow", label: "Oct 2025: $650M equity raise from an investor whose identity has not been disclosed", text: "In October 2025, Chobani raised $650M in equity from an unnamed investor at a $20B valuation. Goldman Sachs and Bank of America are retained as IPO bookrunners. The identity of the $650M investor has not been publicly disclosed as of February 2026. A meaningful equity stake in America's #1 yogurt brand now belongs to someone consumers cannot identify." },
        { level: "green", label: "Core product — plain Greek yogurt — is genuinely clean: two ingredients", text: "Chobani plain Greek yogurt: pasteurized nonfat milk and live cultures. Two ingredients. The probiotic claims are valid. The founder's mission around simple ingredients is reflected in the original product. The Chobani Flip line is a separate product with 24g of sugar and candy mix-ins under the same logo." },
        { level: "yellow", label: "IPO trajectory means ownership structure will change", text: "Chobani has filed for IPO twice and withdrawn. The active Goldman Sachs / BofA mandate makes a third filing likely. At IPO, the ownership structure that consumers associate with Chobani's independence will change materially. The brand built on independence is in active transition." },
      ],
      narrative: "The Chobani story is one of the most compelling in American food: a Turkish immigrant buys a defunct Kraft factory, builds the #1 yogurt brand in the country in under a decade. The core product is genuinely clean. What Traced surfaces is <strong>a transparency gap at an inflection point</strong> — the founder-led independent brand consumers trust is actively in transition.",
    },
  },
  "David": {
    emoji: "💪", parent: "David Protein Inc. (VC-backed)", ownershipType: "pe",
    ticker: { OWNER: "PETER RAHAL", ACQUIRED: "2023", DEAL: "$10M SEED", STATUS: "⚑ FLAGGED" },
    tickerStatus: "flag-red",
    verdict: { level: "red", label: "FLAG · INVESTOR-ENDORSER CONFLICT", body: "Peter Attia resigned as CSO Feb 2026; Andrew Huberman holds equity + promotes the product" },
    chain: [{ name: "Founded", year: "2023" }, { name: "VC $10M", year: "2024" }, { name: "David Inc.", current: true }],
    flags: [{ label: "Investor-Endorser Conflict", color: "red" }, { label: "Attia Resigned (Epstein)", color: "red" }, { label: "Collagen Dose Undisclosed", color: "yellow" }],
    findingColor: "red",
    finding: "David's macros are real: <strong>28g protein, 150 calories, zero sugar per bar</strong>. But Peter Attia served as both equity investor and Chief Science Officer — until he resigned Feb 2026 following Epstein-related documents naming him. Andrew Huberman holds equity and promotes the product to 7M subscribers. The protein blend uses collagen to inflate the headline number, at an undisclosed proportion.",
    snippet: "David's macros are real: 28g protein, 150 calories, zero sugar. What Traced examines is the infrastructure. Peter Attia was both equity investor and Chief Science Officer — until he resigned in February 2026 following Epstein-related document releases naming him. Andrew Huberman holds equity from the seed round and promotes the product to 7M subscribers. The protein blend mixes whey with collagen at undisclosed ratios. The macros check out. The endorsement structure doesn't.",
    category: "health", subcategory: "protein_bars",
    profile: {
      subtitle: "Investor-Endorser Conflict · Protein Blend Opacity",
      scores: ["red","red","yellow","red","red","yellow","red"],
      dimensions: [
        { label: "Ownership Structure", color: "red" },
        { label: "Marketing Alignment", color: "red" },
        { label: "Revenue Model", color: "yellow" },
        { label: "Ingredient Integrity", color: "red" },
        { label: "Scientific Backing", color: "red" },
        { label: "Label Claim Accuracy", color: "yellow" },
        { label: "Safety Transparency", color: "red" },
      ],
      findings: [
        { level: "red", label: "Peter Attia was both equity investor and Chief Science Officer — resigned Feb 2026", text: "Attia held equity from the $10M seed round (Aug 2024) and served as the brand's Chief Science Officer — a formal executive role, not an advisory title. When a physician-podcaster with 2M subscribers serves as a brand's Chief Science Officer, holds equity, and promotes the product, the independence of scientific recommendation is not a gray area. He resigned in February 2026 following the release of Epstein-related documents naming him in 1,700+ pages." },
        { level: "red", label: "Andrew Huberman is a confirmed equity investor with no consistent disclosure", text: "Huberman (Huberman Lab, ~7M YouTube subscribers) is a confirmed equity investor from the seed round. The equity relationship has not been consistently disclosed beyond standard 'sponsored by' language in podcast reads, which understates the financial relationship between endorser and brand." },
        { level: "yellow", label: "Protein blend uses collagen to achieve headline gram count — proportion undisclosed", text: "David's 'Protein System' blends milk protein isolate, collagen, whey protein concentrate, and egg white. The blend achieves a legitimate 1.0 PDCAAS score. But collagen is the cheapest ingredient in that system and its proportion is undisclosed. The collagen contributes total gram count at the lowest possible cost; the whey and egg white do the amino acid work." },
      ],
      narrative: "David was founded in 2023 by Peter Rahal, co-founder of RXBar (sold to Kellogg for $600M). The brand launched with immediate velocity, driven by a strategic capital structure that placed its investor roster at the center of its marketing plan from day one. The macros are genuinely impressive. <strong>The endorsement infrastructure mirrors AG1 exactly</strong>.",
    },
  },
  "Ghost Whey": {
    emoji: "👻", parent: "Keurig Dr Pepper", ownershipType: "acquired",
    ticker: { OWNER: "KEURIG DR PEPPER", ACQUIRED: "2024", DEAL: "N/A", STATUS: "⚑ FLAGGED" },
    tickerStatus: "flag-red",
    verdict: { level: "red", label: "FLAG · IDENTITY INVERSION", body: "Independence brand acquired by Dr Pepper maker — 'radical transparency' brand uses undisclosed blend ratios" },
    chain: [{ name: "Founded", year: "2016" }, { name: "Keurig Dr Pepper", year: "2024", current: true }],
    flags: [{ label: "KDP Acquired Oct 2024", color: "red" }, { label: "Blend Ratios Undisclosed", color: "red" }, { label: "No NSF Certification", color: "yellow" }],
    findingColor: "red",
    finding: "Ghost built the most sophisticated independence brand in sports nutrition — <strong>radical transparency as an aesthetic</strong>, garage mythology, Oreo collaborations. In October 2024, Keurig Dr Pepper acquired it. The maker of Dr Pepper, 7UP, Canada Dry, and Snapple now owns the brand that most loudly marketed its independence. The collaboration flavors remain. The independence does not.",
    snippet: "Ghost built its brand on radical transparency and independence from corporate supplement culture. In October 2024, Keurig Dr Pepper — maker of Dr Pepper, 7UP, Canada Dry, and Snapple — acquired it. The brand that most loudly marketed its independence from Big Food is now owned by a $50B beverage conglomerate. The Oreo protein flavor is still on shelf. The independence is not.",
    category: "health", subcategory: "protein",
    profile: {
      subtitle: "Identity Inversion · Independence Brand Acquired",
      scores: ["red","red","red","yellow","yellow","yellow","green"],
      dimensions: [
        { label: "Ownership/Control", color: "red" },
        { label: "Ingredient Transparency", color: "red" },
        { label: "Brand Identity Accuracy", color: "red" },
        { label: "Third-Party Testing", color: "yellow" },
        { label: "Artificial Sweeteners", color: "yellow" },
        { label: "Formula Quality", color: "yellow" },
        { label: "Label Accuracy", color: "green" },
      ],
      findings: [
        { level: "red", label: "Acquired by Keurig Dr Pepper in October 2024 — a beverage conglomerate with no prior sports nutrition presence", text: "KDP's portfolio includes Dr Pepper, 7UP, Canada Dry, Snapple, Bai, and Mott's. Ghost is their first and only sports nutrition brand. Founders Ryan Hughes and Daniel Lourenco remain in operational roles. The acquisition was confirmed October 24, 2024." },
        { level: "red", label: "Ghost's 'radical transparency' brand ethos conflicts with undisclosed protein blend ratios", text: "Ghost's founding ethos included publicizing its supply chain partners and manufacturing relationships — unusual transparency for the category. Ghost Whey uses a three-form whey blend (concentrate, isolate, hydrolyzed) with ratios not disclosed. A brand built on transparency does not disclose what proportion of its protein is the cheapest form." },
        { level: "yellow", label: "Not NSF Certified for Sport — batch COAs not published", text: "Ghost does not hold NSF Certified for Sport or Informed Sport certification. Batch-level certificates of analysis are not published on the website. This is inconsistent with the 'radical transparency' brand positioning and makes third-party verification of label accuracy impossible for consumers." },
      ],
      narrative: "What makes Ghost the definitive case study in identity inversion is not the acquisition itself — it is that the acquisition happened <strong>to the brand that most loudly marketed its independence</strong>, and that this structural change has not been meaningfully communicated to the audience that was sold that independence as a core value.",
    },
  },
  "MusclePharm": {
    emoji: "⚠️", parent: "MusclePharm Corp. (Nasdaq: MSLP)", ownershipType: "public",
    ticker: { OWNER: "NASDAQ: MSLP", ACQUIRED: "2008", DEAL: "PUBLIC", STATUS: "⚑ FLAGGED" },
    tickerStatus: "flag-red",
    verdict: { level: "red", label: "FLAG · REGULATORY HISTORY", body: "$4M FTC settlement, SEC investigation, protein spiking class action, revenue down 70%" },
    chain: [{ name: "Founded", year: "2008" }, { name: "Nasdaq: MSLP", current: true }],
    flags: [{ label: "$4M FTC Settlement", color: "red" }, { label: "SEC Investigation", color: "red" }, { label: "Revenue -70% From Peak", color: "red" }],
    findingColor: "red",
    finding: "MusclePharm has accumulated the <strong>most documented legal and regulatory failure record</strong> in the protein powder category: a $4M FTC settlement for false advertising, an SEC investigation into the CEO for insider trading, a protein spiking class action, and multiple financial restatements. Revenue is down ~70% from a $177M peak. The product is still on shelf at GNC.",
    snippet: "MusclePharm has a $4M FTC settlement for false advertising, an SEC investigation into its former CEO for insider trading, a protein spiking class action, and revenue down 70% from its $177M peak. It continues to operate on Nasdaq and sell at GNC and Amazon. The question MusclePharm forces: how much documented failure is required before a supplement company faces real consequences?",
    category: "health", subcategory: "protein",
    profile: {
      subtitle: "Regulatory Failure Record · Still On Shelf",
      scores: ["yellow","red","red","red","red","red","yellow"],
      dimensions: [
        { label: "Ownership/Control", color: "yellow" },
        { label: "Executive Integrity", color: "red" },
        { label: "Ingredient Transparency", color: "red" },
        { label: "Third-Party Testing", color: "red" },
        { label: "Advertising Claims", color: "red" },
        { label: "Financial Integrity", color: "red" },
        { label: "Product Formula", color: "yellow" },
      ],
      findings: [
        { level: "red", label: "$4M FTC settlement for false and unsubstantiated advertising claims — 20-year consent decree", text: "In 2014, the FTC charged MusclePharm with making false and unsubstantiated claims about its Combat Protein Powder, Amino 1, and other products. The company agreed to pay $4M and was placed under a 20-year consent decree prohibiting it from making unsupported advertising claims. This is a resolved federal enforcement action, not an allegation." },
        { level: "red", label: "SEC investigated CEO Brad Pyatt for insider trading — he resigned, financial restatements filed", text: "The SEC launched an investigation into former CEO Brad Pyatt for alleged insider trading in MusclePharm stock. Pyatt resigned as CEO in 2015. A separate shareholder class action alleged securities fraud. The company disclosed multiple material weaknesses in its financial controls in restatements filed after Pyatt's departure." },
        { level: "red", label: "Class action alleged protein spiking — adding free amino acids to inflate protein count", text: "A class action alleged that MusclePharm added free amino acids (glycine, taurine) that pass nitrogen testing but are not functionally equivalent to complete protein. This practice — protein spiking — inflates the reported gram count while delivering less actual protein value." },
      ],
      narrative: "MusclePharm is a publicly traded supplement company that has accumulated the most documented legal and regulatory failure record in the protein powder category — and <strong>continues operating with the same disclosure gaps that generated that record</strong>. The question it forces is whether a company can hold this many documented accountability events and face no meaningful consequence in a category with no mandatory disclosure requirements.",
    },
  },
  "Transparent Labs": {
    emoji: "✓", parent: "Nutra Holdings (private)", ownershipType: "acquired",
    ticker: { OWNER: "NUTRA HOLDINGS", ACQUIRED: "2020", DEAL: "N/A", STATUS: "✓ CLEAN" },
    tickerStatus: "flag-green",
    verdict: { level: "green", label: "BENCHMARK · TRANSPARENCY LEADER", body: "Full ingredient disclosure, batch COAs published, Informed Choice certified, no proprietary blends" },
    chain: [{ name: "Founded", year: "2015" }, { name: "Nutra Holdings", year: "2020", current: true }],
    flags: [{ label: "Batch COAs Published", color: "green" }, { label: "No Proprietary Blends", color: "green" }, { label: "Watch: Nutra Holdings", color: "yellow" }],
    findingColor: "green",
    finding: "Transparent Labs is doing what the name says — <strong>full ingredient disclosure with no proprietary blends, published COAs for every batch, Informed Choice certified, no artificial sweeteners or colors</strong>. Acquired by Nutra Holdings in 2020 (also owns Jacked Factory). The acquisition hasn't changed the product yet. Whether that holds is the active question.",
    snippet: "Transparent Labs publishes batch-level certificates of analysis for every product — the current best practice in supplement transparency. No proprietary blends, Informed Choice certified, no artificial sweeteners. It was acquired by Nutra Holdings in 2020, which also owns Jacked Factory — a budget supplement brand. The product hasn't changed. The founders no longer control formulation decisions.",
    category: "health", subcategory: "protein",
    profile: {
      subtitle: "Green Benchmark · Science-First",
      scores: ["yellow","green","green","green","green","yellow","green"],
      dimensions: [
        { label: "Ownership Structure", color: "yellow" },
        { label: "Revenue Model", color: "green" },
        { label: "Marketing Alignment", color: "green" },
        { label: "Ingredient Integrity", color: "green" },
        { label: "Label Claim Accuracy", color: "green" },
        { label: "Scientific Backing", color: "yellow" },
        { label: "Safety Transparency", color: "green" },
      ],
      findings: [
        { level: "green", label: "Batch-level certificates of analysis published for every product", text: "Transparent Labs publishes COAs for each product batch, allowing consumers to verify that what's on the label is in the product at the stated amount. This is the current best practice in supplement transparency and is rare in the category." },
        { level: "green", label: "No proprietary blends — every ingredient at its exact dose", text: "Every ingredient is disclosed at its exact amount. No proprietary blends. No underdosed herb hidden behind a 'blend' total. This directly addresses the primary transparency failure of competitors like AG1 and Ghost Whey." },
        { level: "yellow", label: "Acquired by Nutra Holdings in 2020 — founders no longer control formulation decisions", text: "Nutra Holdings is a small private company that also owns Jacked Factory — a budget performance supplement brand with a different ingredient philosophy. The acquisition was described as mission-aligned, and the product has not changed. But the founders no longer control formulation decisions. The question of whether that holds at the moment of a secondary sale or IPO is the active watch item." },
      ],
      narrative: "Transparent Labs is the direct counter-example to AG1 and MusclePharm in the Traced database — same category, same consumer, opposite approach. <strong>The transparency practices here set the standard the rest of the category should be held to</strong>.",
    },
  },
  "Momentous": {
    emoji: "🔬", parent: "Momentous (VC-backed, private)", ownershipType: "pe",
    ticker: { OWNER: "PRIVATE", ACQUIRED: "2018", DEAL: "~$50M VC", STATUS: "✓ CLEAN" },
    tickerStatus: "flag-green",
    verdict: { level: "green", label: "BENCHMARK · SCIENCE-FIRST", body: "NSF Certified for Sport, full ingredient disclosure, disclosed endorser relationships" },
    chain: [{ name: "Founded", year: "2018" }, { name: "Founders Fund / a16z", year: "2020" }, { name: "Momentous Inc.", current: true }],
    flags: [{ label: "NSF Certified for Sport", color: "green" }, { label: "Full Dose Disclosure", color: "green" }, { label: "Watch: VC Investor Table", color: "yellow" }],
    findingColor: "green",
    finding: "Momentous operates in the same market as AG1 — <strong>same audience, same podcast channels, same price point</strong>. The difference is every structural choice: full ingredient doses, NSF Certified for Sport, disclosed endorser relationships, independent sports scientists. Andrew Huberman is a paid collaborator — with disclosed relationship, no undisclosed equity. Two yellow scores are honest: private VC funding, full investor table not public.",
    snippet: "Momentous sells to the same premium consumer as AG1 — through the same podcast channels, at similar price points. Where AG1 hides 49 doses in proprietary blends, Momentous discloses every ingredient at every amount. Where David uses undisclosed collagen ratios, Momentous uses whey isolate and pea protein with peer-reviewed backing. NSF Certified for Sport. The benchmark the rest of the category should meet.",
    category: "health", subcategory: "protein",
    profile: {
      subtitle: "Green Benchmark · Science-First",
      scores: ["yellow","green","yellow","green","green","green","green"],
      dimensions: [
        { label: "Ownership Structure", color: "yellow" },
        { label: "Marketing Alignment", color: "green" },
        { label: "Revenue Model", color: "yellow" },
        { label: "Ingredient Integrity", color: "green" },
        { label: "Scientific Backing", color: "green" },
        { label: "Label Claim Accuracy", color: "green" },
        { label: "Safety Transparency", color: "green" },
      ],
      findings: [
        { level: "green", label: "NSF Certified for Sport — publishes batch-level certificates of analysis", text: "Momentous holds NSF Certified for Sport status and publishes batch-level certificates of analysis. This is the gold standard for supplement safety verification and means each batch has been independently tested for banned substances and label accuracy." },
        { level: "green", label: "Andrew Huberman collaboration is disclosed — no undisclosed equity", text: "Momentous has worked with Andrew Huberman as a paid collaborator. The relationship is disclosed. Unlike AG1 and David, Huberman does not hold undisclosed equity in Momentous. The product was formulated with the input of independent sports scientists, not equity-holding endorsers." },
        { level: "yellow", label: "VC-backed — full investor table not public", text: "Momentous has raised an estimated $50M+ from investors including Founders Fund and a16z's consumer arm. The full investor roster and capitalization table are not publicly disclosed. The yellow score is honest: Traced cannot fully evaluate what it cannot see. Founders Fund and a16z are sophisticated investors who will seek significant returns at the moment of exit." },
      ],
      narrative: "Momentous is the direct counter-example to AG1 and David in the Traced database — same category, same audience, <strong>opposite approach to scientific backing, transparency, and endorser relationships</strong>. The model works on its own terms without manufactured credibility.",
    },
  },
};

const AISLES = {
  health: {
    label: "Health & Supplements", isHealth: true,
    subcategories: [
      { id: "all", label: "All" },
      { id: "protein", label: "Protein" },
      { id: "protein_bars", label: "Protein Bars" },
      { id: "electrolytes", label: "Electrolytes" },
      { id: "greens", label: "Greens Powders" },
    ],
    brands: ["AG1", "Momentous", "Transparent Labs", "Ghost Whey", "MusclePharm", "Vital Proteins", "Celsius", "David", "Quest Bars", "Clif Bar", "Herbalife"],
  },
  breakfast: { label: "Breakfast & Cereal", icon: "☀", brands: ["Cheerios", "Annie's"] },
  snacks:    { label: "Snacks & Packaged",  icon: "▲", brands: ["Reese's", "Annie's", "Chobani Flip"] },
  pantry:    { label: "Pantry Staples",     icon: "◈", brands: ["Jif", "Gerber"] },
  dairy:     { label: "Dairy & Alternatives", icon: "◆", brands: ["Chobani", "Chobani Flip", "siggi's", "Oatly", "Fairlife"] },
  juice:     { label: "Juice & Drinks",     icon: "◉", brands: ["Tropicana", "Celsius"] },
  frozen:    { label: "Frozen & Ice Cream", icon: "❄", brands: ["Halo Top", "Beyond Meat"] },
  baby:      { label: "Baby & Kids",        icon: "●", brands: ["Gerber"] },
};

const RECENT = [
  { brand: "AG1",      dots: ["red","yellow","yellow"] },
  { brand: "Gerber",   dots: ["red","red","yellow"] },
  { brand: "Annie's",  dots: ["red","red","yellow"] },
];

const Ico = {
  Home:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  Grid:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  Scan:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/><line x1="7" y1="12" x2="17" y2="12"/></svg>,
  Search:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Share:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>,
  X:        () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Research: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Arrow:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="16" height="16" strokeWidth="1.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  Local:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>,
  Mail:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
};

function ContactModal({ onClose }) {
  const options = [
    {
      icon: "🏷️", color: "amber",
      label: "Submit a brand",
      desc: "Know a brand we haven't covered? Tell us who owns it and why it matters.",
      mailto: "mailto:hello@tracedhealth.com?subject=Brand%20Submission&body=Brand%20name%3A%0AParent%20company%3A%0AWhy%20it%20matters%3A",
    },
    {
      icon: "⚠️", color: "red",
      label: "We got something wrong",
      desc: "Our data should be accurate. If you spot an error, we commit to fixing it within 48 hours.",
      mailto: "mailto:hello@tracedhealth.com?subject=Data%20Correction&body=Brand%3A%0AWhat%27s%20incorrect%3A%0ACorrect%20information%3A%0ASource%20(if%20you%20have%20one)%3A",
    },
    {
      icon: "💬", color: "green",
      label: "Ask a question",
      desc: "Something confusing, a methodology question, or anything else on your mind.",
      mailto: "mailto:hello@tracedhealth.com?subject=Question&body=",
    },
  ];

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target.classList.contains("modal-overlay")) onClose(); }}>
      <div className="modal-sheet">
        <div className="modal-handle" />
        <div className="modal-head">
          <div>
            <div className="modal-title">Get in <em>touch.</em></div>
            <div className="modal-sub">We read every message. Data corrections are our highest priority.</div>
          </div>
          <button className="modal-close" onClick={onClose}><Ico.X /></button>
        </div>
        <div className="modal-body">
          {options.map((o, i) => (
            <button key={i} className="contact-option" onClick={() => window.open(o.mailto)}>
              <div className={`contact-option-icon ${o.color}`}>{o.icon}</div>
              <div>
                <div className="contact-option-label">{o.label}</div>
                <div className="contact-option-desc">{o.desc}</div>
              </div>
            </button>
          ))}
          <div className="contact-commitment">
            <div className="contact-commitment-label">Our commitment</div>
            <div className="contact-commitment-text">
              Traced exists to get the facts right. If we've made an error — ownership, date, ingredient change, anything — we will correct it and note the update. Food transparency only works if the data is trustworthy.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScanCard({ brandKey, onClose }) {
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const b = BRANDS[brandKey];
  if (!b) return null;

  const badgeClass = { acquired: "badge-acquired", independent: "badge-independent", pe: "badge-pe", public: "badge-public" }[b.ownershipType];
  const badgeLabel = { acquired: "Acquired", independent: "Independent", pe: "PE / Public", public: "Public Co." }[b.ownershipType];

  const copy = () => {
    navigator.clipboard?.writeText(b.snippet).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="scan-card">
      {/* 1 · Verdict strip */}
      <div className={`card-verdict-strip verdict-${b.verdict.level}`}>
        <div className="card-verdict-icon">
          <span>{b.verdict.level === "red" ? "⚑" : b.verdict.level === "green" ? "✓" : "◑"}</span>
        </div>
        <div className="card-verdict-content">
          <div className="card-verdict-label">{b.verdict.label}</div>
          <div className="card-verdict-body">{b.verdict.body}</div>
        </div>
      </div>

      {/* 2 · Ticker */}
      <div className="card-ticker">
        {Object.entries(b.ticker).map(([k, v]) => (
          <div key={k} className="ticker-item">
            <div className="ticker-label">{k}</div>
            <div className={`ticker-val ${k === "STATUS" ? b.tickerStatus : ""}`}>{v}</div>
          </div>
        ))}
      </div>

      {/* 3 · Brand + ownership */}
      <div className="card-brand-block">
        <div className="card-brand-name"><em>{brandKey}</em></div>
        <div className="card-ownership-line">
          <span className="card-parent">→ {b.parent}</span>
          <span className={`ownership-badge ${badgeClass}`}>{badgeLabel}</span>
        </div>
      </div>

      {/* 4 · Flags */}
      <div className="card-flags">
        {b.flags.map((f, i) => (
          <span key={i} className={`flag flag-${f.color}`}>
            <span className="flag-dot" />{f.label}
          </span>
        ))}
      </div>

      {/* 5 · Key finding */}
      <div className={`card-finding finding-${b.findingColor}`}>
        <div className="finding-label">What Traced Found</div>
        <div className="finding-text" dangerouslySetInnerHTML={{ __html: b.finding }} />
      </div>

      {/* 6 · Ownership chain */}
      <div className="card-chain">
        <div className="chain-label">Ownership Chain</div>
        <div className="chain-nodes">
          {b.chain.map((node, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center" }}>
              {i > 0 && <span className="chain-sep">→</span>}
              <div className="chain-node">
                <span className={`chain-node-name ${node.current ? "current" : ""}`}>{node.name}</span>
                {node.year && <span className="chain-node-year">{node.year}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6b · Deep Trace profile (if data exists) */}
      {b.profile && (
        <>
          <button className="profile-toggle" onClick={() => setProfileOpen(!profileOpen)}>
            <div className="profile-toggle-left">
              <span className="profile-toggle-label">⬡ Deep Trace</span>
              <span className="profile-toggle-sub">{b.profile.subtitle}</span>
            </div>
            <span className={`profile-toggle-chevron ${profileOpen ? "open" : ""}`}>▾</span>
          </button>
          <div className={`profile-drawer ${profileOpen ? "open" : ""}`}>
            <div className="profile-drawer-inner">
              {/* Score bar */}
              {b.profile.scores && (
                <div className="profile-score-bar">
                  <span className="profile-score-label">7-Dim Score</span>
                  <div className="profile-score-dots">
                    {b.profile.scores.map((s, i) => (
                      <div key={i} className={`profile-score-dot ${s}`} />
                    ))}
                  </div>
                  <span className="profile-score-summary">
                    {b.profile.scores.filter(s => s === "red").length}R · {b.profile.scores.filter(s => s === "yellow").length}Y · {b.profile.scores.filter(s => s === "green").length}G
                  </span>
                </div>
              )}
              {/* Dimension grid */}
              {b.profile.dimensions && (
                <div className="profile-dim-grid">
                  {b.profile.dimensions.map((d, i) => (
                    <div key={i} className="profile-dim-cell">
                      <span className="profile-dim-name">{d.label}</span>
                      <div className={`profile-dim-dot ${d.color}`} />
                    </div>
                  ))}
                </div>
              )}
              {/* Key findings */}
              {b.profile.findings && b.profile.findings.map((f, i) => (
                <div key={i} className="profile-finding-row">
                  <span className="profile-finding-num">0{i + 1}</span>
                  <div>
                    <div className={`profile-finding-level ${f.level}`}>{f.label}</div>
                    <div className="profile-finding-text" dangerouslySetInnerHTML={{ __html: f.text }} />
                  </div>
                </div>
              ))}
              {/* Narrative section */}
              {b.profile.narrative && (
                <div className="profile-section">
                  <div className="profile-section-label">The Full Picture</div>
                  <div className="profile-section-body" dangerouslySetInnerHTML={{ __html: b.profile.narrative }} />
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* 7 · Actions */}
      <div className="card-actions">
        <button className="card-btn share-btn" onClick={() => setShareOpen(!shareOpen)}>
          <Ico.Share /> Share
        </button>
        <button className="card-btn" onClick={onClose}>
          <Ico.X /> Dismiss
        </button>
      </div>

      {/* 8 · Share drawer */}
      <div className={`share-drawer ${shareOpen ? "open" : ""}`}>
        <div className="share-drawer-inner">
          <div className="snippet-quote">{b.snippet}</div>
          <div className="snippet-source">traced · food transparency</div>
          <button className={`copy-btn ${copied ? "copied" : ""}`} onClick={copy}>
            {copied ? "✓ Copied to clipboard" : "Copy snippet"}
          </button>
        </div>
      </div>

      {/* 9 · Exit ramp */}
      <div className="card-exit" onClick={() => window.open("https://traced-local.vercel.app/", "_blank")}>
        <div>
          <div className="exit-label">The Exit Ramp</div>
          <div className="exit-title">Find real food near you</div>
          <div className="exit-sub">Traced Local → Bay Area markets</div>
        </div>
        <div className="exit-arrow"><Ico.Arrow /></div>
      </div>
    </div>
  );
}

const TRENDING = [
  { brand: "Reese's",    reason: "Inventor's grandson goes public on reformulation" },
  { brand: "Annie's",    reason: "Reformulated without telling anyone" },
  { brand: "Fairlife",   reason: "Coca-Cola owns it. Animal abuse settlement." },
  { brand: "Tropicana",  reason: "Your 'fresh' OJ is stored for up to a year" },
  { brand: "Celsius",    reason: "FTC challenged the 'health drink' label" },
];

function TrendingSection({ onBrand }) {
  const worstColor = (bk) => {
    const b = BRANDS[bk];
    if (!b) return "gray";
    if (b.flags.some(f => f.color === "red")) return "red";
    if (b.flags.some(f => f.color === "yellow")) return "yellow";
    return "green";
  };

  return (
    <div className="trending-section">
      <div className="section-head" style={{ padding: "18px 0 12px" }}>
        <span className="section-label">↑ Trending</span>
      </div>
      <div className="trending-grid">
        {TRENDING.map((t, i) => {
          const b = BRANDS[t.brand];
          if (!b) return null;
          const color = worstColor(t.brand);
          const topFlags = b.flags.slice(0, 2);
          return (
            <div key={i} className="trending-card" onClick={() => onBrand(t.brand)}>
              <div className="trending-rank">0{i + 1}</div>
              <div className="trending-body">
                <div className="trending-brand-row">
                  <span className="trending-brand-name">{t.brand}</span>
                </div>
                <div className="trending-parent">→ {b.parent}</div>
                <div className="trending-flags-row">
                  {topFlags.map((f, j) => (
                    <span key={j} className={`trending-flag trending-flag-${f.color}`}>{f.label}</span>
                  ))}
                </div>
              </div>
              <div className="trending-right">
                <div className={`trending-verdict-dot dot-${color}`} />
                <span className="trending-arrow">→</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BrowseScreen({ onBrand }) {
  const [healthSub, setHealthSub] = useState("all");

  const worstDot = (bk) => {
    const b = BRANDS[bk];
    if (!b) return "gray";
    if (b.flags.some(f => f.color === "red")) return "red";
    if (b.flags.some(f => f.color === "yellow")) return "yellow";
    return "green";
  };

  const healthBrands = AISLES.health.brands.filter(bk =>
    healthSub === "all" || BRANDS[bk]?.subcategory === healthSub
  );

  return (
    <div>
      <TrendingSection onBrand={onBrand} />
      <div className="section-head" style={{ paddingTop: "4px" }}><span className="section-label">Aisles</span></div>

      <div className="health-aisle">
        <div className="health-aisle-top">
          <div className="health-aisle-label">Health & Supplements</div>
          <div className="health-new">NEW</div>
        </div>
        <div className="health-aisle-body">
          <div className="health-pills">
            {AISLES.health.subcategories.map(s => (
              <button key={s.id} className={`health-pill ${healthSub === s.id ? "active" : ""}`}
                onClick={() => setHealthSub(s.id)}>{s.label}</button>
            ))}
          </div>
          <div className="brand-chips">
            {healthBrands.map(bk => (
              <button key={bk} className="brand-chip" onClick={() => onBrand(bk)}>
                <span className={`dot dot-${worstDot(bk)}`} />{bk}
              </button>
            ))}
          </div>
        </div>
      </div>

      {Object.entries(AISLES).filter(([k]) => k !== "health").map(([key, aisle]) => (
        <div key={key} className="aisle-block">
          <div className="aisle-head">{aisle.icon} {aisle.label}</div>
          <div className="brand-chips">
            {aisle.brands.map(bk => (
              <button key={bk} className="brand-chip" onClick={() => onBrand(bk)}>
                <span className={`dot dot-${worstDot(bk)}`} />{bk}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// Barcode → Brand lookup via Open Food Facts
const BARCODE_MAP = {
  "038000845024": "Cheerios",
  "016000275287": "Cheerios",
  "016000494664": "Cheerios",
  "013562100018": "Annie's",
  "013562100032": "Annie's",
  "013562100049": "Annie's",
  "034000002306": "Jif",
  "034000021802": "Jif",
  "034000016907": "Jif",
  "048001010019": "Tropicana",
  "048001210014": "Tropicana",
  "048001820034": "Tropicana",
  "099482400026": "Halo Top",
  "099482400019": "Halo Top",
  "850002569004": "Beyond Meat",
  "850002569028": "Beyond Meat",
  "894700010017": "Chobani",
  "894700010109": "Chobani",
  "894700010024": "Chobani Flip",
  "035826095473": "Oatly",
  "035826108777": "Oatly",
  "034952510068": "Fairlife",
  "034952510013": "Fairlife",
  "722252342010": "Clif Bar",
  "722252195679": "Clif Bar",
  "041376510014": "Gerber",
  "015000043079": "Gerber",
  "034000020003": "Reese's",
  "034000020010": "Reese's",
  "834241000024": "AG1",
  "856531006001": "Ghost Whey",
};

async function lookupBarcode(barcode) {
  // 1. Check local map first
  if (BARCODE_MAP[barcode]) return BARCODE_MAP[barcode];
  // 2. Try Open Food Facts
  try {
    const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
    const data = await res.json();
    if (data.status === 1 && data.product) {
      const name = data.product.brands || data.product.product_name || "";
      // Try to match against our brand keys
      const nameLower = name.toLowerCase();
      for (const key of Object.keys(BRANDS)) {
        if (nameLower.includes(key.toLowerCase())) return key;
      }
      return { unknown: true, name: data.product.product_name || name, barcode };
    }
  } catch(e) {}
  return { unknown: true, barcode };
}

function ScanScreen({ selected, onDismiss, onDemo }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const readerRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [camError, setCamError] = useState(null);
  const [looking, setLooking] = useState(false);
  const [zxingReady, setZxingReady] = useState(false);

  // Dynamically load ZXing
  useEffect(() => {
    if (window.ZXing) { setZxingReady(true); return; }
    const s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/@zxing/library@0.19.1/umd/index.min.js";
    s.onload = () => setZxingReady(true);
    s.onerror = () => setCamError("Failed to load scanner library. Check your connection.");
    document.head.appendChild(s);
  }, []);

  const stopCamera = () => {
    if (readerRef.current) {
      try { readerRef.current.reset(); } catch(e) {}
      readerRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    setScanning(false);
    setLooking(false);
  };

  const startCamera = async () => {
    if (!zxingReady) { setCamError("Scanner loading, try again in a moment."); return; }
    setCamError(null);
    setLooking(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setScanning(true);

      const ZXing = window.ZXing;
      const hints = new Map();
      hints.set(ZXing.DecodeHintType.POSSIBLE_FORMATS, [
        ZXing.BarcodeFormat.EAN_13,
        ZXing.BarcodeFormat.EAN_8,
        ZXing.BarcodeFormat.UPC_A,
        ZXing.BarcodeFormat.UPC_E,
        ZXing.BarcodeFormat.CODE_128,
      ]);
      const reader = new ZXing.BrowserMultiFormatReader(hints, { delayBetweenScanAttempts: 150 });
      readerRef.current = reader;

      reader.decodeFromVideoElement(videoRef.current, async (result, err) => {
        if (result) {
          const code = result.getText();
          stopCamera();
          setLooking(true);
          const brand = await lookupBarcode(code);
          setLooking(false);
          if (typeof brand === "string") {
            onDemo(brand);
          } else {
            setCamError(brand.name
              ? `Found: "${brand.name}" — not in Traced database yet`
              : `Barcode ${brand.barcode} not in database yet`
            );
          }
        }
      });
    } catch(err) {
      if (err.name === "NotAllowedError") setCamError("Camera permission denied. Allow camera access in your browser settings and try again.");
      else if (err.name === "NotFoundError") setCamError("No camera found on this device.");
      else setCamError("Camera error: " + err.message);
    }
  };

  useEffect(() => {
    if (selected) stopCamera();
    return () => stopCamera();
  }, [selected]);

  return (
    <div>
      <div className="viewfinder" style={{ position: "relative", overflow: "hidden" }}>
        <video
          ref={videoRef}
          style={{
            position: "absolute", inset: 0, width: "100%", height: "100%",
            objectFit: "cover", display: scanning ? "block" : "none"
          }}
          muted playsInline
        />
        <div className="vf-corner tl" /><div className="vf-corner tr" />
        <div className="vf-corner bl" /><div className="vf-corner br" />

        {!selected && !scanning && !camError && !looking && (
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:12, cursor:"pointer" }}
            onClick={startCamera}>
            <div className="vf-scan-line" />
            <div className="vf-hint">{zxingReady ? "Tap to open camera" : "Loading scanner…"}</div>
          </div>
        )}

        {scanning && (
          <div style={{ position:"absolute", bottom:16, left:0, right:0, textAlign:"center" }}>
            <div className="vf-scan-line" />
            <div className="vf-hint" style={{ marginTop:8 }}>Point at a barcode</div>
            <button onClick={stopCamera}
              style={{ marginTop:10, background:"rgba(0,0,0,0.6)", border:"1px solid rgba(255,255,255,0.2)",
                color:"#fff", borderRadius:4, padding:"6px 14px", fontSize:11, cursor:"pointer" }}>
              Cancel
            </button>
          </div>
        )}

        {looking && <div className="vf-hint">Looking up product…</div>}

        {camError && (
          <div style={{ padding:"14px 18px", textAlign:"center" }}>
            <div style={{ fontSize:11, lineHeight:1.6, color:"var(--text-muted)", marginBottom:12 }}>{camError}</div>
            <div style={{ display:"flex", gap:8, justifyContent:"center" }}>
              <button onClick={() => { setCamError(null); startCamera(); }}
                style={{ background:"var(--amber)", border:"none", color:"var(--black)",
                  borderRadius:4, padding:"7px 14px", fontSize:11, fontFamily:"var(--font-mono)",
                  cursor:"pointer", letterSpacing:"0.08em" }}>
                Try Again
              </button>
              <button onClick={() => { setCamError(null); onDemo(); }}
                style={{ background:"var(--surface-2)", border:"1px solid var(--border)",
                  color:"var(--text-muted)", borderRadius:4, padding:"7px 14px",
                  fontSize:11, cursor:"pointer" }}>
                Demo
              </button>
            </div>
          </div>
        )}

        {selected && <div className="vf-success">✓ Product identified</div>}
      </div>

      {selected
        ? <ScanCard brandKey={selected} onClose={onDismiss} />
        : <>
            <div className="section-head"><span className="section-label">Recently Scanned</span></div>
            {RECENT.map((r, i) => (
              <div key={i} className="recent-row" onClick={() => onDemo(r.brand)}>
                <div className="recent-icon">{BRANDS[r.brand]?.emoji}</div>
                <div className="recent-info">
                  <div className="recent-brand">{r.brand}</div>
                  <div className="recent-parent">{BRANDS[r.brand]?.parent}</div>
                </div>
                <div className="recent-dots">{r.dots.map((d, j) => <span key={j} className={`dot dot-${d}`} />)}</div>
              </div>
            ))}
          </>
      }
    </div>
  );
}

function ResearchScreen() {
  return (
    <div>
      <div className="section-head"><span className="section-label">Investigations</span></div>
      {[
        { title: "The Supplement Industry's Proprietary Blend Problem", meta: "AG1 · Herbalife · Vital Proteins · 8 brands" },
        { title: "Baby Food & Heavy Metals: What the 2021 Report Found", meta: "Gerber · Beech-Nut · Plum Organics" },
        { title: "Independent Brands That Sold to Big Food", meta: "Annie's · siggi's · Clif Bar · 12 brands" },
        { title: "Health Drinks vs. Energy Drinks: The Marketing Gap", meta: "Celsius · PRIME · Liquid IV · 6 brands" },
        { title: "Skimpflation: Same Packaging, Worse Ingredients", meta: "Reese's · Annie's · Smart Balance · 9 brands" },
      ].map((c, i) => (
        <div key={i} className="research-card">
          <div className="research-title">{c.title}</div>
          <div className="research-meta">{c.meta}</div>
        </div>
      ))}
    </div>
  );
}

const DEMO_BRANDS = Object.keys(BRANDS);

export default function App() {
  const [tab, setTab] = useState("home");
  const [selected, setSelected] = useState(null);
  const [demoIdx, setDemoIdx] = useState(0);
  const [contactOpen, setContactOpen] = useState(false);

  const openBrand = (b) => { setSelected(b); setTab("scan"); };
  const scanDemo  = (brand) => {
    const b = brand || DEMO_BRANDS[demoIdx];
    setSelected(b);
    if (!brand) setDemoIdx((demoIdx + 1) % DEMO_BRANDS.length);
    setTab("scan");
  };
  const dismiss = () => setSelected(null);

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <div className="topbar">
          <div className="topbar-logo" onClick={() => { setTab("home"); setSelected(null); }}
            style={{ cursor: "pointer" }}>
            <div className="logo-mark"><div className="logo-mark-inner" /></div>
            TRACED
          </div>
          <div className="topbar-right">
            <button className="contact-topbar-btn" onClick={() => setContactOpen(true)}>Contact</button>
            <button className="icon-btn"><Ico.Search /></button>
          </div>
        </div>

        <div className="screen">
          {tab === "home" && (
            <div>
              <div className="home-hero">
                <div className="home-tagline">What the label<br /><em>doesn't tell you.</em></div>
                <div className="home-sub">Find out what's actually in your food — who really owns the brand, what changed since they sold, and where to get the real thing.</div>
              </div>
              <button className="scan-hero-btn" onClick={() => scanDemo()}><Ico.Scan /> Scan a Product</button>
              <TrendingSection onBrand={openBrand} />
              <div className="section-head"><span className="section-label">Recently Scanned</span></div>
              {RECENT.map((r, i) => (
                <div key={i} className="recent-row" onClick={() => openBrand(r.brand)}>
                  <div className="recent-icon">{BRANDS[r.brand]?.emoji}</div>
                  <div className="recent-info">
                    <div className="recent-brand">{r.brand}</div>
                    <div className="recent-parent">{BRANDS[r.brand]?.parent}</div>
                  </div>
                  <div className="recent-dots">{r.dots.map((d, j) => <span key={j} className={`dot dot-${d}`} />)}</div>
                </div>
              ))}
            </div>
          )}
          {tab === "browse"   && <BrowseScreen onBrand={openBrand} />}
          {tab === "scan"     && <ScanScreen selected={selected} onDismiss={dismiss} onDemo={scanDemo} />}
          {tab === "research" && <ResearchScreen />}
        </div>

        {tab === "browse" && (
          <button className="fab" onClick={() => scanDemo()}><Ico.Scan /> Scan</button>
        )}

        <div className="bottom-nav">
          {[
            { id: "home",     label: "Home",     Icon: Ico.Home },
            { id: "browse",   label: "Browse",   Icon: Ico.Grid },
            { id: "scan",     label: "Scan",     Icon: Ico.Scan },
            { id: "local",    label: "Local",    Icon: Ico.Local },
            { id: "research", label: "Research", Icon: Ico.Research },
          ].map(({ id, label, Icon }) => (
            <button key={id} className={`nav-tab ${tab === id ? "active" : ""}`}
              onClick={() => {
                if (id === "local") { window.open("https://traced-local.vercel.app/", "_blank"); return; }
                setTab(id); if (id !== "scan") setSelected(null);
              }}>
              <Icon />{label}
            </button>
          ))}
        </div>
        {contactOpen && <ContactModal onClose={() => setContactOpen(false)} />}
      </div>
    </>
  );
}
