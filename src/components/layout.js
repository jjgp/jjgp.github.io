import React from "react"
import { Link } from "gatsby"

import { rhythm, scale } from "../utils/typography"

class Layout extends React.Component {
  renderHeader = () => (
    <h1
      style={{
        ...scale(0.75),
        marginBottom: rhythm(1.5),
        marginTop: 0,
      }}
    >
      <Link
        style={{
          boxShadow: `none`,
          textDecoration: `none`,
          color: `inherit`,
        }}
        to={`/`}
      >
        {this.props.title}
      </Link>
    </h1>
  )

  render() {
    const { children } = this.props

    return (
      <div
        style={{
          marginLeft: `auto`,
          marginRight: `auto`,
          maxWidth: rhythm(24),
          padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
        }}
      >
        <header>{this.renderHeader()}</header>
        <main>{children}</main>
      </div>
    )
  }
}

export default Layout
