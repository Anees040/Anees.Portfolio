# FitPilot

FitPilot is Anees's solo personal fitness project. Core features are built. The public case study and repository describe food logging, burn plans, workout guidance and connected local records. No production launch, adoption or measured model accuracy is claimed.

## Implemented experience

FitPilot includes food and activity logging, burn planning and workout/program guidance. Its project contains AI-related capture and coaching integrations, with review and correction considerations. The portfolio does not assert those integrations are accurate or production reliable.

## Architecture and evidenced technologies

FitPilot uses Flutter, Dart and Riverpod. Pure Dart calculation engines keep calculations separate from screens. SQLite holds local records; the reviewed synchronization code connects them to Supabase. Public evidence includes lib/domain/engines/burn_planner.dart, streak_engine.dart, lib/data/sync/sync_service.dart and sync_tables.dart at the revision linked by the case study.

## Engineering decisions and challenges

An unlogged day is neutral rather than automatically treated as failure. Offline synchronization requires identity mapping, explicit UTC timestamps and consideration of retries. Local and remote records have different responsibilities. Repository evidence supports these observations, but does not establish production correctness, personally measured performance or business outcomes.

## Evidence and contribution limits

FitPilot is approved as a solo personal project. Genuine repository screenshots and reviewed source support the case study. No user count, revenue, download metric, launch or external product outcome is verified. Further personally experienced trade-offs and release/device evidence can be added after owner approval.
