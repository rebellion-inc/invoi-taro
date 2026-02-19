"""
請求受取太郎 サービス資料 PDF スライド生成スクリプト (v2)
Usage: python scripts/generate_slides.py
Output: docs/請求受取太郎_サービス資料.pdf
"""

from reportlab.lib.pagesizes import landscape, A4
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor, white, Color
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.cidfonts import UnicodeCIDFont
import os

# ─── Fonts ────────────────────────────────────────────────────
pdfmetrics.registerFont(UnicodeCIDFont("HeiseiKakuGo-W5"))
pdfmetrics.registerFont(UnicodeCIDFont("HeiseiMin-W3"))
FONT = "HeiseiKakuGo-W5"
FONT_MIN = "HeiseiMin-W3"

# ─── Page ─────────────────────────────────────────────────────
PAGE_W, PAGE_H = landscape(A4)
MARGIN = 48
TOTAL_PAGES = 12

# ─── Colors ───────────────────────────────────────────────────
INDIGO_50 = HexColor("#EEF2FF")
INDIGO_100 = HexColor("#E0E7FF")
INDIGO_500 = HexColor("#6366F1")
INDIGO_600 = HexColor("#4F46E5")
INDIGO_700 = HexColor("#4338CA")
INDIGO_900 = HexColor("#312E81")
PURPLE_500 = HexColor("#A855F7")
PURPLE_600 = HexColor("#9333EA")
PINK_500 = HexColor("#EC4899")
ROSE_500 = HexColor("#F43F5E")
EMERALD_400 = HexColor("#34D399")
EMERALD_500 = HexColor("#10B981")
EMERALD_600 = HexColor("#059669")
AMBER_500 = HexColor("#F59E0B")
ORANGE_600 = HexColor("#EA580C")
SLATE_50 = HexColor("#F8FAFC")
SLATE_100 = HexColor("#F1F5F9")
SLATE_200 = HexColor("#E2E8F0")
SLATE_400 = HexColor("#94A3B8")
SLATE_500 = HexColor("#64748B")
SLATE_600 = HexColor("#475569")
SLATE_700 = HexColor("#334155")
SLATE_800 = HexColor("#1E293B")
SLATE_900 = HexColor("#0F172A")
WHITE = white

# ─── Paths ────────────────────────────────────────────────────
BASE_DIR = os.path.join(os.path.dirname(__file__), "..")
LOGO_PATH = os.path.join(BASE_DIR, "docs", "images", "logo.png")
SS_INVOICE = os.path.join(BASE_DIR, "docs", "images", "invoice-list.png")
SS_VENDOR = os.path.join(BASE_DIR, "docs", "images", "vendor-list.png")
OUTPUT_PATH = os.path.join(BASE_DIR, "docs", "請求受取太郎_サービス資料.pdf")


# ─── Drawing Helpers ──────────────────────────────────────────

def gradient_rect(c, x, y, w, h, c1, c2, steps=60):
    """Horizontal gradient fill."""
    for i in range(steps):
        t = i / steps
        r = c1.red + (c2.red - c1.red) * t
        g = c1.green + (c2.green - c1.green) * t
        b = c1.blue + (c2.blue - c1.blue) * t
        c.setFillColor(Color(r, g, b))
        c.rect(x + w * i / steps, y, w / steps + 1, h, stroke=0, fill=1)


def gradient_rect_v(c, x, y, w, h, c1, c2, steps=60):
    """Vertical gradient fill (bottom to top)."""
    for i in range(steps):
        t = i / steps
        r = c1.red + (c2.red - c1.red) * t
        g = c1.green + (c2.green - c1.green) * t
        b = c1.blue + (c2.blue - c1.blue) * t
        c.setFillColor(Color(r, g, b))
        c.rect(x, y + h * i / steps, w, h / steps + 1, stroke=0, fill=1)


def rounded_rect(c, x, y, w, h, r, fill=None, stroke=None, lw=1):
    """Draw a rounded rectangle."""
    if fill:
        c.setFillColor(fill)
    if stroke:
        c.setStrokeColor(stroke)
        c.setLineWidth(lw)
    c.roundRect(x, y, w, h, r, stroke=1 if stroke else 0, fill=1 if fill else 0)


def pill(c, x, y, w, h, fill):
    """Draw a pill shape (fully rounded rect)."""
    rounded_rect(c, x, y, w, h, h / 2, fill=fill)


def circle(c, x, y, r, fill):
    """Draw a filled circle."""
    c.setFillColor(fill)
    c.circle(x, y, r, stroke=0, fill=1)


