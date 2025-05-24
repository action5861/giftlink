import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { prisma } from '../lib/prisma';
import { hash } from 'bcryptjs';
import { getServerSession } from 'next-auth';
import { authOptions } from '../lib/auth';

describe('Partner Invite API', () => {
  beforeAll(async () => {
    // 관리자 계정 생성
    const adminPassword = await hash('admin123', 10);
    await prisma.user.create({
      data: {
        name: 'Admin',
        email: 'admin@example.com',
        password: adminPassword,
        role: 'ADMIN',
      },
    });
  });

  afterAll(async () => {
    // 테스트 데이터 정리
    await prisma.user.deleteMany({
      where: {
        email: 'admin@example.com',
      },
    });
    await prisma.partner.deleteMany({
      where: {
        email: 'test@example.com',
      },
    });
  });

  it('should invite a new partner', async () => {
    const response = await fetch('http://localhost:3000/api/admin/partners/invite', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: '테스트 기관',
        email: 'test@example.com',
        contactPerson: '홍길동',
        phoneNumber: '010-1234-5678',
      }),
      credentials: 'include',
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.name).toBe('테스트 기관');
    expect(data.email).toBe('test@example.com');
    expect(data.contactPerson).toBe('홍길동');
    expect(data.phoneNumber).toBe('010-1234-5678');
    expect(data.isVerified).toBe(false);
  });

  it('should not invite a partner with existing email', async () => {
    const response = await fetch('http://localhost:3000/api/admin/partners/invite', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: '테스트 기관 2',
        email: 'test@example.com',
        contactPerson: '김철수',
        phoneNumber: '010-8765-4321',
      }),
      credentials: 'include',
    });

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('Email already registered');
  });
}); 