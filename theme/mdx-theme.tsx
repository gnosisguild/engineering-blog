import ReactDOMServer from "react-dom/server"
import { MDXProvider } from "@mdx-js/react"
import slugify from "@sindresorhus/slugify"
import Link from "next/link"
import React from "react"
import { Highlight } from "prism-react-renderer"
import styles from "./theme.module.css"

// Anchor links

const HeaderLink = ({ tag: Tag, children, ...props }) => {
  const slug = slugify(ReactDOMServer.renderToStaticMarkup(children))
  return (
    <Tag {...props}>
      <span className="subheading-anchor" id={slug} />
      <a href={"#" + slug} className="subheading">
        {children}
        <span className="anchor-icon" aria-hidden>
          #
        </span>
      </a>
    </Tag>
  )
}

const H2 = ({ children, ...props }) => {
  return (
    <HeaderLink tag="h2" {...props}>
      {children}
    </HeaderLink>
  )
}

const H3 = ({ children, ...props }) => {
  return (
    <HeaderLink tag="h3" {...props}>
      {children}
    </HeaderLink>
  )
}

const H4 = ({ children, ...props }) => {
  return (
    <HeaderLink tag="h4" {...props}>
      {children}
    </HeaderLink>
  )
}

const H5 = ({ children, ...props }) => {
  return (
    <HeaderLink tag="h5" {...props}>
      {children}
    </HeaderLink>
  )
}

const H6 = ({ children, ...props }) => {
  return (
    <HeaderLink tag="h6" {...props}>
      {children}
    </HeaderLink>
  )
}

const A = ({ children, ...props }) => {
  const isExternal = props.href && props.href.startsWith("https://")
  if (isExternal) {
    return (
      <a target="_blank" {...props}>
        {children}
      </a>
    )
  }
  return (
    <Link href={props.href} {...props}>
      {children}
    </Link>
  )
}

const Code = ({ children, className, highlight, ...props }) => {
  console.log("code", children, className, highlight)
  if (!className) return <code {...props}>{children}</code>
  const highlightedLines = highlight ? highlight.split(",").map(Number) : []

  // https://mdxjs.com/guides/syntax-highlighting#all-together
  const language = className.replace(/language-/, "")
  return (
    <div className={styles.codeContainer}>
      <Highlight code={children.trim()} language={language}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <code className={className} style={{ ...style }}>
            {tokens.map((line, i) => (
              <div
                key={i}
                {...getLineProps({ line, key: i })}
                style={
                  highlightedLines.includes(i + 1)
                    ? {
                        background: "#cce0f5",
                        margin: "0 -1rem",
                        padding: "0 1rem",
                      }
                    : null
                }
              >
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token, key })} />
                ))}
              </div>
            ))}
          </code>
        )}
      </Highlight>
    </div>
  )
}

const components = {
  h2: H2,
  h3: H3,
  h4: H4,
  h5: H5,
  h6: H6,
  a: A,
  code: Code,
}

export default ({ children }) => {
  return <MDXProvider components={components}>{children}</MDXProvider>
}