def icon_badge(c, x, y, size, color, letter):
    """Draw a colored square badge with a letter."""
    rounded_rect(c, x - size / 2, y - size / 2, size, size, size * 0.25, fill=color)
    c.setFillColor(WHITE)
    c.setFont(FONT, size * 0.48)
    c.drawCentredString(x, y - size * 0.17, letter)


def page_bg(c, color=WHITE):
    """Fill page background."""
    c.setFillColor(color)
    c.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)


def page_num(c, n):
    """Page number at bottom-right."""
    c.setFont(FONT, 8)
    c.setFillColor(SLATE_400)
    c.drawRightString(PAGE_W - 36, 22, f"{n} / {TOTAL_PAGES}")


def accent_bar_bottom(c):
    """Thin gradient bar at page bottom."""
    gradient_rect(c, 0, 0, PAGE_W, 3, INDIGO_600, PURPLE_500)


def section_header(c, title, subtitle=None):
    """Draw a clean section header with left accent bar."""
    gradient_rect_v(c, MARGIN, PAGE_H - 95, 4, 40, INDIGO_600, PURPLE_500)
    c.setFont(FONT, 24)
    c.setFillColor(SLATE_900)
    c.drawString(MARGIN + 16, PAGE_H - 82, title)
    if subtitle:
        c.setFont(FONT, 11)
        c.setFillColor(SLATE_500)
        c.drawString(MARGIN + 16, PAGE_H - 100, subtitle)


def bullet_list(c, x, y, items, color=INDIGO_500, font_size=12, line_h=28, text_color=SLATE_700):
    """Draw a bulleted list with colored dots."""
    for item in items:
        circle(c, x + 5, y + 4, 3.5, color)
        c.setFont(FONT, font_size)
        c.setFillColor(text_color)
        c.drawString(x + 18, y, item)
        y -= line_h
    return y


def draw_shadow_card(c, x, y, w, h, radius=12):
    """Draw a card with subtle shadow effect."""
    rounded_rect(c, x + 2, y - 2, w, h, radius, fill=Color(0, 0, 0, 0.04))
    rounded_rect(c, x, y, w, h, radius, fill=WHITE, stroke=SLATE_200, lw=0.5)


# ─── Slides ───────────────────────────────────────────────────

def slide_cover(c):
    """1. Cover slide."""
    page_bg(c, SLATE_50)

    # Subtle decorative bg circles
    circle(c, PAGE_W - 60, PAGE_H + 20, 220, Color(0.39, 0.40, 0.95, 0.04))
    circle(c, 40, -30, 180, Color(0.58, 0.21, 0.92, 0.04))
    circle(c, PAGE_W / 2, 50, 140, Color(0.39, 0.40, 0.95, 0.03))

    # Top accent line
    gradient_rect(c, 0, PAGE_H - 4, PAGE_W, 4, INDIGO_600, PURPLE_500)

    # Logo
    if os.path.exists(LOGO_PATH):
        c.drawImage(LOGO_PATH, PAGE_W / 2 - 155, PAGE_H / 2 + 40, width=310,
                     height=310 * 0.4, preserveAspectRatio=True, mask="auto")

    # Tagline
    c.setFont(FONT, 16)
    c.setFillColor(SLATE_700)
    c.drawCentredString(PAGE_W / 2, PAGE_H / 2 - 10,
                        "取引先からの請求書を専用URLで簡単に受け取り・管理")

    # Pill badges
    badges = ["アカウント不要", "シンプル", "セキュア"]
    badge_colors = [INDIGO_600, PURPLE_600, EMERALD_500]
    bw = 120
    gap = 16
    bx = PAGE_W / 2 - (bw * 3 + gap * 2) / 2
    for i, (txt, col) in enumerate(zip(badges, badge_colors)):
        pill(c, bx + i * (bw + gap), PAGE_H / 2 - 60, bw, 30, col)
        c.setFont(FONT, 11)
        c.setFillColor(WHITE)
        c.drawCentredString(bx + i * (bw + gap) + bw / 2, PAGE_H / 2 - 52, txt)

    # Subtitle
    c.setFont(FONT, 14)
    c.setFillColor(SLATE_600)
    c.drawCentredString(PAGE_W / 2, PAGE_H / 2 - 115, "サービス紹介資料")
    c.setFont(FONT, 11)
    c.setFillColor(SLATE_400)
    c.drawCentredString(PAGE_W / 2, PAGE_H / 2 - 138, "2026年2月")

    accent_bar_bottom(c)
    page_num(c, 1)


