// src/components/auth/AuthModal.tsx
'use client';

import { useState } from 'react';
import { Dialog, Tab } from '@headlessui/react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile 
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Button } from "@/components/ui/button";
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  Phone,
  AlertCircle 
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { KakaoIcon, NaverIcon } from '@/components/icons';
import { motion, AnimatePresence } from 'framer-motion';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  email: string;
  password: string;
  name?: string;
  phone?: string;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState('login');
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    name: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
  
    try {
      const { email, password } = formData;
      await signInWithEmailAndPassword(auth, email, password);
      setLoading(false);  // 여기서 로딩 상태 해제
      onClose();
      router.push('/stories');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || '로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
      setLoading(false);  // 에러 발생 시에도 로딩 상태 해제
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
  
    try {
      const { email, password, name, phone } = formData;
      
      // 이메일 형식 검증
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('올바른 이메일 형식이 아닙니다.');
      }

      // 비밀번호 길이 검증
      if (password.length < 6) {
        throw new Error('비밀번호는 최소 6자 이상이어야 합니다.');
      }

      // Firebase Authentication으로 사용자 생성
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 사용자 프로필 업데이트
      if (name) {
        await updateProfile(user, {
          displayName: name
        });
      }

      // Firestore에 사용자 정보 저장
      await setDoc(doc(db, 'users', user.uid), {
        email,
        name,
        phone,
        createdAt: new Date().toISOString()
      });
  
      setLoading(false);  // 성공 시 로딩 상태 해제
      onClose();
      router.push('/stories');
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.message || '회원가입에 실패했습니다. 다시 시도해주세요.');
      setLoading(false);  // 에러 발생 시 로딩 상태 해제
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 }
  };

  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose}
      className="fixed inset-0 z-[60] overflow-y-auto"
    >
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-100/30 to-purple-100/30 backdrop-blur-sm" 
           aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel 
          as={motion.div}
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl relative overflow-hidden"
        >
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-2 rounded-full hover:bg-black/5 transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>

          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {activeTab === 'login' ? '다시 만나서 반가워요!' : '함께해요!'}
              </h2>
              <p className="text-sm text-gray-500 mt-2">
                {activeTab === 'login' 
                  ? '당신의 따뜻한 마음을 기다렸어요' 
                  : '투명한 기부로 따뜻한 변화를 만들어요'}
              </p>
            </div>

            <Tab.Group selectedIndex={activeTab === 'login' ? 0 : 1} 
                      onChange={index => setActiveTab(index === 0 ? 'login' : 'signup')}>
              <Tab.List className="flex space-x-1 p-1 mb-8 bg-gray-100/80 rounded-xl">
                <Tab
                  className={({ selected }) =>
                    `w-full py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                      selected
                        ? 'bg-white text-indigo-600 shadow'
                        : 'text-gray-600 hover:text-indigo-600 hover:bg-white/[0.12]'
                    }`
                  }
                >
                  로그인
                </Tab>
                <Tab
                  className={({ selected }) =>
                    `w-full py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                      selected
                        ? 'bg-white text-indigo-600 shadow'
                        : 'text-gray-600 hover:text-indigo-600 hover:bg-white/[0.12]'
                    }`
                  }
                >
                  회원가입
                </Tab>
              </Tab.List>

              <Tab.Panels>
                <Tab.Panel>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-4">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="block w-full pl-10 px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                          placeholder="이메일을 입력하세요"
                          required
                        />
                      </div>

                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="block w-full pl-10 px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                          placeholder="비밀번호를 입력하세요"
                          required
                        />
                      </div>

                      {error && (
                        <div className="flex items-center gap-2 text-red-500 text-sm">
                          <AlertCircle className="h-4 w-4" />
                          <p>{error}</p>
                        </div>
                      )}

                      <Button 
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg
                          hover:from-indigo-700 hover:to-purple-700 transform hover:scale-[1.02] transition-all
                          active:scale-[0.98]"
                      >
                        {loading ? '처리중...' : '로그인'}
                      </Button>
                    </div>
                  </form>
                </Tab.Panel>

                <Tab.Panel>
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-4">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="block w-full pl-10 px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                          placeholder="이메일을 입력하세요"
                          required
                        />
                      </div>

                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="block w-full pl-10 px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                          placeholder="비밀번호를 입력하세요"
                          required
                        />
                      </div>

                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="block w-full pl-10 px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                          placeholder="이름을 입력하세요"
                          required
                        />
                      </div>

                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="block w-full pl-10 px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                          placeholder="전화번호를 입력하세요"
                          required
                        />
                      </div>

                      {error && (
                        <div className="flex items-center gap-2 text-red-500 text-sm">
                          <AlertCircle className="h-4 w-4" />
                          <p>{error}</p>
                        </div>
                      )}

                      <Button 
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg
                          hover:from-indigo-700 hover:to-purple-700 transform hover:scale-[1.02] transition-all
                          active:scale-[0.98]"
                      >
                        {loading ? '처리중...' : '회원가입'}
                      </Button>
                    </div>
                  </form>
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>

            <div className="mt-8">
             <div className="relative">
               <div className="absolute inset-0 flex items-center">
                 <div className="w-full border-t border-gray-200" />
               </div>
               <div className="relative flex justify-center text-sm">
                 <span className="px-4 bg-white/80 text-gray-500">간편 로그인</span>
               </div>
             </div>

             <div className="mt-6 grid grid-cols-2 gap-4">
               <button 
                 type="button"
                 className="flex items-center justify-center px-4 py-3 border border-gray-200 rounded-lg
                   bg-[#FEE500] hover:bg-[#FEE500]/90 text-[#191919] font-medium transform hover:scale-[1.02] 
                   transition-all active:scale-[0.98]"
               >
                 <KakaoIcon />
                 <span className="ml-2">카카오 로그인</span>
               </button>
               <button 
                 type="button"
                 className="flex items-center justify-center px-4 py-3 border border-gray-200 rounded-lg
                   bg-[#03C75A] hover:bg-[#03C75A]/90 text-white font-medium transform hover:scale-[1.02]
                   transition-all active:scale-[0.98]"
               >
                 <NaverIcon />
                 <span className="ml-2">네이버 로그인</span>
               </button>
             </div>
           </div>
         </div>
       </Dialog.Panel>
     </div>
   </Dialog>
 );
}