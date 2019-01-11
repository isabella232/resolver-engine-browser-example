import React, { Component } from "react";
import { MDBInput, Button } from "mdbreact";
import {
  ResolverEngine,
  GithubResolver,
  UriResolver,
  UrlParser
} from "resolver-engine";
const resolver = new ResolverEngine();
resolver
  .addResolver(GithubResolver())
  .addResolver(UriResolver())
  .addParser(UrlParser());
export default class Content extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      url: "",
      content: ""
    };
  }

  handleSubmitForm = event => {
    event.preventDefault();
    const data = new FormData(event.target);

    const name = data.get("name");

    resolver
      .resolve(name)
      .then(value => {
        this.setState({ url: value });

        try {
          const url = new URL(value);
          resolver.require(url.href).then(content => {
            this.setState({ content: content });
          });
        } catch (err) {
          this.setState({ content: "Not a valid URL" });
        }
      })
      .catch(() => {
        this.setState({
          name: "",
          url: "",
          content: "Name resolved to nothing interesting"
        });
      });

    return false;
  };
  render() {
    return (
      <div className="Content">
        <form onSubmit={this.handleSubmitForm}>
          <MDBInput
            autoFocus
            id="name"
            name="name"
            value={this.name}
            label="Name to resolve"
            onInput={event => {
              this.setState({ name: event.target.value });
            }}
          />
          <Button rounded size="sm" type="submit">
            RESOLVE
          </Button>
        </form>

        <div>{this.state.url}</div>

        <div>{this.state.content}</div>
      </div>
    );
  }
}