def slide_problem(c):
    """2. Problem statement."""
    page_bg(c, WHITE)
    section_header(c, "こんな課題、ありませんか？")

    problems = [
        (ROSE_500, "!", "請求書がメール・FAX・郵送とバラバラで管理が大変"),
        (AMBER_500, "?", "取引先にシステム登録をお願いするのが気まずい"),
        (PINK_500, "¥", "支払い漏れや重複チェックに時間がかかる"),
        (SLATE_600, "X", "請求書データがローカルPCに散在しセキュリティが不安"),
    ]

    y = PAGE_H - 145
    for color, icon, text in problems:
        draw_shadow_card(c, MARGIN + 8, y - 8, PAGE_W - MARGIN * 2 - 16, 52, 10)
        icon_badge(c, MARGIN + 42, y + 18, 32, color, icon)
        c.setFont(FONT, 14)
        c.setFillColor(SLATE_800)
        c.drawString(MARGIN + 72, y + 11, text)
        y -= 68

    # CTA box
    rounded_rect(c, PAGE_W / 2 - 200, 36, 400, 44, 22, fill=INDIGO_50)
    c.setFont(FONT, 14)
    c.setFillColor(INDIGO_600)
    c.drawCentredString(PAGE_W / 2, 51, ">> 請求受取太郎がすべて解決します")

    accent_bar_bottom(c)
    page_num(c, 2)


def slide_solution(c):
    """3. Solution overview."""
    page_bg(c, WHITE)
    section_header(c, "請求受取太郎とは？",
                   "取引先に専用URLを共有するだけで、請求書を簡単に収集・管理できるクラウドサービス")

    features = [
        (INDIGO_600, "1", "専用URL共有", [
            "取引先にURLを送るだけ",
            "アカウント登録不要",
            "即座にアップロード可能",
        ]),
        (PINK_500, "2", "一元管理", [
            "ダッシュボードで一覧確認",
            "月別・ステータス別に絞り込み",
            "合計金額を自動集計",
        ]),
        (EMERALD_500, "3", "支払い追跡", [
            "未振込 / 振込済をワンクリック",
            "支払い漏れを防止",
            "リアルタイムな残高把握",
        ]),
    ]

    col_w = 220
    gap = 24
    start_x = (PAGE_W - (col_w * 3 + gap * 2)) / 2
    card_top = PAGE_H - 140

    for i, (color, num, title, items) in enumerate(features):
        x = start_x + i * (col_w + gap)
        draw_shadow_card(c, x, card_top - 230, col_w, 230, 14)

        # Number badge
        icon_badge(c, x + col_w / 2, card_top - 30, 40, color, num)

        # Title
        c.setFont(FONT, 15)
        c.setFillColor(SLATE_900)
        c.drawCentredString(x + col_w / 2, card_top - 68, title)

        # Items
        iy = card_top - 100
        for item in items:
            circle(c, x + 28, iy + 4, 3, color)
            c.setFont(FONT, 11)
            c.setFillColor(SLATE_600)
            c.drawString(x + 40, iy, item)
            iy -= 24

    accent_bar_bottom(c)
    page_num(c, 3)


def slide_flow(c):
    """4. How it works - flow."""
    page_bg(c, WHITE)
    section_header(c, "ご利用の流れ", "4ステップで請求書の受領を開始")

    steps = [
        (INDIGO_600, "1", "取引先を登録", "ダッシュボードから\n取引先名を入力するだけ"),
        (PURPLE_600, "2", "URLを共有", "自動生成された専用URLを\nコピーして取引先に送付"),
        (PINK_500, "3", "請求書受領", "取引先がURLから\nファイルをアップロード"),
        (EMERALD_500, "4", "管理・支払い", "ダッシュボードで確認し\nステータスを更新"),
    ]

    step_w = 165
    gap = 18
    total_w = step_w * 4 + gap * 3
    sx = (PAGE_W - total_w) / 2
    cy = PAGE_H / 2 + 10

    for i, (color, num, title, desc) in enumerate(steps):
        x = sx + i * (step_w + gap)

        draw_shadow_card(c, x, cy - 85, step_w, 170, 12)

        # Number circle
        circle(c, x + step_w / 2, cy + 60, 22, color)
        c.setFillColor(WHITE)
        c.setFont(FONT, 18)
        c.drawCentredString(x + step_w / 2, cy + 53, num)

        # Title
        c.setFont(FONT, 13)
        c.setFillColor(SLATE_900)
        c.drawCentredString(x + step_w / 2, cy + 22, title)

        # Desc lines
        c.setFont(FONT, 10)
        c.setFillColor(SLATE_500)
        for j, line in enumerate(desc.split("\n")):
            c.drawCentredString(x + step_w / 2, cy - 5 - j * 18, line)

        # Arrow between steps
        if i < 3:
            ax = x + step_w + 2
            c.setStrokeColor(SLATE_200)
            c.setLineWidth(1.5)
            c.line(ax, cy + 10, ax + gap - 4, cy + 10)
            c.setFillColor(SLATE_200)
            p = c.beginPath()
            p.moveTo(ax + gap - 4, cy + 14)
            p.lineTo(ax + gap + 2, cy + 10)
            p.lineTo(ax + gap - 4, cy + 6)
            p.close()
            c.drawPath(p, fill=1, stroke=0)

    accent_bar_bottom(c)
    page_num(c, 4)


