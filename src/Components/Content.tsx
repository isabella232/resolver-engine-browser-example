import * as React from 'react';
// import { Button, Input } from 'reactstrap';
import { GithubResolver, ResolverEngine, UriResolver, UrlParser } from "resolver-engine";
const { MDBInput, MDBContainer, MDBJumbotron, Button, FormInline } = require("mdbreact");

const resolver = new ResolverEngine<string>({debug: true});
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

    this.setState({
      content: "",
      url: "",
    })
    const data = new FormData(event.target as any);

    const name = data.get("name") as string;

    resolver
      .resolve(name)
      .then(value => {
        console.log("Resolved to", value)
        this.setState({ url: value });

        try {
          const url = new URL(value);
          resolver.require(url.href).then(content => {
            this.setState({ content: content });
          }).catch(err => {
            this.setState({content: "Nothing found at given location"})
          });
        } catch (err) {
          this.setState({ content: "Unexpected error while resolving" });
        }
      })
      .catch((err) => {
        console.error(err);
        this.setState({
          name: "",
          url: "",
          content: "Name resolved to nothing particularly interesting"
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
            className="ResolveBar"
            containerClass="mt-0 mb-3"
          />
          <Button rounded size="sm" type="submit">
            RESOLVE
          </Button>
        </FormInline>
        </form>

        {!!this.state.url || !!this.state.content ?
        <div className="Results">
        {!!this.state.url ? <MDBContainer><pre>{this.state.url}</pre></MDBContainer> : null}

        {!!this.state.content ? <MDBContainer><MDBJumbotron><pre>{this.state.content}</pre></MDBJumbotron></MDBContainer> : null}
        </div> : null}

      </div>
    );
  }
}
