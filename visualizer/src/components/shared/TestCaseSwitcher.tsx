export interface TestCase<T = unknown> {
  id: string;
  name: string;
  data?: T;
}

interface TestCaseSwitcherProps {
  testCases: TestCase<any>[];
  currentIndex: number;
  onChange: (index: number) => void;
}

export default function TestCaseSwitcher({
  testCases,
  currentIndex,
  onChange,
}: TestCaseSwitcherProps) {
  return (
    <div className="flex items-center gap-2 ml-6">
      <span className="text-sm font-medium text-muted-foreground">Test Case:</span>
      <select
        className="bg-card border border-border text-foreground text-sm rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer shadow-sm hover:border-gray-500 transition-colors"
        value={currentIndex}
        onChange={(e) => onChange(Number(e.target.value))}
      >
        {testCases.map((tc, i) => (
          <option key={tc.id} value={i}>
            {tc.name}
          </option>
        ))}
      </select>
    </div>
  );
}
