// sample.ts - a small sample TypeScript file demonstrating basic language features

interface Greeting {
  message: string;
  times: number;
}

function greet({ message, times }: Greeting): string[] {
  const results: string[] = [];
  for (let i = 0; i < times; i++) {
    results.push(message);
  }
  return results;
}

const greeting: Greeting = {
  message: 'Hello, TypeScript!',
  times: 3,
};

console.log(greet(greeting).join('\n'));
