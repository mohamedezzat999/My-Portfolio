const githubUsername = "mohamedezzat999";

const curatedDescriptions = {
  LedgerSystem:
    "A backend-focused ledger system project centered on structured business logic, transaction flows, and reliable API design.",
  "User-Management-API-CRUD":
    "A user management API project covering CRUD operations, service layering, and clean backend structure.",
  "jwt-spring-security-project":
    "JWT authentication with Spring Boot 3 and Spring Security 6, including registration, login, and secured API access.",
  "keycloak-extensions-demo":
    "A hands-on Keycloak customization repository aligned with enterprise IAM and authentication work.",
  MyApplication:
    "An earlier application project that reflects full-stack fundamentals and hands-on software engineering practice.",
  SpringExamples:
    "Spring-oriented example work exploring backend patterns, APIs, and framework usage.",
  "e-commerce":
    "An e-commerce practice project covering application structure and common business workflows.",
};

const hiddenRepos = new Set([
  "unit-testing",
  "firstProject",
  "InfluxDB",
  "InfluxDB Data Access",
  "getDataFromInfluxDB",
].map((name) => name.toLowerCase()));

const prioritizedRepos = [
  "LedgerSystem",
  "User-Management-API-CRUD",
  "jwt-spring-security-project",
  "keycloak-extensions-demo",
  "MyApplication",
  "SpringExamples",
];

function formatDate(dateString) {
  if (!dateString) return "No recent activity";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

function buildRepoCard(repo) {
  const card = document.createElement("article");
  card.className = "repo-card";

  const description =
    curatedDescriptions[repo.name] ||
    repo.description ||
    "Public repository on GitHub covering backend development, experimentation, or technical learning.";

  const language = repo.language ? `<span>${repo.language}</span>` : "";
  const stars = typeof repo.stargazers_count === "number" ? `<span>${repo.stargazers_count} stars</span>` : "";

  card.innerHTML = `
    <h3>${repo.name}</h3>
    <p>${description}</p>
    <div class="repo-meta">
      ${language}
      ${stars}
      <span>Updated ${formatDate(repo.pushed_at)}</span>
    </div>
    <div class="repo-links">
      <a href="${repo.html_url}" target="_blank" rel="noreferrer">Repository</a>
      ${
        repo.homepage
          ? `<a href="${repo.homepage}" target="_blank" rel="noreferrer">Live Link</a>`
          : ""
      }
    </div>
  `;

  return card;
}

async function loadRepos() {
  const repoGrid = document.getElementById("repo-grid");

  try {
    const response = await fetch(
      `https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=100`
    );

    if (!response.ok) {
      throw new Error("GitHub request failed");
    }

    const repos = await response.json();
    const repoMap = new Map(
      repos
        .filter((repo) => !repo.fork && !hiddenRepos.has(repo.name.toLowerCase()))
        .map((repo) => [repo.name.toLowerCase(), repo])
    );

    const prioritized = prioritizedRepos
      .map((name) => repoMap.get(name.toLowerCase()))
      .filter(Boolean);

    const remaining = Array.from(repoMap.values())
      .filter(
        (repo) =>
          !prioritizedRepos.some(
            (name) => name.toLowerCase() === repo.name.toLowerCase()
          )
      )
      .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at));

    const filtered = [...prioritized, ...remaining].slice(0, 6);

    repoGrid.innerHTML = "";

    if (!filtered.length) {
      repoGrid.innerHTML =
        '<p class="repo-status">No public repositories are available to display right now.</p>';
      return;
    }

    filtered.forEach((repo) => {
      repoGrid.appendChild(buildRepoCard(repo));
    });
  } catch (error) {
    repoGrid.innerHTML =
      '<p class="repo-status">GitHub projects could not be loaded automatically. The featured repositories above are still available to explore.</p>';
  }
}

loadRepos();
