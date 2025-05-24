import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
} from '@react-email/components';
import { Tailwind } from '@react-email/tailwind';

interface PartnerInviteEmailProps {
  partnerName: string;
  contactPerson: string;
  inviteLink: string;
}

export default function PartnerInviteEmail({
  partnerName,
  contactPerson,
  inviteLink,
}: PartnerInviteEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>DigiSafe 파트너 초대</Preview>
      <Tailwind>
        <Body className="bg-white font-sans">
          <Container className="mx-auto py-8 px-4">
            <Heading className="text-2xl font-bold text-gray-900 mb-4">
              DigiSafe 파트너 초대
            </Heading>
            <Text className="text-gray-700 mb-4">
              안녕하세요, {contactPerson}님.
            </Text>
            <Text className="text-gray-700 mb-4">
              {partnerName}이(가) DigiSafe의 파트너로 초대되었습니다.
              아래 링크를 통해 계정을 생성하고 서비스를 이용하실 수 있습니다.
            </Text>
            <Link
              href={inviteLink}
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md font-medium"
            >
              계정 생성하기
            </Link>
            <Text className="text-gray-500 text-sm mt-4">
              이 링크는 24시간 동안 유효합니다.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
} 