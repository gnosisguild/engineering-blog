import { ReactNode } from "react"
import Image from "next/image"

const Caption: React.FC<{ caption: ReactNode; children: ReactNode }> = ({
  caption,
  children,
}) => (
  <figure>
    {children}
    <figcaption>{caption}</figcaption>
  </figure>
)

export default Caption
