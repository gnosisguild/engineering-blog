import React from "react"

export default function getTitle(
  children
): [React.ReactElement | null, React.ReactNode[]] {
  const nodes = React.Children.toArray(children)

  const titleEl = nodes.find(
    (child: React.ReactElement) => child.props.mdxType === "h1"
  )
  return [
    (titleEl as React.ReactElement) || null,
    nodes.filter((node) => node !== titleEl),
  ]
}
