import * as React from 'react';
// import { Button, Input } from 'reactstrap';
import { GithubResolver, ResolverEngine, UriResolver, UrlParser } from "resolver-engine";
const { MDBInput, Button, FormInline } = require("mdbreact");

const resolver = new ResolverEngine<string>();
resolver
  .addResolver(GithubResolver())
  .addResolver(UriResolver())
  .addParser(UrlParser());

interface Props {
}

interface State {
  name: string;
  url: string;
  content: string;
}

export default class Content extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      name: "",
      url: "",
      content: ""
    };
  }

  handleSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const name = data.get("name") as string;

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

  };
  render() {
    return (
      <div className="Content">
        <form onSubmit={this.handleSubmitForm}>
        <FormInline className="md-form mr-auto">
          <MDBInput
            autoFocus
            placeholder="Name to resolve"
            id="name"
            name="name"
            value={this.state.name}
            onInput={(event: React.FormEvent<HTMLInputElement>) => {
              this.setState({ name: event.currentTarget.value });
            }}
          />
          <Button rounded size="sm" type="submit">
            RESOLVE
          </Button>
        </FormInline>
        </form>

        <div>{this.state.url}</div>

        <div>{this.state.content}</div>
      </div>
    );
  }
}
