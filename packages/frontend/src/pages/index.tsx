import { Link } from "@/router";
import { Button } from "@chakra-ui/react";

export default function Home() {
  return (
    <>
      <h1>Home</h1>
      <Button>Button</Button>
      <Link to='/yobidashi'>yobidashi</Link>
      <Link to='/kitchen'>kitchen</Link>
      <Link to='/uketuke'>受付画面</Link>
    </>
  );
}