def slide_ss_invoice(c):
    """5. Screenshot - Invoice List."""
    page_bg(c, SLATE_50)
    section_header(c, "請求書一覧ダッシュボード", "受け取った請求書を一目で確認・管理")

    if os.path.exists(SS_INVOICE):
        img_w = PAGE_W - MARGIN * 2 - 40
        img_h = img_w * 0.52
        ix = (PAGE_W - img_w) / 2
        iy = 32

        # Shadow
        rounded_rect(c, ix + 3, iy - 3, img_w, img_h, 10,
                      fill=Color(0, 0, 0, 0.08))
        # Border
        rounded_rect(c, ix, iy, img_w, img_h, 10, fill=WHITE, stroke=SLATE_200, lw=0.5)
        # Image
        c.saveState()
        clip = c.beginPath()
        clip.roundRect(ix + 2, iy + 2, img_w - 4, img_h - 4, 8)
        c.clipPath(clip, stroke=0)
        c.drawImage(SS_INVOICE, ix + 2, iy + 2, width=img_w - 4, height=img_h - 4,
                     preserveAspectRatio=True, mask="auto")
        c.restoreState()

    # Feature callouts
    callouts = [
        "月別 / ステータス別フィルタ",
        "合計金額の自動集計",
        "ワンクリックでステータス切替",
    ]
    cx = PAGE_W - MARGIN - 230
    cy_pos = PAGE_H - 130
    for txt in callouts:
        pill(c, cx, cy_pos, 225, 26, Color(1, 1, 1, 0.9))
        circle(c, cx + 14, cy_pos + 13, 4, EMERALD_500)
        c.setFont(FONT, 10)
        c.setFillColor(SLATE_700)
        c.drawString(cx + 26, cy_pos + 7, txt)
        cy_pos -= 34

    accent_bar_bottom(c)
    page_num(c, 5)


def slide_ss_vendor(c):
    """6. Screenshot - Vendor Management."""
    page_bg(c, SLATE_50)
    section_header(c, "取引先管理", "専用アップロードURLをワンクリックで発行・共有")

    if os.path.exists(SS_VENDOR):
        img_w = PAGE_W - MARGIN * 2 - 40
        img_h = img_w * 0.52
        ix = (PAGE_W - img_w) / 2
        iy = 32

        rounded_rect(c, ix + 3, iy - 3, img_w, img_h, 10,
                      fill=Color(0, 0, 0, 0.08))
        rounded_rect(c, ix, iy, img_w, img_h, 10, fill=WHITE, stroke=SLATE_200, lw=0.5)
        c.saveState()
        clip = c.beginPath()
        clip.roundRect(ix + 2, iy + 2, img_w - 4, img_h - 4, 8)
        c.clipPath(clip, stroke=0)
        c.drawImage(SS_VENDOR, ix + 2, iy + 2, width=img_w - 4, height=img_h - 4,
                     preserveAspectRatio=True, mask="auto")
        c.restoreState()

    callouts = [
        "取引先名を入力するだけで登録",
        "URLをコピーして取引先に送付",
        "不要になったら削除も簡単",
    ]
    cx = PAGE_W - MARGIN - 230
    cy_pos = PAGE_H - 130
    for txt in callouts:
        pill(c, cx, cy_pos, 225, 26, Color(1, 1, 1, 0.9))
        circle(c, cx + 14, cy_pos + 13, 4, PINK_500)
        c.setFont(FONT, 10)
        c.setFillColor(SLATE_700)
        c.drawString(cx + 26, cy_pos + 7, txt)
        cy_pos -= 34

    accent_bar_bottom(c)
    page_num(c, 6)


