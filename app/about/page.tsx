import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  Heart, 
  Search, 
  ShoppingBag, 
  Truck, 
  Shield, 
  Users,
  DollarSign,
  Eye,
  ArrowRight
} from 'lucide-react';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* 헤더 섹션 */}
        <section className="text-center mb-12 md:mb-16" aria-labelledby="about-title">
          <h1 id="about-title" className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 font-inter">
            <span className="text-[#0F52BA]">GiftLink</span>에 대하여
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto font-plus-jakarta">
            필요한 사람들과 직접 연결되는 1:1 생필품 기부 플랫폼,<br />
            작은 선물이 만드는 큰 변화를 경험하세요.
          </p>
        </section>

        {/* 미션 섹션 */}
        <section className="mb-16 md:mb-20" aria-labelledby="mission-title">
          <div className="bg-[#0F52BA]/5 rounded-2xl p-6 md:p-8 lg:p-12">
            <h2 id="mission-title" className="text-2xl md:text-3xl font-bold mb-6 text-center font-inter">우리의 미션</h2>
            <div className="max-w-3xl mx-auto space-y-4">
              <p className="text-base md:text-lg font-plus-jakarta">
                GiftLink는 도움이 필요한 이웃들에게 단순한 기부가 아닌 <strong>직접적이고 투명한 지원</strong>을 제공하기 위해 탄생했습니다.
              </p>
              <p className="text-base md:text-lg font-plus-jakarta">
                우리는 기존 기부 시스템의 복잡성과 불투명성을 해결하고, 실질적인 필요를 충족시키는 <strong>효율적이고 의미 있는</strong> 기부 방식을 만들고자 합니다.
              </p>
              <p className="text-base md:text-lg font-medium font-plus-jakarta">
                "모든 사람이 손쉽게 참여할 수 있는 투명한 기부 문화를 만듭니다."
              </p>
            </div>
          </div>
        </section>

        {/* 서비스 특징 섹션 */}
        <section className="mb-16 md:mb-20" aria-labelledby="features-title">
          <h2 id="features-title" className="text-2xl md:text-3xl font-bold mb-8 md:mb-12 text-center font-inter">GiftLink의 특별한 가치</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* 직접적인 도움 */}
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-[#0F52BA]/10 rounded-full flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 md:w-7 md:h-7 text-[#0F52BA]" aria-hidden="true" />
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-3 font-inter">직접적인 도움</h3>
              <p className="text-gray-600 font-plus-jakarta">
                현금 기부가 아닌 실제 필요한 물품을 직접 전달함으로써 실질적인 도움을 제공합니다. 쿠팡과의 파트너십을 통해 빠르고 정확하게 물품이 전달됩니다.
              </p>
            </div>
            
            {/* 완벽한 투명성 */}
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-[#0F52BA]/10 rounded-full flex items-center justify-center mb-4">
                <Eye className="w-6 h-6 md:w-7 md:h-7 text-[#0F52BA]" aria-hidden="true" />
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-3 font-inter">완벽한 투명성</h3>
              <p className="text-gray-600 font-plus-jakarta">
                기부자는 자신의 기부가 어떻게 사용되는지 확인할 수 있습니다. 물품 선택부터 배송 과정까지 모든 단계를 투명하게 확인하고 추적할 수 있습니다.
              </p>
            </div>
            
            {/* 검증된 신뢰성 */}
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-[#0F52BA]/10 rounded-full flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 md:w-7 md:h-7 text-[#0F52BA]" aria-hidden="true" />
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-3 font-inter">검증된 신뢰성</h3>
              <p className="text-gray-600 font-plus-jakarta">
                굿네이버스, 세이브더칠드런 등 신뢰할 수 있는 파트너 기관과 협력합니다. 모든 사연은 전문가의 검증을 거쳐 실제 도움이 필요한 분들에게 전달됩니다.
              </p>
            </div>
          </div>
        </section>

        {/* 작동 방식 섹션 */}
        <section className="mb-16 md:mb-20" aria-labelledby="how-it-works-title">
          <h2 id="how-it-works-title" className="text-2xl md:text-3xl font-bold mb-8 md:mb-12 text-center font-inter">
            GiftLink의 작동 방식
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {/* 단계 1 */}
            <div className="relative">
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 h-full">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-[#0F52BA] text-white rounded-full flex items-center justify-center mb-4 font-bold text-lg md:text-xl">
                  1
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-3 font-inter">사연 선택하기</h3>
                <p className="text-gray-600 font-plus-jakarta">
                  신뢰할 수 있는 파트너 기관에서 검증한 실제 도움이 필요한 분들의 사연을 확인하고 선택합니다.
                </p>
              </div>
              {/* 화살표(모바일에서는 숨김) */}
              <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                <ArrowRight className="text-gray-300 w-8 h-8" aria-hidden="true" />
              </div>
            </div>
            
            {/* 단계 2 */}
            <div className="relative">
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 h-full">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-[#0F52BA] text-white rounded-full flex items-center justify-center mb-4 font-bold text-lg md:text-xl">
                  2
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-3 font-inter">필수품 선택하기</h3>
                <p className="text-gray-600 font-plus-jakarta">
                  사연에 필요한 물품 중 예산에 맞게 선택하세요. 최소한의 금액으로도 의미 있는 기부가 가능합니다.
                </p>
              </div>
              {/* 화살표(모바일에서는 숨김) */}
              <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                <ArrowRight className="text-gray-300 w-8 h-8" aria-hidden="true" />
              </div>
            </div>
            
            {/* 단계 3 */}
            <div className="relative">
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 h-full">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-[#0F52BA] text-white rounded-full flex items-center justify-center mb-4 font-bold text-lg md:text-xl">
                  3
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-3 font-inter">직접 구매하기</h3>
                <p className="text-gray-600 font-plus-jakarta">
                  쿠팡을 통해 직접 물품을 구매하세요. 선택한 물품은 수혜자에게 직접 배송됩니다.
                </p>
              </div>
              {/* 화살표(모바일에서는 숨김) */}
              <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                <ArrowRight className="text-gray-300 w-8 h-8" aria-hidden="true" />
              </div>
            </div>
            
            {/* 단계 4 */}
            <div>
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 h-full">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-[#0F52BA] text-white rounded-full flex items-center justify-center mb-4 font-bold text-lg md:text-xl">
                  4
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-3 font-inter">연결 완료하기</h3>
                <p className="text-gray-600 font-plus-jakarta">
                  배송 상태를 실시간으로 확인하고, 수혜자로부터 감사 메시지를 받을 수 있습니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 신뢰할 수 있는 파트너십 섹션 */}
        <section className="mb-16 md:mb-20" aria-labelledby="partners-title">
          <h2 id="partners-title" className="text-2xl md:text-3xl font-bold mb-8 md:mb-12 text-center font-inter">
            신뢰할 수 있는 파트너십
          </h2>
          
          <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm">
            <div className="text-center mb-8 md:mb-10">
              <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto font-plus-jakarta">
                GiftLink는 검증된 사회복지 단체 및 기관과 협력하여 도움이 필요한 분들을 발굴하고 지원합니다.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              <div className="flex flex-col items-center p-6 bg-gray-50 rounded-xl">
                <div className="text-xl md:text-2xl font-bold text-[#0F52BA] mb-2 font-inter">굿네이버스</div>
                <p className="text-center text-gray-600 text-sm md:text-base font-plus-jakarta">
                  국내외 아동의 권리 보호와 복지 증진을 위해 활동하는 국제구호개발 NGO
                </p>
              </div>
              
              <div className="flex flex-col items-center p-6 bg-gray-50 rounded-xl">
                <div className="text-xl md:text-2xl font-bold text-[#4CAF50] mb-2 font-inter">세이브더칠드런</div>
                <p className="text-center text-gray-600 text-sm md:text-base font-plus-jakarta">
                  아동의 생존, 보호, 발달, 참여의 권리를 실현하기 위해 활동하는 국제 구호개발 NGO
                </p>
              </div>
              
              <div className="flex flex-col items-center p-6 bg-gray-50 rounded-xl">
                <div className="text-xl md:text-2xl font-bold text-[#FFD700] mb-2 font-inter">유니세프</div>
                <p className="text-center text-gray-600 text-sm md:text-base font-plus-jakarta">
                  전 세계 어린이의 생존, 보호, 발달을 위해 활동하는 유엔 산하 국제기구
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 쿠팡 파트너십 섹션 */}
        <section className="mb-16 md:mb-20" aria-labelledby="coupang-partnership-title">
          <div className="bg-gradient-to-br from-gray-50 to-[#0F52BA]/5 p-6 md:p-8 lg:p-12 rounded-xl">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-2/3 mb-8 md:mb-0 md:pr-8">
                <h2 id="coupang-partnership-title" className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 font-inter">쿠팡이 함께합니다</h2>
                <p className="text-base md:text-lg text-gray-700 mb-4 font-plus-jakarta">
                  GiftLink는 쿠팡과의 파트너십을 통해 빠르고 정확한 물품 전달 시스템을 구축했습니다.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Truck className="h-5 w-5 md:h-6 md:w-6 text-[#0F52BA] flex-shrink-0 mt-1 mr-3" aria-hidden="true" />
                    <p className="text-gray-600 font-plus-jakarta">
                      <strong>신속한 배송:</strong> 쿠팡의 빠른 물류 네트워크를 통해 필요한 물품을 빠르게 전달합니다.
                    </p>
                  </div>
                  <div className="flex items-start">
                    <ShoppingBag className="h-5 w-5 md:h-6 md:w-6 text-[#0F52BA] flex-shrink-0 mt-1 mr-3" aria-hidden="true" />
                    <p className="text-gray-600 font-plus-jakarta">
                      <strong>다양한 상품:</strong> 생필품부터 특별한 필요 물품까지 다양한 상품을 선택할 수 있습니다.
                    </p>
                  </div>
                  <div className="flex items-start">
                    <DollarSign className="h-5 w-5 md:h-6 md:w-6 text-[#0F52BA] flex-shrink-0 mt-1 mr-3" aria-hidden="true" />
                    <p className="text-gray-600 font-plus-jakarta">
                      <strong>합리적인 가격:</strong> 쿠팡의 경쟁력 있는 가격으로 더 많은 도움을 전할 수 있습니다.
                    </p>
                  </div>
                </div>
              </div>
              <div className="md:w-1/3 flex justify-center">
                <div className="w-40 h-40 md:w-48 md:h-48 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <div className="text-4xl md:text-5xl font-bold text-[#0F52BA] font-inter">쿠팡</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 자주 묻는 질문 */}
        <section className="mb-16 md:mb-20" aria-labelledby="faq-title">
          <h2 id="faq-title" className="text-2xl md:text-3xl font-bold mb-8 md:mb-12 text-center font-inter">
            자주 묻는 질문
          </h2>
          
          <div className="max-w-3xl mx-auto space-y-4 md:space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg md:text-xl font-bold mb-3 font-inter">GiftLink는 어떤 기관인가요?</h3>
              <p className="text-gray-600 font-plus-jakarta">
                GiftLink는 필요한 사람들과 직접 연결되는 1:1 생필품 기부 플랫폼입니다. 우리는 투명하고 직접적인 기부 문화를 만들어가는 사회적 기업입니다.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg md:text-xl font-bold mb-3 font-inter">어떻게 기부할 수 있나요?</h3>
              <p className="text-gray-600 font-plus-jakarta">
                사연 목록에서 도움이 필요한 분들의 이야기를 읽고, 필요한 물품을 선택하여 쿠팡을 통해 직접 구매하면 됩니다. 기부 과정은 간단하며 몇 분 안에 완료할 수 있습니다.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg md:text-xl font-bold mb-3 font-inter">기부금 영수증을 받을 수 있나요?</h3>
              <p className="text-gray-600 font-plus-jakarta">
                GiftLink를 통한 물품 구매는 직접적인 물품 구매이므로 일반적인 기부금 영수증은 발행되지 않습니다. 하지만 구매 영수증은 쿠팡을 통해 발급받을 수 있습니다.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg md:text-xl font-bold mb-3 font-inter">사연은 어떻게 선정되나요?</h3>
              <p className="text-gray-600 font-plus-jakarta">
                모든 사연은 굿네이버스, 세이브더칠드런, 유니세프 등 신뢰할 수 있는 파트너 기관의 전문가들이 검증하고 선정합니다. 철저한 검증 과정을 통해 실제 도움이 필요한 분들의 이야기만 소개됩니다.
              </p>
            </div>
          </div>
        </section>

        {/* CTA 섹션 */}
        <section className="text-center mb-12" aria-labelledby="cta-title">
          <h2 id="cta-title" className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 font-inter">지금 기부에 참여하세요</h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-6 md:mb-8 font-plus-jakarta">
            작은 선물이 누군가에게는 큰 변화가 될 수 있습니다.<br />
            지금 GiftLink와 함께 의미 있는 기부를 시작해보세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="px-8 h-12 md:h-14 text-base md:text-lg">
              <Link href="/stories">
                사연 둘러보기
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="px-8 h-12 md:h-14 text-base md:text-lg">
              <Link href="/auth/signup">
                회원가입하기
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
} 