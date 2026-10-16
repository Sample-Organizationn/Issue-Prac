// Sample TypeScript file

interface Greeting {
  message: string;
}

function greet(name: string): Greeting {
  return { message: `Hello, ${name}!` };
}

const result: Greeting = greet('World');
console.log(result.message);
