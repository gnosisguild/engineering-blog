import React from "react";
import Link from "next/link";

export default function Nav({ navPages }) {
  return (
    <div className="nav-line">
      {navPages.map((page) => {
        if (page.active) {
          return (
            <span key={page.route} className="nav-link">
              {page.frontMatter.title || page.name}
            </span>
          );
        }
        return (
          <Link key={page.route} href={page.route}>
            {page.frontMatter.title || page.name}
          </Link>
        );
      })}
    </div>
  );
}
