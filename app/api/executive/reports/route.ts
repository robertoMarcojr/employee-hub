import { NextRequest, NextResponse } from 'next/server';
import { getAuthToken, verifyToken } from '@/lib/auth';

export async function GET() {
  try {
    const token = await getAuthToken();
    const payload = token ? verifyToken(token) : null;
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (payload.role !== 'admin' && payload.role !== 'executive') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const reports = [
      {
        id: '1',
        title: 'Q1 2026 Executive Summary',
        type: 'Quarterly',
        date: '2026-04-01',
        status: 'Final',
        pages: 12,
      },
      {
        id: '2',
        title: 'March 2026 Performance Review',
        type: 'Monthly',
        date: '2026-03-31',
        status: 'Final',
        pages: 8,
      },
      {
        id: '3',
        title: 'Weekly Sprint Report — W17',
        type: 'Weekly',
        date: '2026-04-28',
        status: 'Draft',
        pages: 3,
      },
      {
        id: '4',
        title: 'FY2026 Annual Strategic Plan',
        type: 'Annual',
        date: '2026-01-15',
        status: 'Final',
        pages: 45,
      },
      {
        id: '5',
        title: 'Q2 2026 Mid-Quarter Check',
        type: 'Quarterly',
        date: '2026-05-15',
        status: 'Draft',
        pages: 6,
      },
      {
        id: '6',
        title: 'April 2026 Financial Report',
        type: 'Monthly',
        date: '2026-05-01',
        status: 'Final',
        pages: 10,
      },
    ];

    return NextResponse.json(reports);
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
