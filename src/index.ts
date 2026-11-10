import { CliRouter } from './cli/router.js';

export async function main(): Promise<void> {
  const router = new CliRouter();
  const args = process.argv.slice(2);
  await router.run(args);
}

// Execute immediately when invoked directly
main().catch((err: unknown) => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});
