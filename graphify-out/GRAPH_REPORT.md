# Graph Report - yashi_electronics  (2026-06-01)

## Corpus Check
- 151 files · ~43,505 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 717 nodes · 906 edges · 20 communities detected
- Extraction: 87% EXTRACTED · 13% INFERRED · 0% AMBIGUOUS · INFERRED: 121 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `4a580c70`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 33|Community 33]]

## God Nodes (most connected - your core abstractions)
1. `getApiErrorMessage()` - 23 edges
2. `Card()` - 22 edges
3. `successResponse()` - 19 edges
4. `Button()` - 19 edges
5. `Container()` - 19 edges
6. `cn()` - 19 edges
7. `useAuth()` - 17 edges
8. `AuthRepository` - 16 edges
9. `buttonStyles()` - 16 edges
10. `AppError` - 14 edges

## Surprising Connections (you probably didn't know these)
- `loadProducts()` --calls--> `getApiErrorMessage()`  [INFERRED]
  frontend/src/pages/ProductsPage.tsx → frontend/src/lib/api-client.ts
- `sendRegistrationOtpController()` --calls--> `successResponse()`  [INFERRED]
  backend/src/modules/auth/auth.controller.ts → backend/src/utils/api-response.ts
- `getSessionController()` --calls--> `successResponse()`  [INFERRED]
  backend/src/modules/auth/auth.controller.ts → backend/src/utils/api-response.ts
- `forgotPasswordController()` --calls--> `successResponse()`  [INFERRED]
  backend/src/modules/auth/auth.controller.ts → backend/src/utils/api-response.ts
- `requireCustomerAuth()` --calls--> `clearAuthCookie()`  [INFERRED]
  backend/src/modules/auth/auth.middleware.ts → backend/src/modules/auth/auth.service.ts

## Communities (158 total, 4 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.05
Nodes (26): useAddress(), AddToCartButton(), QuantitySelector(), useCart(), CancelOrderModal(), OrderStatusBadge(), PaymentStatusBadge(), clearFilters() (+18 more)

### Community 1 - "Community 1"
Cohesion: 0.05
Nodes (31): AddressProvider(), AuthProvider(), ProtectedRoute(), useAuth(), CartProvider(), createPendingOrder(), getCheckoutSummary(), ApiHealthStatus() (+23 more)

### Community 2 - "Community 2"
Cohesion: 0.07
Nodes (25): errorResponse(), successResponse(), forgotPassword(), loginCustomer(), registerCustomer(), resetPassword(), forgotPasswordController(), getSessionController() (+17 more)

### Community 3 - "Community 3"
Cohesion: 0.06
Nodes (19): normalizeAddressPayload(), normalizeOptionalText(), normalizeText(), validateAddressForm(), handleSubmit(), getApiErrorMessage(), getBrands(), getCategories() (+11 more)

### Community 4 - "Community 4"
Cohesion: 0.12
Nodes (14): forgotPasswordController(), getSessionController(), loginCustomerController(), logoutCustomerController(), registerCustomerController(), resetPasswordController(), sendRegistrationOtpController(), clearAuthCookie() (+6 more)

### Community 5 - "Community 5"
Cohesion: 0.1
Nodes (11): buildCanCancel(), buildCanContinuePayment(), buildTimeline(), createTimelineEntry(), mapOrderDetail(), mapOrderListItem(), mapPayment(), mapShippingAddress() (+3 more)

### Community 6 - "Community 6"
Cohesion: 0.13
Nodes (16): buildCartResponse(), createEmptyResponse(), createEmptySummary(), mapCartItem(), mapCartProduct(), roundMoney(), toDecimal(), toNumber() (+8 more)

### Community 7 - "Community 7"
Cohesion: 0.15
Nodes (15): buildCartResponse(), createEmptyResponse(), createEmptySummary(), mapCartItem(), mapCartProduct(), roundMoney(), toDecimal(), toNumber() (+7 more)

### Community 8 - "Community 8"
Cohesion: 0.17
Nodes (12): requireCustomerAuth(), AuthService, createOtpHash(), createResetTokenHash(), generateOtp(), normalizedEmail(), normalizedMobile(), signAuthToken() (+4 more)

### Community 9 - "Community 9"
Cohesion: 0.2
Nodes (17): buildAddressFingerprint(), buildCheckoutFingerprint(), buildCheckoutState(), buildDuplicateOrderResponse(), buildItemValidation(), buildOrderFingerprint(), buildSummaryFromItems(), createEmptySummary() (+9 more)

### Community 11 - "Community 11"
Cohesion: 0.17
Nodes (12): getBrands(), getCategories(), buildOrderBySql(), buildWhereSql(), findActiveBrands(), findActiveCategories(), findProductBySlug(), findProducts() (+4 more)

### Community 12 - "Community 12"
Cohesion: 0.17
Nodes (12): getBrands(), getCategories(), buildOrderBySql(), buildWhereSql(), findActiveBrands(), findActiveCategories(), findProductBySlug(), findProducts() (+4 more)

### Community 13 - "Community 13"
Cohesion: 0.21
Nodes (7): extractAddressValidationErrors(), normalizeAddressPayload(), normalizeOptionalText(), normalizeText(), validateAddressForm(), AddressForm(), handleSubmit()

### Community 14 - "Community 14"
Cohesion: 0.28
Nodes (12): buildCheckoutState(), buildItemValidation(), buildSummaryFromItems(), createEmptySummary(), formatOrderDateSegment(), generateOrderNumber(), mapAddress(), mapCheckoutItem() (+4 more)

### Community 15 - "Community 15"
Cohesion: 0.17
Nodes (6): AddressProvider(), AddToCartButton(), CartProvider(), useAuth(), useCart(), WishlistProvider()

### Community 16 - "Community 16"
Cohesion: 0.22
Nodes (4): Button(), buttonStyles(), cn(), navLinkClass()

## Knowledge Gaps
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AppError` connect `Community 5` to `Community 4`, `Community 7`, `Community 8`, `Community 9`, `Community 11`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **Why does `getApiErrorMessage()` connect `Community 1` to `Community 0`, `Community 13`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **Are the 10 inferred relationships involving `getApiErrorMessage()` (e.g. with `handleSubmit()` and `fetchSummary()`) actually correct?**
  _`getApiErrorMessage()` has 10 INFERRED edges - model-reasoned connections that need verification._
- **Are the 7 inferred relationships involving `successResponse()` (e.g. with `sendRegistrationOtpController()` and `registerCustomerController()`) actually correct?**
  _`successResponse()` has 7 INFERRED edges - model-reasoned connections that need verification._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.07 - nodes in this community are weakly interconnected._