def slide_security(c):
    """7. Security & Multi-tenant."""
    page_bg(c, WHITE)
    section_header(c, "セキュリティ & マルチテナント", "企業データを堅牢に守るアーキテクチャ")

    col_w = (PAGE_W - MARGIN * 2 - 30) / 2

    # ─ Left: Security ─
    lx = MARGIN
    ly = PAGE_H - 130
    draw_shadow_card(c, lx, 44, col_w, ly - 34, 14)

    icon_badge(c, lx + 28, ly - 18, 28, INDIGO_600, "S")
    c.setFont(FONT, 15)
    c.setFillColor(SLATE_900)
    c.drawString(lx + 50, ly - 25, "セキュリティ")

    sec_items = [
        "Row Level Security (RLS) でDBレベルの保護",
        "組織単位のアクセス制御を標準実装",
        "アップロードトークンによる不正防止",
        "ファイルサイズ制限 (10MB)",
        "ファイル形式バリデーション (PDF/PNG/JPG)",
        "Supabase Storage による安全な保管",
    ]
    bullet_list(c, lx + 20, ly - 62, sec_items, INDIGO_500, 11, 26, SLATE_600)

    # ─ Right: Multi-tenant ─
    rx = MARGIN + col_w + 30
    ry = PAGE_H - 130
    draw_shadow_card(c, rx, 44, col_w, ry - 34, 14)

    icon_badge(c, rx + 28, ry - 18, 28, EMERALD_500, "M")
    c.setFont(FONT, 15)
    c.setFillColor(SLATE_900)
    c.drawString(rx + 50, ry - 25, "マルチテナント")

    mt_items = [
        "組織 (Organization) 単位のデータ完全分離",
        "他組織のデータには一切アクセス不可",
        "組織ID / 取引先ID による体系的フォルダ構造",
        "将来的なチーム招待・権限管理に対応可能",
        "BPO・経理代行での複数クライアント管理",
    ]
    bullet_list(c, rx + 20, ry - 62, mt_items, EMERALD_500, 11, 26, SLATE_600)

    accent_bar_bottom(c)
    page_num(c, 7)


def slide_tech(c):
    """8. Tech Stack."""
    page_bg(c, WHITE)
    section_header(c, "技術スタック", "モダンな技術基盤で高速・安全・スケーラブル")

    rows = [
        ("フロントエンド", "Next.js 16 + React 19", "Server Componentsで高速表示", INDIGO_600),
        ("スタイリング", "Tailwind CSS 4", "一貫性のあるモダンUI", PURPLE_600),
        ("データベース", "Supabase (PostgreSQL)", "スケーラブル・リアルタイム対応", PINK_500),
        ("認証", "Supabase Auth", "メール/パスワード認証を標準搭載", EMERALD_500),
        ("ストレージ", "Supabase Storage", "S3互換のファイル管理", AMBER_500),
        ("セキュリティ", "Row Level Security", "DBレベルの堅牢なアクセス制御", ROSE_500),
    ]

    col_widths = [130, 210, 300]
    table_x = (PAGE_W - sum(col_widths) - 40) / 2
    row_h = 40
    header_h = 42
    ty = PAGE_H - 135

    # Header
    gradient_rect(c, table_x, ty - header_h, sum(col_widths) + 40, header_h,
                  INDIGO_600, PURPLE_600)
    c.setFont(FONT, 12)
    c.setFillColor(WHITE)
    headers = ["レイヤー", "技術", "メリット"]
    hx = table_x + 20
    for i, h in enumerate(headers):
        c.drawString(hx, ty - 27, h)
        hx += col_widths[i]

    for r, (layer, tech, merit, color) in enumerate(rows):
        ry = ty - header_h - r * row_h
        bg = SLATE_50 if r % 2 == 0 else WHITE
        c.setFillColor(bg)
        c.rect(table_x, ry - row_h, sum(col_widths) + 40, row_h, stroke=0, fill=1)

        circle(c, table_x + 15, ry - row_h / 2, 4, color)

        cx = table_x + 28
        cells = [layer, tech, merit]
        for i, cell in enumerate(cells):
            c.setFont(FONT, 11)
            c.setFillColor(SLATE_800 if i < 2 else SLATE_600)
            c.drawString(cx, ry - row_h / 2 - 4, cell)
            cx += col_widths[i]

    bot_y = ty - header_h - len(rows) * row_h
    c.setStrokeColor(SLATE_200)
    c.setLineWidth(0.5)
    c.line(table_x, bot_y, table_x + sum(col_widths) + 40, bot_y)

    accent_bar_bottom(c)
    page_num(c, 8)


