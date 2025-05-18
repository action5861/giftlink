'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Send, 
  Loader2,
  MessageSquare,
  User,
  RefreshCw
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

// 메시지 타입 정의
interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'ADMIN' | 'PARTNER';
  receiverId: string;
  receiverName: string;
  content: string;
  storyId: string | null;
  storyTitle: string | null;
  isRead: boolean;
  createdAt: Date;
}

// 대화 타입 정의
interface Conversation {
  id: string;
  lastMessage: Message;
  messages: Message[];
  partnerId: string;
  partnerName: string;
  storyId: string | null;
  storyTitle: string | null;
  hasUnread: boolean;
}

// 파트너 타입 정의
interface Partner {
  id: string;
  name: string;
}

// 임시 파트너 데이터
const mockPartners: Partner[] = [
  { id: 'p1', name: '굿네이버스' },
  { id: 'p2', name: '세이브더칠드런' },
  { id: 'p3', name: '유니세프' },
  { id: 'p4', name: '행복나눔재단' },
];

// 임시 메시지 데이터
const mockMessages: Message[] = [
  {
    id: 'm1',
    senderId: 'p1',
    senderName: '굿네이버스',
    senderRole: 'PARTNER',
    receiverId: 'admin1',
    receiverName: '관리자',
    content: '안녕하세요, 새로운 사연이 등록되었습니다.',
    storyId: 's1',
    storyTitle: '겨울을 따뜻하게 보내고 싶어요',
    isRead: false,
    createdAt: new Date('2023-12-15T09:32:00'),
  },
  {
    id: 'm2',
    senderId: 'admin1',
    senderName: '관리자',
    senderRole: 'ADMIN',
    receiverId: 'p1',
    receiverName: '굿네이버스',
    content: '네, 확인했습니다. 검토 후 연락드리겠습니다.',
    storyId: 's1',
    storyTitle: '겨울을 따뜻하게 보내고 싶어요',
    isRead: true,
    createdAt: new Date('2023-12-15T09:35:00'),
  },
  {
    id: 'm3',
    senderId: 'p2',
    senderName: '세이브더칠드런',
    senderRole: 'PARTNER',
    receiverId: 'admin1',
    receiverName: '관리자',
    content: '기부 현황 보고드립니다.',
    storyId: null,
    storyTitle: null,
    isRead: false,
    createdAt: new Date('2023-12-14T15:47:00'),
  },
];

// 메시지를 대화별로 그룹화하는 함수
const groupMessagesByConversation = (messages: Message[]): Conversation[] => {
  const conversations: Record<string, Conversation> = {};
  
  messages.forEach(message => {
    const key = message.storyId || `partner-${message.receiverId !== 'admin1' ? message.receiverId : message.senderId}`;
    
    if (!conversations[key]) {
      conversations[key] = {
        id: key,
        lastMessage: message,
        messages: [message],
        partnerId: message.receiverId !== 'admin1' ? message.receiverId : message.senderId,
        partnerName: message.receiverId !== 'admin1' ? message.receiverName : message.senderName,
        storyId: message.storyId,
        storyTitle: message.storyTitle,
        hasUnread: message.senderRole !== 'ADMIN' && !message.isRead,
      };
    } else {
      conversations[key].messages.push(message);
      
      if (new Date(message.createdAt) > new Date(conversations[key].lastMessage.createdAt)) {
        conversations[key].lastMessage = message;
      }
      
      if (message.senderRole !== 'ADMIN' && !message.isRead) {
        conversations[key].hasUnread = true;
      }
    }
  });
  
  return Object.values(conversations).sort((a, b) => 
    new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime()
  );
};

