import { FaGithub, FaLinkedin } from "react-icons/fa";
import { SiCodechef, SiGeeksforgeeks, SiLeetcode } from "react-icons/si";
import type { SocialLink } from "@/types";

export const socials: SocialLink[] = [
  { name: "GitHub", href: "https://github.com/Mdsaddam0786", icon: FaGithub },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/md-saddam-800b28206/",
    icon: FaLinkedin,
  },
  {
    name: "LeetCode",
    href: "https://leetcode.com/u/Saddamcoder/",
    icon: SiLeetcode,
  },
  {
    name: "GeeksforGeeks",
    href: "https://www.geeksforgeeks.org/profile/mmdh7qicg?tab=activity",
    icon: SiGeeksforgeeks,
  },
  {
    name: "CodeChef",
    href: "https://www.codechef.com/rankings/START215A?itemsPerPage=100&order=asc&page=1&sortBy=rank",
    icon: SiCodechef,
  },
];