def slide_market(c):
    """9. Market Landscape."""
    page_bg(c, WHITE)
    section_header(c, "市場における競合サービス",
                   "主要な請求書受領サービスと請求受取太郎のポジション")

    # ── Competitor cards ──
    competitors = [
        {
            "name": "Bill One (Sansan)",
            "color": SLATE_800,
            "stats": "20万社以上のネットワーク",
            "traits": [
                "大企業向けスイート型",
                "受領 + 経費精算 + 債権管理",
                "99.9% データ化精度",
                "取引先にアカウント作成が必要",
                "料金: 要問い合わせ",
            ],
        },
        {
            "name": "invox (Deepwork)",
            "color": ORANGE_600,
            "stats": "30,000社+ / 3年連続No.1",
            "traits": [
                "中小〜中堅企業向け",
                "AI OCR + オペレーター検証",
                "50以上の会計ソフト連携",
                "月額980円〜で段階的プラン",
                "紙スキャン代行サービスあり",
            ],
        },
        {
            "name": "バクラク (LayerX)",
            "color": EMERALD_600,
            "stats": "15,000社+ / 継続率99%",
            "traits": [
                "バックオフィス統合型",
                "AI-OCR + 仕訳自動生成",
                "受領代行プランあり",
                "AIエージェント機能",
                "導入支援は有償オプション",
            ],
        },
    ]

    card_w = 225
    card_h = 210
    gap = 18
    total_w = card_w * 3 + gap * 2
    sx = (PAGE_W - total_w) / 2
    cy = PAGE_H - 140

    for i, comp in enumerate(competitors):
        x = sx + i * (card_w + gap)
        draw_shadow_card(c, x, cy - card_h, card_w, card_h, 12)

        # Header bar
        rounded_rect(c, x + 1, cy - 1, card_w - 2, 0, 12, fill=None)
        c.setFillColor(comp["color"])
        c.roundRect(x, cy - 40, card_w, 40, 12, stroke=0, fill=1)
        # Cover bottom corners of header
        c.rect(x, cy - 40, card_w, 14, stroke=0, fill=1)

        c.setFont(FONT, 12)
        c.setFillColor(WHITE)
        c.drawCentredString(x + card_w / 2, cy - 25, comp["name"])
        c.setFont(FONT, 9)
        c.drawCentredString(x + card_w / 2, cy - 37, comp["stats"])

        # Traits
        ty = cy - 58
        for trait in comp["traits"]:
            circle(c, x + 18, ty + 3, 2.5, comp["color"])
            c.setFont(FONT, 9.5)
            c.setFillColor(SLATE_600)
            c.drawString(x + 28, ty - 1, trait)
            ty -= 22

    # ── Our positioning box ──
    box_y = 28
    box_h = 68
    box_w = PAGE_W - MARGIN * 2
    rounded_rect(c, MARGIN, box_y, box_w, box_h, 14, fill=INDIGO_50,
                 stroke=INDIGO_500, lw=1)

    c.setFont(FONT, 13)
    c.setFillColor(INDIGO_700)
    c.drawCentredString(PAGE_W / 2, box_y + box_h - 22,
                        "請求受取太郎の独自ポジション : 「取引先にアカウント不要」な唯一のサービス")
    c.setFont(FONT, 10)
    c.setFillColor(SLATE_600)
    c.drawCentredString(PAGE_W / 2, box_y + box_h - 44,
                        "競合サービスは高機能・大規模向け。請求受取太郎は「いますぐ・誰でも・無料で始められる」手軽さで差別化。")
    c.setFont(FONT, 10)
    c.setFillColor(SLATE_500)
    c.drawCentredString(PAGE_W / 2, box_y + box_h - 60,
                        "中小企業・フリーランス・経理1名体制でも数分で導入でき、取引先の負担もゼロ。")

    accent_bar_bottom(c)
    page_num(c, 9)


