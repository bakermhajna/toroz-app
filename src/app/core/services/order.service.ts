import { Injectable, inject, signal, effect, OnDestroy } from '@angular/core';
import { Database, ref, onValue, push, update, remove, set, runTransaction } from '@angular/fire/database';
import { Order, OrderStatus } from '../models/order.model';

@Injectable({ providedIn: 'root' })
export class OrderService implements OnDestroy {
  private db = inject(Database);

  readonly todayOrders = signal<Order[]>([]);

  private unsubscribe: (() => void) | null = null;

  constructor() {
    this.startListener();
  }

  private startListener(): void {
    const ordersRef = ref(this.db, 'todayOrders');
    this.unsubscribe = onValue(ordersRef, snapshot => {
      if (!snapshot.exists()) {
        this.todayOrders.set([]);
        return;
      }
      const raw = snapshot.val() as Record<string, Omit<Order, 'id'>>;
      const orders: Order[] = Object.entries(raw).map(([id, data]) => ({ ...data, id }));
      orders.sort((a, b) => a.createdAt - b.createdAt);
      this.todayOrders.set(orders);
    });
  }

  async getNextOrderNum(): Promise<number> {
    const metaRef = ref(this.db, 'meta/lastOrderNum');
    let num = 200;
    await runTransaction(metaRef, current => {
      num = (current ?? 200) + 1;
      return num;
    });
    return num;
  }

  async addOrder(order: Omit<Order, 'id'>): Promise<string> {
    const newRef = push(ref(this.db, 'todayOrders'));
    await set(newRef, order);
    return newRef.key!;
  }

  async updateStatus(id: string, status: OrderStatus): Promise<void> {
    if (status === 'done') {
      await this.moveToDone(id);
      return;
    }
    await update(ref(this.db, `todayOrders/${id}`), { status, updatedAt: Date.now() });
  }

  async toggleLineDone(id: string, idx: number, value: boolean): Promise<void> {
    await update(ref(this.db, `todayOrders/${id}/lineDone`), { [idx]: value });
  }

  async cancelOrder(id: string): Promise<void> {
    await remove(ref(this.db, `todayOrders/${id}`));
  }

  private async moveToDone(id: string): Promise<void> {
    const order = this.todayOrders().find(o => o.id === id);
    if (!order) return;
    const { id: _, ...data } = order;
    await set(ref(this.db, `doneOrders/${id}`), { ...data, status: 'done', updatedAt: Date.now() });
    await remove(ref(this.db, `todayOrders/${id}`));
  }

  ngOnDestroy(): void {
    this.unsubscribe?.();
  }
}
