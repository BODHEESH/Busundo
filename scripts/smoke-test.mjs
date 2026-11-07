// Smoke test for a deployed environment.
// Usage: BASE_URL=https://your-staging-url node scripts/smoke-test.mjs
// Read-only: it never creates data.

const base = (process.env.BASE_URL || "http://localhost:3000").replace(/\/$/, "");
let failures = 0;

async function check(name, path, { method = "GET", body, expect }) {
  try {
    const res = await fetch(base + path, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      redirect: "manual",
    });
    const ok = expect(res.status);
    console.log(`${ok ? "PASS" : "FAIL"}  ${name}  (${method} ${path} -> ${res.status})`);
    if (!ok) failures++;
    return res;
  } catch (err) {
    console.log(`FAIL  ${name}  (${err.message})`);
    failures++;
  }
}

await check("health endpoint reports database ok", "/api/health", { expect: (s) => s === 200 });

const search = await check("search returns JSON", "/api/search?from=Sakthan&to=Ollur", { expect: (s) => s === 200 });
if (search) {
  const data = await search.json().catch(() => null);
  const shaped = data && Array.isArray(data.directRoutes);
  console.log(`${shaped ? "PASS" : "FAIL"}  search response has directRoutes`);
  if (!shaped) failures++;
}

await check("admin review list needs sign-in", "/api/admin/review/routes", {
  expect: (s) => s === 401 || s === 403 || s === 307 || s === 302,
});
await check("route submission needs sign-in", "/api/contribute/routes", {
  method: "POST",
  body: { routeName: "x", district: "Thrissur", stops: "a\nb" },
  expect: (s) => s === 401,
});
await check("test-db hidden on this host", "/api/test-db", {
  expect: (s) => s === 404 || s === 403 || s === 307 || s === 302,
});

console.log(failures === 0 ? "\nAll checks passed." : `\n${failures} check(s) failed.`);
process.exit(failures === 0 ? 0 : 1);
