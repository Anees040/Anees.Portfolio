# Sukoon

Sukoon is Anees's completed personal prayer companion project. It combines an offline prayer routine, local tracking, Qibla and native Android quiet-window behavior. Completion does not mean a verified store release or guaranteed behavior on all Android devices. Device hardening continues.

## Implemented functionality

The approved case study describes local prayer calculation and tracking, Qibla, prayer configuration and reminders, and auto-silent scheduling. Genuine screenshots show the home, permissions, prayer tracker and Qibla screens. The public README's verification work remains distinct from declaring the personal project complete.

## Architecture and technologies

Flutter and Dart carry configuration and the application interface. A versioned schedule payload crosses MethodChannel to Kotlin/Android. The native side persists the schedule so alarms and receivers can act without an open Flutter screen. Reviewed evidence includes lib/prayer/schedule_payload.dart, lib/native/schedule_sync.dart and DndController.kt, linked by the case study.

## Decisions and hardening

Android owns timed system behavior rather than relying solely on a Flutter timer. The payload is explicitly versioned. Exact-alarm permission and DND access are distinct requirements. Reboot, clock and timezone changes can make schedules stale and need device verification. A temporary interruption-filter change also needs deliberate restoration of the previous state.

## Status boundaries

Sukoon is completed personal work with ongoing permission, background-execution and lifecycle hardening. It is not described as a verified store release. No production adoption, downloads, accuracy or comprehensive device-testing claim is approved.
