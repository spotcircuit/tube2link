import { NextResponse } from 'next/server';

// In-memory store for process status
const processStatus = new Map<string, {
  steps: string[];
  completed: boolean;
}>();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing process ID' }, { status: 400 });
  }

  const status = processStatus.get(id) || { steps: [], completed: false };
  return NextResponse.json(status);
}

export async function POST(request: Request) {
  const { id, step } = await request.json();

  if (!id || !step) {
    return NextResponse.json({ error: 'Missing id or step' }, { status: 400 });
  }

  if (!processStatus.has(id)) {
    processStatus.set(id, { steps: [], completed: false });
  }
  const status = processStatus.get(id)!;
  status.steps.push(step);

  return NextResponse.json({ success: true });
}