export default function MessagesPage() {
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // 메시지 데이터 로드
  useEffect(() => {
    loadMessages();
  }, []);
  
  // 메시지 목록이 업데이트될 때마다 스크롤을 맨 아래로 이동
  useEffect(() => {
    if (selectedConversation) {
      scrollToBottom();
    }
  }, [selectedConversation?.messages]);
  
  const loadMessages = () => {
    setLoading(true);
    
    // 실제 구현에서는 API 호출
    setTimeout(() => {
      const groupedConversations = groupMessagesByConversation(mockMessages);
      setConversations(groupedConversations);
      
      // 대화가 있으면 첫 번째 대화를 선택
      if (groupedConversations.length > 0) {
        setSelectedConversation(groupedConversations[0]);
      }
      
      setLoading(false);
    }, 500);
  };
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // 대화 선택 핸들러
  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    
    // 실제 구현에서는 읽음 상태 업데이트 API 호출
    if (conversation.hasUnread) {
      const updatedConversations = conversations.map(c => {
        if (c.id === conversation.id) {
          return { ...c, hasUnread: false };
        }
        return c;
      });
      setConversations(updatedConversations);
    }
  };
  
  // 메시지 전송 핸들러
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    setSending(true);
    
    // 새 메시지 데이터
    const messageData: Message = {
      id: `m${Date.now()}`,
      senderId: 'admin1',
      senderName: '관리자',
      senderRole: 'ADMIN',
      receiverId: selectedConversation ? selectedConversation.partnerId : selectedPartner,
      receiverName: selectedConversation ? selectedConversation.partnerName : mockPartners.find(p => p.id === selectedPartner)?.name || '',
      content: newMessage.trim(),
      storyId: selectedConversation?.storyId || null,
      storyTitle: selectedConversation?.storyTitle || null,
      isRead: false,
      createdAt: new Date(),
    };
    
    // 실제 구현에서는 API 호출
    setTimeout(() => {
      // 기존 대화에 메시지 추가
      if (selectedConversation) {
        const updatedMessages = [...selectedConversation.messages, messageData];
        const updatedConversation: Conversation = {
          ...selectedConversation,
          messages: updatedMessages,
          lastMessage: messageData,
        };
        
        // 대화 목록 업데이트
        const updatedConversations = conversations.map(c => 
          c.id === selectedConversation.id ? updatedConversation : c
        );
        
        setConversations(updatedConversations);
        setSelectedConversation(updatedConversation);
      } else if (selectedPartner) {
        // 새 대화 생성
        const newConversation: Conversation = {
          id: `partner-${selectedPartner}`,
          lastMessage: messageData,
          messages: [messageData],
          partnerId: selectedPartner,
          partnerName: mockPartners.find(p => p.id === selectedPartner)?.name || '',
          storyId: null,
          storyTitle: null,
          hasUnread: false,
        };
        
        // 대화 목록 업데이트
        const updatedConversations = [newConversation, ...conversations];
        setConversations(updatedConversations);
        setSelectedConversation(newConversation);
        setSelectedPartner('');
      }
      
      setNewMessage('');
      setSending(false);
      
      // 약간의 지연 후 스크롤 이동 (애니메이션 완료 후)
      setTimeout(scrollToBottom, 100);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">메시지 관리</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={loadMessages}>
            <RefreshCw className="h-4 w-4 mr-2" />
            새로고침
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-12 gap-6">
        {/* 대화 목록 */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle className="text-lg">대화 목록</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  className={`w-full p-3 rounded-lg text-left transition-colors ${
                    selectedConversation?.id === conversation.id
                      ? 'bg-primary/10 text-primary'
                      : 'hover:bg-slate-100'
                  }`}
                  onClick={() => handleSelectConversation(conversation)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <User className="h-5 w-5 text-slate-500" />
                      <span className="font-medium">{conversation.partnerName}</span>
                    </div>
                    {conversation.hasUnread && (
                      <Badge variant="secondary">새 메시지</Badge>
                    )}
                  </div>
                  <p className="text-sm text-slate-500 mt-1 truncate">
                    {conversation.lastMessage.content}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {formatDate(conversation.lastMessage.createdAt)}
                  </p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* 메시지 내용 */}
        <Card className="col-span-8">
          <CardHeader>
            <CardTitle className="text-lg">
              {selectedConversation ? (
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-slate-500" />
                  <span>{selectedConversation.partnerName}</span>
                  {selectedConversation.storyTitle && (
                    <Badge variant="outline" className="ml-2">
                      {selectedConversation.storyTitle}
                    </Badge>
                  )}
                </div>
              ) : (
                '대화를 선택해주세요'
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedConversation ? (
              <div className="flex flex-col h-[600px]">
                <ScrollArea className="flex-1 pr-4">
                  <div className="space-y-4">
                    {selectedConversation.messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.senderRole === 'ADMIN' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            message.senderRole === 'ADMIN'
                              ? 'bg-primary text-white'
                              : 'bg-slate-100'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className="text-xs mt-1 opacity-70">
                            {formatDate(message.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
                
                <div className="mt-4 flex space-x-2">
                  <Input
                    placeholder="메시지를 입력하세요..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={sending || !newMessage.trim()}
                  >
                    {sending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="h-[600px] flex items-center justify-center text-slate-500">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4" />
                  <p>대화를 선택하여 메시지를 확인하세요</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 