def slide_comparison(c):
    """10. Competitive Comparison Table."""
    page_bg(c, WHITE)
    section_header(c, "競合比較", "請求受取太郎 vs 主要競合サービス")

    # Columns: 比較軸 | 請求受取太郎 | Bill One | invox | バクラク
    col_widths = [128, 148, 148, 148, 148]
    table_x = (PAGE_W - sum(col_widths)) / 2
    row_h = 36
    header_h = 38
    ty = PAGE_H - 130

    # Header row
    gradient_rect(c, table_x, ty - header_h, sum(col_widths), header_h,
                  INDIGO_600, PURPLE_600)
    c.setFont(FONT, 10)
    c.setFillColor(WHITE)
    headers = ["比較軸", "請求受取太郎", "Bill One", "invox", "バクラク"]
    hx = table_x
    for i, h in enumerate(headers):
        c.drawCentredString(hx + col_widths[i] / 2, ty - 24, h)
        hx += col_widths[i]

    rows = [
        ("取引先のアカウント", "不要",       "必要",       "必要",       "不要(受領代行)"),
        ("導入までの時間",     "数分",       "数週間〜",   "数日〜",     "数日〜"),
        ("主要ターゲット",     "中小 / 個人", "大企業",     "中小〜中堅", "中小〜大企業"),
        ("料金",             "無料〜",      "要問い合わせ", "月額980円〜", "要問い合わせ"),
        ("会計ソフト連携",     "CSV出力対応", "多数対応",   "50種以上",   "多数対応"),
        ("取引先の負担",       "ゼロ",       "登録必要",   "登録必要",   "送付先変更のみ"),
        ("初期費用",          "0円",        "要問い合わせ", "0円",       "要問い合わせ"),
    ]

    # Highlight column for 請求受取太郎
    ours_x = table_x + col_widths[0]
    total_rows_h = len(rows) * row_h
    c.setFillColor(Color(0.39, 0.40, 0.95, 0.05))
    c.rect(ours_x, ty - header_h - total_rows_h, col_widths[1], total_rows_h,
           stroke=0, fill=1)

    for r, row_data in enumerate(rows):
        ry = ty - header_h - r * row_h
        # Alternate row bg
        if r % 2 == 0:
            c.setFillColor(Color(0.97, 0.98, 0.99, 1))
            c.rect(table_x, ry - row_h, sum(col_widths), row_h, stroke=0, fill=1)
            # Re-draw highlight for our column over alternating bg
            c.setFillColor(Color(0.39, 0.40, 0.95, 0.07))
            c.rect(ours_x, ry - row_h, col_widths[1], row_h, stroke=0, fill=1)

        cx = table_x
        for i, cell in enumerate(row_data):
            if i == 0:
                c.setFont(FONT, 10)
                c.setFillColor(SLATE_800)
            elif i == 1:
                c.setFont(FONT, 10)
                c.setFillColor(INDIGO_600)
            else:
                c.setFont(FONT, 10)
                c.setFillColor(SLATE_500)
            c.drawCentredString(cx + col_widths[i] / 2, ry - row_h / 2 - 3, cell)
            cx += col_widths[i]

    # Grid lines
    bot_y = ty - header_h - len(rows) * row_h
    c.setStrokeColor(SLATE_200)
    c.setLineWidth(0.3)
    # Horizontal lines
    for r in range(len(rows) + 1):
        ly = ty - header_h - r * row_h
        c.line(table_x, ly, table_x + sum(col_widths), ly)
    # Vertical lines
    vx = table_x
    for w in col_widths:
        c.line(vx, ty - header_h, vx, bot_y)
        vx += w
    c.line(vx, ty - header_h, vx, bot_y)

    # Key takeaway
    msg_y = bot_y - 32
    rounded_rect(c, PAGE_W / 2 - 280, msg_y, 560, 28, 14, fill=INDIGO_50)
    c.setFont(FONT, 11)
    c.setFillColor(INDIGO_700)
    c.drawCentredString(PAGE_W / 2, msg_y + 8,
                        ">> 取引先の手間ゼロ x 数分で導入 x 無料スタート = 請求受取太郎だけの強み")

    accent_bar_bottom(c)
    page_num(c, 10)


