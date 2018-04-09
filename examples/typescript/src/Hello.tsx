import * as React from "react";

interface Props {
  name: string;
}

export default ({ name }: Props) => <h1>Hello {name}!</h1>;
