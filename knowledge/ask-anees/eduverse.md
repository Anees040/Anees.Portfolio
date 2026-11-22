# EduVerse

EduVerse is Anees's academic semester project, a role-based learning application. Core course, learning, assessment and management workflows are built. It is not presented as a commercial production service.

## Implemented learning and management

Student workflows cover course discovery and enrollment, video learning, assignments, quizzes and progress. Teachers manage course content and assessments. Administrative workflows cover users, course oversight, moderation, announcements and support. Shared course identities connect the role-specific interfaces.

## Architecture and evidenced stack

EduVerse uses Flutter, Dart, Firebase Authentication and Firebase Realtime Database, not Firestore. Named course and quiz services organize operations. Quiz attempts connect student, quiz and course identities. Reviewed source includes lib/services/course_service.dart, quiz_service.dart and database.rules.json, linked from the case study.

## Engineering decisions and boundaries

Teacher-related and global course records are written separately. These writes support convenient queries but are not an atomic transaction; interruption can leave inconsistent views. Time limits, attempt limits and publication state affect assessments. Database rules exist, but the portfolio makes no comprehensive security-audit claim.

## Planned features and contribution

Collaborative study rooms, push notifications and advanced assessment work remain planned. In-app notification records do not establish completed FCM push delivery. Visible certificate or payment interfaces do not prove external credential validity or commercial payment processing. Anees describes EduVerse as his semester project; the public content does not specify a complete team responsibility breakdown, so do not invent one.
