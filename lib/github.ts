import "server-only";

export type ContributionDay = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 };

export type GitHubStats = {
  publicRepos: number;
  followers: number;
  totalStars: number;
  totalContributions: number | null;
  languages: { name: string; count: number }[];
  weeks: ContributionDay[][];
  topRepos: {
    name: string;
    description: string | null;
    url: string;
    stars: number;
    language: string | null;
  }[];
};

const REVALIDATE = 60 * 60; // 1 hour

type Repo = {
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  fork: boolean;
  pushed_at: string;
};

function headers(): HeadersInit {
  const h: Record<string, string> = { Accept: "application/vnd.github+json" };
  if (process.env.GITHUB_TOKEN) h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return h;
}

const LEVELS = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
} as const;

async function fetchContributions(username: string) {
  if (!process.env.GITHUB_TOKEN) return null;
  const query = `query($login:String!){user(login:$login){contributionsCollection{contributionCalendar{totalContributions weeks{contributionDays{date contributionCount contributionLevel}}}}}}`;
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ query, variables: { login: username } }),
    next: { revalidate: REVALIDATE },
  });
  if (!res.ok) return null;
  const json = await res.json();
  const cal = json?.data?.user?.contributionsCollection?.contributionCalendar;
  if (!cal) return null;
  return {
    total: cal.totalContributions as number,
    weeks: (
      cal.weeks as {
        contributionDays: {
          date: string;
          contributionCount: number;
          contributionLevel: keyof typeof LEVELS;
        }[];
      }[]
    ).map((w) =>
      w.contributionDays.map((d) => ({
        date: d.date,
        count: d.contributionCount,
        level: LEVELS[d.contributionLevel] ?? 0,
      })),
    ),
  };
}

export async function getGitHubStats(username: string): Promise<GitHubStats | null> {
  try {
    const [userRes, reposRes, contributions] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`, {
        headers: headers(),
        next: { revalidate: REVALIDATE },
      }),
      fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=pushed`, {
        headers: headers(),
        next: { revalidate: REVALIDATE },
      }),
      fetchContributions(username),
    ]);
    if (!userRes.ok || !reposRes.ok) return null;

    const user = await userRes.json();
    const repos = ((await reposRes.json()) as Repo[]).filter((r) => !r.fork);

    const langCounts = new Map<string, number>();
    for (const r of repos) {
      if (r.language) langCounts.set(r.language, (langCounts.get(r.language) ?? 0) + 1);
    }

    return {
      publicRepos: user.public_repos ?? repos.length,
      followers: user.followers ?? 0,
      totalStars: repos.reduce((s, r) => s + r.stargazers_count, 0),
      totalContributions: contributions?.total ?? null,
      weeks: contributions?.weeks ?? [],
      languages: [...langCounts.entries()]
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count),
      topRepos: repos
        .filter((r) => r.language && r.name.toLowerCase() !== "skills")
        .sort(
          (a, b) =>
            b.stargazers_count - a.stargazers_count ||
            +new Date(b.pushed_at) - +new Date(a.pushed_at),
        )
        .slice(0, 4)
        .map((r) => ({
          name: r.name,
          description: r.description,
          url: r.html_url,
          stars: r.stargazers_count,
          language: r.language,
        })),
    };
  } catch {
    return null;
  }
}
