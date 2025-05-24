import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from '@react-email/components';
import { Tailwind } from '@react-email/tailwind';

interface AdminMessageEmailProps {
  partnerName: string;
  message: string;
  adminName: string;
}

export default function AdminMessageEmail({
  partnerName,
  message,
  adminName,
}: AdminMessageEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>DigiSafe 관리자 메시지</Preview>
      <Tailwind>
        <Body className="bg-white font-sans">
          <Container className="mx-auto py-8 px-4">
            <Heading className="text-2xl font-bold text-gray-900 mb-4">
              DigiSafe 관리자 메시지
            </Heading>
            <Text className="text-gray-700 mb-4">
              안녕하세요, {partnerName}님.
            </Text>
            <Text className="text-gray-700 mb-4">
              DigiSafe 관리자 {adminName}님이 보낸 메시지입니다:
            </Text>
            <div className="bg-gray-50 p-4 rounded-md mb-4">
              <Text className="text-gray-700 whitespace-pre-wrap">
                {message}
              </Text>
            </div>
            <Text className="text-gray-500 text-sm">
              DigiSafe 관리팀 드림
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
} 