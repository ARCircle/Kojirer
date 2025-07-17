import { Link } from '@/router';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Home</h1>
      <Button>Button</Button>
      <div className="space-y-2">
        <Link to='/yobidashi' className="block text-blue-600 hover:underline">yobidashi</Link>
        <Link to='/kitchen' className="block text-blue-600 hover:underline">kitchen</Link>
        <Link to='/uketuke' className="block text-blue-600 hover:underline">受付画面</Link>
      </div>
    </div>
  );
}
