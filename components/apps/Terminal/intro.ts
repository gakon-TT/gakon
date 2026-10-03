import { type LocalEcho } from "components/apps/Terminal/types";

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

export const PING_LINES = [
  "Connecting to gakon.dev:443 (warmup): from 42.116.229.237:54774: 5.12ms",
  "Connecting to gakon.dev:443: from 42.116.229.237:54775: 5.01ms",
  "Connecting to gakon.dev:443: from 42.116.229.237:54776: 4.67ms",
  "Connecting to gakon.dev:443: from 42.116.229.237:54777: 5.49ms",
  "Connecting to gakon.dev:443: from 42.116.229.237:54778: 5.65ms",
  "Connecting to gakon.dev:443: from 42.116.229.237:54779: 5.72ms",
  "Connecting to gakon.dev:443: from 42.116.229.237:54780: 5.86ms",
  "Connecting to gakon.dev:443: from 42.116.229.237:54781: 5.55ms",
  "Connecting to gakon.dev:443: from 42.116.229.237:54782: 6.19ms",
  "Connecting to gakon.dev:443: from 42.116.229.237:54783: 5.69ms",
  "Connecting to gakon.dev:443: from 42.116.229.237:54784: 6.06ms",
];

export const JSON_PROFILE_LINES = [
  "{",
  '  \u001B[36m"developer"\u001B[0m: {',
  '    \u001B[36m"name"\u001B[0m: \u001B[32m"Tai Tran"\u001B[0m,',
  '    \u001B[36m"nickname"\u001B[0m: \u001B[32m"Gakon"\u001B[0m,',
  '    \u001B[36m"nationality"\u001B[0m: \u001B[32m"Vietnamese"\u001B[0m,',
  '    \u001B[36m"location"\u001B[0m: \u001B[32m"Ho Chi Minh City, Vietnam"\u001B[0m,',
  '    \u001B[36m"status"\u001B[0m: \u001B[32m"Exploring New Technologies & Open to Collaboration"\u001B[0m',
  "  },",
  '  \u001B[36m"expertise"\u001B[0m: {',
  '    \u001B[36m"frontend_architecture"\u001B[0m: {',
  '      \u001B[36m"specialization"\u001B[0m: \u001B[32m"React, Next.js, Cyberpunk UI & Web Systems"\u001B[0m',
  "    },",
  '    \u001B[36m"infrastructure"\u001B[0m: {',
  '      \u001B[36m"role"\u001B[0m: \u001B[32m"System Administration & Server Operations"\u001B[0m,',
  '      \u001B[36m"experience"\u001B[0m: \u001B[32m"2+ Years"\u001B[0m',
  "    },",
  '    \u001B[36m"interactive_creation"\u001B[0m: {',
  '      \u001B[36m"service"\u001B[0m: \u001B[32m"FiveM Dev, Digital Creator & Bot Architect"\u001B[0m',
  "    }",
  "  },",
  '  \u001B[36m"websites"\u001B[0m: {',
  '    \u001B[36m"operating_system"\u001B[0m: {',
  '      \u001B[36m"url"\u001B[0m: \u001B[32m"http://gakon.dev"\u001B[0m,',
  '      \u001B[36m"description"\u001B[0m: \u001B[32m"Ga kon OS - macOS / Cyberpunk Desktop environment in the browser."\u001B[0m',
  '    }',
  '  },',
  '  \u001B[36m"portfolio"\u001B[0m: {',
  '    \u001B[36m"url"\u001B[0m: \u001B[32m"http://gakon.dev"\u001B[0m,',
  '    \u001B[36m"description"\u001B[0m: \u001B[32m"A personal web profile displaying my professional projects, system architectures, and technical expertise."\u001B[0m',
  '  },',
  '  \u001B[36m"socials"\u001B[0m: {',
  '    \u001B[36m"discord"\u001B[0m: \u001B[32m"https://discord.com/users/882230994499948625"\u001B[0m,',
  '    \u001B[36m"spotify"\u001B[0m: \u001B[32m"https://open.spotify.com/user/31hfwjh4pvtpsiz5wujs6fnkb4ai?si=79c4d27140014c82"\u001B[0m,',
  '    \u001B[36m"facebook"\u001B[0m: \u001B[32m"https://www.facebook.com/gak0nn"\u001B[0m,',
  '    \u001B[36m"steam"\u001B[0m: \u001B[32m"https://steamcommunity.com/profiles/76561199245171581/"\u001B[0m',
  '  },',
  '  \u001B[36m"contact"\u001B[0m: {',
  '    \u001B[36m"message"\u001B[0m: \u001B[32m"Open to networking, professional collaboration, or technical discussions. Feel free to connect via the links provided."\u001B[0m,',
  '    \u001B[36m"website"\u001B[0m: \u001B[32m"http://gakon.dev"\u001B[0m',
  '  }',
  "}",
];

