import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'app-brand-mark',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="brand">
      <div class="brand-mark" [style.width.px]="size()" [style.height.px]="size()">T</div>
      <div class="brand-text">
        <div class="b1">טורוז מיט</div>
        <div class="b2">{{ subtitle() }}</div>
      </div>
    </div>
  `,
  styles: [`
    .brand { display:flex;align-items:center;gap:14px; }
    .brand-mark {
      border-radius:50%;
      background:radial-gradient(circle at 30% 30%,var(--gold2),var(--gold) 50%,#6b4d18);
      display:flex;align-items:center;justify-content:center;
      font-weight:900;color:var(--dark);font-size:1.2rem;
      box-shadow:0 0 24px rgba(200,150,46,.3);
    }
    .brand-text { line-height:1.1; }
    .b1 { color:var(--gold);font-weight:900;font-size:1.05rem; }
    .b2 { color:var(--muted);font-size:.7rem;letter-spacing:.12em; }
  `],
})
export class BrandMarkComponent {
  readonly size = input(42);
  readonly subtitle = input('');
}
