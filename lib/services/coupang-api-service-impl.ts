import { CoupangApiService, OrderProduct, CoupangOrderStatus } from '../types';
import axios from 'axios';
import crypto from 'crypto';

export class CoupangApiServiceImpl implements CoupangApiService {
  private apiKey: string;
  private secretKey: string;
  private baseUrl: string;

  constructor(apiKey: string, secretKey: string, baseUrl: string) {
    this.apiKey = apiKey;
    this.secretKey = secretKey;
    this.baseUrl = baseUrl;
  }

  /**
   * 상품 주문
   */
  async placeOrder(products: OrderProduct[], shippingInfo: any): Promise<{ orderId: string }> {
    try {
      const url = `${this.baseUrl}/orders`;
      const timestamp = Date.now().toString();
      
      const requestBody = {
        products: products.map(p => ({
          productId: p.productId,
          productName: p.productName,
          quantity: p.quantity,
          unitPrice: p.unitPrice
        })),
        shipping: {
          recipientName: shippingInfo.recipientName,
          address: shippingInfo.address,
          phone: shippingInfo.phone,
          message: shippingInfo.message
        }
      };
      
      const signature = this.generateSignature('POST', '/orders', timestamp);
      
      const response = await axios.post(url, requestBody, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.apiKey,
          'Signature': signature,
          'Timestamp': timestamp
        }
      });
      
      if (response.status !== 200) {
        throw new Error(`쿠팡 API 오류: ${response.statusText}`);
      }
      
      return { orderId: response.data.orderId };
    } catch (error) {
      console.error('쿠팡 주문 API 호출 중 오류:', error);
      throw new Error(`쿠팡 주문 생성 실패: ${(error as Error).message}`);
    }
  }

  /**
   * 주문 상태 조회
   */
  async getOrderStatus(coupangOrderId: string): Promise<CoupangOrderStatus> {
    try {
      const url = `${this.baseUrl}/orders/${coupangOrderId}/status`;
      const timestamp = Date.now().toString();
      const signature = this.generateSignature('GET', `/orders/${coupangOrderId}/status`, timestamp);
      
      const response = await axios.get(url, {
        headers: {
          'Authorization': this.apiKey,
          'Signature': signature,
          'Timestamp': timestamp
        }
      });
      
      if (response.status !== 200) {
        throw new Error(`쿠팡 API 오류: ${response.statusText}`);
      }
      
      return response.data.status as CoupangOrderStatus;
    } catch (error) {
      console.error('쿠팡 주문 상태 조회 API 호출 중 오류:', error);
      throw new Error(`쿠팡 주문 상태 조회 실패: ${(error as Error).message}`);
    }
  }

  /**
   * 배송 추적 조회
   */
  async getTrackingInfo(coupangOrderId: string): Promise<{ trackingNumber: string, status: string }> {
    try {
      const url = `${this.baseUrl}/orders/${coupangOrderId}/tracking`;
      const timestamp = Date.now().toString();
      const signature = this.generateSignature('GET', `/orders/${coupangOrderId}/tracking`, timestamp);
      
      const response = await axios.get(url, {
        headers: {
          'Authorization': this.apiKey,
          'Signature': signature,
          'Timestamp': timestamp
        }
      });
      
      if (response.status !== 200) {
        throw new Error(`쿠팡 API 오류: ${response.statusText}`);
      }
      
      return {
        trackingNumber: response.data.trackingNumber,
        status: response.data.status
      };
    } catch (error) {
      console.error('쿠팡 배송 추적 API 호출 중 오류:', error);
      throw new Error(`쿠팡 배송 추적 조회 실패: ${(error as Error).message}`);
    }
  }

  /**
   * 주문 취소
   */
  async cancelOrder(coupangOrderId: string): Promise<boolean> {
    try {
      const url = `${this.baseUrl}/orders/${coupangOrderId}/cancel`;
      const timestamp = Date.now().toString();
      const signature = this.generateSignature('POST', `/orders/${coupangOrderId}/cancel`, timestamp);
      
      const response = await axios.post(url, {}, {
        headers: {
          'Authorization': this.apiKey,
          'Signature': signature,
          'Timestamp': timestamp
        }
      });
      
      if (response.status !== 200) {
        throw new Error(`쿠팡 API 오류: ${response.statusText}`);
      }
      
      return response.data.success;
    } catch (error) {
      console.error('쿠팡 주문 취소 API 호출 중 오류:', error);
      throw new Error(`쿠팡 주문 취소 실패: ${(error as Error).message}`);
    }
  }

  /**
   * API 요청 서명 생성
   */
  private generateSignature(method: string, path: string, timestamp: string): string {
    const message = `${method}\n${path}\n${timestamp}`;
    const hmac = crypto.createHmac('sha256', this.secretKey);
    hmac.update(message);
    return hmac.digest('hex');
  }
} 