# Graph Report - yashi_electronics  (2026-06-02)

## Corpus Check
- 154 files · ~46,448 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 746 nodes · 945 edges · 28 communities detected
- Extraction: 87% EXTRACTED · 13% INFERRED · 0% AMBIGUOUS · INFERRED: 123 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d5293dde`
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
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 41|Community 41]]

## God Nodes (most connected - your core abstractions)
1. `getApiErrorMessage()` - 23 edges
2. `Card()` - 22 edges
3. `cn()` - 21 edges
4. `successResponse()` - 19 edges
5. `Button()` - 19 edges
6. `Container()` - 19 edges
7. `useAuth()` - 17 edges
8. `AuthRepository` - 16 edges
9. `buttonStyles()` - 16 edges
10. `AppError` - 15 edges

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

## Communities (166 total, 7 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.05
Nodes (31): AddressProvider(), AuthProvider(), ProtectedRoute(), useAuth(), CartProvider(), createPendingOrder(), getCheckoutSummary(), ApiHealthStatus() (+23 more)

### Community 1 - "Community 1"
Cohesion: 0.07
Nodes (25): errorResponse(), successResponse(), forgotPassword(), loginCustomer(), registerCustomer(), resetPassword(), forgotPasswordController(), getSessionController() (+17 more)

### Community 2 - "Community 2"
Cohesion: 0.06
Nodes (19): normalizeAddressPayload(), normalizeOptionalText(), normalizeText(), validateAddressForm(), handleSubmit(), getApiErrorMessage(), getBrands(), getCategories() (+11 more)

### Community 3 - "Community 3"
Cohesion: 0.09
Nodes (11): buildCanCancel(), buildCanContinuePayment(), buildTimeline(), createTimelineEntry(), mapOrderDetail(), mapOrderListItem(), mapPayment(), mapShippingAddress() (+3 more)

### Community 4 - "Community 4"
Cohesion: 0.11
Nodes (14): forgotPasswordController(), getSessionController(), loginCustomerController(), logoutCustomerController(), registerCustomerController(), resetPasswordController(), sendRegistrationOtpController(), clearAuthCookie() (+6 more)

### Community 5 - "Community 5"
Cohesion: 0.13
Nodes (16): buildCartResponse(), createEmptyResponse(), createEmptySummary(), mapCartItem(), mapCartProduct(), roundMoney(), toDecimal(), toNumber() (+8 more)

### Community 6 - "Community 6"
Cohesion: 0.15
Nodes (15): buildCartResponse(), createEmptyResponse(), createEmptySummary(), mapCartItem(), mapCartProduct(), roundMoney(), toDecimal(), toNumber() (+7 more)

### Community 7 - "Community 7"
Cohesion: 0.17
Nodes (12): requireCustomerAuth(), AuthService, createOtpHash(), createResetTokenHash(), generateOtp(), normalizedEmail(), normalizedMobile(), signAuthToken() (+4 more)

### Community 8 - "Community 8"
Cohesion: 0.12
Nodes (15): getBrands(), findNodeBySlug(), getCategoryFilterSlugs(), getCategoryLabel(), getCategories(), buildOrderBySql(), buildWhereSql(), findActiveBrands() (+7 more)

### Community 9 - "Community 9"
Cohesion: 0.14
Nodes (4): QuantitySelector(), Button(), buttonStyles(), cn()

### Community 10 - "Community 10"
Cohesion: 0.2
Nodes (17): buildAddressFingerprint(), buildCheckoutFingerprint(), buildCheckoutState(), buildDuplicateOrderResponse(), buildItemValidation(), buildOrderFingerprint(), buildSummaryFromItems(), createEmptySummary() (+9 more)

### Community 11 - "Community 11"
Cohesion: 0.14
Nodes (8): CancelOrderModal(), OrderStatusBadge(), PaymentStatusBadge(), clearFilters(), handleSearchSubmit(), updateSearchParams(), applySearch(), setSearchParams()

### Community 13 - "Community 13"
Cohesion: 0.17
Nodes (12): getBrands(), getCategories(), buildOrderBySql(), buildWhereSql(), findActiveBrands(), findActiveCategories(), findProductBySlug(), findProducts() (+4 more)

### Community 14 - "Community 14"
Cohesion: 0.2
Nodes (4): useAddress(), Card(), EmptyState(), ErrorState()

### Community 15 - "Community 15"
Cohesion: 0.21
Nodes (7): extractAddressValidationErrors(), normalizeAddressPayload(), normalizeOptionalText(), normalizeText(), validateAddressForm(), AddressForm(), handleSubmit()

### Community 16 - "Community 16"
Cohesion: 0.28
Nodes (12): buildCheckoutState(), buildItemValidation(), buildSummaryFromItems(), createEmptySummary(), formatOrderDateSegment(), generateOrderNumber(), mapAddress(), mapCheckoutItem() (+4 more)

### Community 17 - "Community 17"
Cohesion: 0.23
Nodes (3): Badge(), calculateDiscountPercentage(), formatCurrency()

### Community 18 - "Community 18"
Cohesion: 0.17
Nodes (6): AddressProvider(), AddToCartButton(), CartProvider(), useAuth(), useCart(), WishlistProvider()

### Community 19 - "Community 19"
Cohesion: 0.24
Nodes (4): AddToCartButton(), useCart(), ProductDetailPage(), useWishlist()

### Community 22 - "Community 22"
Cohesion: 0.22
Nodes (4): Button(), buttonStyles(), cn(), navLinkClass()

### Community 31 - "Community 31"
Cohesion: 0.6
Nodes (3): getSeedCategorySlug(), run(), seedCatalog()

## Knowledge Gaps
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AppError` connect `Community 3` to `Community 4`, `Community 6`, `Community 7`, `Community 8`, `Community 10`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **Why does `getApiErrorMessage()` connect `Community 0` to `Community 11`, `Community 14`, `Community 15`, `Community 19`, `Community 21`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **Why does `Card()` connect `Community 14` to `Community 0`, `Community 9`, `Community 11`, `Community 15`, `Community 17`, `Community 19`, `Community 20`, `Community 21`?**
  _High betweenness centrality (0.009) - this node is a cross-community bridge._
- **Are the 10 inferred relationships involving `getApiErrorMessage()` (e.g. with `handleSubmit()` and `fetchSummary()`) actually correct?**
  _`getApiErrorMessage()` has 10 INFERRED edges - model-reasoned connections that need verification._
- **Are the 7 inferred relationships involving `successResponse()` (e.g. with `sendRegistrationOtpController()` and `registerCustomerController()`) actually correct?**
  _`successResponse()` has 7 INFERRED edges - model-reasoned connections that need verification._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.07 - nodes in this community are weakly interconnected._