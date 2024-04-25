import React from "react";
import Link from "next/link";
import styles from "./theme.module.css";

export default function Meta({ author, date, tag, back }) {
  const authorNode = author ? author : null;
  const dateNode = date ? <time>{new Date(date).toDateString()}</time> : null;
  const tags = tag ? tag.split(",").map((s) => s.trim()) : [];

  return (
    <div className="meta-line">
      <div className="meta">
        <div className={styles.author}>{authorNode}</div>
        <div className={styles.date}>{dateNode}</div>
        <div className={styles.tagContainer}>
          {tags.map((t) => {
            return (
              <Link
                key={t}
                href="/tags/[tag]"
                as={`/tags/${t}`}
                className={styles.tag}
              >
                {t}
              </Link>
            );
          })}
        </div>
      </div>
      {back ? <Link href={back}>Back</Link> : null}
    </div>
  );
}
