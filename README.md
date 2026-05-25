# DATN Web (React + Vite)

Frontend production-ready cho backend Spring Boot trong repo cha (`context-path: /doan`, cổng `8080`).

## Cài đặt

```bash
cd datn-web
npm install
```

## Môi trường

Sao chép `.env.example` → `.env` (đã có mặc định):

```env
VITE_API_URL=http://localhost:8080/doan
```

Nếu muốn tránh CORS hoàn toàn khi dev, có thể đặt `VITE_API_URL=/doan` và chạy Vite (đã cấu proxy trong `vite.config.ts`).

## WebSocket STOMP (native)

Broker URL được suy ra từ `VITE_API_URL`:

`ws://localhost:8080/doan/ws-chat` (hoặc `wss://` nếu API là HTTPS).

Header kết nối: `Authorization: Bearer <JWT>` (đúng với `WebSocketAuthInterceptor` backend).

Subscribe ví dụ:

- Chat: `/topic/conversation.{conversationId}`
- Presence: `/topic/presence`
- Thông báo user: `/user/queue/notifications`

Publish (prefix `/app`):

- `/app/chat.send/{convId}`, `/app/chat.typing/{convId}`, `/app/chat.seen/{convId}`, v.v.

## Chạy dev

```bash
npm run dev
```

Mặc định: http://localhost:5173

## Build

```bash
npm run build
npm run preview
```

## Kiến trúc (tóm tắt)

- `src/api/` — Axios instance + module theo domain (auth, user, post, chat, quiz…)
- `src/api/http.ts` — Bearer + refresh token (POST `/auth/refresh`) + toast lỗi
- `src/stores/` — Zustand (JWT, theme dark/light/system)
- `src/ws/stomp-context.tsx` — `@stomp/stompjs` Client, reconnect 5s
- `src/routes/router.tsx` — React Router + guard + role-based routes
- `src/pages/` — màn hình theo nghiệp vụ

## Lưu ý backend

- JWT chỉ có một field `token`; refresh xoá JWT cũ và cấp token mới (`AuthResponse`).
- Quiz public: `GET /test/public`; học sinh: start/submit/ai-review theo controller hiện tại.
- Thông báo REST yêu cầu query `userId` (`NotificationController`).