export const colorizeJsonLine = (line: string): string =>
  line
    .replace(/^(\s*)"([^"]+)":/g, '$1\u001B[36m"$2"\u001B[0m:')
    .replace(/: ("[^"]*")/g, ': \u001B[32m$1\u001B[0m')
    .replace(/: (\d+|true|false|null)/g, ': \u001B[33m$1\u001B[0m');

export const fetchJsonProfileLines = async (): Promise<string[]> => {
  try {
    const res = await fetch(`/source.json?t=${Date.now()}`);
    if (res.ok) {
      const text = await res.text();
      return text.split(/\r?\n/).map(colorizeJsonLine);
    }
  } catch {
    // fallback
  }
  return JSON_PROFILE_LINES;
};

export const runPsPingSequence = async (
  printLn: (msg: string) => void,
  shouldCancel?: () => boolean
): Promise<void> => {
  printLn("\u001B[33m[System]\u001B[0m Handshake initiated from IP: 42.116.229.237");
  await sleep(180);
  if (shouldCancel?.()) return;

  printLn("\u001B[33m[System]\u001B[0m Securing connection to Ga kon's Portfolio Server...");
  await sleep(180);
  if (shouldCancel?.()) return;

  printLn("\u001B[33m[System]\u001B[0m Protocol: TLSv1.3 | Cipher: TLS_AES_256_GCM_SHA384");
  await sleep(180);
  if (shouldCancel?.()) return;

  printLn("\u001B[33m[System]\u001B[0m Port: 443 | Status: \u001B[32mCONNECTED\u001B[0m");
  printLn("");
  await sleep(220);
  if (shouldCancel?.()) return;

  printLn("PsPing v2.10 - PsPing - ping, latency, bandwidth measurement utility");
  printLn("Copyright (C) 2012-2016 Mark Russinovich");
  printLn("Sysinternals - www.sysinternals.com");
  printLn("");
  printLn("TCP connect to gakon.dev:443:");
  printLn("10 seconds (1 warmup pings) connecting test:");
  await sleep(250);
  if (shouldCancel?.()) return;

  for (const line of PING_LINES) {
    printLn(line);
    // eslint-disable-next-line no-await-in-loop
    await sleep(110);
    if (shouldCancel?.()) return;
  }

  printLn("");
  printLn("TCP connect statistics for gakon.dev:443:");
  printLn("  Sent = 10, Received = 10, Lost = 0 (0% loss),");
  printLn("  Minimum = 4.67ms, Maximum = 6.19ms, Average = 5.59ms");
  printLn("");
  printLn("\u001B[33m[System]\u001B[0m Connection fully optimized. Welcome to Ga kon's Space!");
};

export const runTerminalIntro = async (
  localEcho: LocalEcho,
  cdCurrent: string,
  onComplete: () => void,
  shouldCancel?: () => boolean
): Promise<void> => {
  await sleep(250);
  if (shouldCancel?.()) {
    onComplete();
    return;
  }

  // 1. Run psping
  localEcho.println(`\r\n${cdCurrent}>psping`);
  await sleep(200);
  if (shouldCancel?.()) {
    onComplete();
    return;
  }

  await runPsPingSequence((msg) => localEcho.println(msg), shouldCancel);
  if (shouldCancel?.()) {
    onComplete();
    return;
  }

  // 2. Run cat /source.json
  await sleep(400);
  if (shouldCancel?.()) {
    onComplete();
    return;
  }

  localEcho.println("\r\n\u001B[32m$\u001B[0m cat /source.json");
  await sleep(250);
  if (shouldCancel?.()) {
    onComplete();
    return;
  }

  const profileLines = await fetchJsonProfileLines();
  for (const jsonLine of profileLines) {
    localEcho.println(jsonLine);
    // eslint-disable-next-line no-await-in-loop
    await sleep(65);
    if (shouldCancel?.()) {
      onComplete();
      return;
    }
  }

  await sleep(250);
  onComplete();
};
