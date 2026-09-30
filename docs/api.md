# LinkedIn Clone - REST API Reference & Specification

LinkedIn Clone provides a comprehensive RESTful API built on Express.js with TypeScript and documented via OpenAPI 3.0 / Swagger UI.

- **Base URL**: `http://localhost:5000/api`
- **Interactive Documentation**: `http://localhost:5000/api-docs`

---

## 1. Response Envelope Standard

Every API response strictly follows a predictable envelope structure:

### Successful Response (`200 OK`, `201 Created`):
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional human-readable confirmation message"
}
```

### Error Response (`400 Bad Request`, `401 Unauthorized`, `404 Not Found`):
```json
{
  "success": false,
  "message": "Specific error explanation",
  "errors": [ ... ]
}
```

---

## 2. Authentication Protocol

- **Cookie-Based**: Set automatically on successful login/registration in an `HTTP-only`, `SameSite=Lax` cookie named `linkedin_token`.
- **Bearer Token**: Can also be supplied via the `Authorization: Bearer <token>` header for mobile or external clients.
- **Session Verification**: Call `GET /api/auth/me` on initial app load to refresh user state.

---

## 3. API Endpoints Catalog

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user account | No |
| `POST` | `/api/auth/login` | Log in and receive HTTP-only cookie | No |
| `POST` | `/api/auth/logout` | Clear auth cookie | Yes |
| `GET` | `/api/auth/me` | Fetch authenticated user session | Yes |

### User Profiles & Completeness (`/api/users`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/users/:id` | View user profile by ID | Yes |
| `PUT` | `/api/users/profile` | Update own bio, headline, links, avatar | Yes |
| `POST` | `/api/users/education` | Add education entry | Yes |
| `DELETE`| `/api/users/education/:id` | Remove education entry | Yes |
| `POST` | `/api/users/experience` | Add experience entry | Yes |
| `DELETE`| `/api/users/experience/:id` | Remove experience entry | Yes |
| `POST` | `/api/users/skills` | Add skill mastery to profile | Yes |
| `DELETE`| `/api/users/skills/:id` | Remove skill from profile | Yes |
| `GET` | `/api/users/:id/completeness` | **Feature 1**: Profile completeness breakdown | Yes |

### Connections & Network (`/api/connections`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/connections` | List accepted connections | Yes |
| `GET` | `/api/connections/pending` | List received pending invitations | Yes |
| `GET` | `/api/connections/sent` | List sent pending invitations | Yes |
| `POST` | `/api/connections/request/:recipientId` | Send connection request | Yes |
| `POST` | `/api/connections/accept/:requestId` | Accept connection request | Yes |
| `POST` | `/api/connections/reject/:requestId` | Reject connection request | Yes |
| `DELETE`| `/api/connections/:connectionId` | Remove connection or cancel request | Yes |
| `GET` | `/api/connections/discovery/skills` | **Feature 2**: Skill-based discovery | Yes |

### Posts, Reactions & Comments (`/api/posts`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/posts` | Paginated ranked feed (`?page=1&limit=10`) | Yes |
| `POST` | `/api/posts` | Create new post (text, image, link, tags) | Yes |
| `PUT` | `/api/posts/:id` | Update own post content | Yes |
| `DELETE`| `/api/posts/:id` | Delete own post | Yes |
| `POST` | `/api/posts/:id/reactions` | Toggle reaction (`LIKE`, `CELEBRATE`, etc.) | Yes |
| `GET` | `/api/posts/:id/comments` | Fetch threaded comment hierarchy | Yes |
| `POST` | `/api/posts/:id/comments` | Add comment or nested reply | Yes |
| `DELETE`| `/api/posts/comments/:commentId` | Delete own comment | Yes |

### Messaging & Chat (`/api/messages`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/messages/conversations` | List active chat threads | Yes |
| `GET` | `/api/messages/:conversationId` | Fetch message history in thread | Yes |
| `POST` | `/api/messages` | Send direct message (also emits Socket.IO)| Yes |

### Notifications (`/api/notifications`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/notifications` | List user notifications | Yes |
| `PUT` | `/api/notifications/:id/read` | Mark individual notification as read | Yes |
| `PUT` | `/api/notifications/read-all` | Mark all notifications as read | Yes |

### Opportunities & Matchmaking (`/api/opportunities`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/opportunities` | List all available opportunities | Yes |
| `GET` | `/api/opportunities/recommendations` | **Feature 3**: Rule-based skill matching | Yes |
| `POST` | `/api/opportunities/:id/apply` | Apply to opportunity | Yes |

### Groups & Communities (`/api/groups`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/groups` | Discover groups & communities | Yes |
| `GET` | `/api/groups/:slug` | View group details and discussions | Yes |
| `POST` | `/api/groups` | Create professional community | Yes |
| `POST` | `/api/groups/:id/join` | Join group | Yes |
| `POST` | `/api/groups/:id/leave` | Leave group | Yes |
| `POST` | `/api/groups/:id/posts` | Publish post in group | Yes |

### Global Search (`/api/search`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/search` | Multi-entity search (`?q=...&type=users\|posts\|groups`) | Yes |