def slide_pricing(c):
    """11. Pricing / Monetization Plan."""
    page_bg(c, WHITE)
    section_header(c, "料金プラン", "スモールスタートから本格運用まで、成長に合わせた3プラン")

    plans = [
        {
            "name": "Free",
            "price": "0",
            "unit": "円 / 月",
            "color": SLATE_600,
            "badge_bg": SLATE_100,
            "desc": "まずは気軽に試したい方に",
            "features": [
                ("取引先数", "5社まで"),
                ("月間請求書", "30件"),
                ("CSV出力", "-"),
                ("AI-OCR", "-"),
                ("チーム招待", "1人"),
                ("メール通知", "-"),
            ],
        },
        {
            "name": "Pro",
            "price": "980",
            "unit": "円 / 月",
            "color": INDIGO_600,
            "badge_bg": INDIGO_50,
            "desc": "成長中の中小企業に最適",
            "popular": True,
            "features": [
                ("取引先数", "50社まで"),
                ("月間請求書", "300件"),
                ("CSV出力", "対応"),
                ("AI-OCR", "-"),
                ("チーム招待", "3人"),
                ("メール通知", "対応"),
            ],
        },
        {
            "name": "Business",
            "price": "4,980",
            "unit": "円 / 月",
            "color": PURPLE_600,
            "badge_bg": Color(0.66, 0.20, 0.92, 0.08),
            "desc": "大規模・BPO事業者向け",
            "features": [
                ("取引先数", "無制限"),
                ("月間請求書", "無制限"),
                ("CSV出力", "対応"),
                ("AI-OCR", "対応"),
                ("チーム招待", "無制限"),
                ("メール通知", "対応"),
            ],
        },
    ]

    card_w = 215
    card_h = 310
    gap = 22
    total_w = card_w * 3 + gap * 2
    sx = (PAGE_W - total_w) / 2
    card_top = PAGE_H - 130

    for i, plan in enumerate(plans):
        x = sx + i * (card_w + gap)
        y = card_top - card_h
        color = plan["color"]
        is_popular = plan.get("popular", False)

        # Popular badge
        if is_popular:
            pill(c, x + card_w / 2 - 50, card_top + 4, 100, 22, INDIGO_600)
            c.setFont(FONT, 9)
            c.setFillColor(WHITE)
            c.drawCentredString(x + card_w / 2, card_top + 10, "おすすめ")

        # Card shadow & border
        if is_popular:
            rounded_rect(c, x + 2, y - 2, card_w, card_h, 14,
                          fill=Color(0.39, 0.40, 0.95, 0.10))
            rounded_rect(c, x, y, card_w, card_h, 14, fill=WHITE,
                          stroke=INDIGO_500, lw=1.5)
        else:
            draw_shadow_card(c, x, y, card_w, card_h, 14)

        # Plan name
        c.setFont(FONT, 16)
        c.setFillColor(color)
        c.drawCentredString(x + card_w / 2, card_top - 24, plan["name"])

        # Price
        c.setFont(FONT, 32)
        c.setFillColor(SLATE_900)
        c.drawCentredString(x + card_w / 2, card_top - 68, plan["price"])
        c.setFont(FONT, 10)
        c.setFillColor(SLATE_500)
        c.drawCentredString(x + card_w / 2, card_top - 84, plan["unit"])

        # Description
        c.setFont(FONT, 9)
        c.setFillColor(SLATE_500)
        c.drawCentredString(x + card_w / 2, card_top - 102, plan["desc"])

        # Divider
        c.setStrokeColor(SLATE_200)
        c.setLineWidth(0.5)
        c.line(x + 16, card_top - 114, x + card_w - 16, card_top - 114)

        # Feature rows
        fy = card_top - 134
        for label, value in plan["features"]:
            c.setFont(FONT, 9)
            c.setFillColor(SLATE_500)
            c.drawString(x + 18, fy, label)
            if value == "-":
                c.setFillColor(SLATE_400)
                c.drawRightString(x + card_w - 18, fy, "-")
            else:
                c.setFillColor(color)
                c.drawRightString(x + card_w - 18, fy, value)
            fy -= 24

    # Footer note
    c.setFont(FONT, 9)
    c.setFillColor(SLATE_400)
    c.drawCentredString(PAGE_W / 2, 44,
                        "* 全プラン初期費用0円 / 年間契約で2ヶ月分無料 / 料金は税抜表示")
    c.setFont(FONT, 10)
    c.setFillColor(SLATE_600)
    c.drawCentredString(PAGE_W / 2, 26,
                        "Freeプランはクレジットカード登録不要。今すぐお試しいただけます。")

    accent_bar_bottom(c)
    page_num(c, 11)


def slide_closing(c):
    """12. Closing."""
    gradient_rect(c, 0, 0, PAGE_W, PAGE_H, INDIGO_700, PURPLE_600)

    circle(c, PAGE_W - 80, PAGE_H - 40, 200, Color(1, 1, 1, 0.03))
    circle(c, 80, 60, 160, Color(1, 1, 1, 0.03))
    circle(c, PAGE_W / 2, PAGE_H + 80, 300, Color(1, 1, 1, 0.02))

    if os.path.exists(LOGO_PATH):
        c.drawImage(LOGO_PATH, PAGE_W / 2 - 130, PAGE_H / 2 + 60, width=260,
                     height=260 * 0.4, preserveAspectRatio=True, mask="auto")

    c.setFont(FONT, 28)
    c.setFillColor(WHITE)
    c.drawCentredString(PAGE_W / 2, PAGE_H / 2 + 10, "請求書管理を、もっとスマートに。")

    pill(c, PAGE_W / 2 - 120, PAGE_H / 2 - 50, 240, 42, Color(1, 1, 1, 0.15))
    c.setFont(FONT, 15)
    c.setFillColor(WHITE)
    c.drawCentredString(PAGE_W / 2, PAGE_H / 2 - 36, "無料でお試しいただけます")

    c.setFont(FONT, 12)
    c.setFillColor(Color(1, 1, 1, 0.6))
    c.drawCentredString(PAGE_W / 2, PAGE_H / 2 - 100,
                        "お問い合わせ・ご質問はお気軽にどうぞ")

    page_num(c, 12)


# ─── Main ─────────────────────────────────────────────────────

def main():
    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)

    c = canvas.Canvas(OUTPUT_PATH, pagesize=landscape(A4))
    c.setTitle("請求受取太郎 サービス紹介資料")
    c.setAuthor("rebellion-inc")

    slides = [
        slide_cover,
        slide_problem,
        slide_solution,
        slide_flow,
        slide_ss_invoice,
        slide_ss_vendor,
        slide_security,
        slide_tech,
        slide_market,
        slide_comparison,
        slide_pricing,
        slide_closing,
    ]

    for i, fn in enumerate(slides):
        fn(c)
        if i < len(slides) - 1:
            c.showPage()

    c.save()
    print(f"Done: {os.path.abspath(OUTPUT_PATH)}")


if __name__ == "__main__":
    main()
