# Engineering decisions evidenced by the portfolio

The engineering workbook connects questions to actual project evidence. Simplified responsibility maps are explanatory, not certified production architecture.

## Offline records and synchronization

FitPilot's SQLite-to-Supabase path makes retries, identity mapping and UTC timestamps explicit. An unlogged day is neutral. Pure Dart engines keep calculation logic separate from UI state. These are evidenced project choices, not a benchmark or accuracy claim.

## Native scheduling and restoration

Sukoon uses a versioned Flutter-to-Android schedule contract. Kotlin alarms, receivers and interruption filters own timed behavior. Exact-alarm and DND permissions, reboot and timezone changes affect reliability. The return to the previous interruption state is part of the quiet-window feature, not an optional extra.

## Connected roles and partial writes

EduVerse follows course, quiz and student identifiers across teaching, learning and administration. Dedicated Dart services organize operations. Separate writes to teacher-related and global course records create a consistency trade-off; they must not be called atomic.

## Educational concurrency

The Concurrency Lab demonstrates a general booking race and a simplified check-and-claim boundary. It is an original local educational model. It is not SportLynk's private implementation, a load test or evidence of a production backend.
